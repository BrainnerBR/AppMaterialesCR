/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        primary: '#861616',
        secondary: '#828080',
        hover: "#6b6a6a",
        active: "#5b5959",
        text: "#fff",
        border: "#7037ff"
      }
    },
  },
  plugins: [],
  variants: {
    extend: {
      display:['print'],
    },
  },
}

