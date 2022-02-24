const defaultTheme = require('tailwindcss/defaultTheme')
const forms = require("@tailwindcss/forms")
const scrollbar = require("tailwind-scrollbar")

module.exports = {
  important: true,
  content: ["./public/**/*.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Rubik", ...defaultTheme.fontFamily.sans],
        mono: ["Roboto Mono", ...defaultTheme.fontFamily.mono],
      },
      colors: {
        primary: "#14F195",
        secondary: "#232325",

        brand: {
          light: "#9945ff",
          dark: "#7D007D",
          darker: "#1C1326",
        },
        accent: {
          lightest: "#bdffe9",
          lighter: "#2af5b2",
          light: "#00d18c",
          dark: "#089158",
          darker: "#046b40",
        },
        mid: "#6377d6",

        purple: "#9945FF",
      },
    },
  },
  plugins: [forms, scrollbar],
  // safelist: [
  //   {
  //     pattern: /.*/,
  //   },
  // ],
};
