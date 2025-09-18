# Production Database Setup for Vercel Deployment

## 🚨 Important: SQLite + Vercel Limitation

**SQLite does not work properly on Vercel** due to its serverless, stateless nature. The database file cannot persist between function invocations.

## 🎯 Recommended Production Database Solutions

### Option 1: Vercel Postgres (Recommended)
```bash
# Install Vercel Postgres
npm install @vercel/postgres

# Set environment variables in Vercel Dashboard:
POSTGRES_URL="postgres://username:password@hostname:port/database"
# or
DATABASE_URL="postgresql://username:password@hostname:port/database"
```

### Option 2: Supabase (Free Tier Available)
```bash
# Environment variables for Supabase:
DATABASE_URL="postgresql://postgres:[password]@[project-ref].supabase.co:5432/postgres"
```

### Option 3: PlanetScale (MySQL)
```bash
# Environment variables for PlanetScale:
DATABASE_URL="mysql://username:password@hostname:port/database"
```

## 🔧 Setup Steps for Production

### 1. Update Prisma Schema for PostgreSQL
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"  // Change from "sqlite" to "postgresql"
  url      = env("DATABASE_URL")
}

// Your existing models remain the same
model User {
  // ... your existing schema
}

model Transaction {
  // ... your existing schema
}
```

### 2. Set Environment Variables in Vercel
1. Go to your Vercel Dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add:
   - `DATABASE_URL`: Your production database connection string
   - `OPENAI_API_KEY`: Your OpenAI API key
   - All other necessary environment variables

### 3. Run Database Migration
```bash
# Generate Prisma client for PostgreSQL
npx prisma generate

# Push schema to production database
npx prisma db push

# Or use migrations (recommended for production)
npx prisma migrate deploy
```

## 🚀 Current Build Configuration

The project is configured to handle different environments:

- **Local Development**: Uses SQLite (`file:./dev.db`)
- **Production/Vercel**: Skips database initialization during build
- **Build Script**: `npm run build:vercel` (no database init)

## 📝 Environment Variables Needed for Production

Add these to your Vercel project:

```env
# Database
DATABASE_URL="postgresql://username:password@hostname:port/database"

# OpenAI
OPENAI_API_KEY="your-openai-api-key"

# Clerk (if needed)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# N8N Webhook  
N8N_WEBHOOK_URL="https://vanya-vasya.app.n8n.cloud/webhook/4c6c4649-99ef-4598-b77b-6cb12ab6a102"
```

## 🔄 Migration Steps

1. **Choose a database provider** (Vercel Postgres recommended)
2. **Update `prisma/schema.prisma`** provider to "postgresql"
3. **Set `DATABASE_URL`** in Vercel environment variables
4. **Deploy** - the build will now succeed
5. **Run migrations** to create tables in production database

## 🧪 Testing Production Database

```bash
# Test connection locally with production DATABASE_URL
DATABASE_URL="your-production-url" npx prisma db push

# Or test in Vercel Functions
# Add a simple API route to test database connectivity
```

## 📚 Additional Resources

- [Vercel Postgres Documentation](https://vercel.com/docs/storage/vercel-postgres)
- [Prisma with PostgreSQL](https://www.prisma.io/docs/concepts/database-connectors/postgresql)
- [Supabase Quick Start](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [PlanetScale with Prisma](https://planetscale.com/docs/prisma/prisma-quickstart)

## 🆘 Quick Fix for Current Deployment

If you need the app to deploy immediately without database:

1. The current build configuration will skip database initialization on Vercel
2. Database-dependent features will fail at runtime until you set up a production database
3. Set up one of the recommended database solutions above for full functionality
