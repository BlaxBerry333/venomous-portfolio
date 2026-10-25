import tsParser from "@typescript-eslint/parser";
import eslintPluginAstro from "eslint-plugin-astro";
import unusedImports from "eslint-plugin-unused-imports";

const sharedRules = {
  "no-restricted-imports": [
    "error",
    {
      patterns: [
        {
          group: ["../../"],
          message: "Please use relative imports instead",
        },
      ],
    },
  ],
  "unused-imports/no-unused-imports": "error",
  "unused-imports/no-unused-vars": [
    "warn",
    {
      vars: "all",
      varsIgnorePattern: "^_",
      args: "after-used",
      argsIgnorePattern: "^_",
    },
  ],
};

export default [
  ...eslintPluginAstro.configs.recommended,
  {
    files: ["**/*.{js,jsx,ts,tsx,mjs,cjs}"],
    plugins: {
      "unused-imports": unusedImports,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        sourceType: "module",
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
      },
    },
    rules: sharedRules,
  },
  {
    files: ["**/*.astro"],
    plugins: {
      "unused-imports": unusedImports,
      astro: eslintPluginAstro,
    },
    languageOptions: {
      parser: eslintPluginAstro.parser,
      parserOptions: {
        parser: tsParser,
        extraFileExtensions: [".astro"],
        sourceType: "module",
      },
    },
    rules: sharedRules,
  },
];
