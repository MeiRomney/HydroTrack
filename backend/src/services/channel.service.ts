import type { Channel } from "@prisma/client";
import { prisma } from "../prisma.client.js";

export interface CreateChannelInput {
  name: string;
  capacity: number;
  status?: string;
}

export interface UpdateChannelInput {
  name?: string;
  capacity?: number;
  status?: string;
}

export class ChannelService {
  async create(data: CreateChannelInput): Promise<Channel> {
    return prisma.channel.create({ data });
  }

  async findAll(): Promise<Channel[]> {
    return prisma.channel.findMany({ include: { batches: true } });
  }

  async findById(id: number): Promise<Channel | null> {
    return prisma.channel.findUnique({
      where: { id },
      include: { batches: true },
    });
  }

  async update(id: number, data: UpdateChannelInput): Promise<Channel> {
    return prisma.channel.update({ where: { id }, data });
  }

  async delete(id: number): Promise<Channel> {
    return prisma.channel.delete({ where: { id } });
  }
}
