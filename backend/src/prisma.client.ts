import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to connect to the database.");
}

const adapter = new PrismaLibSql({ url: databaseUrl });

export const prisma = new PrismaClient({ adapter });

export default prisma;
