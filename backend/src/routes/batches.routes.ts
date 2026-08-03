import { Router } from "express";
import { BatchController } from "../controllers/batch.controller.js";

const router = Router();
const controller = new BatchController();

/**
 * @openapi
 * /api/batches:
 *   get:
 *     summary: Get all crop batches
 *     tags: [Batches]
 *     responses:
 *       200:
 *         description: List of batches
 *   post:
 *     summary: Create a new crop batch
 *     tags: [Batches]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [cropType, plantedDate, expectedHarvestDate, channelId]
 *             properties:
 *               cropType: { type: string, example: "Lettuce" }
 *               plantedDate: { type: string, format: date }
 *               expectedHarvestDate: { type: string, format: date }
 *               channelId: { type: integer, example: 1 }
 *     responses:
 *       201:
 *         description: Batch created
 */
router.get("/", controller.getAll.bind(controller));
router.post("/", controller.create.bind(controller));

/**
 * @openapi
 * /api/batches/{id}:
 *   get:
 *     summary: Get a single batch by id
 *     tags: [Batches]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Batch found }
 *       404: { description: Batch not found }
 *   put:
 *     summary: Update a batch
 *     tags: [Batches]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Batch updated }
 *       404: { description: Batch not found }
 *   delete:
 *     summary: Delete a batch
 *     tags: [Batches]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204: { description: Batch deleted }
 *       404: { description: Batch not found }
 */
router.get("/:id", controller.getById.bind(controller));
router.put("/:id", controller.update.bind(controller));
router.delete("/:id", controller.remove.bind(controller));

export default router;
