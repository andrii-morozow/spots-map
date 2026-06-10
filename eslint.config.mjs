import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import tsEslint from "typescript-eslint";

export default defineConfig([
  { files: ["**/*.{js,ts,jsx,tsx}"] },
  {
    files: ["**/*.{js,ts,jsx,tsx}"],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  {
    ignores: [
      "**/.next",
      "**/build/",
      "**/node_modules/",
      "**/out/",
      "**/dist/",
      "**/static/",
    ],
  },
  ...tsEslint.configs.recommended,
  {
    files: ["**/*.{js,ts,jsx,tsx}"],
    plugins: { js },
    rules: {
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports" },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        { ignoreRestSiblings: true },
      ],
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "@typescript-eslint/no-use-before-define": "off",
      "@typescript-eslint/camelcase": "off",
      "@typescript-eslint/explicit-member-accessibility": 0,
      "@typescript-eslint/consistent-type-assertions": "warn",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "react/prop-types": "off",
      "react/display-name": "warn",
      semi: ["error"],
    },
  },
  pluginReact.configs.flat.recommended,
  {
    files: ["**/*.{js,ts,jsx,tsx}"],
    settings: { react: { version: "detect" } },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
    },
  },
]);
