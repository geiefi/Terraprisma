import './index.css';

import { AccentColors, BgColors, Theme } from './Theme';

export interface Register {
  // themes: typeof myThemes;
}

export type Themes = Register extends {
  themes: infer InferredThemes extends Theme[];
}
  ? InferredThemes
  : Theme[];
export type Accents<T extends Themes = Themes> = AccentColors<T[number]>;
export type Bgs<T extends Themes = Themes> = BgColors<T[number]>;

export * from './themes';

export * from './Theme';
export * from './generateStyleVariablesFrom';
