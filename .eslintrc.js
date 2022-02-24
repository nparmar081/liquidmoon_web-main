module.exports = {
  root: true,
  env: {
    node: true,
  },
  parserOptions: {
    parser: "babel-eslint",
  },
  extends: ["plugin:vue/vue3-recommended", "plugin:tailwindcss/recommended"],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "tailwindcss/migration-from-tailwind-2": "off",
    "vue/html-closing-bracket-newline": [
      "warn",
      {
        singleline: "never",
        multiline: "never",
      },
    ],
  },
};
