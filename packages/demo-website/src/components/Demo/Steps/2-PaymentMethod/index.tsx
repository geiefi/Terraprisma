import { Table } from 'grapes/DataDisplay';
import { createForm } from 'grapes/Form/Form';
import { FormProviderValue } from 'grapes/Form/FormContext';
import Validators from 'grapes/Form/Validators';
import { Box } from 'grapes/General';
import { BarcodeScanner, CreditCard, QrCode } from 'grapes/Icons';
import { Col, Row } from 'grapes/Layout/Grid';
import { Component, Show } from 'solid-js';

export type PaymentFormValue = {
  paymentMethod: 'cartao-de-credito' | 'boleto' | 'pix';
  creditCardDetails?: {
    number: string;
    cvv: string;
    displayedName: string;
    expiresIn: Date;
  };
};

const PaymentMethod: Component<{
  ref?: (formProviderValue: FormProviderValue<PaymentFormValue>) => void,
}> = (props) => {
  const PaymentForm = createForm<PaymentFormValue>(
    'PaymentForm',
    {
      paymentMethod: 'cartao-de-credito'
    }
  );

  return <PaymentForm ref={props.ref}>
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
  </PaymentForm>;
};

export default PaymentMethod;
