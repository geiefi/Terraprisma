import { Color, Theme } from "./Theme";

export const GrapeSDarkTheme: Theme = {
  id: 'dark',

  grays: {
    0: new Color('#181515'),
    1: new Color('#211E1E'),
    2: new Color('#292626'),
    3: new Color('#3A3737'),
    4: new Color('#5B5858'),
    5: new Color('#7C7878'),
  },

  textColors: {
    primary: new Color("#FFFFFF"),
    secondary: new Color("#FFFFFF"),
    tertiary: new Color("#ffffff"),

    0: new Color('#ffffff'),
    1: new Color('#dcdcdc').withAlpha(0.77),
    2: new Color('#D8D5D5'),
    3: new Color('#C4C2C2'),
    4: new Color('#B2B0B0'),
    5: new Color('#A2A0A0'),
  },

  primary: new Color('#9b66d9'),
  secondary: new Color('#1cb88e'),
  tertiary: new Color('#bd462b'),

  error: new Color('#BC5C5C'),
};
