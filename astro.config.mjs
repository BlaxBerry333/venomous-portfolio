// @ts-check
import react from "@astrojs/react";
import { defineConfig } from "astro/config";
import { devRoutesIntegration } from "./src/dev/routes.ts";
import { DEFAULT_LOCALE, LOCALES } from "./src/i18n/config.ts";

export default defineConfig({
  site: "https://BlaxBerry333.github.io",
  base: "/venomous-portfolio",
  server: { port: 4322 },
  integrations: [react(), devRoutesIntegration()],
  prefetch: { defaultStrategy: "hover" },
  i18n: {
    locales: [...LOCALES],
    defaultLocale: DEFAULT_LOCALE,
    routing: { prefixDefaultLocale: true, redirectToDefaultLocale: false },
  },
  vite: {
    envDir: "envs",
    server: { strictPort: true },
    preview: { strictPort: true },
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@astrojs/react/client.js",
        "three",
        "@react-three/fiber",
        "@react-three/postprocessing",
        "postprocessing",
      ],
    },
  },
});
