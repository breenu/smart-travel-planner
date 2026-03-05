/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brown: {
          DEFAULT: '#271D14',
          dark: '#1a1209',
          light: '#3a2d22',
        },
        beige: {
          DEFAULT: '#FFF2DA',
          dark: '#f0e0c0',
          light: '#FFF8EC',
        },
        darkblue: {
          DEFAULT: '#0C2735',
        },
        orange: {
          DEFAULT: '#D2773F',
          light: '#e09060',
          dark: '#b56030',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
