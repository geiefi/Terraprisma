// @refresh reload
import { Router } from '@solidjs/router';
import { FileRoutes } from '@solidjs/start';
import { VoidTheme, setupTerraprisma, Container, Box } from 'terraprisma';
import 'terraprisma/dist/styles.css';
import 'material-symbols';

import './app.css';
import { Sidebar } from './components/Sidebar';
import { Logo } from './components/Logo';
import { Suspense } from 'solid-js';

const themes = [VoidTheme];
declare module 'terraprisma' {
  interface Register {
    themes: typeof themes;
  }
}

const [ThemeProvider, initialStyles] = setupTerraprisma(themes);

export default function Root() {
  return (
    <Router
      root={(props) => (<>
        <Suspense>{props.children}</Suspense>
        <ThemeProvider>
          <main>
            <Container class="h-screen min-h-fit py-5 flex flex-col gap-6">
              <Logo />

              <div class="flex justify-around items-stretch w-full h-full gap-x-10">
                <div class="w-full max-h-full max-w-[368px]">
                  <Sidebar />
                </div>

                <div class="w-full h-full min-h-fit max-w-[1024px]">
                  <Box class="h-fit">
                    <Suspense>{props.children}</Suspense>
                  </Box>
                </div>
              </div>
            </Container>
          </main>
        </ThemeProvider>
      </>)}
    >
      <FileRoutes />
    </Router>
  );
}
