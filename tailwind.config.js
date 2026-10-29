/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './index.php',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        obsidian: {
          950: '#090a10',
          900: '#0d0f18',
          800: '#121521',
          700: '#181c2b',
        },
      },
    },
  },
  plugins: [],
};
