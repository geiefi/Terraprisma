// @refresh reload
import { createEffect, ParentProps, Suspense } from 'solid-js';
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

import {
  componentBuilder,
  extendPropsFrom,
  mergeClass
} from '@terraprisma/utils';
import { ContainerProps } from '@terraprisma/layout/Container';
import { HydrationScript } from 'solid-js/web';

const themes = [VoidTheme];
declare module '@terraprisma/core' {
  interface Register {
    themes: typeof themes;
  }
}

const [ThemeProvider, initialStyles] = setupTerraprisma(themes);

const TestingComponent = componentBuilder<ContainerProps>()
  .factory(
    extendPropsFrom<ContainerProps, 'div'>([
      'horizontalAlign',
      'verticalAlign',
      'style',
      'maxWidth',
      'children'
    ])
  )
  .create((props, elProps) => {
    return (
      <div
        {...elProps}
        class={mergeClass(
          'container mx-auto',
          (props.horizontalAlign || props.verticalAlign) && 'flex flex-col',
          props.maxWidth === 'xs' && '!max-w-full',
          props.maxWidth === 'sm' && '!max-w-[640px]',
          props.maxWidth === 'md' && '!max-w-[768px]',
          props.maxWidth === 'md' && '!max-w-[1024px]',
          props.maxWidth === 'lg' && '!max-w-[1280px]',
          props.maxWidth === 'xl' && '!max-w-[1536px]',
          elProps.class
        )}
        style={{
          'justify-content': props.horizontalAlign,
          'align-items': props.verticalAlign,
          ...props.style
        }}
      >
        {props.children}
      </div>
    );
  });

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
              <TestingComponent></TestingComponent>
              <Container></Container>
              {/* <TestingComponent>Gabriel Miranda</TestingComponent> */}
              {/* <Container class="h-screen min-h-fit py-5 flex flex-col gap-6"> */}
              {/*   <Logo /> */}
              {/**/}
              {/*   <div class="flex justify-around items-stretch w-full h-full gap-x-10"> */}
              {/*     <div class="w-full max-h-full max-w-[368px]"> */}
              {/*       <Sidebar /> */}
              {/*     </div> */}
              {/**/}
              {/*     <main class="w-full h-full min-h-fit max-w-[1024px]"> */}
              {/*       <Box class="h-fit"> */}
              {/*         <Routes> */}
              {/*           <FileRoutes /> */}
              {/*         </Routes> */}
              {/*       </Box> */}
              {/*     </main> */}
              {/*   </div> */}
              {/* </Container> */}
            </ThemeProvider>
          </ErrorBoundary>
        </Suspense>
        <Scripts />
      </Body>
    </Html>
  );
}
