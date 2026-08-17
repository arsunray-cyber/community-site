# Community Portal

A full-stack community portal built with Next.js, Supabase, and Netlify.

## Features

- **Authentication**: Email/password and OAuth (Google, LinkedIn, Facebook) via Supabase Auth
- **Member Registration**: Multi-step registration form with validation
- **Approval Workflow**: Admin approval required for new members
- **Member Directory**: Searchable directory of approved members
- **Announcements**: Public news and updates feed
- **Financial Audits**: Transparent financial reporting with PDF support
- **Trustees Page**: Contact information for community leaders
- **Admin Dashboard**: Member approval and content management

## Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Backend**: Netlify Serverless Functions
- **Database & Auth**: Supabase (PostgreSQL, GoTrue Auth, Storage)
- **Deployment**: Netlify (Free Tier)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (free tier)
- Netlify account (free tier)

### 1. Clone and Install

```bash
cd community-portal
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the contents of `supabase-schema.sql`
3. Create storage buckets: `audits` and `profile-photos`
4. Configure OAuth providers in Authentication > Providers (optional)

### 3. Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your values:

```bash
cp .env.local.example .env.local
```

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon/public key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (server-side only)

### 4. Local Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Deploy to Netlify

1. Push your code to GitHub/GitLab
2. Connect your repository on [Netlify](https://netlify.com)
3. Add environment variables in Netlify dashboard
4. Deploy!

## Project Structure

```
community-portal/
├── netlify/
│   └── functions/          # Serverless functions
│       ├── send-notification.ts
│       └── update-profile-status.ts
├── src/
│   ├── app/                # Next.js App Router pages
│   │   ├── admin/          # Admin dashboard
│   │   ├── announcements/  # News feed
│   │   ├── auth/callback/  # OAuth callback
│   │   ├── dashboard/      # User dashboard
│   │   ├── directory/      # Member directory
│   │   ├── financial-audits/
│   │   ├── login/
│   │   ├── register/
│   │   └── trustees/
│   ├── components/
│   │   └── auth/           # Auth components
│   └── lib/                # Utilities and Supabase client
├── netlify.toml            # Netlify configuration
├── supabase-schema.sql     # Database schema
└── .env.local.example      # Environment template
```

## Database Schema

The application uses the following tables:

- `profiles`: User profiles with approval status
- `announcements`: Community news and updates
- `financial_audits`: Financial reports
- `trustees`: Community leadership contacts

See `supabase-schema.sql` for complete schema with RLS policies.

## Security

- Row Level Security (RLS) enabled on all tables
- Members can only view approved profiles
- Admins have full access
- Serverless functions use service role for privileged operations

## Adding an Admin

To make a user an admin, run this in Supabase SQL Editor:

```sql
UPDATE profiles SET role = 'ADMIN' WHERE email = 'admin@example.com';
```

## License

MIT
