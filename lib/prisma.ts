import { PrismaClient } from '@prisma/client';
import { Pool, types } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// Parse PostgreSQL decimals as floats
types.setTypeParser(1700, (val) => parseFloat(val));

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

/**
 * Factory for creating a Prisma client that handles Vercel environment variables
 * and provides safe connection logic for production.
 */
const createPrismaClient = (): PrismaClient => {
    // Standard Vercel + Supabase/Neon connection strings
    const url = process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL;

    if (!url) {
        console.error('CRITICAL: No database connection string found (DATABASE_URL or POSTGRES_PRISMA_URL)');
        // Return a client that will fail on use, but not at module load time
        return new PrismaClient();
    }

    try {
        if (url.startsWith('file:') || url.startsWith('libsql:')) {
            const { createClient } = require('@libsql/client');
            const { PrismaLibSql } = require('@prisma/adapter-libsql');
            const libsql = createClient({ url });
            const adapter = new PrismaLibSql(libsql);
            return new PrismaClient({ adapter });
        } else {
            const pool = new Pool({
                connectionString: url,
                ssl: { rejectUnauthorized: false },
                max: 1 // Single connection per serverless instance
            });
            const adapter = new PrismaPg(pool);
            return new PrismaClient({ adapter });
        }
    } catch (err) {
        console.error('Failed to initialize Prisma Client adapter:', err);
        return new PrismaClient();
    }
};

/**
 * Safe proxy for Prisma that ensures we don't crash at module load time
 * if the environment is not yet ready or configured.
 */
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
