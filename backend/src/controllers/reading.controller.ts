import type { Request, Response } from "express";
import { ReadingService } from "../services/reading.service.js";

const readingService = new ReadingService();

export class ReadingController {
  async create(req: Request, res: Response) {
    try {
      const reading = await readingService.create(req.body);
      res.status(201).json(reading);
    } catch (err) {
      res.status(400).json({ error: "Failed to create reading" });
    }
  }

  async getAll(req: Request, res: Response) {
    // Optional ?batchId= filter, since readings are usually viewed per-batch
    if (req.query.batchId) {
      const readings = await readingService.findByBatch(
        Number(req.query.batchId),
      );
      return res.json(readings);
    }
    const readings = await readingService.findAll();
    res.json(readings);
  }

  async getById(req: Request, res: Response) {
    const reading = await readingService.findById(Number(req.params.id));
    if (!reading) return res.status(404).json({ error: "Reading not found" });
    res.json(reading);
  }

  async update(req: Request, res: Response) {
    try {
      const reading = await readingService.update(
        Number(req.params.id),
        req.body,
      );
      res.json(reading);
    } catch (err) {
      res.status(404).json({ error: "Reading not found" });
    }
  }

  async remove(req: Request, res: Response) {
    try {
      await readingService.delete(Number(req.params.id));
      res.status(204).send();
    } catch (err) {
      res.status(404).json({ error: "Reading not found" });
    }
  }
}
