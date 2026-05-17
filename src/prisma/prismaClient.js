import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

// Создаем пул подключений к Postgres
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Оборачиваем пул в Prisma-адаптер
const adapter = new PrismaPg(pool);

// Теперь PrismaClient будет работать, так как мы передали ему адаптер!
const prisma = new PrismaClient({ adapter });

export default prisma;