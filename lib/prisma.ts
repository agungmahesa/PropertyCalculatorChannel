import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

const getPrisma = () => {
    const url = process.env.DATABASE_URL || '';

    if (url.startsWith('file:') || url.startsWith('libsql:')) {
        const adapter = new PrismaLibSql({ url });
        return new PrismaClient({ adapter });
    } else {
        const pool = new Pool({ connectionString: url });
        const adapter = new PrismaPg(pool);
        return new PrismaClient({ adapter });
    }
};

export const prisma = globalForPrisma.prisma ?? getPrisma();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
