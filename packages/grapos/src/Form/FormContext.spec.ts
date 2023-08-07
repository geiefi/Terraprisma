import { describe, expect, test } from '@jest/globals';

import { setByPath } from './FormContext';

describe('FormContext', () => {
  test('setByPath', () => {
    const object = {
      paymentMethod: 'cartao-de-credito',
      creditCardDetails: {
        number: '1wdoiujqwdoij',
        cvv: '1231qwd',
        displayedName: 'name',
        expiresIn: new Date(),
      }
    };

    setByPath(object, 'creditCardDetails.expiresIn', 'banana');

    expect(object.creditCardDetails.expiresIn).toEqual('banana');
  });
});