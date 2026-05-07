import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

// https://vite.dev/config/
// Vite config runs as ESM (see package.json: "type": "module"), so __dirname isn't available.
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Expose both VITE_* and SUPABASE_* env vars to client code via import.meta.env.
  // (Supabase keys in this project are prefixed with SUPABASE_.)
  envPrefix: ["VITE_", "SUPABASE_"],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
})
