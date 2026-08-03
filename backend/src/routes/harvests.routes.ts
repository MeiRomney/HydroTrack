import { Router } from "express";
import { HarvestController } from "../controllers/harvest.controller.js";

const router = Router();
const controller = new HarvestController();

/**
 * @openapi
 * /api/harvests:
 *   get:
 *     summary: Get all harvests, optionally filtered by batch
 *     tags: [Harvests]
 *     parameters:
 *       - in: query
 *         name: batchId
 *         required: false
 *         schema: { type: integer }
 *         description: Filter harvests to a single batch
 *     responses:
 *       200:
 *         description: List of harvests
 *   post:
 *     summary: Record a new harvest
 *     tags: [Harvests]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [yieldKg, batchId]
 *             properties:
 *               yieldKg: { type: number, example: 2.4 }
 *               notes: { type: string, example: "Slightly early harvest" }
 *               batchId: { type: integer, example: 1 }
 *     responses:
 *       201:
 *         description: Harvest recorded
 */
router.get("/", controller.getAll.bind(controller));
router.post("/", controller.create.bind(controller));

/**
 * @openapi
 * /api/harvests/{id}:
 *   get:
 *     summary: Get a single harvest by id
 *     tags: [Harvests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Harvest found }
 *       404: { description: Harvest not found }
 *   put:
 *     summary: Update a harvest
 *     tags: [Harvests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Harvest updated }
 *       404: { description: Harvest not found }
 *   delete:
 *     summary: Delete a harvest
 *     tags: [Harvests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204: { description: Harvest deleted }
 *       404: { description: Harvest not found }
 */
router.get("/:id", controller.getById.bind(controller));
router.put("/:id", controller.update.bind(controller));
router.delete("/:id", controller.remove.bind(controller));

export default router;
