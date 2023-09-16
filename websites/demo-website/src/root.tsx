// @refresh reload
import { DarkTheme, makeThemeProvider } from '@terraprisma/core';
import type { Theme } from '@terraprisma/utils';
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

const themes = [DarkTheme];
declare global {
  interface Register {
    themes: typeof themes;
  }
}

const ThemeProvider = makeThemeProvider([DarkTheme]);

export default function Root() {
  onMount(() => {
    onCLS(console.log);
    onFID(console.log);
    onLCP(console.log);
  });

  return (
    <Html lang="pt-br">
      <Head>
        <Title>GrapeS - Demo website</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Body style={{ margin: 0 }}>
        <Suspense>
          <ErrorBoundary>
            <ThemeProvider>
              <ErrorBoundary>
                <Routes>
                  <FileRoutes />
                </Routes>
              </ErrorBoundary>
            </ThemeProvider>
          </ErrorBoundary>
        </Suspense>
        <Scripts />
      </Body>
    </Html>
  );
}
