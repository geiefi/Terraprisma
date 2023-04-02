import { Component, createSignal } from 'solid-js';
import { createStore } from 'solid-js/store';

import { Form } from './Components/Form/Form';
import Box from './Components/General/Box/Box';
import Button from './Components/General/Button/Button';
import Stack from './Components/Layout/Stack/Stack';
import Steps, { Step } from './Components/Navigation/Steps/Steps';

import { FormStore } from './Components/Form/FormContext';

const App: Component = () => {
  const [currentStep, setCurrentStep] = createSignal<number>(1);

  const formStore = createStore<FormStore<{}>>(new FormStore({}));

  return (<>
    <Steps current={currentStep} identification='PassoAPassoDeCompra'>
      <Step description='coloque seu endereço'>endereço</Step>
      <Step description='dados de pagamento'>pagamento</Step>
      <Step description='confirme a compra'>conclusão</Step>
    </Steps>

    <Box>
      <Form formStore={formStore} indentification='InformacoesDePagamento'>
        <Stack direction='horizontal' align='space-between'>
          <Button
            size='large'
            onClick={() => setCurrentStep(currentStep() - 1)}
          >Previous</Button>
          <Button
            size='large'
            onClick={() => setCurrentStep(currentStep() + 1)}
          >Next</Button>
        </Stack>
      </Form>
    </Box>
  </>);
};

export default App;
