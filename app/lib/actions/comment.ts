
'use server';

import { db } from '@/app/db';
import { comments } from '@/app/db/schema';
import { CreateCommentSchema } from '../definitions';
import { revalidatePath } from 'next/cache';

export async function createComment(prevState: unknown, formData: FormData) {
  const validatedFields = CreateCommentSchema.safeParse({
    content: formData.get('content'),
    topicId: formData.get('topicId'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'ข้อมูลไม่ถูกต้อง',
    };
  }

  const { content, topicId } = validatedFields.data;
  const authorId = '00000000-0000-0000-0000-000000000000'; // Mock Auth

  try {
    await db.insert(comments).values({
      content,
      topicId,
      authorId,
    });
    
    revalidatePath(`/topic/${topicId}`);
    return { success: true, message: 'ตอบกลับเรียบร้อยแล้ว' };

  } catch (error) {
    console.error('Database Error:', error);
    return {
      message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล',
    };
  }
}
