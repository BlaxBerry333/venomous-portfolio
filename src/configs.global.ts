const CONFIGS = {
  SITE: {
    NAME: import.meta.env.ASTRO_SITE_NAME,
  },

  PAGE_NAME: {
    WORKS: 'Works Collection',
    ABOUT: 'About Me',
    CONTACT: 'Contact Me',
  },
} as const;

export default CONFIGS;
