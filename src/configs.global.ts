const CONFIGS = {
  SITE: {
    NAME: import.meta.env.ASTRO_SITE_NAME,
    URL: import.meta.env.ASTRO_SITE_URL,
    BASE: import.meta.env.ASTRO_SITE_BASE,
  },

  PAGE_NAME: {
    WORKS: "Works Collection",
    ABOUT: "About Me",
    CONTACT: "Contact Me",
  },
} as const;

export default CONFIGS;
