'use server'

import { createClient } from '@/app/lib/supabase/server';
import { isProfane, cleanText } from '@/lib/profanity';

export type Role = 'suffering' | 'healing';

export async function joinHealjai(prevState: unknown, formData: FormData) {
  const name = formData.get('name') as string;
  const role = formData.get('role') as Role;

  if (!name || name.trim().length === 0) {
    return { error: 'กรุณากรอกชื่อ' };
  }

  if (isProfane(name)) {
    return { error: 'ชื่อมีคำไม่สุภาพ กรุณาใช้ชื่ออื่น' };
  }

  const userId = crypto.randomUUID();
  const supabase = await createClient();

  // Add user to healjai_users table
  const { error: insertError } = await supabase
    .from('healjai_users')
    .insert({
      id: userId,
      name: cleanText(name),
      role,
      status: 'waiting',
      last_active_at: new Date().toISOString(),
    });

  if (insertError) {
    console.error('Failed to add user:', insertError);
    return { error: 'เกิดข้อผิดพลาด กรุณาลองใหม่' };
  }

  // Try to find match
  await findAndCreateMatch();

  return { success: true, userId: userId, role: role };
}

async function findAndCreateMatch() {
  const supabase = await createClient();

  // Find waiting users of both roles
  const { data: waitingUsers } = await supabase
    .from('healjai_users')
    .select('*')
    .eq('status', 'waiting')
    .order('created_at', { ascending: true });

  if (!waitingUsers || waitingUsers.length < 2) return;

  const sufferingUser = waitingUsers.find((u) => u.role === 'suffering');
  const healingUser = waitingUsers.find((u) => u.role === 'healing');

  if (!sufferingUser || !healingUser) return;

  // Create room
  const { data: room, error: roomError } = await supabase
    .from('healjai_rooms')
    .insert({
      suffering_user_id: sufferingUser.id,
      healing_user_id: healingUser.id,
      is_active: 1,
    })
    .select()
    .single();

  if (roomError || !room) {
    console.error('Failed to create room:', roomError);
    return;
  }

  // Update both users to 'matched' status
  await supabase
    .from('healjai_users')
    .update({ status: 'matched', room_id: room.id })
    .in('id', [sufferingUser.id, healingUser.id]);
}

export async function checkMatchStatus(userId: string) {
  const supabase = await createClient();

  const { data: user } = await supabase
    .from('healjai_users')
    .select('status, room_id')
    .eq('id', userId)
    .single();

  if (!user) return { matched: false };

  if (user.status === 'matched' && user.room_id) {
    // Update status to 'chatting'
    await supabase
      .from('healjai_users')
      .update({ status: 'chatting' })
      .eq('id', userId);

    return { matched: true, roomId: user.room_id };
  }

  return { matched: false };
}

export async function getRoomData(roomId: string, userId: string) {
  const supabase = await createClient();

  const { data: room } = await supabase
    .from('healjai_rooms')
    .select('*')
    .eq('id', roomId)
    .single();

  if (!room) return { error: 'Room not found' };

  if (room.suffering_user_id !== userId && room.healing_user_id !== userId) {
    return { error: 'Unauthorized' };
  }

  // Get other user's data
  const otherUserId = room.suffering_user_id === userId ? room.healing_user_id : room.suffering_user_id;
  
  const { data: otherUser } = await supabase
    .from('healjai_users')
    .select('*')
    .eq('id', otherUserId)
    .single();

  const { data: currentUser } = await supabase
    .from('healjai_users')
    .select('*')
    .eq('id', userId)
    .single();

  return {
    room,
    currentUser,
    otherUser,
  };
}

export async function sendChatMessage(roomId: string, userId: string, content: string) {
  const supabase = await createClient();

  // Check if room is active
  const { data: room } = await supabase
    .from('healjai_rooms')
    .select('is_active')
    .eq('id', roomId)
    .single();

  if (!room || room.is_active === 0) {
    return { error: 'Chat ended' };
  }

  // Filter profanity
  if (isProfane(content)) {
    content = cleanText(content);
  }

  // Get sender name
  const { data: user } = await supabase
    .from('healjai_users')
    .select('name')
    .eq('id', userId)
    .single();

  if (!user) return { error: 'User not found' };

  // Insert message
  const { error } = await supabase
    .from('healjai_messages')
    .insert({
      room_id: roomId,
      sender_id: userId,
      sender_name: user.name,
      content: content,
    });

  if (error) {
    console.error('Failed to send message:', error);
    return { error: 'Failed to send message' };
  }

  // Update last active
  await supabase
    .from('healjai_users')
    .update({ last_active_at: new Date().toISOString() })
    .eq('id', userId);

  return { success: true };
}

export async function getMessages(roomId: string) {
  const supabase = await createClient();

  const { data: room } = await supabase
    .from('healjai_rooms')
    .select('is_active')
    .eq('id', roomId)
    .single();

  const { data: messages } = await supabase
    .from('healjai_messages')
    .select('*')
    .eq('room_id', roomId)
    .order('created_at', { ascending: true });

  return {
    messages: messages || [],
    isActive: room?.is_active === 1,
  };
}

export async function leaveChat(roomId: string, userId: string) {
  const supabase = await createClient();

  // Mark room as inactive
  await supabase
    .from('healjai_rooms')
    .update({ is_active: 0, ended_at: new Date().toISOString() })
    .eq('id', roomId);

  // Add system message
  await supabase
    .from('healjai_messages')
    .insert({
      room_id: roomId,
      sender_id: null,
      sender_name: 'System',
      content: 'คู่สนทนาของคุณได้ออกจากห้องแล้ว การสนทนาสิ้นสุดลง',
    });

  // Update user status
  await supabase
    .from('healjai_users')
    .update({ status: 'left' })
    .eq('id', userId);

  return { success: true };
}
