# Personal app

Next.js 16 (App Router) + Tailwind v4 + Prisma, structured as one deployable
app that serves both the website and a versioned public API for a future
mobile client.

## Structure

```
app/
├── page.tsx                     "/"            Presentation page
├── modules/
│   ├── page.tsx                 "/modules"     Module hub (reads lib/modules.ts)
│   ├── investing/page.tsx       "/modules/investing"  Dummy data for now
│   └── reminders/page.tsx       "/modules/reminders"  Dummy data for now
└── api/v1/
    ├── auth/login/route.ts      POST — issues access/refresh tokens + session cookie
    ├── auth/refresh/route.ts    POST — exchanges refresh token for new access token
    ├── reminders/route.ts       GET/POST — real Prisma/Neon-backed example
    └── stocks/route.ts          GET — dummy data, same shape a real market-data call would return

lib/
├── db.ts        Prisma client singleton
├── auth.ts       JWT sign/verify + `authenticate()` (checks Bearer header OR session cookie)
└── modules.ts     Module registry — add a module here + a page folder, nothing else

prisma/
└── schema.prisma   User + Reminder models — no connection URL (see below)

prisma.config.ts    CLI-only config (migrate, studio) — reads DIRECT_URL
```

**Note on Prisma 7:** connection URLs no longer live in `schema.prisma`.
The Prisma CLI (migrations, studio) reads its connection from
`prisma.config.ts` (`DIRECT_URL`), and `PrismaClient` itself connects via
the `@prisma/adapter-neon` driver adapter in `lib/db.ts` (`DATABASE_URL`,
the pooled string). Both env vars are still the two Neon connection
strings described below — just wired in differently than in older Prisma
versions or older tutorials you might find online.

## Adding a new module

1. Add an entry to `lib/modules.ts` (slug, name, description, status).
2. Create `app/modules/<slug>/page.tsx`.
3. It automatically shows up as a card on `/modules`.

## One backend, two clients (web + mobile)

- **Server Components / Server Actions** — used for the web app's own pages
  and form submissions. This code never ships to the browser.
- **Route Handlers under `app/api/v1/...`** — the real public API. Anything
  a future mobile app needs must exist here, since Server Actions aren't a
  stable contract for external clients.
- **Auth** — `lib/auth.ts` issues a short-lived access token + longer-lived
  refresh token on login. The web app gets them via an httpOnly cookie; a
  mobile app would store them itself and send `Authorization: Bearer <token>`.
  `authenticate()` checks either source, so the same route handler serves both.

The current login route is a **placeholder** — it upserts a user by email
with no password/OAuth check, since this is a single-owner personal app.
Swap in real verification (password hash, magic link, or Auth.js/an OAuth
provider) before this is exposed beyond just you.

## Local setup

```bash
npm install
cp .env.example .env   # fill in your Neon connection strings
npx prisma migrate dev --name init
npm run dev
```

## Neon (Postgres) setup

1. Create a project at https://neon.com.
2. In the Neon dashboard → Connection Details:
   - Copy the **pooled** connection string into `DATABASE_URL`.
   - Copy the **direct** connection string into `DIRECT_URL`.
3. `DATABASE_URL` is what the running app uses for normal queries.
   `DIRECT_URL` is only used by Prisma when running migrations.
4. Optional but handy: create a Neon **branch** per feature/PR for a
   throwaway copy of the schema + data during development.

## Deploying to Render

1. Push this repo to GitHub.
2. Render dashboard → **New → Web Service** → connect the repo.
3. Build command: `npm install && npm run build`
   (this runs `prisma generate` automatically, then `next build`)
4. Start command: `npm run start`
5. Add environment variables in Render's dashboard: `DATABASE_URL`,
   `DIRECT_URL`, `AUTH_SECRET` (generate with `openssl rand -base64 32`).
6. Before or after the first deploy, run migrations against Neon once —
   easiest from your local machine: `npx prisma migrate deploy` with
   `DIRECT_URL` pointed at Neon.
7. Every push to your main branch redeploys automatically.

## Notes on this scaffold

- The Investing and Reminders module **pages** currently render hardcoded
  dummy arrays, matching what their real API routes return. The Reminders
  **API route** is already fully wired to Prisma/Neon — swap the page's
  hardcoded array for a `fetch("/api/v1/reminders")` call once there's a
  real logged-in session to test with.
- No chart library is included yet. The Investing page uses simple CSS bars.
  If you want real charts later, `recharts` is a solid, lightweight option.
