// @refresh reload
import { setupTerraprisma } from '@terraprisma/core';
import { VoidTheme } from '@terraprisma/core';

import { onMount, Suspense } from 'solid-js';
import {
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Meta,
  Routes,
  Scripts,
  Title
} from 'solid-start';

import { onLCP, onFID, onCLS } from 'web-vitals';

const themes = [VoidTheme];
declare module '@terraprisma/core' {
  interface Register {
    themes: typeof themes;
  }
}

const ThemeProvider = setupTerraprisma(themes);

export default function Root() {
  onMount(() => {
    onCLS(console.log);
    onFID(console.log);
    onLCP(console.log);
  });

  return (
    <Html lang="pt-br">
      <Head>
        <Title>Terraprisma - demo</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Body style={{ margin: 0 }}>
        <Suspense>
          <ThemeProvider>
            <Routes>
              <FileRoutes />
            </Routes>
          </ThemeProvider>
        </Suspense>
        <Scripts />
      </Body>
    </Html>
  );
}
