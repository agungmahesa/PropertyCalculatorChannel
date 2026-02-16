import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

const getPrisma = () => {
    const url = process.env.DATABASE_URL;

    if (!url) {
        console.warn('DATABASE_URL is not set. Database features will fail.');
        return new PrismaClient();
    }

    if (url.startsWith('file:') || url.startsWith('libsql:')) {
        const { createClient } = require('@libsql/client');
        const libsql = createClient({ url });
        const adapter = new PrismaLibSql({ url });
        return new PrismaClient({ adapter });
    } else {
        // PostgreSQL connection with SSL support for production (Supabase/Neon)
        const pool = new Pool({
            connectionString: url,
            ssl: url.includes('localhost') ? false : { rejectUnauthorized: false }
        });
        const adapter = new PrismaPg(pool);
        return new PrismaClient({ adapter });
    }
};

export const prisma = globalForPrisma.prisma ?? getPrisma();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
