export default {
  plugins: [
    'prettier-plugin-astro',
    'prettier-plugin-organize-imports',
  ],
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],

  printWidth: 100,
  singleQuote: false,
};
