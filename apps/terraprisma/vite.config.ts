import { searchForWorkspaceRoot } from 'vite';
import devtools from 'solid-devtools/vite';
import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
  plugins: [
    devtools({
      autoname: true
    })
  ],
  start: {
    server: {
      preset: 'vercel'
    }
  },
  server: {
    fs: {
      allow: [
        searchForWorkspaceRoot(process.cwd())
      ]
    }
  }
});
