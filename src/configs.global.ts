const CONFIGS = {
  SITE: {
    NAME: `${import.meta.env.ASTRO_APP_SERIES_NAME} ${import.meta.env.ASTRO_APP_NAME} ${process.env.NODE_ENV === "development" ? "( DEV )" : ""}`,
    URL: import.meta.env.ASTRO_SITE_URL,
    BASE: import.meta.env.ASTRO_SITE_BASE,
  },

  APP: {
    NAME: `${import.meta.env.ASTRO_APP_NAME}`,
    NAME_WITH_SERIES: `${import.meta.env.ASTRO_APP_SERIES_NAME} ${import.meta.env.ASTRO_APP_NAME}`,
    AUTHOR: import.meta.env.ASTRO_APP_AUTHOR,
  },

  PAGE_NAME: {
    WORKS: "作品集",
    RESUME: "履歷書",
  },
} as const;

export default CONFIGS;
