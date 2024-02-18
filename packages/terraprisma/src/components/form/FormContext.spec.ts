import { createStore } from 'solid-js/store';
import { createEffect, createRoot, on } from 'solid-js';

import { captureStoreUpdates } from '@solid-primitives/deep';

import {
  FormProviderValue,
  FormStore,
  deepDelete,
  getByPath,
  setByPath
} from './FormContext';

describe('FormContext', () => {
  let object = {
    paymentMethod: 'cartao-de-credito',
    creditCardDetails: {
      number: '1wdoiujqwdoij',
      cvv: '1231qwd',
      displayedName: 'name',
      expiresIn: new Date()
    }
  };

  beforeEach(() => {
    object = {
      paymentMethod: 'cartao-de-credito',
      creditCardDetails: {
        number: '1wdoiujqwdoij',
        cvv: '1231qwd',
        displayedName: 'name',
        expiresIn: new Date()
      }
    };
  });

  test('update', () => {
    const [store, setStore] = createStore(new FormStore());
    const [values, setValues] = createStore(object);

    const updates = captureStoreUpdates(values);

    let formProvider = new FormProviderValue<typeof values>(
      [store, setStore],
      [values, setValues],
      [],
      '_'
    );

    formProvider.update(
      'creditCardDetails.displayedName',
      'I am the banana man'
    );

    expect(values.creditCardDetails.displayedName).toBe('I am the banana man');

    createEffect(
      on(
        updates,
        (changes) => {
          expect(changes).toEqual([
            {
              path: ['creditCardDetails', 'displayedName'],
              value: 'I am the banana man'
            }
          ]);
        },
        { defer: true }
      )
    );
  });

  describe('setByPath()', () => {
    it('should work with single-depth fields', () => {
      setByPath(object, 'creditCardDetails', 'banana');

      expect(object.creditCardDetails).toEqual('banana');
    });

    it('should work with date fields', () => {
      setByPath(object, 'creditCardDetails.expiresIn', 'banana');

      expect(object.creditCardDetails.expiresIn).toEqual('banana');
    });
  });

  describe('getByPath()', () => {
    it('should work with single-depth fields', () => {
      expect(getByPath(object, 'creditCardDetails')).toEqual(
        object.creditCardDetails
      );
    });

    it('should work with date fields', () => {
      expect(getByPath(object, 'creditCardDetails.expiresIn')).toEqual(
        object.creditCardDetails.expiresIn
      );
    });
  });

  describe('deepDelete()', () => {
    it('should work with date fields', () => {
      deepDelete(object, 'creditCardDetails.expiresIn');

      expect(object.creditCardDetails.expiresIn).toBeUndefined();
    });
  });
});
