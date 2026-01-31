
import { z } from 'zod';

export const CreateTopicSchema = z.object({
  title: z.string().min(5, 'หัวข้อต้องยาวอย่างน้อย 5 ตัวอักษร').max(100, 'หัวข้อต้องไม่เกิน 100 ตัวอักษร'),
  content: z.string().min(10, 'เนื้อหาต้องยาวอย่างน้อย 10 ตัวอักษร'),
  category: z.string().min(1, 'กรุณาเลือกหรือกรอกหมวดหมู่').max(50, 'ชื่อหมวดหมู่ยาวเกินไป'),
  // Category can be either existing name or new name - will be handled server-side
});

export const DeleteTopicSchema = z.object({
  id: z.string().uuid(),
});

export const CreateCommentSchema = z.object({
  content: z.string().min(1, 'กรุณาพิมพ์ข้อความ'),
  topicId: z.string().uuid(),
  // authorId handled serverside
});
