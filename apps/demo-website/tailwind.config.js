import { resolve } from 'path';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.tsx',
    '../../packages/**/*.tsx'
  ],
  corePlugins: {
    preflight: false
  },
  theme: {},
  plugins: []
};
