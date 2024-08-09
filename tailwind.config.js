/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",

  theme: {
    extend: {},
    screens: {
      "xl": { "max": "1200px" },
      "lg": { "max": "1080px" },
      "md-lg": { "max": "991px" },
      "md": { "max": "768px" },
      "sm": { "max": "576px" },
      "xs": { "max": "480px" },
      "2xs": { "max": "340px" },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    themes: ["light", "dark"],
  },
};
  