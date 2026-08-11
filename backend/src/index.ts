import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Simple request logger (helpful while learning/debugging)
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Health check route
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

// TODO: mount your feature routes here as you build them, e.g.
// import channelRoutes from './routes/channels';
// app.use('/api/channels', channelRoutes);
//
// import batchRoutes from './routes/batches';
// app.use('/api/batches', batchRoutes);
//
// import readingRoutes from './routes/readings';
// app.use('/api/readings', readingRoutes);
//
// import harvestRoutes from './routes/harvests';
// app.use('/api/harvests', harvestRoutes);

import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger.js";

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

import batchRoutes from "./routes/batches.routes.js";
import channelRoutes from "./routes/channels.routes.js";
import readingRoutes from "./routes/readings.routes.js";
import harvestRoutes from "./routes/harvests.routes.js";

app.use("/api/batches", batchRoutes);
app.use("/api/channels", channelRoutes);
app.use("/api/readings", readingRoutes);
app.use("/api/harvests", harvestRoutes);
// 404 handler — must come after all real routes
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` });
});

// Central error handler — must have 4 args for Express to treat it as an error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("--- ERROR ---");
  console.error("Message:", err.message);
  console.error("Code:", err.code);
  console.error("Meta:", err.meta);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`HydroTrack backend running on http://localhost:${PORT}`);
});
