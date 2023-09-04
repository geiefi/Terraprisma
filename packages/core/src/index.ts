import GrapeS, { useGrapeS } from './GrapeS';
import { GrapeSDarkTheme, GrapeSLightTheme, Theme } from './themes';

import Ripple from './Ripple/Ripple';
import Button from './Button/Button';
import Box from './Box/Box';
import Dropdown from './Dropdown/Dropdown';
import ClickableSignalizer from './ClickableSignalizer/ClickableSignalizer';
import Modal, { createModal } from './Modal/Modal';

declare global {
  /**
   * @description This is how GrapeS maintains type-safety for theming and other things.
   */
  export interface ApplicationAssets<Themes extends Theme[]> {
    GrapeS: typeof GrapeS<Themes>;
    useGrapeS: typeof useGrapeS<Themes>;

    Ripple: typeof Ripple<Themes>;
  }

  var applicationComponents: ApplicationAssets<any>;
}

const _global = typeof window !== 'undefined' ? window : global;
_global.applicationComponents = {
  ..._global.applicationComponents,
  GrapeS,
  useGrapeS
};

export default function createApplication<
  Themes extends Theme[] = [typeof GrapeSLightTheme, typeof GrapeSDarkTheme]
>(
  themes: Themes = [GrapeSLightTheme, GrapeSDarkTheme] as Themes
): ApplicationAssets<Themes> {
  return _global.applicationComponents;
}

export * from './themes';

export {
  GrapeS,
  useGrapeS,
  Ripple,
  Button,
  Box,
  Dropdown,
  ClickableSignalizer,
  Modal,
  createModal
};
