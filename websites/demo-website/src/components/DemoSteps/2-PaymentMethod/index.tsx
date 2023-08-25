import { Component, Show, createSignal } from 'solid-js';

import { Table } from '@grapos/data-display';
import { createForm, Validators, FormProviderValue } from '@grapos/form';
import { Box } from '@grapos/core';
import { BarcodeScanner, CreditCard, QrCode } from '@grapos/icons';
import { Col, Row } from '@grapos/layout';
import { Pagination } from '@grapos/navigation';

export type PaymentFormValue = {
  paymentMethod: 'cartao-de-credito' | 'boleto' | 'pix';
  creditCardDetails: {
    number: string;
    cvv: string;
    displayedName: string;
    expiresIn: Date;
  };
};

const PaymentMethod: Component<{
  ref?: (formProviderValue: FormProviderValue<PaymentFormValue>) => void;
}> = (props) => {
  const PaymentForm = createForm<PaymentFormValue>('PaymentForm', {
    paymentMethod: 'cartao-de-credito'
  });

  const [page, setPage] = createSignal(5);

  return (
    <PaymentForm ref={props.ref}>
      <PaymentForm.ButtonChooser
        name="paymentMethod"
        label="Método de pagamento"
        validators={[Validators.required]}
      >
        {(Option) => (
          <>
            <Option value="cartao-de-credito">
              <CreditCard /> Cartão de crédito
            </Option>

            <Option value="boleto">
              <BarcodeScanner /> Boleto
            </Option>

            <Option value="pix">
              <QrCode /> Pix
            </Option>
          </>
        )}
      </PaymentForm.ButtonChooser>

      <Show
        when={PaymentForm.store[0].values.paymentMethod === 'cartao-de-credito'}
      >
        <Box>
          <h4>Dados do cartão de crédito</h4>

          <Box>
            <Table identification="TableTest" boxed>
              <Table.Row headRow>
                <Table.Column>Estado</Table.Column>
                <Table.Column>País</Table.Column>
                <Table.Column align="center">População</Table.Column>
              </Table.Row>

              <Table.Row>
                <Table.Column>Pernambuco</Table.Column>
                <Table.Column>Brasil</Table.Column>
                <Table.Column align="center">10310328019238019823</Table.Column>
              </Table.Row>
            </Table>

            <Pagination
              style={{ 'margin-left': 'auto' }}
              current={page()}
              total={10}
              onChangePage={(newPage) => setPage(newPage)}
            />
          </Box>

          <Row>
            <Col size={14}>
              <PaymentForm.Input
                name="creditCardDetails.number"
                label="número do cartão"
                placeholder="0000 0000 0000 0000"
                mask="9999 9999 9999 9999"
                validators={[Validators.required]}
              />
            </Col>

            <Col size={10}>
              <PaymentForm.Input
                name="creditCardDetails.cvv"
                label="cvv"
                placeholder="123"
                mask="999"
                validators={[Validators.required]}
              />
            </Col>

            <Col size={14}>
              <PaymentForm.Input
                name="creditCardDetails.displayedName"
                label="nome impresso"
                validators={[Validators.required]}
              />
            </Col>

            <Col size={10}>
              <PaymentForm.Datepicker
                name="creditCardDetails.expiresIn"
                label="validade"
                validators={[Validators.required]}
              />
            </Col>
          </Row>
        </Box>
      </Show>
    </PaymentForm>
  );
};

export default PaymentMethod;
