// @refresh reload
import { Suspense } from "solid-js";
import {
  Body,
  ErrorBoundary,
  Head,
  Html,
  Meta,
  Scripts,
  Title,
} from "solid-start";

import Demo from "./components/Demo/Demo";
// import FieldsWithoutForms from "./components/FieldsWithoutForms/FieldsWithoutForms";

export default function Root() {
  return (
    <Html lang="pt-br">
      <Head>
        <Title>FoxPox - Demo website</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Body style={{ margin: 0 }}>
        <Suspense>
          <ErrorBoundary>
            {/*<FieldsWithoutForms/>*/}
            <Demo/>
          </ErrorBoundary>
        </Suspense>
        <Scripts />
      </Body>
    </Html>
  );
}
