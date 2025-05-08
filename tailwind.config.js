/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        primary: '#00dde5',
        secondary: '#105b69',
        hover: "#00b0c0",
        active: "#038c9b",
        text: "#00fbff",
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

