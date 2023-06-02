import { Component, createSignal, Show } from 'solid-js';
import { createStore } from 'solid-js/store';

import { GrapeS } from 'grapes';

import { BarcodeScanner, CreditCard, QrCode } from 'grapes/Icons';

import { Form, FormStore } from 'grapes/Form';
import Validators from 'grapes/Form/Validators';
import { Input, Select, ButtonChooser, Datepicker } from 'grapes/Form/Fields';
import { Box, Button } from 'grapes/General';
import { Stack, Container, Divisor } from 'grapes/Layout';
import { Row, Col } from 'grapes/Layout/Grid';
import { Steps, Step } from 'grapes/Navigation';

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
  const [currentStep, setCurrentStep] = createSignal<number>(2);

  const addressFormStore = createStore<FormStore<AddressFormValue>>(new FormStore({}));
  const paymentFormStore = createStore<FormStore<PaymentFormValue>>(new FormStore({
    paymentMethod: 'cartao-de-credito'
  }));
  const [paymentForm, _setPaymentForm] = paymentFormStore;

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

        <Show when={currentStep() === 0}>
          <Form formStore={addressFormStore} indentification='EnderecoDeEntrega'>
            <Row>
              <Col size={16}>
                <Input
                  name='cidade'
                  label='Cidade'
                  placeholder='São Paulo'
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
                  placeholder='513'
                  label='N°'
                  validators={[Validators.required]}
                />
              </Col>

              <Col size={16}>
                <Input
                  name='bairro'
                  label='Bairro'
                  placeholder='Butantã Morumbi'
                  validators={[Validators.required]}
                />
              </Col>
              <Col size={8}>
                <Input
                  name='cep'
                  placeholder='99999-999'
                  label='CEP'
                  validators={[Validators.required]}
                />
              </Col>
            </Row>
          </Form>
        </Show>
        <Show when={currentStep() === 1}>
          <Form formStore={paymentFormStore} indentification='DadosDePagamento'>
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
                <QrCode/> Pix
              </ButtonChooser.Option>
            </ButtonChooser>

            <Show when={paymentForm.values.paymentMethod === 'cartao-de-credito'}>
              <Box>
                <h4>Dados do cartão de crédito</h4>

                <Form.Inner
                  identification='CreditCardDetails'
                  name='creditCardDetails'
                >
                  <Row>
                    <Col size={14}>
                      <Input
                        name='number'
                        label='número do cartão'
                        placeholder='0000 0000 0000 0000'
                        type='number'
                        validators={[Validators.required]}
                      />
                    </Col>

                    <Col size={10}>
                      <Input
                        name='cvv'
                        label='cvv'
                        placeholder='123'
                        type='number'
                        validators={[Validators.required]}
                      />
                    </Col>

                    <Col size={14}>
                      <Input
                        name='displayedName'
                        label='nome impresso'
                        type='number'
                        validators={[Validators.required]}
                      />
                    </Col>

                    <Col size={10}>
                      <Datepicker
                        name='expiresIn'
                        label='validade'
                        validators={[Validators.required]}
                      />
                    </Col>
                  </Row>
                </Form.Inner>
              </Box>
            </Show>
          </Form>
        </Show>

        <Show when={currentStep() === 2}>
          <h1>conclusão</h1>
        </Show>

        <Stack style={{ 'margin-top': 'auto' }} direction='horizontal' align='space-between'>
          <Button
            size='medium'
            style={{
              "border-radius": '7px',
            }}
            onClick={() => setCurrentStep(currentStep() - 1)}
            disabled={currentStep() === 0}
          >Previous</Button>
          <Button
            size='medium'
            style={{
              "border-radius": '7px',
            }}
            onClick={() => setCurrentStep(currentStep() + 1)}
            disabled={currentStep() === 2}
          >Next</Button>
        </Stack>
      </Box>
    </Container>
  </GrapeS>);
};

export default Demo;
