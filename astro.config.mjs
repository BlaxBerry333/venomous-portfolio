// @ts-check
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import { defineConfig } from "astro/config";
import { version } from "./package.json";

export default defineConfig({
  site: "https://BlaxBerry333.github.io",
  base: "/venomous-portfolio",

  integrations: [react(), mdx()],

  redirects: {
    "/": "/venomous-portfolio/ja/nebula",
    "/ja": "/venomous-portfolio/ja/nebula",
    "/zh": "/venomous-portfolio/zh/nebula",
    "/en": "/venomous-portfolio/en/nebula",
  },

  prefetch: {
    defaultStrategy: "hover",
    prefetchAll: true,
  },

  vite: {
    define: {
      __APP_VERSION__: JSON.stringify(version),
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            three: ["three"],
            r3f: ["@react-three/fiber"],
            motion: ["framer-motion"],
          },
        },
      },
    },
  },
});
