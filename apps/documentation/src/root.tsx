// @refresh reload
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

import { VoidTheme } from '@terraprisma/core';
import { Box, setupTerraprisma } from '@terraprisma/general';

import './root.css';
import { Container } from '@terraprisma/layout';
import { Sidebar } from './components/Sidebar';
import { Logo } from './components/Logo';
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
              <Container class="min-h-screen h-fit py-5 flex flex-col gap-6">
                <Logo />

                <div class="flex justify-around w-full h-full gap-x-10">
                  <div class="w-full max-w-[368px]">
                    <Sidebar />
                  </div>

                  <main class="max-w-[1024px]">
                    <Box>
                      <Routes>
                        <FileRoutes />
                      </Routes>
                    </Box>
                  </main>
                </div>
              </Container>
            </ThemeProvider>
          </ErrorBoundary>
        </Suspense>
        <Scripts />
      </Body>
    </Html>
  );
}
