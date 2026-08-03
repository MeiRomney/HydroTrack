import type { Batch } from "@prisma/client";
import { prisma } from "../prisma.client.js";

// Shape of data needed to create a batch (id/relations are generated or set separately)
export interface CreateBatchInput {
  cropType: string;
  plantedDate: Date;
  expectedHarvestDate: Date;
  channelId: number;
  status?: string;
}

export interface UpdateBatchInput {
  cropType?: string;
  plantedDate?: Date;
  expectedHarvestDate?: Date;
  status?: string;
}

export class BatchService {
  async create(data: CreateBatchInput): Promise<Batch> {
    return prisma.batch.create({ data });
  }

  async findAll(): Promise<Batch[]> {
    return prisma.batch.findMany({
      include: { channel: true, readings: true, harvests: true },
    });
  }

  async findById(id: number): Promise<Batch | null> {
    return prisma.batch.findUnique({
      where: { id },
      include: { channel: true, readings: true, harvests: true },
    });
  }

  async update(id: number, data: UpdateBatchInput): Promise<Batch> {
    return prisma.batch.update({ where: { id }, data });
  }

  async delete(id: number): Promise<Batch> {
    return prisma.batch.delete({ where: { id } });
  }
}
