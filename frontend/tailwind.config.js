/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#3B82F6', // blue-500
          dark: '#2563EB',  // blue-600
        },
        background: {
          light: '#F3F4F6', // gray-100
          dark: '#1F2937',  // gray-800
        },
        card: {
          light: '#FFFFFF', // white
          dark: '#374151',  // gray-700
        },
      },
    },
  },
  plugins: [],
}; 