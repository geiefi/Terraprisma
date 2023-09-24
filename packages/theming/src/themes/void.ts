import { Color, Theme, cbf, cbfb, cbfh } from '../Theme';

export const VoidTheme = {
  id: 'void',

  bgBackdrop: new Color('rgba(0,0,0,.4)'),
  normal: cbf('#000000', '#ffffff'),
  deeper: cbf('#151515', '#ffffff'),
  floating: cbfb('#000000', '#ffffff', '#303030'),

  accent: cbfh('#ffffff', '#000000', '#A9A9A9'),
  muted: cbf('#6B6B6B', '#898989'),
  marked: cbf('#4555A2', '#ffffff'),

  success: cbfh('#578F49', '#FFFFFF', '#427036'),
  warning: cbfh('#A97931', '#FFFFFF', '#9A7031'),
  danger: cbfh('#AB2B2B', '#FFFFFF', '#872424')
} as const satisfies Theme;
