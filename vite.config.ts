
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
<<<<<<< HEAD
  base: "/",
}));
=======
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  // Configuration pour lovable.dev et bolt.new
  server: {
    host: '0.0.0.0',
    port: 8080,
    strictPort: true,
    hmr: {
      clientPort: isLovableDev() ? 443 : 8080,
      protocol: isLovableDev() ? 'wss' : 'ws',
    },
  },
});
>>>>>>> c265cbdd9c5c3a60cd14f0e50de769dc755042a4
