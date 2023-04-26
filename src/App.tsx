import { Component, createSignal } from 'solid-js';
import { createStore } from 'solid-js/store';

import { Form } from './Components/Form/Form';
import Box from './Components/General/Box/Box';
import Button from './Components/General/Button/Button';
import Stack from './Components/Layout/Stack/Stack';
import Steps, { Step } from './Components/Navigation/Steps/Steps';

import { FormStore } from './Components/Form';
import { Input, Select } from './Components/Form/Fields';
import Validators from './Components/Form/Validators';
import Container from './Components/Layout/Container/Container';
import Row from './Components/Layout/Grid/Row';
import Col from './Components/Layout/Grid/Col';

export type AddressFormValue = Partial<{
  cidade: string;
  rua: string;
  uf: string;
  numero: number;
  cep: string;
  bairro: string;
}>;

const App: Component = () => {
  const [currentStep, setCurrentStep] = createSignal<number>(0);

  const addressFormStore = createStore<FormStore<AddressFormValue>>(new FormStore({}));
  const paymentFormStore = createStore<FormStore<{}>>(new FormStore({}));

  return (<Container
    maxWidth='md'
    style={{ height: '100vh' }}
    horizontalAlign='center'
    verticalAlign='center'
  >
    <Steps current={currentStep} identification='PassoAPassoDeCompra'>
      <Step description='endereço de entrega'>endereço</Step>
      <Step description='dados de pagamento'>pagamento</Step>
      <Step description='confirme a compra'>conclusão</Step>
    </Steps>

    <Box
      style={{
        width: '100%',
        'max-width': '398px'
      }}
    >
      {currentStep() === 0
        && <Form formStore={addressFormStore} indentification='EnderecoDeEntrega'>
          <Row>
            <Col size={16}>
              <Input
                name='cidade'
                label='Cidade'
                validators={[Validators.required]}
              />
            </Col>
            <Col size={8}>
              <Select
                name='uf'
                label='UF'
                validators={[Validators.required]}
              >
                <Select.Option value='pe'>PE</Select.Option>
                <Select.Option value='mg'>MG</Select.Option>
                <Select.Option value='pr'>PR</Select.Option>
                <Select.Option value='rj'>RJ</Select.Option>
                <Select.Option value='sp'>SP</Select.Option>
              </Select>
            </Col>
          </Row>
          <Row>
            <Col size={16}>
              <Input
                name='rua'
                label='Rua'
                validators={[Validators.required]}
              />
            </Col>
            <Col size={8}>
              <Input
                type='number'
                name='numero'
                label='N°'
                validators={[Validators.required]}
              />
            </Col>
          </Row>
          <Row>
            <Col size={16}>
              <Input
                name='bairro'
                label='Bairro'
                validators={[Validators.required]}
              />
            </Col>
            <Col size={8}>
              <Input
                name='cep'
                label='CEP'
                validators={[Validators.required]}
              />
            </Col>
          </Row>
        </Form>}
      {currentStep() === 1
        && <Form formStore={paymentFormStore} indentification='EnderecoDeEntrega'>
        </Form>}
      {currentStep() === 2
        && <h1>conclusão</h1>}

      <Stack direction='horizontal' align='space-around'>
        <Button
          size='large'
          onClick={() => setCurrentStep(currentStep() - 1)}
        >Previous</Button>
        <Button
          size='large'
          onClick={() => setCurrentStep(currentStep() + 1)}
        >Next</Button>
      </Stack>
    </Box>
  </Container>);
};

export default App;
