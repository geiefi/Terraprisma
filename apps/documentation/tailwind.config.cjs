/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontSize: {
        base: '14px'
      },
      fontFamily: {
        'roboto-mono': '"Roboto Mono", monospace'
      }
    }
  },
  plugins: []
};
