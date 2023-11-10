import solid from 'solid-start/vite';
import vercel from 'solid-start-vercel';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    solid({
      adapter: vercel(),
      ssr: true
    })
  ],
  ssr: {
    external: [
      // '@terraprisma/core',
      // '@terraprisma/data-display',
      // '@terraprisma/form',
      // '@terraprisma/general',
      // '@terraprisma/icons',
      // '@terraprisma/layout',
      // '@terraprisma/navigation',
      // '@terraprisma/transitions',
      // '@terraprisma/utils'
    ]
  }
});
