/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./src/**/*.tsx'],
  corePlugins: {
    preflight: false
  },
  theme: {
    transitionDuration: {
      DEFAULT: '225ms'
    },
    fontSize: {
      base: ['14px', '20px']
    }
  },
  plugins: []
};

export default config;
