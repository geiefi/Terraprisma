import { useTheme, setupTerraprisma } from './ThemeProvider';

import Ripple from './Ripple/Ripple';
import Button from './Button/Button';
import Box from './Box/Box';
import Dropdown from './Dropdown/Dropdown';
import Modal, { createModal } from './Modal/Modal';

import type { AccentColors, BgColors, Theme } from './themes';

export * from './themes';

declare global {
  export interface Register {
    // themes: typeof myThemes;
  }
}

export type Themes = Register extends {
  themes: infer InferredThemes extends Theme[];
}
  ? InferredThemes
  : Theme[];
export type Accents<T extends Themes = Themes> = AccentColors<T[number]>;
export type Bgs<T extends Themes = Themes> = BgColors<T[number]>;
export * from './themes';

export {
  useTheme,
  setupTerraprisma,
  Ripple,
  Button,
  Box,
  Dropdown,
  Modal,
  createModal
};
