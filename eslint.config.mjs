import eslint from "@eslint/js";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import importPlugin from "eslint-plugin-import";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  ...tseslint.config(
    {
      ignores: ["node_modules", "dist"],
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    eslintPluginPrettierRecommended,
    {
      plugins: {
        import: importPlugin,
      },
      languageOptions: {
        globals: {
          ...globals.node,
          ...globals.jest,
        },
        sourceType: "script",
        parserOptions: {
          projectService: true,
          tsconfigRootDir: import.meta.dirname,
        },
      },
      rules: {
        "node/file-extension-in-import": "off",
        "class-methods-use-this": "off",
        "import/no-named-as-default-member": "off",
        "import/default": "off",
        "@typescript-eslint/no-floating-promises": "warn",
        "@typescript-eslint/no-unsafe-argument": "warn",

        "@typescript-eslint/naming-convention": [
          "warn",
          {
            selector: "interface",
            format: ["PascalCase"],
            prefix: [],
          },
          {
            selector: "typeAlias",
            format: ["PascalCase"],
            prefix: [],
          },
        ],

        "object-shorthand": ["warn", "properties"],
        "import/order": [
          "error",
          {
            groups: [
              "builtin",
              "external",
              "internal",
              "type",
              "parent",
              "sibling",
              "object",
              "index",
            ],
            pathGroups: [
              {
                pattern: "@nestjs/**",
                group: "builtin",
                position: "before",
              },
              {
                pattern: "**/interfaces/**",
                group: "type",
                position: "before",
              },
              {
                pattern: "src/**",
                group: "parent",
                position: "before",
              },
              {
                pattern: "./*",
                group: "sibling",
                position: "before",
              },
            ],
            distinctGroup: true,
            warnOnUnassignedImports: true,
            pathGroupsExcludedImportTypes: ["@nestjs/**"],
          },
        ],
      },
    },
  ),
  {
    files: ["**/*.spec.ts", "**/test/integration/**", "**/test/utils/**"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/require-await": "off",
    },
  },
];
