import { Color, Theme } from './Theme';

export const GrapeSLightTheme = {
  id: 'light',

  bgBackdrop: new Color('rgba(0,0,0,.4)'),
  normal: {
    bg: new Color('#ffffff'),
    fg: new Color('#1E1E1E')
  },

  floating: {
    bg: new Color('#dcdcdc'),
    fg: new Color('#1E1E1E'),

    border: new Color('#211E1E')
  },

  accent: {
    bg: new Color('#9b66d9'),
    fg: new Color('#ffffff')
  },

  marked: {
    bg: new Color('#4555A2'),
    fg: new Color('#ffffff')
  },

  danger: new Color('#AB4B4B'),
  success: new Color('#259C33'),
  warning: new Color('#DC8623')
} satisfies Theme;
