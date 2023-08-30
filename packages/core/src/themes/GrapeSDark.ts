import { Color, Theme } from './Theme';

export const GrapeSDarkTheme = {
  id: 'dark',

  bgBackdrop: new Color('rgba(0,0,0,.4)'),
  normal: {
    bg: new Color('#181515'),
    fg: new Color('#ffffff')
  },

  floating: {
    bg: new Color('#181515'),
    fg: new Color('#ffffff'),

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

  success: new Color('#259C33'),
  warning: new Color('#DC8623'),
  danger: new Color('#d66565')
} satisfies Theme;
