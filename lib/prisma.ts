import { PrismaClient } from '@prisma/client';
import { Pool, types } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// Core database initialization logic for Prisma 7
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

// Ensure Decimals are parsed as floats for calculations
types.setTypeParser(1700, (val) => parseFloat(val));

const getPrisma = () => {
    // Standard Vercel + Supabase/Neon connection strings
    const url = process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL;

    if (!url) {
        console.error('CRITICAL: DATABASE_URL is not set. Database features will fail.');
        return new PrismaClient();
    }

    console.log(`Initializing Prisma with provider: ${url.startsWith('postgresql') ? 'PostgreSQL' : 'SQLite/LibSQL'}`);

    // SQLite/LibSQL path (Local development)
    if (url.startsWith('file:') || url.startsWith('libsql:')) {
        try {
            const { createClient } = require('@libsql/client');
            const { PrismaLibSql } = require('@prisma/adapter-libsql');
            const libsql = createClient({ url });
            const adapter = new PrismaLibSql(libsql);
            return new PrismaClient({ adapter });
        } catch (error) {
            console.error('Failed to initialize LibSQL adapter:', error);
            return new PrismaClient();
        }
    }

    // PostgreSQL path (Production/Vercel)
    else {
        try {
            const pool = new Pool({
                connectionString: url,
                ssl: { rejectUnauthorized: false }, // Required for Supabase/Neon in production
                max: 1 // Optimize for serverless cold starts and connection limits
            });
            const adapter = new PrismaPg(pool);
            return new PrismaClient({ adapter });
        } catch (error) {
            console.error('Failed to initialize PostgreSQL adapter:', error);
            return new PrismaClient();
        }
    }
};

export const prisma = globalForPrisma.prisma ?? getPrisma();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
