import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ldis: {
          navy: '#0B2545',
          navyLight: '#13315C',
          steel: '#3A5A80',
          mist: '#EEF2F7',
          border: '#D8E0EA',
        },
        risk: {
          low: '#1E8A4C',
          lowBg: '#E7F6EC',
          mid: '#C97A1B',
          midBg: '#FBF0DF',
          high: '#B3261E',
          highBg: '#FCE8E6',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
