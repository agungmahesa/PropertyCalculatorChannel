# Deployment Environment Variables

## Supabase Configuration
Go to your Supabase Project Settings > Database > Connection String > Prisma.
Copy the following variables and add them to your `.env` file and Vercel Environment Variables.

```env
# Transaction mode (use port 6543)
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:6543/postgres?pgbouncer=true&connection_limit=1"

# Session mode (use port 5432)
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# NextAuth Configuration
NEXTAUTH_SECRET="any-random-long-string"
NEXTAUTH_URL="https://property-calculator-channel.vercel.app" # Update after deployment
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
