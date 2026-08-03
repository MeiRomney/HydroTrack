import { Router } from "express";
import { ReadingController } from "../controllers/reading.controller.js";

const router = Router();
const controller = new ReadingController();

/**
 * @openapi
 * /api/readings:
 *   get:
 *     summary: Get all readings, optionally filtered by batch
 *     tags: [Readings]
 *     parameters:
 *       - in: query
 *         name: batchId
 *         required: false
 *         schema: { type: integer }
 *         description: Filter readings to a single batch
 *     responses:
 *       200:
 *         description: List of readings
 *   post:
 *     summary: Log a new pH/EC/temperature reading
 *     tags: [Readings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [pH, ec, waterTemp, batchId]
 *             properties:
 *               pH: { type: number, example: 6.1 }
 *               ec: { type: number, example: 1.8 }
 *               waterTemp: { type: number, example: 22 }
 *               notes: { type: string, example: "Topped up nutrients" }
 *               batchId: { type: integer, example: 1 }
 *     responses:
 *       201:
 *         description: Reading logged
 */
router.get("/", controller.getAll.bind(controller));
router.post("/", controller.create.bind(controller));

/**
 * @openapi
 * /api/readings/{id}:
 *   get:
 *     summary: Get a single reading by id
 *     tags: [Readings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Reading found }
 *       404: { description: Reading not found }
 *   put:
 *     summary: Update a reading
 *     tags: [Readings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Reading updated }
 *       404: { description: Reading not found }
 *   delete:
 *     summary: Delete a reading
 *     tags: [Readings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204: { description: Reading deleted }
 *       404: { description: Reading not found }
 */
router.get("/:id", controller.getById.bind(controller));
router.put("/:id", controller.update.bind(controller));
router.delete("/:id", controller.remove.bind(controller));

export default router;
