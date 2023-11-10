import { Color } from '../Theme';
import { generateStyleVariablesFrom } from './generateStyleVariablesFrom';

describe('generateStyleVariablesFrom()', () => {
  it('should generate css variables for normal colors as just "--{key}"', () => {
    const obj = {
      myColor: new Color('#000')
    };

    expect(generateStyleVariablesFrom(obj)).toEqual({
      '--my-color': 'rgba(0, 0, 0, 1)',
      '--my-color-10': 'rgba(0, 0, 0, 0.1)',
      '--my-color-20': 'rgba(0, 0, 0, 0.2)',
      '--my-color-30': 'rgba(0, 0, 0, 0.3)'
    });
  });

  it('should properly generate css variables for a color inside a object, inside of the object', () => {
    const obj = {
      myObj: {
        superColor: new Color('#000')
      }
    };

    expect(generateStyleVariablesFrom(obj)).toEqual({
      '--my-obj-super-color': 'rgba(0, 0, 0, 1)',
      '--my-obj-super-color-10': 'rgba(0, 0, 0, 0.1)',
      '--my-obj-super-color-20': 'rgba(0, 0, 0, 0.2)',
      '--my-obj-super-color-30': 'rgba(0, 0, 0, 0.3)'
    });
  });

  it('should only prefix the variable to two properties above', () => {
    const obj = {
      myObj: {
        mySecondObj: {
          color: new Color('#000')
        }
      }
    };

    expect(generateStyleVariablesFrom(obj)).toEqual({
      '--my-second-obj-color': 'rgba(0, 0, 0, 1)',
      '--my-second-obj-color-10': 'rgba(0, 0, 0, 0.1)',
      '--my-second-obj-color-20': 'rgba(0, 0, 0, 0.2)',
      '--my-second-obj-color-30': 'rgba(0, 0, 0, 0.3)'
    });
  });
});
