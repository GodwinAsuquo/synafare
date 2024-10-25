/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#202020',
      },
      keyframes: {
        slideInLeft: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        slideInLeft: 'slideInLeft 0.5s ease-in-out forwards',
        slideInRight: 'slideInRight 0.5s ease-in-out forwards',
      },
    },
  },
  plugins: [],
};
