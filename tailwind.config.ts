import { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

export default {
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
  plugins: [
    plugin(function({ addBase }) {
      addBase({
        'html': { fontSize: "14px" },
      })
    }),
  ]
} satisfies Config
