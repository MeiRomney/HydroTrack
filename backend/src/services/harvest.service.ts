import type { Harvest } from "@prisma/client";
import { prisma } from "../prisma.client.js";

export interface CreateHarvestInput {
  harvestDate?: Date;
  yieldKg: number;
  notes?: string;
  batchId: number;
}

export interface UpdateHarvestInput {
  harvestDate?: Date;
  yieldKg?: number;
  notes?: string;
}

export class HarvestService {
  async create(data: CreateHarvestInput): Promise<Harvest> {
    return prisma.harvest.create({ data });
  }

  async findAll(): Promise<Harvest[]> {
    return prisma.harvest.findMany({ include: { batch: true } });
  }

  async findByBatch(batchId: number): Promise<Harvest[]> {
    return prisma.harvest.findMany({
      where: { batchId },
      orderBy: { harvestDate: "desc" },
    });
  }

  async findById(id: number): Promise<Harvest | null> {
    return prisma.harvest.findUnique({
      where: { id },
      include: { batch: true },
    });
  }

  async update(id: number, data: UpdateHarvestInput): Promise<Harvest> {
    return prisma.harvest.update({ where: { id }, data });
  }

  async delete(id: number): Promise<Harvest> {
    return prisma.harvest.delete({ where: { id } });
  }
}
