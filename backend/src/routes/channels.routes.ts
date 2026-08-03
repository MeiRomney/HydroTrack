import { Router } from "express";
import { ChannelController } from "../controllers/channel.controller.js";

const router = Router();
const controller = new ChannelController();

/**
 * @openapi
 * /api/channels:
 *   get:
 *     summary: Get all grow channels
 *     tags: [Channels]
 *     responses:
 *       200:
 *         description: List of channels
 *   post:
 *     summary: Create a new grow channel
 *     tags: [Channels]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, capacity]
 *             properties:
 *               name: { type: string, example: "Channel A" }
 *               capacity: { type: integer, example: 12 }
 *               status: { type: string, example: "empty" }
 *     responses:
 *       201:
 *         description: Channel created
 */
router.get("/", controller.getAll.bind(controller));
router.post("/", controller.create.bind(controller));

/**
 * @openapi
 * /api/channels/{id}:
 *   get:
 *     summary: Get a single channel by id
 *     tags: [Channels]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Channel found }
 *       404: { description: Channel not found }
 *   put:
 *     summary: Update a channel
 *     tags: [Channels]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Channel updated }
 *       404: { description: Channel not found }
 *   delete:
 *     summary: Delete a channel
 *     tags: [Channels]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204: { description: Channel deleted }
 *       404: { description: Channel not found }
 */
router.get("/:id", controller.getById.bind(controller));
router.put("/:id", controller.update.bind(controller));
router.delete("/:id", controller.remove.bind(controller));

export default router;
