import { setupTerraprisma, VoidTheme } from 'terraprisma';

const themes = [VoidTheme];
declare module 'terraprisma' {
  interface Register {
    themes: typeof themes;
  }
}

export const [ThemeProvider, initialStyles] = setupTerraprisma(themes);
