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
    // We prioritize DATABASE_URL if it looks like a pooler URL (port 6543)
    // or fallback to POSTGRES_PRISMA_URL (Vercel's default for Postgres)
    const dbUrl = process.env.DATABASE_URL || '';
    const prismaUrl = process.env.POSTGRES_PRISMA_URL || '';

    // Logic: If DATABASE_URL is explicitly set and contains ':6543' (Supabase Pooler), 
    // it's likely what the user just updated, so we prioritize it over the legacy Vercel URL.
    const url = dbUrl.includes(':6543') ? dbUrl : (prismaUrl || dbUrl);

    if (!url) {
        console.error('CRITICAL: No database connection string found');
        return new PrismaClient();
    }

    // Diagnostic logging for production (masked)
    if (process.env.NODE_ENV === 'production') {
        const maskedUrl = url.replace(/:([^@]+)@/, ':****@').split('?')[0];
        console.log(`[Prisma Init] Using connection: ${maskedUrl}`);
        if (prismaUrl && dbUrl && prismaUrl !== dbUrl) {
            console.warn(`[Prisma Init] Warning: Multiple DB URLs found. Prioritizing: ${maskedUrl}`);
        }
    }

    try {
        if (url.startsWith('file:') || url.startsWith('libsql:')) {
            const { createClient } = require('@libsql/client');
            const { PrismaLibSql } = require('@prisma/adapter-libsql');
            const libsql = createClient({ url });
            const adapter = new PrismaLibSql(libsql);
            return new PrismaClient({ adapter });
        } else {
            // Check for SSL requirement (Supabase Pooler usually needs SSL)
            const connectionUrl = new URL(url);
            const pool = new Pool({
                connectionString: url,
                ssl: { rejectUnauthorized: false },
                max: 1
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
