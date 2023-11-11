/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
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
      },
      fontFamily: {
        'roboto-mono': '"Roboto Mono", monospace'
      }
    }
  },
  plugins: []
};
