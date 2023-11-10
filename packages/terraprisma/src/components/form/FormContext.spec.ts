import { deepDelete, getByPath, setByPath } from './FormContext';

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

  beforeAll(() => {
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

  describe('setByPath()', () => {
    it('should work with date fields', () => {
      setByPath(object, 'creditCardDetails.expiresIn', 'banana');

      expect(object.creditCardDetails.expiresIn).toEqual('banana');
    });
  });

  describe('getByPath()', () => {
    it('should work with date fields', () => {
      expect(getByPath(object, 'creditCardDetails.expiresIn')).toEqual(
        object.creditCardDetails.expiresIn
      );
    });
  });

  describe('delete()', () => {
    it('should work with date fields', () => {
      deepDelete(object, 'creditCardDetails.expiresIn');

      expect(object.creditCardDetails.expiresIn).toBeUndefined();
    });
  });
});
