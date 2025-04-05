// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { version } from './package.json';

export default defineConfig({
  site: "https://BlaxBerry333.github.io",
  base: "/venomous-portfolio",

  prefetch: {
    defaultStrategy: "hover",
    prefetchAll: true,
  },

  vite: {
    plugins: [tailwindcss()],
    define: {
      __APP_VERSION__: JSON.stringify(version),
    },
  },
});
