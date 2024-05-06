/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/lib/esm/**/*.js",
  ],
  theme: {
    extend: {
      screens: {
        'sm': '500px',
      },
      fontFamily:{
        "cursive":["Dancing Script", "cursive"]
      }
    },
  },
  plugins: [require("flowbite/plugin")],
};
