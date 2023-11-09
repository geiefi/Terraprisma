// @refresh reload
import { Suspense } from 'solid-js';
import {
  useLocation,
  A,
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

import { VoidTheme } from '@terraprisma/core';
import { Box, setupTerraprisma } from '@terraprisma/general';

import './root.css';
import { Container } from '@terraprisma/layout';
import { Sidebar } from './components/Sidebar';
const themes = [VoidTheme];
declare module '@terraprisma/core' {
  interface Register {
    themes: typeof themes;
  }
}

const [ThemeProvider, initialStyles] = setupTerraprisma(themes);

export default function Root() {
  return (
    <Html lang="en">
      <Head>
        <Title>SolidStart - With TailwindCSS</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Body style={initialStyles}>
        <Suspense>
          <ErrorBoundary>
            <ThemeProvider>
              <Container class="grid grid-cols-12 gap-10">
                <div class="col-span-3">
                  <Sidebar />
                </div>

                <main class="col-span-9">
                  <Box>
                    <Routes>
                      <FileRoutes />
                    </Routes>
                  </Box>
                </main>
              </Container>
            </ThemeProvider>
          </ErrorBoundary>
        </Suspense>
        <Scripts />
      </Body>
    </Html>
  );
}
