const CONFIGS = {
  SITE: {
    NAME: `${import.meta.env.ASTRO_APP_NAME} ( ${process.env.NODE_ENV} )`,
    URL: import.meta.env.ASTRO_SITE_URL,
    BASE: import.meta.env.ASTRO_SITE_BASE,
  },

  APP: {
    NAME: `${import.meta.env.ASTRO_APP_SERIES_NAME} - ${import.meta.env.ASTRO_APP_NAME}`,
    AUTHOR: import.meta.env.ASTRO_APP_AUTHOR,
  },

  PAGE_NAME: {
    WORKS: "Works Collection",
    ABOUT: "About Me",
    CONTACT: "Contact Me",
    RESUME: "Resume",
  },
} as const;

export default CONFIGS;
