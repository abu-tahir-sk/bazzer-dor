# বাজার দর

## Authentication setup

Email/password authentication works with a local SQLite database. Better Auth
creates its schema automatically on the first authentication request and stores
the database in `.data/bazaar-auth.sqlite` (this file is ignored by Git). When
`DATABASE_URL` is configured, Better Auth uses PostgreSQL instead.

1. Copy `.env.example` to `.env.local`.
2. Set `BETTER_AUTH_SECRET` to a random secret of at least 32 characters. You
   can generate one with
   `node -e "console.log(require('node:crypto').randomBytes(32).toString('base64'))"`.
3. Keep `BETTER_AUTH_URL=http://localhost:3000` for local development.
4. Run `npm run dev`.

Google and GitHub sign-in are optional. Add the corresponding client ID and
client secret to `.env.local`. Set each provider's callback URL to
`http://localhost:3000/api/auth/callback/google` or
`http://localhost:3000/api/auth/callback/github`. For deployment, use the
deployed app origin in `BETTER_AUTH_URL` and in the provider callback URL, and
set a PostgreSQL `DATABASE_URL` plus a private `BETTER_AUTH_SECRET` in the
hosting provider's environment settings. Production authentication refuses to
start without persistent PostgreSQL storage and a secret. Never commit
`.env.local` or production credentials.