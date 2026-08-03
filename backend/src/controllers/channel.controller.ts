import type { Request, Response } from "express";
import { ChannelService } from "../services/channel.service.js";

const channelService = new ChannelService();

export class ChannelController {
  async create(req: Request, res: Response) {
    try {
      const channel = await channelService.create(req.body);
      res.status(201).json(channel);
    } catch (err) {
      res.status(400).json({ error: "Failed to create channel" });
    }
  }

  async getAll(_req: Request, res: Response) {
    const channels = await channelService.findAll();
    res.json(channels);
  }

  async getById(req: Request, res: Response) {
    const channel = await channelService.findById(Number(req.params.id));
    if (!channel) return res.status(404).json({ error: "Channel not found" });
    res.json(channel);
  }

  async update(req: Request, res: Response) {
    try {
      const channel = await channelService.update(
        Number(req.params.id),
        req.body,
      );
      res.json(channel);
    } catch (err) {
      res.status(404).json({ error: "Channel not found" });
    }
  }

  async remove(req: Request, res: Response) {
    try {
      await channelService.delete(Number(req.params.id));
      res.status(204).send();
    } catch (err) {
      res.status(404).json({ error: "Channel not found" });
    }
  }
}
