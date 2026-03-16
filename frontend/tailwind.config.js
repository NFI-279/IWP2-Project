/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#fb5151",
        "background-light": "#f8f5f5",
        "background-dark": "#230f0f",
      },
      fontFamily: {
        display: ["Work Sans"],
      },
    },
  },
  plugins: [],
};