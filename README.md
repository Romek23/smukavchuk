# Smukavchuk Epoxid Art

Portfolio gallery and lightweight admin panel for Smukavchuk Epoxid Art.

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS

## Getting Started

Install dependencies:

```bash
npm install
```

Create local environment variables:

```bash
cp .env.example .env.local
```

Set the admin credentials:

```env
ADMIN_USERNAME=
ADMIN_PASSWORD=
ADMIN_SESSION_SECRET=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_STORAGE_BUCKET=gallery
```

Run the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Admin Panel

The admin panel is available at `/admin`.

Admins can:

- sign in with the credentials from `.env.local`
- upload JPG, PNG, or WEBP images up to 5 MB
- delete uploaded gallery images

The admin session is stored in an httpOnly cookie. Use a long random value for `ADMIN_SESSION_SECRET` in production.

## Gallery Storage

For production, uploaded images are stored in Supabase Storage when these variables are configured:

```env
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_STORAGE_BUCKET=gallery
```

Create a public Supabase Storage bucket named `gallery`. The service role key must stay server-side only, so do not prefix it with `NEXT_PUBLIC_`.

If Supabase variables are not configured, the app falls back to local `public/gallery` storage for local development.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

Run these before handoff:

```bash
npm run lint
npm run build
npm audit --audit-level=moderate
```
