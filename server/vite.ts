
import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";

const viteLogger = createLogger();

// Fonction pour déterminer si nous sommes sur Replit
const isReplit = () => {
  return process.env.REPL_ID !== undefined;
};

// Fonction pour déterminer si nous sommes sur lovable.dev ou bolt.new
const isLovableDev = () => {
  return process.env.LOVABLE_DEV === 'true';
};

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: {
      server,
      clientPort: isLovableDev() ? 443 : 5000,
      protocol: isLovableDev() ? 'wss' : 'ws',
    },
    // Correction pour le type allowedHosts
    allowedHosts: true,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        // Ne pas quitter le processus sur lovable.dev ou bolt.new
        if (isReplit()) {
          process.exit(1);
        }
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  // Adapter le chemin pour lovable.dev et bolt.new
  const distPath = isLovableDev()
    ? path.resolve(import.meta.dirname, "..", "dist", "public")
    : path.resolve(import.meta.dirname, "public");

  if (!fs.existsSync(distPath)) {
    log(`Could not find the build directory: ${distPath}, make sure to build the client first`);
    // Créer le répertoire si nécessaire
    try {
      fs.mkdirSync(distPath, { recursive: true });
    } catch (error) {
      log(`Failed to create directory: ${error}`);
    }
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    const indexPath = path.resolve(distPath, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send("Build not found. Please run 'npm run build' first.");
    }
  });
}
