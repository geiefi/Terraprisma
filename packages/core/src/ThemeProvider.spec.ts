import { Color, VoidTheme, generateStyleVariablesFrom } from './themes';

describe('ThemeProvider', () => {
  describe('generateStyleVariablesFrom()', () => {
    it('should generate css variables for normal colors as just "--{key}"', () => {
      const obj = {
        myColor: new Color('#000')
      };

      expect(generateStyleVariablesFrom(obj)).toEqual({
        '--my-color': 'rgba(0, 0, 0, 1)'
      });
    });

    it('should properly generate css variables for a color inside a object, inside of the object', () => {
      const obj = {
        myObj: {
          superColor: new Color('#000')
        }
      };

      expect(generateStyleVariablesFrom(obj)).toEqual({
        '--my-obj-super-color': 'rgba(0, 0, 0, 1)'
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
        '--my-second-obj-color': 'rgba(0, 0, 0, 1)'
      });
    });
  });
});
