import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";

const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = dirname(currentFile);
const compat = new FlatCompat({
  baseDirectory: currentDirectory,
});

const eslintConfig = [
  {
    ignores: [".next*/**", "misc/**", "node_modules/**"],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
