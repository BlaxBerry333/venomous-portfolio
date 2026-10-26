import { getViteConfig } from "astro/config";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";
import astro from "../astro.config.mjs";

const vitest = defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
    env: { BASE_URL: `${astro.base ?? ""}/` },
  },
});

export default getViteConfig({
  ...vitest,
  root: fileURLToPath(new URL("..", import.meta.url)),
});
