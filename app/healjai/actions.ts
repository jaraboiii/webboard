'use server'

import { store, Role } from '@/lib/store';
import { isProfane, cleanText } from '@/lib/profanity';


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
  
  store.addUser({
    id: userId,
    name: cleanText(name),
    role,
    joinedAt: Date.now()
  });

  store.addToQueue(userId, role);
  store.findMatch(); // Trigger matchmaking check

  return { success: true, userId: userId, role: role };
}

export async function checkMatchStatus(userId: string) {
  const room = store.findUserRoom(userId);
  if (room) {
    return { matched: true, roomId: room.id };
  }
  return { matched: false };
}

export async function getRoomData(roomId: string, userId: string) {
    const room = store.getRoom(roomId);
    if (!room) return { error: 'Room not found' };
    if (room.healingUserId !== userId && room.sufferingUserId !== userId) {
        return { error: 'Unauthorized' };
    }
    
    // Get other user's name
    const otherUserId = room.healingUserId === userId ? room.sufferingUserId : room.healingUserId;
    const otherUser = otherUserId ? store.getUser(otherUserId) : null;
    
    return { 
        room, 
        currentUser: store.getUser(userId),
        otherUser: otherUser
    };
}

export async function sendChatMessage(roomId: string, userId: string, content: string) {
  const room = store.getRoom(roomId);
  if (!room || !room.isActive) return { error: 'Chat ended' };

  if (isProfane(content)) {
     // Optional: reject or filter. User asked specifically for filter.
     // "Profanity Filter both in name and chat"
     // We can censor it.
     content = cleanText(content);
  }

  const msgId = crypto.randomUUID();
  const user = store.getUser(userId);
  
  if (!user) return { error: 'User not found' };

  const message = {
    id: msgId,
    senderId: userId,
    senderName: user.name,
    content: content,
    timestamp: Date.now()
  };

  room.messages.push(message);
  return { success: true };
}

export async function getMessages(roomId: string) {
    const room = store.getRoom(roomId);
    if (!room) return { messages: [], isActive: false };
    return { messages: room.messages, isActive: room.isActive };
}

export async function leaveChat(roomId: string, userId: string) {
    store.removeUser(userId);
    return { success: true };
}
