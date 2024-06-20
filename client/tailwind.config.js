/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ind: "#695AE0", //indigo
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        inter: ['"Inter"', "sans-serif"],
        satoshi: ["Satoshi", "sans-serif"],
      },
    },
  },
  plugins: [],
};
