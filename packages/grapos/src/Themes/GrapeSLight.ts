import { Color, Theme } from './Theme';

export const GrapeSLightTheme: Theme = {
  id: 'light',

  grays: {
    0: new Color('#ffffff'),
    1: new Color('#dcdcdc').withAlpha(0.77),
    2: new Color('#D8D5D5'),
    3: new Color('#C4C2C2'),
    4: new Color('#B2B0B0'),
    5: new Color('#A2A0A0'),
  },

  textColors: {
    primary: new Color('#FFFFFF'),
    secondary: new Color('#FFFFFF'),
    tertiary: new Color('#ffffff'),

    marked: {
      background: new Color('#4555A2'),
      textColor: new Color('#ffffff'),
    },

    0: new Color('#1E1E1E'),
    1: new Color('#535353'),
    2: new Color('#5B5B5B'),
    3: new Color('#6A6A6A'),
    4: new Color('#787878'),
    5: new Color('#848484'),
  },

  primary: new Color('#9b66d9'),
  secondary: new Color('#1cb88e'),
  tertiary: new Color('#bd462b'),

  danger: new Color('#AB4B4B'),
  success: new Color('#259C33'),
  warning: new Color('#DC8623'),
};