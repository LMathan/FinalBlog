// src/index.ts

import express, { Request, Response, NextFunction } from "express";
import compression from "compression";
import { registerRoutes } from "./routes";
import { connectDB } from "./db";
import { log } from "./vite"; // You can keep this if needed

const app = express();

// Limit payload size to avoid memory overuse
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false, limit: "1mb" }));

// Enable gzip compression for responses
app.use(compression());

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    try {
      const preview = JSON.stringify(bodyJson);
      capturedJsonResponse = preview.length > 100
        ? { preview: preview.slice(0, 100) + "…" }
        : bodyJson;
    } catch {
      capturedJsonResponse = { preview: "[unserializable]" };
    }
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Set up routes and DB
(async () => {
  await connectDB();
  await registerRoutes(app);
})();

// Error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

export default app;
