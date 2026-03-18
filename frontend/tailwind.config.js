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

        // backgrounds
        "background-light": "#f8f5f5",
        "background-dark": "#230f0f",

        // surfaces
        surface: "#ffffff",

        // text
        "text-main": "#1f2937",     // gray-800
        muted: "#6b7280",           // gray-500

        // borders
        border: "#e5e7eb",          // gray-200
      },

      boxShadow: {
        soft: "0 4px 20px rgba(0,0,0,0.05)",
      },

      fontFamily: {
        display: ["Work Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};