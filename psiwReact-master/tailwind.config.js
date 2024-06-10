/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "gray-100": "#F0F0F0",
        "gray-300": "#4D4D4D",
        "blue-500": "#7CA7FE",
        "pink-500": "#FE778D",
        "yellow-500": "#FDC641",
        "green-500": "#2CD19A"
      }
    },
  },
  plugins: [],
}