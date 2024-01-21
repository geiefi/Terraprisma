// @refresh reload
import { Suspense } from 'solid-js';
import { Router } from '@solidjs/router';
import { FileRoutes } from '@solidjs/start';

import { Box, Container } from 'terraprisma';
import { Logo } from './components/Logo';
import { Sidebar } from './components/Sidebar';
import { ThemeProvider } from './theme';

import 'terraprisma/styles.css';
import 'material-symbols';
import 'fdbg';

import './app.css';

export default function Root() {
  return (
    <Router
      root={(props) => {
        return (<ThemeProvider>
          <main>
            <Container class="h-screen min-h-fit py-5 flex flex-col gap-6">
              <Logo />

              <div class="flex justify-around items-stretch w-full h-full gap-x-10">
                <div class="w-full max-h-full max-w-[368px]">
                  <Sidebar />
                </div>

                <div class="w-full h-full min-h-fit max-w-[1024px]">
                  <Box class="h-fit">
                    <Suspense>
                      {props.children}
                    </Suspense>
                  </Box>
                </div>
              </div>
            </Container>
          </main>
        </ThemeProvider>);
      }}
    >
      <FileRoutes />
    </Router>
  );
}
