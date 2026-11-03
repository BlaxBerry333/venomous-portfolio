// @ts-check
import react from "@astrojs/react";
import { defineConfig } from "astro/config";
import { loadEnv } from "vite";
import { devRoutesIntegration } from "./src/dev/routes.ts";
import { DEFAULT_LOCALE, LOCALES } from "./src/i18n/config.ts";

const env = loadEnv(process.env.NODE_ENV ?? "", "envs", "");

export default defineConfig({
  site: env.VENOMOUS_PORTFOLIO__SITE_URL,
  base: env.VENOMOUS_PORTFOLIO__BASE_PATH,
  server: ({ command }) => ({
    port: Number(
      command === "dev"
        ? env.VENOMOUS_PORTFOLIO__WEB_DEV_PORT
        : env.VENOMOUS_PORTFOLIO__WEB_PREVIEW_PORT,
    ),
  }),
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
