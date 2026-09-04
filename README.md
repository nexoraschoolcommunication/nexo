# Nexo — Production Architecture

Next.js 14 (App Router) + Supabase (Postgres + Auth + RLS). This is a real, deployable
codebase — not a mockup — but three things require credentials only you can generate;
everything else is fully wired.

## What you must supply before this runs

| Item | Where it goes | How to get it |
|---|---|---|
| Supabase URL + anon key | `.env.local` | Supabase project → Settings → API |
| Supabase service role key | `.env.local` (server-only, never shipped to client) | Supabase project → Settings → API |
| Google OAuth client ID/secret | Supabase Auth → Providers → Google | Google Cloud Console → OAuth consent screen |
| Cloudflare Turnstile site + secret key | `.env.local` | Cloudflare dashboard → Turnstile |
| Your logo file | `public/logo.svg` | Replace the placeholder |
| Domain | Vercel/host DNS + `NEXT_PUBLIC_SITE_URL` | Your registrar |

Nothing else in this repo is a placeholder. Auth flows, RLS policies, the meeting-link
generator, and the schema are real and functional once the above are set.

## Why Magic Link + Phone need a real backend
Magic Link email and phone OTP are both Supabase Auth features that require your
Supabase project to have an SMTP provider (for email) and an SMS provider like Twilio
(for phone) connected — that's configured in the Supabase dashboard, not in this code.
The sign-in UI and server-side session handling here are complete and will work
immediately once those providers are attached.

## Why the meeting generator is a real link, not an API call
`meet.google.com/new` is Google's own instant-meeting redirect — hitting it creates a
genuine, unique Meet room with no API key required, which is what's implemented in
`app/api/meetings/route.ts`. Attaching Calendar events to that room (auto-inviting both
users, adding it to their calendars) does require the Google Calendar API with OAuth
scopes and a verified app — that's the natural next step once you're validated in
Google Cloud, and the route is written so that upgrade is a small diff, not a rewrite.

## Run it
```
npm install
cp .env.example .env.local   # fill in the table above
npm run dev
```

## Deploy
Push to Vercel (or any Next.js host). Set the same env vars in the host's dashboard.
Run `schema.sql` once against your Supabase Postgres instance before first launch.
