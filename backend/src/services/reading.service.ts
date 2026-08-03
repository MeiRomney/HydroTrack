import type { Reading } from "@prisma/client";
import { prisma } from "../prisma.client.js";

export interface CreateReadingInput {
  date?: Date;
  pH: number;
  ec: number;
  waterTemp: number;
  notes?: string;
  batchId: number;
}

export interface UpdateReadingInput {
  date?: Date;
  pH?: number;
  ec?: number;
  waterTemp?: number;
  notes?: string;
}

export class ReadingService {
  async create(data: CreateReadingInput): Promise<Reading> {
    return prisma.reading.create({ data });
  }

  async findAll(): Promise<Reading[]> {
    return prisma.reading.findMany({ include: { batch: true } });
  }

  async findByBatch(batchId: number): Promise<Reading[]> {
    return prisma.reading.findMany({
      where: { batchId },
      orderBy: { date: "asc" },
    });
  }

  async findById(id: number): Promise<Reading | null> {
    return prisma.reading.findUnique({
      where: { id },
      include: { batch: true },
    });
  }

  async update(id: number, data: UpdateReadingInput): Promise<Reading> {
    return prisma.reading.update({ where: { id }, data });
  }

  async delete(id: number): Promise<Reading> {
    return prisma.reading.delete({ where: { id } });
  }
}
