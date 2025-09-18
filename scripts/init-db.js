// Database initialization script for production
const { PrismaClient } = require('@prisma/client');

async function initDatabase() {
  // Skip database initialization in production build environments
  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    console.log('🚀 Skipping database initialization in production build environment');
    return;
  }

  // Check if DATABASE_URL is available
  if (!process.env.DATABASE_URL) {
    console.log('⚠️  DATABASE_URL not found, skipping database initialization');
    return;
  }

  const prisma = new PrismaClient();
  
  try {
    console.log('Checking database connection...');
    
    // Test connection
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database connected successfully');
    
    // Check if User table exists
    try {
      await prisma.user.findFirst();
      console.log('✅ Database tables already exist');
    } catch (error) {
      if (error.code === 'P2021') {
        console.log('⚠️  Tables do not exist. Creating tables...');
        
        // Create User table
        await prisma.$executeRaw`
          CREATE TABLE IF NOT EXISTS "User" (
            "id" TEXT NOT NULL PRIMARY KEY,
            "clerkId" TEXT NOT NULL UNIQUE,
            "email" TEXT NOT NULL UNIQUE,
            "photo" TEXT NOT NULL,
            "firstName" TEXT,
            "lastName" TEXT,
            "usedGenerations" INTEGER NOT NULL DEFAULT 0,
            "availableGenerations" INTEGER NOT NULL DEFAULT 20
          );
        `;
        
        // Create Transaction table
        await prisma.$executeRaw`
          CREATE TABLE IF NOT EXISTS "Transaction" (
            "id" TEXT NOT NULL PRIMARY KEY,
            "tracking_id" TEXT NOT NULL,
            "userId" TEXT NOT NULL,
            "status" TEXT,
            "amount" INTEGER,
            "currency" TEXT,
            "description" TEXT,
            "type" TEXT,
            "payment_method_type" TEXT,
            "message" TEXT,
            "paid_at" TIMESTAMP(3),
            "receipt_url" TEXT,
            CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("clerkId") ON DELETE RESTRICT ON UPDATE CASCADE
          );
        `;
        
        console.log('✅ Database tables created successfully');
      } else {
        throw error;
      }
    }
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  initDatabase()
    .then(() => {
      console.log('🎉 Database initialization completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Initialization failed:', error);
      process.exit(1);
    });
}

module.exports = { initDatabase };
