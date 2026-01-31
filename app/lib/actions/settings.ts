'use server'

import { createClient } from '@/app/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const UpdateProfileSchema = z.object({
  name: z.string().min(2, 'ชื่อต้องยาวอย่างน้อย 2 ตัวอักษร').max(50, 'ชื่อต้องไม่เกิน 50 ตัวอักษร'),
  avatar: z.instanceof(File).optional().refine((file) => !file || file.size <= 5 * 1024 * 1024, 'ไฟล์ขนาดใหญ่เกินไป (สูงสุด 5MB)'),
});

export async function updateProfile(prevState: unknown, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { message: 'Unauthorized' };
  }

  const validatedFields = UpdateProfileSchema.safeParse({
    name: formData.get('name'),
    avatar: formData.get('avatar'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, avatar } = validatedFields.data;
  let avatarUrl = null;

  // Handle Avatar Upload
  if (avatar && avatar.size > 0 && avatar.name !== 'undefined') {
      const fileExt = avatar.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, avatar, { upsert: true });

      if (uploadError) {
          console.error('Upload error:', uploadError);
          // Only fail if avatar was explicitly provided but failed. 
          // However, we can also proceed with just name update if we want, but user might be confused.
          // Let's return error.
          return { message: 'Failed to upload image. Please try again.' };
      }

      // Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
        
      avatarUrl = publicUrl;
  }

  const updates: { name: string; image?: string; avatar_url?: string } = { name };
  if (avatarUrl) {
      updates.image = avatarUrl; // Changed from avatar_url to image based on callback route
      
      // Also update auth metadata for faster access if needed (optional but good practice)
      await supabase.auth.updateUser({
          data: { avatar_url: avatarUrl, picture: avatarUrl } // syncing both common keys
      });
  }

  const { error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', user.id);

  if (error) {
    return { message: 'Failed to update profile' };
  }

  revalidatePath('/', 'layout');
  return { message: 'บันทึกข้อมูลสำเร็จ', success: true };
}

export async function deleteAccount() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Attempt to delete from public users table
  // Note: This relies on RLS allowing users to delete their own record.
  // And ideally a trigger on postgres side should handle auth.users deletion or we need service_role here.
  // For now, we will delete the public profile and sign out.
  
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', user.id);

  if (error) {
    console.error('Error deleting user:', error);
    // Might fail if there are foreign key constraints (topics, comments) and no cascade.
    // We will assume cascade is set up or this is a soft delete.
    return { message: 'Failed to delete account. Please contact support.' };
  }

  await supabase.auth.signOut();
  revalidatePath('/');
  redirect('/');
}
