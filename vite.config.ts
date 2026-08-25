import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitroV2Plugin } from "@tanstack/nitro-v2-vite-plugin";

// Standard TanStack Start + Vite config (no Lovable-specific wrappers).
// A Nitro plugin is required for Vercel (and most other hosts) to
// recognize the build output — without it, Vercel serves a bare 404 for
// every route even though the build itself succeeds. We use the stable
// Nitro v2 plugin (not the newer standalone "nitro" v3 package, which as
// of mid-2026 still has open bugs with the Vercel preset — see
// https://github.com/nitrojs/nitro/issues/3905). Nitro auto-detects the
// deployment target from the hosting provider's environment variables at
// build time (e.g. Vercel sets VERCEL=1).
export default defineConfig({
  plugins: [
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    tailwindcss(),
    tanstackStart(),
    nitroV2Plugin(),
    viteReact(),
  ],
});
