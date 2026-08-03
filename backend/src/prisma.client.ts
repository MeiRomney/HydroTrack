import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to connect to the database.");
}

export const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: databaseUrl }),
});

export default prisma;
