# Environment Setup Guide

## Required Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database (PostgreSQL for production)
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"

# Clerk Auth (Get these from https://clerk.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_xxxxxxxxxxxxxxxxxx"
CLERK_SECRET_KEY="sk_test_xxxxxxxxxxxxxxxxxx"
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/dashboard"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/dashboard"
```

## Production Database Setup

For production (Vercel), you need a proper database service. SQLite files don't work in serverless environments.

### Recommended Options:

1. **Planetscale (MySQL)** - Free tier available
   ```
   DATABASE_URL="mysql://username:password@host/database?sslaccept=strict"
   ```

2. **Neon (PostgreSQL)** - Free tier available
   ```
   DATABASE_URL="postgresql://username:password@host/database?sslmode=require"
   ```

3. **Supabase (PostgreSQL)** - Free tier available
   ```
   DATABASE_URL="postgresql://postgres:password@host:5432/postgres"
   ```

### Setup Steps:

1. Create account with one of the database providers
2. Create a new database
3. Copy the connection string
4. In Vercel dashboard:
   - Go to your project settings
   - Go to Environment Variables
   - Add `DATABASE_URL` with your connection string
5. Schema is already configured for PostgreSQL:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
6. Run `npx prisma migrate deploy` in production

## MIA Payments (QR)

User-facing label for this payment method is **MIA** everywhere in the UI.
Internally it is implemented via the Bpay QR MIA API
(https://blog.bpay.md/ro/dev-ro-qrmia/) — this provider name must never be
shown to end users, only used in code/config.

```env
# Merchant credentials issued by Bpay for the MIA QR integration
MIA_MERCHANT_ID="your_bpay_merchant_id"
MIA_SECRET_KEY="your_bpay_secret_key"

# Optional overrides
MIA_API_BASE_URL="https://qr-merchant.bpay.md" # https://qr-test.bpay.md for sandbox
MIA_TEST_MODE="false"                          # "true" to default to the sandbox host
MIA_POINT_ID="1"                               # point-of-sale identifier, arbitrary if you only have one
```

Add these in Vercel: **Project → Settings → Environment Variables**, for
Production (and Preview if you want to test there too). Never commit real
secret values to this repo — only placeholders belong here.

## Local Development

1. Copy this template to `.env`
2. Replace placeholder values with your actual keys
3. Run `npx prisma generate` to generate the client
4. Run `npx prisma migrate dev` to create/update the database
