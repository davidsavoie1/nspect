/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{html,js,svelte,ts}"],

  darkMode: "class",

  theme: {
    extend: {
      colors: {
        // Green
        primary: {
          50: "#edfff7",
          100: "#d6ffee",
          200: "#afffde",
          300: "#71ffc6",
          400: "#2dfba7",
          500: "#02e58a",
          600: "#00bf6e",
          700: "#008a53",
          800: "#067549",
          900: "#085f3e",
          950: "#003621",
        },
      },
    },
  },
};
