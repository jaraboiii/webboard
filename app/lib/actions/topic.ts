
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
    category: formData.get('category'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'ข้อมูลไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง',
    };
  }

  const { title, content, category } = validatedFields.data;
  
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { message: 'กรุณาเข้าสู่ระบบก่อนตั้งกระทู้' };
  }

  try {
    // Find or create category
    let categoryId: string;
    
    // Try to find existing category by name (case-insensitive)
    const { data: existingCategory } = await supabase
      .from('categories')
      .select('id')
      .ilike('name', category)
      .single();

    if (existingCategory) {
      categoryId = existingCategory.id;
    } else {
      // Create new category
      const { data: newCategory, error: categoryError } = await supabase
        .from('categories')
        .insert({ name: category })
        .select('id')
        .single();

      if (categoryError) {
        console.error('Category creation error:', categoryError);
        // Return specific error message
        if (categoryError.code === '42501') {
          return { message: 'ไม่มีสิทธิ์สร้างหมวดหมู่ใหม่ กรุณาเลือกหมวดหมู่ที่มีอยู่แล้ว' };
        }
        return { message: `ไม่สามารถสร้างหมวดหมู่ได้: ${categoryError.message}` };
      }

      if (!newCategory) {
        return { message: 'ไม่สามารถสร้างหมวดหมู่ได้' };
      }

      categoryId = newCategory.id;
    }

    // Extract hashtags from title and content (for future trending feature)
    const hashtagRegex = /#[\w\u0E00-\u0E7F]+/g;
    const titleHashtags = title.match(hashtagRegex) || [];
    const contentHashtags = content.match(hashtagRegex) || [];
    const allHashtags = [...new Set([...titleHashtags, ...contentHashtags])];
    
    // Store hashtags as JSON for now (could be normalized to separate table later)
    const hashtags = allHashtags.map(tag => tag.substring(1)); // Remove # prefix

    const { error } = await supabase
      .from('topics')
      .insert({
        title,
        content,
        category_id: categoryId,
        author_id: user.id,
        hashtags: hashtags.length > 0 ? hashtags : null
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
