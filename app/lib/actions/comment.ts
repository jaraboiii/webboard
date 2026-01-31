
'use server';

import { createClient } from '@/app/lib/supabase/server';
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
  
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { message: 'กรุณาเข้าสู่ระบบก่อนตอบกลับ' };
  }

  try {
    const { error } = await supabase
        .from('comments')
        .insert({
            content,
            topic_id: topicId,
            author_id: user.id
        });

    if (error) {
        console.error('Supabase Error:', error);
        throw error;
    }
    
    revalidatePath(`/topic/${topicId}`);
    return { success: true, message: 'ตอบกลับเรียบร้อยแล้ว' };

  } catch {
    return {
      message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล',
    };
  }
}
