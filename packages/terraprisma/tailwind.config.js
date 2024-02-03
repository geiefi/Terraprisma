/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./src/**/*.tsx'],
  corePlugins: {
    preflight: false
  },
  prefix: 'tp-',
  theme: {
    extend: {
      fontSize: {
        xs: ['5px', { lineHeight: '9px' }],
        sm: ['9px', { lineHeight: '14px' }],
        base: ['14px', { lineHeight: '21px' }],
        lg: ['21px', { lineHeight: '34px' }],
        xl: ['34px', { lineHeight: '55px' }]
      },
      transitionDuration: {
        DEFAULT: '225ms'
      }
    }
  },
  plugins: []
};

export default config;
