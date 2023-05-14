import { resolve } from "path";

import solid from "solid-start/vite";
import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  plugins: [solid({ ssr: false })],
  build: {
    target: 'esnext',
  },
  resolve: {
    alias: {
      "~": resolve(__dirname, "src"),
      "foxpox": resolve(__dirname, "../foxpox/src"),
    }
  }
});
