/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./src/**/*.tsx'],
  corePlugins: {
    preflight: false
  },
  theme: {
    extend: {
      transitionDuration: {
        DEFAULT: '225ms'
      }
    }
  },
  plugins: []
};

export default config;
