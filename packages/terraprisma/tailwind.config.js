/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./src/**/*.tsx'],
  corePlugins: {
    preflight: false
  },
  theme: {
    extend: {
      fontSize: {
        base: ['14px', { lineHeight: '20px' }]
      },
      transitionDuration: {
        DEFAULT: '225ms'
      }
    }
  },
  plugins: []
};

export default config;
