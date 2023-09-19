import { Color, Theme, c } from './Theme';

export const VoidTheme = {
  id: 'void',

  bgBackdrop: new Color('rgba(0,0,0,.4)'),
  normal: c('#000000', '#ffffff'),
  deeper: c('#0D0D0D', '#ffffff'),
  floating: c('#000000', '#ffffff', { border: new Color('#303030') }),

  accent: c('#ffffff', '#000000', { hover: new Color('#A9A9A9') }),
  muted: c('#6B6B6B', '#898989'),
  marked: c('#4555A2', '#ffffff'),

  success: c('#578F49', '#FFFFFF', { hover: new Color('#427036') }),
  warning: c('#A97931', '#FFFFFF', { hover: new Color('#9A7031') }),
  danger: c('#AB2B2B', '#FFFFFF', { hover: new Color('#872424') })
} as const satisfies Theme;
