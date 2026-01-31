# HealJAI - Mental Health Support Platform

A Next.js-based platform combining webboard discussions and anonymous peer support chat.

## 🎯 Features

### 1. Webboard
- Create and browse discussion topics
- Comment system
- Category organization
- Hashtag support
- User authentication

### 2. HealJAI Chat (Anonymous Support)
- Real-time anonymous matching
- Two modes: "Suffering" (seeking support) and "Healing" (offering support)
- Profanity filter
- Anonymous, ephemeral conversations

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Database:** Supabase (PostgreSQL)
- **Realtime:** Supabase Realtime
- **Authentication:** Supabase Auth
- **ORM:** Drizzle
- **Styling:** Tailwind CSS
- **Deployment:** Vercel

## 📁 Project Structure

```
healjai/
├── app/
│   ├── @auth/              # Auth modal routes (intercepting routes)
│   ├── auth/               # Auth callbacks
│   ├── create-topic/       # Topic creation
│   ├── db/                 # Database schema (Drizzle)
│   ├── healjai/            # HealJAI chat feature
│   │   ├── actions.ts      # Server actions
│   │   ├── types.ts        # TypeScript types
│   │   ├── chat/[roomId]/  # Chat room page
│   │   └── page.tsx        # HealJAI landing
│   ├── lib/                # Shared utilities
│   │   ├── actions/        # Server actions
│   │   ├── supabase/       # Supabase clients
│   │   └── definitions.ts  # Zod schemas
│   ├── login/              # Login page
│   ├── settings/           # User settings
│   ├── signup/             # Signup page
│   └── page.tsx            # Home (webboard)
├── components/
│   ├── healjai/            # HealJAI components
│   ├── layout/             # Layout components
│   ├── ui/                 # Reusable UI components
│   └── webboard/           # Webboard components
├── lib/
│   └── profanity.ts        # Profanity filter
├── docs/                   # Documentation
└── public/                 # Static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Supabase account
- Vercel account (for deployment)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd healjai
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.development
```

Edit `.env.development`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
DATABASE_URL=your_postgres_connection_string
```

4. Push database schema:
```bash
npm run db:push:dev
```

5. Set up Supabase Realtime (for HealJAI):
   - Open Supabase Dashboard → SQL Editor
   - Run the SQL from `supabase-healjai-setup.sql`

6. Run development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📝 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:push:dev  # Push schema to development DB
npm run db:push:prod # Push schema to production DB
```

## 🌐 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

Quick deploy to Vercel:
```bash
vercel
```

## 📚 Documentation

- [Deployment Guide](./DEPLOYMENT.md) - Production deployment
- [HealJAI Migration](./docs/HEALJAI-MIGRATION.md) - Technical details
- [Dev Deployment](./docs/DEPLOY-DEV.md) - Preview deployments

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | Yes |
| `DATABASE_URL` | PostgreSQL connection string | Yes |

## 🧪 Features Status

| Feature | Status | Notes |
|---------|--------|-------|
| User Authentication | ✅ Production Ready | Google OAuth + Email |
| Webboard Topics | ✅ Production Ready | CRUD operations |
| Comments | 🚧 Partial | Backend ready, UI WIP |
| HealJAI Chat | ✅ Production Ready | Supabase Realtime |
| User Settings | ✅ Production Ready | Profile & avatar |

## 📄 License

MIT

## 🤝 Contributing

Contributions welcome! Please read our contributing guidelines first.
