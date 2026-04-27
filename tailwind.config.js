/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './containers/**/*.{js,jsx,ts,tsx}',
    './pages/**/*.{js,jsx,ts,tsx}',
    './layouts/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#059669',
        'primary-dark': '#292C33',
        'driver-primary': '#29FE94',
        'text-shade': '#0C3456',
      },
      fontFamily: {
        EuclidCircularB: "'Euclid Circular B'",
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};
