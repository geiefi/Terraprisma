import { Component, createSignal } from 'solid-js';
import { createStore } from 'solid-js/store';

import { FoxPox } from 'foxpox';

import { BarcodeScanner, CreditCard } from 'foxpox/Components/Icons';

import { Form, FormStore } from 'foxpox/Components/Form';
import Validators from 'foxpox/Components/Form/Validators';
import { Input, Select, ButtonChooser } from 'foxpox/Components/Form/Fields';
import { Box, Button } from 'foxpox/Components/General';
import { Typography, Title } from 'foxpox/Components/General/Typography';
import { Stack, Container } from 'foxpox/Components/Layout';
import { Row, Col } from 'foxpox/Components/Layout/Grid';
import { Steps, Step } from 'foxpox/Components/Navigation';

export type AddressFormValue = Partial<{
  cidade: string;
  rua: string;
  uf: string;
  numero: number;
  cep: string;
  bairro: string;
}>;

export type PaymentFormValue = Partial<{
  paymentMethod: 'cartao-de-credito' | 'boleto' | 'pix';
  creditCardDetails?: {
    number: string;
    cvv: string;
    displayedName: string;
    expiresIn: Date;
  };
}>;

const Demo: Component = () => {
  const [currentStep, setCurrentStep] = createSignal<number>(1);

  const addressFormStore = createStore<FormStore<AddressFormValue>>(new FormStore({}));
  const paymentFormStore = createStore<FormStore<PaymentFormValue>>(new FormStore({}));
  const [paymentForm, _setPaymentForm] = paymentFormStore;

  return (<FoxPox>
    <Container
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
          && <Form formStore={paymentFormStore} indentification='DadosDePagamento'>
            <ButtonChooser
              name='paymentMethod'
              label='Método de pagamento'
              validators={[Validators.required]}
            >
              <ButtonChooser.Option value='cartao-de-credito'>
                <CreditCard /> Cartão de crédito
              </ButtonChooser.Option>
              <ButtonChooser.Option value='boleto'>
                <BarcodeScanner /> Boleto
              </ButtonChooser.Option>
              <ButtonChooser.Option value='pix'>
                Pix
              </ButtonChooser.Option>
            </ButtonChooser>

            {paymentForm.values.paymentMethod === 'cartao-de-credito' && <Box>
              <Typography>
                <Title type={4}>Dados do cartão de crédito</Title>
              </Typography>

              <Form.Inner
                identification='CreditCardDetails'
                name='creditCardDetails'
              >
                <Row>
                  <Col size={14}>
                    <Input
                      name='number'
                      label='número do cartão'
                      type='number'
                      validators={[Validators.required]}
                    />
                  </Col>

                  <Col size={10}>
                    <Input
                      name='cvv'
                      label='cvv'
                      type='number'
                      validators={[Validators.required]}
                    />
                  </Col>
                </Row>
              </Form.Inner>
            </Box>}
          </Form>}
        {currentStep() === 2
          && <h1>conclusão</h1>}

        <Stack direction='horizontal' align='space-around'>
          <Button
            size='large'
            onClick={() => setCurrentStep(currentStep() - 1)}
            disabled={currentStep() === 0}
          >Previous</Button>
          <Button
            size='large'
            onClick={() => setCurrentStep(currentStep() + 1)}
            disabled={currentStep() === 2}
          >Next</Button>
        </Stack>
      </Box>
    </Container>
  </FoxPox>);
};

export default Demo;
