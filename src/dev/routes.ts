import type { AstroIntegration } from "astro";

export const DEV_ROUTES = [
  {
    pattern: "/dev/design",
    label: "DESIGN",
    entrypoint: "./src/dev/mock/design/DesignShowcasePage.astro",
  },
  { pattern: "/dev/debug", label: "DEBUG", entrypoint: "./src/dev/debug/StageDebugPage.astro" },
];

export function devRoutesIntegration(): AstroIntegration {
  return {
    name: "dev-routes",
    hooks: {
      "astro:config:setup": ({ command, injectRoute, logger }) => {
        if (command !== "dev") return;
        for (const { pattern, entrypoint } of DEV_ROUTES) injectRoute({ pattern, entrypoint });
        logger.info(`injected ${DEV_ROUTES.length} dev-only route(s)`);
      },
    },
  };
}
