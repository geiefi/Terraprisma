import { Color, Theme } from "./Theme";

export const FoxPoxLightTheme: Theme = {
  id: 'light',

  grays: {
    0: new Color('#ffffff'),
    1: new Color('#dcdcdc').withAlpha(0.77),
    2: new Color('#D8D5D5'),
    3: new Color('#a0a0a0'),
    4: new Color('#808080'),
    5: new Color('#534848'),
  },

  primary: new Color('#9b66d9'),
  secondary: new Color('#1cb88e'),
  tertiary: new Color('#bd462b'),

  error: new Color('#AB4B4B'),
};
