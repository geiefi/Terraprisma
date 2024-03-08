import { searchForWorkspaceRoot } from 'vite';
import devtools from 'solid-devtools/vite';
import { defineConfig } from '@solidjs/start/config';

export default defineConfig({
  devOverlay: true,
  vite: {
    server: {
      fs: {
        allow: [searchForWorkspaceRoot(process.cwd())]
      }
    }
  },
  server: {
    preset: 'vercel'
  }
});
