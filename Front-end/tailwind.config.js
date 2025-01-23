/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Προσθήκη αυτών των γραμμών για να ανιχνεύει όλα τα components
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
