// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import rehypeExternalLinks from 'rehype-external-links';

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

  integrations: [mdx()],

  markdown: {
    rehypePlugins: [
      [
        rehypeExternalLinks,
        {
          target: '_blank',
          rel: ['noopener', 'noreferrer'],
          content: { type: 'text', value: ' ↗' }
        },
      ],
    ],
  },
});
