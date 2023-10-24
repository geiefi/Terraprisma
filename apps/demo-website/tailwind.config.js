import config from '../../packages/general/tailwind.config';

/** @type {import('tailwindcss').Config} */
export default {
  ...config,
  content: ['./src/**/*.tsx', '../../packages/**/*.tsx']
};
