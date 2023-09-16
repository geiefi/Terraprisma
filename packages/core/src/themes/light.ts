import { Color, Theme } from '@terraprisma/utils';

export const LightTheme = {
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

  danger: {
    bg: new Color('#AB4B4B'),
    fg: new Color('#ffffff')
  },
  success: {
    bg: new Color('#259C33'),
    fg: new Color('#ffffff')
  },
  warning: {
    bg: new Color('#DC8623'),
    fg: new Color('#ffffff')
  }
} as const satisfies Theme;
