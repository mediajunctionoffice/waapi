import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import react from "@vitejs/plugin-react";

// Keep existing deployment targets; use a standalone Node server by default.
const explicitPreset = process.env.NITRO_PRESET || (process.env.VERCEL ? "vercel" : undefined);
const nodeMiddleware = process.env.DEPLOY_TARGET === "node" || explicitPreset === "node-middleware" || explicitPreset === "node";
const preset = nodeMiddleware ? "node-middleware" : process.env.NETLIFY === "true" ? "netlify" : explicitPreset || "node-server";

export default defineConfig(({ command }) => ({
  base: process.env.PUBLIC_BASE_URL || "/",
  // NODE_ENV is defined here rather than in .env (Vite only supports NODE_ENV=development in .env)
  define: { "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "production") },
  resolve: {
    tsconfigPaths: true,
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
    dedupe: ["react", "react-dom", "@tanstack/react-router", "@tanstack/react-start"],
  },
  plugins: [
    tailwindcss(),
    tanstackStart({
      importProtection: { behavior: "error", client: { files: ["**/server/**"], specifiers: ["server-only"] } },
      server: { entry: "server", ...(nodeMiddleware ? { preset: "node-middleware" as const } : {}) },
    }),
    ...(command === "build" ? [nitro({ preset, ...(preset === "netlify" ? { noExternals: ["tslib"] } : {}) })] : []),
    react(),
  ],
}));
