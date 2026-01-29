import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",        // Vercel default expects 'dist'
    emptyOutDir: true,     // Clean 'dist' before building
  },
  base: "./",              // Relative paths for assets
});
