import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes.js";
import { setupVite, serveStatic, log } from "./vite.js";

// Global error handlers for Vercel/Production debugging
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err.message);
  console.error(err.stack);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("UNHANDLED REJECTION at:", promise, "reason:", reason);
});

export const app = express();

// ABSOLUTE TOP PRIORITY FOR DIAGNOSTICS
app.get("/api/ping", async (_req, res) => {
  const { storage } = await import("./storage.js");
  const inquiries = await storage.getAllAdmissionInquiries();
  const lastAdm = inquiries.reduce((max: number, curr: any) => {
    const num = curr.admissionNumber || 0;
    return num > max ? num : max;
  }, 26000);

  res.json({ 
    status: "alive", 
    vercel: !!process.env.VERCEL,
    storageCount: inquiries.length,
    nextAdmissionNo: lastAdm + 1,
    time: new Date().toISOString() 
  });
});

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false, limit: "50mb" }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        const bodyStr = JSON.stringify(capturedJsonResponse);
        logLine += ` :: ${bodyStr.length > 200 ? bodyStr.slice(0, 200) + "..." : bodyStr}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Initialize routes synchronously to avoid race conditions on Vercel
const server = registerRoutes(app);

const setupAsync = async () => {
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
  });

  if (process.env.NODE_ENV !== "production") {
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }
  }

  const port = Number(process.env.PORT) || 5000;
  if (process.env.NODE_ENV !== "production" || process.env.LISTEN_IN_PROD) {
    server.listen(port, "0.0.0.0", () => {
      log(`serving on port ${port}`);
    });
  }
};

setupAsync().catch(err => {
  console.error("Critical server startup error:", err);
});

export default app;
