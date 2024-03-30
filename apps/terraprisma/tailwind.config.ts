import { Config } from 'tailwindcss';
import { generateTailwindColors } from 'terraprisma';

import { initialStyles } from './src/theme';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  corePlugins: {
    preflight: false
  },
  theme: {
    extend: {
      colors: generateTailwindColors(initialStyles),
      transitionDuration: {
        DEFAULT: '225ms'
      },
      fontFamily: {
        'roboto-mono': '"Roboto Mono", monospace'
      }
    }
  }
} satisfies Config;
