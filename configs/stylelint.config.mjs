export default {
  extends: ["stylelint-config-standard-scss"],
  ignoreFiles: ["**/node_modules/**", "**/dist/**", "**/.astro/**"],
  rules: {
    "selector-class-pattern": null,
    "keyframes-name-pattern": null,
    "alpha-value-notation": null,
    "color-function-notation": null,
    "media-feature-range-notation": null,
    "comment-empty-line-before": null,
    "scss/double-slash-comment-empty-line-before": null,
    "property-no-vendor-prefix": [true, { ignoreProperties: ["user-select"] }],
  },
};
