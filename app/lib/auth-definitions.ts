
import { z } from 'zod';

export const SignupSchema = z.object({
  name: z.string().min(2, 'ชื่อต้องยาวอย่างน้อย 2 ตัวอักษร'),
  email: z.string().email('รูปแบบอีเมลไม่ถูกต้อง'),
  password: z.string().min(6, 'รหัสผ่านต้องยาวอย่างน้อย 6 ตัวอักษร'),
});

export const LoginSchema = z.object({
  email: z.string().email('รูปแบบอีเมลไม่ถูกต้อง'),
  password: z.string().min(1, 'กรุณากรอกรหัสผ่าน'),
});
