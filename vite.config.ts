import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: process.env.VITE_BASE_PATH || "/",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icons/*.svg", "favicon.svg", "knotic-logo.png", "agora-logo.png"],
      manifest: {
        name: "EchoSphere Finalist Pass",
        short_name: "EchoSphere",
        description: "Create your EchoSphere 2026 Finalist Pass",
        theme_color: "#020617",
        background_color: "#020617",
        display: "standalone",
        scope: "/",
        start_url: "/",
        icons: [
          { src: "/icons/icon-192.svg", sizes: "192x192", type: "image/svg+xml", purpose: "any" },
          { src: "/icons/icon-512.svg", sizes: "512x512", type: "image/svg+xml", purpose: "any" },
        ],
      },
      workbox: { globPatterns: ["**/*.{js,css,html,ico,svg,png}"] },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: { vendor: ["react", "react-dom", "react-router-dom"], qr: ["qrcode"] },
      },
    },
  },
});
