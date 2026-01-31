
'use server';

import { createClient } from '@/app/lib/supabase/server';
import { CreateTopicSchema, DeleteTopicSchema } from '../definitions';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

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
  
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { message: 'กรุณาเข้าสู่ระบบก่อนตั้งกระทู้' };
  }

  try {
    const { error } = await supabase
      .from('topics')
      .insert({
        title,
        content,
        category_id: categoryId,
        author_id: user.id
      });

    if (error) {
       console.error('Supabase Error:', error);
       throw error;
    }

    revalidatePath('/');
    
  } catch {
    return {
      message: 'เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล',
    };
  }

  redirect('/');
}

export async function deleteTopic(topicId: string) {
    const validated = DeleteTopicSchema.safeParse({ id: topicId });
    if (!validated.success) return { message: 'ID ไม่ถูกต้อง' };

    const supabase = await createClient();
    // Optional: Check if user owns the topic before deleting

    try {
        const { error } = await supabase
            .from('topics')
            .delete()
            .eq('id', topicId);

        if (error) throw error;

        revalidatePath('/');
        return { success: true };
    } catch {
        return { message: 'ลบกระทู้ไม่สำเร็จ' };
    }
}
