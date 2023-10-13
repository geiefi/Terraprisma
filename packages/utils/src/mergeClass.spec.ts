import { mergeClass } from './mergeClass';

describe('mergeClass()', () => {
  it('should work with normal classes that can be undefined, null, false and the actual class', () => {
    expect(
      mergeClass(
        false,
        null,
        undefined,
        'this should be in the result',
        'this too'
      )
    ).toEqual('this should be in the result this too');
  });

  it('should work with objects inside', () => {
    expect(
      mergeClass(
        false,
        null,
        undefined,
        [false, undefined, 'I need to be in there too', null],
        {
          square: true,
          'dumb dumb': false,
          'dumb dumb2': undefined,
          'dumb dumb3': null
        },
        'this should be in the result',
        'this too'
      )
    ).toEqual(
      'I need to be in there too square this should be in the result this too'
    );
  });

  it('should work with arrays inside', () => {
    expect(
      mergeClass(
        false,
        null,
        undefined,
        [false, undefined, 'I need to be in there too', null],
        'this should be in the result',
        'this too'
      )
    ).toEqual(
      'I need to be in there too this should be in the result this too'
    );
  });
});
