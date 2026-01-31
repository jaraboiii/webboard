
'use server';

import { db } from '@/app/db';
import { topics } from '@/app/db/schema';
import { CreateTopicSchema, DeleteTopicSchema } from '../definitions';
import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

// Mock Auth - In production, use your auth library (e.g., Auth.js)
// const getSession = async () => ({ user: { id: 'mock-user-id' } });

export async function createTopic(prevState: unknown, formData: FormData) {
  // Validate Fields
  const validatedFields = CreateTopicSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
    categoryId: formData.get('categoryId'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'ข้อมูลไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง',
    };
  }

  const { title, content, categoryId } = validatedFields.data;
  
  // Prepare Author ID (Mock for MVP)
  // In real app: const session = await auth(); if (!session) throw new Error('Unauthorized');
  const authorId = '00000000-0000-0000-0000-000000000000'; // Replace with real auth

  try {
    await db.insert(topics).values({
      title,
      content,
      categoryId,
      authorId, // Ensure this user exists in your seed data or auth logic
    }).returning(); // Returning ID for redirection if needed

    // Revalidate paths
    revalidatePath('/');
    revalidatePath('/category/[slug]'); 
    
  } catch (error) {
    console.error('Database Error:', error);
    return {
      message: 'เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล',
    };
  }

  // Redirect after success
  redirect('/');
}

export async function deleteTopic(topicId: string) {
    // Validate
    const validated = DeleteTopicSchema.safeParse({ id: topicId });
    if (!validated.success) return { message: 'ID ไม่ถูกต้อง' };

    try {
        await db.delete(topics).where(eq(topics.id, topicId));
        revalidatePath('/');
        return { success: true };
    } catch {
        return { message: 'ลบกระทู้ไม่สำเร็จ' };
    }
}
