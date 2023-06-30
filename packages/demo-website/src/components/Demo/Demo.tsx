import { Component, on, createEffect, createSignal, Show, Match, Switch } from 'solid-js';
import { createStore } from 'solid-js/store';

import { GrapeS } from 'grapes';

import { Form, FormStore } from 'grapes/Form';
import Validators from 'grapes/Form/Validators';
import { Input, Select, Slider } from 'grapes/Form/Fields';
import { Box, Button } from 'grapes/General';
import { Tooltip } from 'grapes/DataDisplay';
import { Stack, Container, Divisor } from 'grapes/Layout';
import { Row, Col } from 'grapes/Layout/Grid';
import { Steps, Step } from 'grapes/Navigation';
import { FormProviderValue } from 'grapes/Form/FormContext';
import { FormValue } from 'grapes/Form/Types/FormValue';
import { GrowFade } from 'grapes/Transitions';
import { createForm } from 'grapes/Form/Form';
import PaymentMethod from './Steps/2-PaymentMethod';
import Address from './Steps/1-Address';

const Demo: Component = () => {
  const [currentStep, setCurrentStep] = createSignal<number>(1);

  const [currentForm, setCurrenForm] = createSignal<FormProviderValue<FormValue>>();

  return (<GrapeS defaultThemeId='dark'>
    <Container
      maxWidth='md'
      style={{ height: '100vh' }}
      horizontalAlign='center'
      verticalAlign='center'
    >
      <Box
        style={{
          width: '100%',
          'max-width': '768px',
          'min-height': '568px',
          'height': 'fit-content',
          'display': 'flex',
          'flex-direction': 'column',
        }}
      >
        <Steps
          current={currentStep()}
          identification='PassoAPassoDeCompra'
        >
          <Step description='endereço de entrega'>endereço</Step>
          <Step description='dados de pagamento'>pagamento</Step>
          <Step description='confirme a compra'>conclusão</Step>
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

        <Stack style={{ 'margin-top': 'auto' }} direction='horizontal' align='space-between'>
          <Button
            style={{
              "border-radius": '7px',
            }}
            onClick={() => setCurrentStep(currentStep() - 1)}
            disabled={currentStep() === 0}
          >Previous</Button>
          <Button
            style={{
              "border-radius": '7px',
            }}
            onClick={() => {
              const isValid = currentForm()?.validateAll();
              if (isValid) {
                setCurrentStep(currentStep() + 1)
              }
            }}
            disabled={currentStep() === 2 || currentForm()?.isInvalid()}
          >Next</Button>
        </Stack>
      </Box>
    </Container>
  </GrapeS>);
};

export default Demo;
