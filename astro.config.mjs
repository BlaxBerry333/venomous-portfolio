// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: "https://BlaxBerry333.github.io",
  base: "/venomous-portfolio",

  prefetch: {
    defaultStrategy: "hover",
    prefetchAll: true,
  },

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [mdx()]
});
