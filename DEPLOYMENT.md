# 🚀 Deployment Guide - HealJAI to Vercel

## ⚠️ ปัญหาที่ต้องแก้ไขก่อน Deploy

### 1. **Healjai In-Memory Store Issue**
ปัจจุบันระบบ Healjai ใช้ `lib/store.ts` เป็น **in-memory storage** ซึ่งจะ**หายทุกครั้งที่ Vercel serverless function หมดอายุ** (ประมาณทุก 15 วินาที)

**ผลกระทบ:**
- ❌ คนที่กำลังรอจับคู่จะหาย
- ❌ Chat messages จะหายกลางคัน
- ❌ ห้องสนทนาจะไม่ persistent

**วิธีแก้ที่แนะนำ (เลือก 1 จาก 3):**

#### ✅ Option 1: ใช้ Supabase Realtime (แนะนำที่สุด)
- แทนที่ in-memory store ด้วย Supabase Realtime Database
- ใช้ Supabase Presence API สำหรับ matching queue
- ใช้ Supabase Database + Realtime subscriptions สำหรับ messages

**Pros:**
- ✅ Persistent data
- ✅ Real-time updates
- ✅ Scalable
- ✅ มี Supabase อยู่แล้ว

**Cons:**
- ⏱️ ต้องเขียนโค้ดใหม่ประมาณ 2-3 ชั่วโมง

#### Option 2: ใช้ Upstash Redis
- ใช้ Redis สำหรับ session management
- Free tier มี 10,000 requests/day

**Pros:**
- ✅ Fast
- ✅ เปลี่ยนโค้ดน้อย

**Cons:**
- ⏱️ ต้องเซ็ตอัพ Upstash account
- 💰 มีข้อจำกัด free tier

#### Option 3: ใช้ WebSocket Server แยก (Vercel + Railway/Render)
- Deploy Next.js ไป Vercel (static pages)
- Deploy WebSocket server ไป Railway หรือ Render (Free tier)

**Pros:**
- ✅ Real-time ที่ดีที่สุด

**Cons:**
- ⏱️ ซับซ้อนที่สุด
- 🔧 ต้องจัดการ 2 servers

---

## 📋 ขั้นตอน Deploy (สำหรับฟีเจอร์ Webboard - ใช้งานได้เลย)

### Step 1: เตรียม Environment Variables

สร้างไฟล์ `.env.example`:
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Database (for Drizzle)
DATABASE_URL=your_postgres_connection_string
```

### Step 2: Run Lint & Build Test
```bash
npm run lint
npm run build
```

คำสั่งนี้จะตรวจสอบว่าโค้ดพร้อม build หรือยัง

### Step 3: Push Database Schema
```bash
npm run db:push:prod
```

หลังจากนั้นรัน RLS policies ใน Supabase SQL Editor:
```sql
-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;

-- Categories policies
CREATE POLICY "Anyone can view categories" ON categories FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can create categories" ON categories FOR INSERT TO authenticated WITH CHECK (true);

-- Topics policies
CREATE POLICY "Anyone can view topics" ON topics FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can create topics" ON topics FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);
```

### Step 4: Deploy to Vercel

1. **Install Vercel CLI:**
```bash
npm i -g vercel
```

2. **Login:**
```bash
vercel login
```

3. **Deploy:**
```bash
vercel --prod
```

4. **Set Environment Variables** ใน Vercel Dashboard:
   - ไปที่ Project Settings → Environment Variables
   - เพิ่ม:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `DATABASE_URL`

### Step 5: Redeploy
```bash
vercel --prod
```

---

## 🎯 สถานะฟีเจอร์ที่พร้อม Deploy

| Feature | Status | Note |
|---------|--------|------|
| 🏠 Homepage Webboard | ✅ Ready | ใช้งานได้เต็มรูปแบบ |
| 🔐 Authentication | ✅ Ready | Supabase Auth |
| 📝 Create Topics | ✅ Ready | รวม hashtags |
| 💬 Comments | ⚠️ Partial | Backend พร้อม, UI ยังไม่ครบ |
| 👤 User Settings | ✅ Ready | Upload avatar ได้ |
| 💚 Healjai Chat | ❌ Not Ready | ต้องแก้ store ก่อน |

---

## 🔧 แนะนำขั้นตอนต่อไป

### สำหรับ Healjai Feature:

1. **ใช้ Supabase Realtime** (แนะนำที่สุด)
2. สร้างตาราง:
   - `healjai_users` (active users) with presence
   - `healjai_rooms` (chat rooms)
   - `healjai_messages` (messages)
3. ใช้ Supabase Realtime Subscriptions แทน polling
4. ใช้ Supabase Functions สำหรับ matchmaking logic

**Time Estimate:** 3-4 hours

---

## 🚀 Quick Deploy (Webboard Only)

ถ้าอยากให้ส่วน Webboard ใช้งานได้ก่อน สามารถทำได้เลย:

```bash
# 1. Build test
npm run build

# 2. Push schema
npm run db:push:prod

# 3. Deploy
vercel --prod
```

แล้ว set env variables ใน Vercel Dashboard ตามที่บอกข้างบน

หลังจากนั้นค่อยกลับมาแก้ Healjai feature ให้ทำงานจริงบน production ทีหลัง! 

---

**Created:** 2026-01-31  
**Status:** Ready to deploy (Webboard features only)
