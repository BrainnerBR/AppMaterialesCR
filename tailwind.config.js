/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        primary: '#3600a5',
        secondary: '#d8ceff',
        hover: "#bca7ff",
        active: "#bca7ff",
        text: "#31008d",
        border: "#7037ff"
      }
    },
  },
  plugins: [],
}

