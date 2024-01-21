import { searchForWorkspaceRoot } from 'vite';
import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
  server: {
    fs: {
      allow: [
        searchForWorkspaceRoot(process.cwd())
      ]
    }
  }
});
