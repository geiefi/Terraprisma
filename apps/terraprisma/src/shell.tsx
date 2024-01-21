import { ParentProps } from 'solid-js';
import { Box, Container } from 'terraprisma';
import { Logo } from './components/Logo';
import { Sidebar } from './components/Sidebar';
import { ThemeProvider } from './theme';

export function Shell(props: ParentProps) {
  return (
    <ThemeProvider>
      <main>
        <Container class="h-screen min-h-fit py-5 flex flex-col gap-6">
          <Logo />

          <div class="flex justify-around items-stretch w-full h-full gap-x-10">
            <div class="w-full max-h-full max-w-[368px]">
              <Sidebar />
            </div>

            <div class="w-full h-full min-h-fit max-w-[1024px]">
              <Box class="h-fit">{props.children}</Box>
            </div>
          </div>
        </Container>
      </main>
    </ThemeProvider>
  );
}
