import { useTheme, setupTerraprisma } from './ThemeProvider';

import Ripple from './Ripple/Ripple';
import Button from './Button/Button';
import Box from './Box/Box';
import Dropdown from './Dropdown/Dropdown';
import Modal, { createModal } from './Modal/Modal';
import { Theme } from './themes';

export * from './themes';

declare global {
  interface Register {
    // themes: typeof myThemes;
  }
}

declare global {
  export type Themes = Register extends {
    themes: infer InferredThemes extends Theme[];
  }
    ? InferredThemes
    : Theme[];
}

export * from './themes';

export {
  useTheme,
  setupTerraprisma as makeThemeProvider,
  Ripple,
  Button,
  Box,
  Dropdown,
  Modal,
  createModal
};
