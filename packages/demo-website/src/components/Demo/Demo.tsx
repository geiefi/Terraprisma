import { Component, on, createEffect, createSignal, Show } from 'solid-js';
import { createStore } from 'solid-js/store';

import { GrapeS } from 'grapes';

import { BarcodeScanner, CreditCard, QrCode } from 'grapes/Icons';

import { Form, FormStore } from 'grapes/Form';
import Validators from 'grapes/Form/Validators';
import { Input, Select, ButtonChooser, Slider } from 'grapes/Form/Fields';
import { Box, Button } from 'grapes/General';
import { Table, Tooltip } from 'grapes/DataDisplay';
import { Stack, Container, Divisor } from 'grapes/Layout';
import { Row, Col } from 'grapes/Layout/Grid';
import { Steps, Step } from 'grapes/Navigation';
import { FormProviderValue } from 'grapes/Form/FormContext';
import { FormValue } from 'grapes/Form/Types/FormValue';
import { GrowFade } from 'grapes/Transitions';
import { createForm } from 'grapes/Form/Form';

export type AddressFormValue = {
  cidade: string;
  rua: string;
  uf: string;
  numero: number;
  cep: string;
  bairro: string;
};

export type PaymentFormValue = {
  paymentMethod: 'cartao-de-credito' | 'boleto' | 'pix';
  creditCardDetails?: {
    number: string;
    cvv: string;
    displayedName: string;
    expiresIn: Date;
  };
};

const Demo: Component = () => {
  const [currentStep, setCurrentStep] = createSignal<number>(1);

  const addressFormStore = createStore<FormStore<Partial<AddressFormValue>>>(new FormStore({
  }));
  const PaymentForm = createForm<PaymentFormValue>('paymenyForm', {
    paymentMethod: 'cartao-de-credito'
  });

  const [currentForm, setCurrenForm] = createSignal<FormProviderValue<FormValue>>();

  const [cepInput, setCEPInput] = createSignal<HTMLElement>();
  const [hoveringCEPInput, setHoveringCEPInput] = createSignal(false);
  const [cepInputTooltipPosition, setCepInputTooltipPosition] = createSignal('bottom');

  createEffect(on(hoveringCEPInput, () => {
    const rng = Math.random();

    if (rng < 0.25) {
      setCepInputTooltipPosition('left');
    } else if (rng < 0.5) {
      setCepInputTooltipPosition('top');
    } else if (rng < 0.75) {
      setCepInputTooltipPosition('right');
    } else if (rng < 1) {
      setCepInputTooltipPosition('bottom');
    }
  }));

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
          <Form formStore={addressFormStore} ref={setCurrenForm} identification='EnderecoDeEntrega'>
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
                <Slider
                  name='sliderValue'
                />
              </Col>
              <Col size={8}>
                <Input
                  ref={setCEPInput}
                  name='cep'
                  placeholder='99999-999'
                  mask='99999-999'
                  label='CEP'
                  onMouseEnter={() => setHoveringCEPInput(true)}
                  onMouseLeave={() => setHoveringCEPInput(false)}
                  validators={[Validators.required]}
                />

                <GrowFade growingOrigin='left'>
                  <Tooltip 
                    identification='CEP tooltip'
                    anchor={cepInput()!} 
                    position={cepInputTooltipPosition() as any}
                    visible={hoveringCEPInput()}
                  >Porfavor, use um CEP valido</Tooltip>
                </GrowFade>
              </Col>
            </Row>
          </Form>
        </Show>
        <Show when={currentStep() === 1}>
          <PaymentForm ref={setCurrenForm}>
            <PaymentForm.ButtonChooser
              name='paymentMethod'
              label='Método de pagamento'
              validators={[Validators.required]}
            >
              <PaymentForm.ButtonChooser.Option value='cartao-de-credito'>
                <CreditCard /> Cartão de crédito
              </PaymentForm.ButtonChooser.Option>
              <PaymentForm.ButtonChooser.Option value='boleto'>
                <BarcodeScanner /> Boleto
              </PaymentForm.ButtonChooser.Option>
              <PaymentForm.ButtonChooser.Option value='pix'>
                <QrCode /> Pix
              </PaymentForm.ButtonChooser.Option>
            </PaymentForm.ButtonChooser>

            <Show when={PaymentForm.store[0].values.paymentMethod === 'cartao-de-credito'}>
              <Box>
                <h4>Dados do cartão de crédito</h4>

                <Table identification='TableTest' boxed>
                  <Table.Row headRow>
                    <Table.Column>Estado</Table.Column>
                    <Table.Column>País</Table.Column>
                    <Table.Column align='center'>População</Table.Column>
                  </Table.Row>

                  <Table.Row>
                    <Table.Column>Pernambuco</Table.Column>
                    <Table.Column>Brasil</Table.Column>
                    <Table.Column align='center'>10310328019238019823</Table.Column>
                  </Table.Row>
                </Table>

                <Row>
                  <Col size={14}>
                    <PaymentForm.Input
                      name='creditCardDetails.number'
                      label='número do cartão'
                      placeholder='0000 0000 0000 0000'
                      mask='9999 9999 9999 9999'
                      validators={[Validators.required]}
                    />
                  </Col>

                  <Col size={10}>
                    <PaymentForm.Input
                      name='creditCardDetails.cvv'
                      label='cvv'
                      placeholder='123'
                      mask='999'
                      type='number'
                      validators={[Validators.required]}
                    />
                  </Col>

                  <Col size={14}>
                    <PaymentForm.Input
                      name='creditCardDetails.displayedName'
                      label='nome impresso'
                      type='number'
                      validators={[Validators.required]}
                    />
                  </Col>

                  <Col size={10}>
                    <PaymentForm.Datepicker
                      name='creditCardDetails.expiresIn'
                      label='validade'
                      validators={[Validators.required]}
                    />
                  </Col>
                </Row>
              </Box>
            </Show>
          </PaymentForm>
        </Show>

        <Show when={currentStep() === 2}>
          <h1>conclusão</h1>
        </Show>

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
