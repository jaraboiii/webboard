# 🔧 Quick Deploy to Vercel (Development)

## ขั้นตอนที่ 1: Setup Supabase Realtime

### 1.1 Go to Supabase Dashboard
```
https://supabase.com/dashboard/project/[your-project-id]
```

### 1.2 Open SQL Editor
- Click **SQL Editor** in sidebar
- Click **New Query**

### 1.3 Run this SQL:
```sql
-- Copy and paste the entire content from supabase-healjai-setup.sql
-- Then click "Run" or press Ctrl+Enter
```

### 1.4 Verify Realtime is enabled:
```sql
SELECT tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime';
```

You should see:
- healjai_users
- healjai_rooms
- healjai_messages

---

## ขั้นตอนที่ 2: Install Vercel CLI

```bash
npm i -g vercel
```

---

## ขั้นตอนที่ 3: Login to Vercel

```bash
vercel login
```

---

## ขั้นตอนที่ 4: Deploy Development Version

```bash
# Deploy to preview/dev (NOT production)
vercel
```

**Important:** 
- When asked: **Set up and deploy?** → Yes
- When asked: **Which scope?** → Select your account
- When asked: **Link to existing project?** → No (first time) or Yes (if exists)
- When asked: **Project name?** → Type: `healjai` or `healjai-dev`
- Accept defaults for other questions

This will deploy to: `healjai-[random].vercel.app`

---

## ขั้นตอนที่ 5: Set Environment Variables

### Option A: Via Vercel Dashboard (Recommended)

1. Go to: https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add these variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
DATABASE_URL=your_postgres_connection_string
```

### Option B: Via CLI

```bash
# Set for preview/development
vercel env add NEXT_PUBLIC_SUPABASE_URL
# Paste your value when prompted

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# Paste your value when prompted

vercel env add DATABASE_URL
# Paste your value when prompted
```

**Get these values from:**
- Supabase Dashboard → Project Settings → API
- `NEXT_PUBLIC_SUPABASE_URL` = Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = anon/public key
- `DATABASE_URL` = Settings → Database → Connection String (Transaction)

---

## ขั้นตอนที่ 6: Redeploy with Environment Variables

```bash
# Redeploy to apply env vars
vercel
```

---

## 🎉 ทดสอบการทำงาน:

1. เปิด URL ที่ Vercel ให้มา (จะเป็น `https://healjai-xxx.vercel.app`)
2. ทดสอบ:
   - ✅ Login/Signup
   - ✅ Create Topic (Webboard)
   - ✅ HealJAI matching
   - ✅ HealJAI chat

---

## 🔍 Troubleshooting:

### ถ้า HealJAI ไม่ทำงาน:

1. **Check SQL setup:**
   ```sql
   SELECT tablename FROM pg_publication_tables WHERE pubname = 'supabase_realtime';
   ```

2. **Check environment variables:**
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Make sure all 3 variables are set

3. **Check Vercel Logs:**
   - Vercel Dashboard → Deployments → Click latest → View Function Logs

### ถ้า Webboard ไม่ทำงาน:

1. **Check RLS policies:**
   ```sql
   SELECT * FROM pg_policies WHERE tablename IN ('categories', 'topics');
   ```

2. **Run the RLS setup from schema.ts comments**

---

## 📊 Deployment URLs:

- **Development:** `https://healjai-[random].vercel.app`
- **Production:** (ยังไม่ได้ deploy)

---

## 💡 Tips:

- Development deployments are **free** and **unlimited**
- Each `vercel` command creates a **new preview URL**
- To deploy to production later, use: `vercel --prod`
- You can have **multiple preview deployments** at once

---

## Next Steps:

1. ✅ Run SQL setup in Supabase
2. ✅ Deploy with `vercel` command
3. ✅ Set environment variables
4. ✅ Test on preview URL
5. 🎯 When ready, deploy to production with `vercel --prod`

---

**Status:** Ready to deploy to development! 🚀
