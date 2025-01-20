/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'soft-purple': '#A8A2D9',  // Light Purple
        'light-gray': '#D1D3D8',   // Light Gray
      },
    },
  },
  plugins: [],
}