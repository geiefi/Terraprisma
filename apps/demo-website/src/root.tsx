// @refresh reload
import { setupTerraprisma } from '@terraprisma/general';
import { VoidTheme } from '@terraprisma/core';

import { Suspense } from 'solid-js';
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

const themes = [VoidTheme];
declare module '@terraprisma/core' {
  interface Register {
    themes: typeof themes;
  }
}

const [ThemeProvider, initialStyles] = setupTerraprisma(themes);

export default function Root() {
  // onMount(() => {
  //   onCLS(console.log);
  //   onFID(console.log);
  //   onLCP(console.log);
  // });

  return (
    <Html lang="pt-br">
      <Head>
        <Title>Terraprisma - demo</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Body style={{ margin: 0, ...initialStyles }}>
        <ErrorBoundary>
          <ThemeProvider>
            <Suspense>
              <Routes>
                <FileRoutes />
              </Routes>
            </Suspense>
            <Scripts />
          </ThemeProvider>
        </ErrorBoundary>
      </Body>
    </Html>
  );
}
