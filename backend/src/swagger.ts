import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "HydroTrack API",
      version: "1.0.0",
      description:
        "API for managing hydroponic grow channels, crop batches, readings, and harvests.",
    },
    servers: [{ url: "http://localhost:3001" }],
  },
  // Point this at every routes file that has @openapi JSDoc comments
  apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
