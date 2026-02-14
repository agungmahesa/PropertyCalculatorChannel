# Deployment Environment Variables

## Supabase Configuration
Go to your Supabase Project Settings > Database > Connection String > Prisma.
Copy the following variables and add them to your `.env` file and Vercel Environment Variables.

```env
# Transaction mode (Key: DATABASE_URL)
DATABASE_URL="postgresql://postgres:h7CQbtnmpDsWAL0K@db.aamvjrfhihtzvvnpijqa.supabase.co:6543/postgres?pgbouncer=true&connection_limit=1"

# Session mode (Key: DIRECT_URL)
DIRECT_URL="postgresql://postgres:h7CQbtnmpDsWAL0K@db.aamvjrfhihtzvvnpijqa.supabase.co:5432/postgres"

# NextAuth Configuration (Key: NEXTAUTH_SECRET)
NEXTAUTH_SECRET="f6e7d8c9b0a1f2e3d4c5b6a7f8e9d0c1" 
```

## Vercel Deployment Steps
1. Push the code to GitHub (Done).
2. Go to [vercel.com/new](https://vercel.com/new).
3. Import the `PropertyCalculatorChannel` repository.
4. In **Environment Variables**, add:
    - `DATABASE_URL`
    - `DIRECT_URL`
    - `NEXTAUTH_SECRET`
5. Click **Deploy**.
6. After deployment, run `npx prisma migrate deploy` in Vercel's terminal or locally pointing to Supabase to set up tables.
