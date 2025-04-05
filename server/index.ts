import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

// Fonction pour déterminer si nous sommes sur lovable.dev ou bolt.new
const isLovableDev = () => {
  return process.env.LOVABLE_DEV === 'true';
};

// Fonction pour déterminer si nous sommes sur Replit
const isReplit = () => {
  return process.env.REPL_ID !== undefined;
};

// Définir la variable d'environnement pour lovable.dev si nécessaire
if (process.env.LOVABLE_DEV === undefined && process.env.BOLT_NEW === 'true') {
  process.env.LOVABLE_DEV = 'true';
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Middleware pour gérer les CORS pour lovable.dev et bolt.new
app.use((req, res, next) => {
  // Configurer les en-têtes CORS si nécessaire pour lovable.dev ou bolt.new
  if (isLovableDev()) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    // Gérer les requêtes OPTIONS préliminaires
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
  }
  next();
});

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

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });

    // Ne pas lancer d'erreur sur lovable.dev ou bolt.new
    if (!isLovableDev()) {
      throw err;
    } else {
      console.error(err);
    }
  });

  // Configurer Vite en mode développement ou servir les fichiers statiques en production
  if (app.get("env") === "development" || isLovableDev()) {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Déterminer le port à utiliser
  const port = process.env.PORT || 5000;

  // Options de serveur adaptées pour lovable.dev et bolt.new
  const serverOptions: any = {
    port,
    host: "0.0.0.0",
  };

  // Ajouter reusePort uniquement pour Replit
  if (isReplit()) {
    serverOptions.reusePort = true;
  }

  server.listen(serverOptions, () => {
    log(`Serveur démarré sur le port ${port}`);
    if (isLovableDev()) {
      log(`Application exécutée sur lovable.dev ou bolt.new`);
    } else if (isReplit()) {
      log(`Application exécutée sur Replit`);
    }
  });
})();
