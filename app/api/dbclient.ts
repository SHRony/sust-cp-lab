// dbClient.ts
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
dotenv.config();
export const prisma = new PrismaClient();
// export default client;
