# સમુદાય પોર્ટલ | Community Portal

A full-stack community portal built with Next.js, Supabase, and Netlify.
(Next.js, Supabase અને Netlify સાથે બનેલું ફુલ-સ્ટેક સમુદાય પોર્ટલ)

## વિશેષતાઓ | Features

- **ઓથેન્ટિકેશન**: Email/password અને OAuth (Google, LinkedIn, Facebook) via Supabase Auth
- **સભ્ય નોંધણી**: Multi-step registration form with validation
- **મંજૂરી વર્કફ્લો**: Admin approval required for new members
- **સભ્ય ડિરેક્ટરી**: Searchable directory of approved members
- **સમાચાર**: Public news and updates feed
- **નાણાકીય અહેવાલો**: Transparent financial reporting with PDF support
- **ટ્રસ્ટીઓ પેજ**: Contact information for community leaders
- **એડમિન ડેશબોર્ડ**: Member approval and content management

## ટેક સ્ટેક | Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Backend**: Netlify Serverless Functions
- **Database & Auth**: Supabase (PostgreSQL, GoTrue Auth, Storage)
- **Deployment**: Netlify (Free Tier)

## શરૂઆત કરો | Getting Started

### જરૂરિયાતો | Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (free tier)
- Netlify account (free tier)

### ૧. ક્લોન અને ઇન્સ્ટોલ | Clone and Install

```bash
cd community-portal
npm install
```

### ૨. સુપાબેઝ સેટઅપ | Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the contents of `supabase-schema.sql`
3. Run `supabase-seed-data.sql` to add sample data including default admin
4. Create storage buckets: `audits` and `profile-photos`
5. Configure OAuth providers in Authentication > Providers (optional)

**ડિફોલ્ટ એડમિન લોગિન | Default Admin Login:**
- Email: `admin@community.org`
- Password: `Admin123!` (પહેલા લોગિન પછી તરત બદલો! | Change immediately after first login!)

### ૩. એન્વાયર્નમેન્ટ વેરिएબल्स | Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your values:

```bash
cp .env.local.example .env.local
```

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon/public key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (server-side only)

### ૪. લોકલ ડેવલપમેન્ટ | Local Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### ૫. Netlify પર ડેપ્લોય | Deploy to Netlify

1. Push your code to GitHub/GitLab
2. Connect your repository on [Netlify](https://netlify.com)
3. Add environment variables in Netlify dashboard
4. Deploy!

## પ્રોજેક્ટ સ્ટ્રક્ચર | Project Structure

```
community-portal/
├── netlify/
│   └── functions/          # Serverless functions
│       ├── send-notification.ts
│       └── update-profile-status.ts
├── src/
│   ├── app/                # Next.js App Router pages
│   │   ├── admin/          # Admin dashboard (એડમિન ડેશબોર્ડ)
│   │   │   └── settings/   # Admin settings (ઇમેઇલ/SMS કોન્ફિગ)
│   │   ├── announcements/  # News feed (સમાચાર)
│   │   ├── auth/callback/  # OAuth callback
│   │   ├── dashboard/      # User dashboard (યુઝર ડેશબોર્ડ)
│   │   ├── directory/      # Member directory (સભ્ય ડિરેક્ટરી)
│   │   ├── financial-audits/ # નાણાકીય અહેવાલો
│   │   ├── login/          # લૉગિન
│   │   ├── register/       # નોંધણી
│   │   └── trustees/       # ટ્રસ્ટીઓ
│   ├── components/
│   │   └── auth/           # Auth components
│   └── lib/                # Utilities and Supabase client
├── netlify.toml            # Netlify configuration
├── supabase-schema.sql     # Database schema
├── supabase-seed-data.sql  # Sample data with default admin
└── .env.local.example      # Environment template
```

## ડેટાબેઝ સ્કીમા | Database Schema

The application uses the following tables:

- `profiles`: User profiles with approval status
- `announcements`: Community news and updates
- `financial_audits`: Financial reports
- `trustees`: Community leadership contacts
- `app_config`: Admin settings for email/SMS services (ઇમેઇલ/SMS સેવાઓ માટે સેટિંગ્સ)

See `supabase-schema.sql` for complete schema with RLS policies.

## સુરક્ષા | Security

- Row Level Security (RLS) enabled on all tables
- Members can only view approved profiles
- Admins have full access
- Serverless functions use service role for privileged operations
- API keys and passwords stored securely in database

## એડમિન ઉમેરવું | Adding an Admin

To make a user an admin, run this in Supabase SQL Editor:

```sql
UPDATE profiles SET role = 'ADMIN' WHERE email = 'your-email@example.com';
```

## ઇમેઇલ અને SMS સેટઅપ | Email & SMS Setup

Admins can configure email and SMS services from the Admin Settings page:
1. Log in as admin
2. Go to Admin Dashboard → Settings (સેટિંગ્સ)
3. Configure SMTP (Gmail, etc.) or Resend API for emails
4. Configure Twilio for SMS notifications

Free tier options:
- **Email**: Resend.com (100 emails/day free) or Gmail SMTP
- **SMS**: Twilio (free trial credits)

## લાઇસન્સ | License

MIT
