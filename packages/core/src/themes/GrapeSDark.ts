import { Color, Theme } from './Theme';

export const GrapeSDarkTheme = {
  id: 'dark',

  bgBackdrop: new Color('rgba(0,0,0,.4)'),
  normal: {
    bg: new Color('#181515'),
    fg: new Color('#ffffff')
  },

  floating: {
    bg: new Color('#292626'),
    fg: new Color('#eeeeee'),

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

  success: {
    bg: new Color('#259C33'),
    fg: new Color('#ffffff')
  },
  warning: {
    bg: new Color('#DC8623'),
    fg: new Color('#ffffff')
  },
  danger: {
    bg: new Color('#d66565'),
    fg: new Color('#ffffff')
  }
} satisfies Theme;
