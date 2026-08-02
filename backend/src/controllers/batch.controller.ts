import type { Request, Response } from "express";
import { BatchService } from "../services/batch.service.js";

const batchService = new BatchService();

export class BatchController {
  async create(req: Request, res: Response) {
    try {
      const batch = await batchService.create(req.body);
      res.status(201).json(batch);
    } catch (err) {
      res.status(400).json({ error: "Failed to create batch" });
    }
  }

  async getAll(_req: Request, res: Response) {
    const batches = await batchService.findAll();
    res.json(batches);
  }

  async getById(req: Request, res: Response) {
    const batch = await batchService.findById(Number(req.params.id));
    if (!batch) return res.status(404).json({ error: "Batch not found" });
    res.json(batch);
  }

  async update(req: Request, res: Response) {
    try {
      const batch = await batchService.update(Number(req.params.id), req.body);
      res.json(batch);
    } catch (err) {
      res.status(404).json({ error: "Batch not found" });
    }
  }

  async remove(req: Request, res: Response) {
    try {
      await batchService.delete(Number(req.params.id));
      res.status(204).send();
    } catch (err) {
      res.status(404).json({ error: "Batch not found" });
    }
  }
}
