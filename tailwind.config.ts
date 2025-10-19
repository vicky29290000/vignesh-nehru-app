import type { Config } from 'tailwindcss';
import colors from 'tailwindcss/colors';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx,js,jsx,css}',
    './components/**/*.{ts,tsx,js,jsx,css}',
    './app/**/*.{ts,tsx,js,jsx,css}',
    './src/**/*.{ts,tsx,js,jsx,css}',
  ],
  theme: {
    extend: {
      colors: {
        ...colors, // keep default Tailwind palette

        brand: {
          light: '#fff1f2',      // soft pink (like bg-pink-50)
          medium: '#fecdd3',     // rose-200
          base: '#f43f5e',       // red (rose-500)
          dark: '#be123c',       // red (rose-700)
          text: '#881337',       // deep rose (rose-900)
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
