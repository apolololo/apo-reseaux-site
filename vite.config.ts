import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

// Fonction pour déterminer si nous sommes sur Replit
const isReplit = () => {
  return process.env.REPL_ID !== undefined;
};

// Fonction pour déterminer si nous sommes sur lovable.dev ou bolt.new
const isLovableDev = () => {
  return process.env.LOVABLE_DEV === 'true';
};

export default defineConfig({
  plugins: [
    react(),
    // Utiliser runtimeErrorOverlay uniquement sur Replit
    ...(isReplit() ? [runtimeErrorOverlay()] : []),
    themePlugin(),
    // Utiliser cartographer uniquement sur Replit en mode développement
    ...(process.env.NODE_ENV !== "production" && isReplit()
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  // Configuration spécifique pour lovable.dev et bolt.new
  server: {
    host: '0.0.0.0',
    port: 5000,
    strictPort: true,
    hmr: {
      clientPort: isLovableDev() ? 443 : 5000,
      protocol: isLovableDev() ? 'wss' : 'ws',
    },
  },
});
