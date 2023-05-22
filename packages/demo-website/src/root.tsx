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

// import Demo from "./components/Demo/Demo";
import DemoWithVerticalSteps from "./components/DemoWithVerticalSteps/DemoWithVerticalSteps";
// import FieldsWithoutForms from "./components/FieldsWithoutForms/FieldsWithoutForms";

export default function Root() {
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
            {/*<FieldsWithoutForms/>*/}
            {/*<Demo/>*/}
            <DemoWithVerticalSteps/>
          </ErrorBoundary>
        </Suspense>
        <Scripts />
      </Body>
    </Html>
  );
}
