import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "./db"; // ✅ db.ts is in same folder
import { complaints, tasks, hugs } from "../shared/schema"; // ✅ shared is one level above

export async function registerRoutes(app: Express): Promise<Server> {
  // Fetch complaints
  app.get("/api/complaints", async (_req, res) => {
    try {
      const data = await db.select().from(complaints);
      res.json(data);
    } catch (err) {
      console.error("Error fetching complaints:", err);
      res.status(500).json({ error: "Failed to fetch complaints" });
    }
  });

  // Fetch tasks
  app.get("/api/tasks", async (_req, res) => {
    try {
      const data = await db.select().from(tasks);
      res.json(data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  });

  // Fetch hugs
  app.get("/api/hugs", async (_req, res) => {
    try {
      const data = await db.select().from(hugs);
      res.json(data);
    } catch (err) {
      console.error("Error fetching hugs:", err);
      res.status(500).json({ error: "Failed to fetch hugs" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

