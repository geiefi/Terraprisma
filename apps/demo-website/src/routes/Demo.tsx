import { Component, createSignal, Match, Switch } from 'solid-js';

import { Box, Button } from '@terraprisma/general';
import { Stack, Container, Divisor } from '@terraprisma/layout';
import { Steps, Step } from '@terraprisma/navigation';
import type { FormProviderValue } from '@terraprisma/form/FormContext';
import { FormValue } from '@terraprisma/form/types';

import Address from '../components/DemoSteps/1-Address';
import PaymentMethod from '../components/DemoSteps/2-PaymentMethod';

const Demo: Component = () => {
  const [currentStep, setCurrentStep] = createSignal<number>(0);

  const [currentForm, setCurrenForm] =
    createSignal<FormProviderValue<FormValue>>();

  return (
    <Container
      maxWidth="md"
      style={{ 'min-height': '100vh' }}
      horizontalAlign="center"
      verticalAlign="center"
    >
      <Box
        style={{
          width: '100%',
          'max-width': '768px',
          'min-height': '568px',
          height: 'fit-content',
          display: 'flex',
          'flex-direction': 'column'
        }}
      >
        <Steps current={currentStep()} identification="PassoAPassoDeCompra">
          <Step description="endereço de entrega">endereço</Step>
          <Step description="dados de pagamento">pagamento</Step>
          <Step description="confirme a compra">conclusão</Step>
        </Steps>

        <Divisor />

        <Switch>
          <Match when={currentStep() === 0}>
            <Address ref={setCurrenForm} />
          </Match>
          <Match when={currentStep() === 1}>
            <PaymentMethod ref={setCurrenForm} />
          </Match>
          <Match when={currentStep() === 2}>
            <h1>conclusão</h1>
          </Match>
        </Switch>

        <Stack
          style={{ 'margin-top': 'auto' }}
          direction="horizontal"
          align="space-between"
        >
          <Button
            style={{
              'border-radius': '7px'
            }}
            onClick={() => setCurrentStep(currentStep() - 1)}
            disabled={currentStep() === 0}
          >
            Previous
          </Button>
          <Button
            style={{
              'border-radius': '7px'
            }}
            onClick={() => {
              const isValid = currentForm()?.validateAll();
              if (isValid) {
                setCurrentStep(currentStep() + 1);
              }
            }}
            disabled={currentStep() === 2 || currentForm()?.isInvalid()}
          >
            Next
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default Demo;
