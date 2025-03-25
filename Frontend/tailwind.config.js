/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#E3F2FD', // sky blue
          DEFAULT: '#90CAF9',
          dark: '#42A5F5',
        },
        secondary: {
          light: '#F1F8E9', // light green
          DEFAULT: '#C5E1A5',
          dark: '#9CCC65',
        },
        background: {
          DEFAULT: '#FFFFFF', // white
          accent: '#F5F7FA',
        }
      },
      animation: {
        'gradient-x': 'gradient-x 15s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'glow': {
          '0%': { boxShadow: '0 0 5px rgba(144, 202, 249, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(144, 202, 249, 0.8)' },
        }
      },
    },
  },
  plugins: [],
}
