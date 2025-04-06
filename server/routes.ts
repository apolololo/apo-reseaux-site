
import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(app: Express): Promise<Server> {
  // Simple health check endpoint
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok' });
  });

  const httpServer = createServer(app);

  return httpServer;
}
