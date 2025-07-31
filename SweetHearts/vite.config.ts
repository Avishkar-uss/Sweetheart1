// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { viteStaticCopy } from "vite-plugin-static-copy"; // 🆕 for copying icon files

export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    viteStaticCopy({
      targets: [
        { src: path.resolve(__dirname, "client", "icon-192.png"), dest: "" },
        { src: path.resolve(__dirname, "client", "icon-512.png"), dest: "" },
        { src: path.resolve(__dirname, "client", "apple-touch-icon.png"), dest: "" },
        { src: path.resolve(__dirname, "client", "favicon.ico"), dest: "" }
      ]
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets")
    }
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
    target: "esnext",
    manifest: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

