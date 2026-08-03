import type { Request, Response } from "express";
import { HarvestService } from "../services/harvest.service.js";

const harvestService = new HarvestService();

export class HarvestController {
  async create(req: Request, res: Response) {
    try {
      const harvest = await harvestService.create(req.body);
      res.status(201).json(harvest);
    } catch (err) {
      res.status(400).json({ error: "Failed to create harvest" });
    }
  }

  async getAll(req: Request, res: Response) {
    if (req.query.batchId) {
      const harvests = await harvestService.findByBatch(
        Number(req.query.batchId),
      );
      return res.json(harvests);
    }
    const harvests = await harvestService.findAll();
    res.json(harvests);
  }

  async getById(req: Request, res: Response) {
    const harvest = await harvestService.findById(Number(req.params.id));
    if (!harvest) return res.status(404).json({ error: "Harvest not found" });
    res.json(harvest);
  }

  async update(req: Request, res: Response) {
    try {
      const harvest = await harvestService.update(
        Number(req.params.id),
        req.body,
      );
      res.json(harvest);
    } catch (err) {
      res.status(404).json({ error: "Harvest not found" });
    }
  }

  async remove(req: Request, res: Response) {
    try {
      await harvestService.delete(Number(req.params.id));
      res.status(204).send();
    } catch (err) {
      res.status(404).json({ error: "Harvest not found" });
    }
  }
}
