/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          '1': '#929195',
          '2': '#79787c',
          '3': '#605f64',
          '4': '#49484d',
          '5': '#333238',
          '6': '#1e1d23'
        },
        inidgo: {
          '1': '#d0cded',
          '2': '#c4c0e8',
          '3': '#b9b4e3',
          '4': '#ada8df',
          '5': '#a19dda',
          '6': '#9591d5'
        },
        cobalt: {
          '1': '#F8F9FA',
          '2': '#F0E6F6',
          '3': '#C5B3D9',
          '4': '#8467D7'
        }


      }
    },
  },
  plugins: [],
}
