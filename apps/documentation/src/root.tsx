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
        <Title>Terraprisma</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Body style={initialStyles}>
        <Suspense>
          <ErrorBoundary>
            <ThemeProvider>
              <Container class="h-screen min-h-fit py-5 flex flex-col gap-6">
                <Logo />

                <div class="flex justify-around items-stretch w-full h-full gap-x-10">
                  <div class="w-full max-h-full max-w-[368px]">
                    <Sidebar />
                  </div>

                  <main class="w-full h-full min-h-fit max-w-[1024px]">
                    <Box class="h-fit">
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
