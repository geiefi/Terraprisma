import {
  Accessor,
  createContext,
  createEffect,
  createMemo,
  createSignal,
  ParentProps,
  Setter,
  useContext
} from 'solid-js';

import { canUseDocument } from '@grapos/utils';

import './GrapeS.scss';

import {
  Theme,
  GrapeSDarkTheme,
  GrapeSLightTheme,
  Color,
  BgFgPair
} from './themes';

export type GrapeSThemesProviderValue<Themes extends Theme[] = Theme[]> = {
  themes: Accessor<Themes>;
  currentTheme: Accessor<Themes[number]>;

  themeId: Accessor<Themes[number]['id']>;
  setThemeId: Setter<Themes[number]['id']>;
};

const GrapeSContext = createContext<GrapeSThemesProviderValue>();

declare global {
  function dbg<T = any>(el: T, context?: string): T;
}

const _global = typeof window !== 'undefined' ? window : global;
/**
 * @description `console.log`'s the `el` then returns it
 *
 * This function is inspired in Rust's `dbg!` macro.
 */
_global.dbg = function <T = any>(el: T, context?: string): T {
  if (context) {
    console.groupCollapsed(`${context}:`, el);
  } else {
    console.groupCollapsed(el);
  }
  console.trace('for this dbg() call');
  console.groupEnd();
  return el;
};

export const GrapeSGlobalDivID = 'grapes-app';

/**
 * A component that creates the `<GrapeSContext>` with the themes defined and creates
 * the signal that will hold the current theme.
 *
 * If there are no custom themes defined, GrapeS's default themes are used.
 *
 * If there is no default theme, the first custom theme is used or `GrapeSLightTheme` is used.
 */
export default function GrapeS<
  Themes extends Theme[] = [typeof GrapeSLightTheme, typeof GrapeSDarkTheme]
>(
  props: ParentProps<{
    themes?: Themes;
    defaultThemeId?: Themes[number]['id'];
  }>
) {
  const hasCustomThemes = createMemo(
    () => props.themes && props.themes.length >= 1
  );

  const [themeId, setThemeId] = createSignal<Themes[number]['id']>(
    props.defaultThemeId ||
      // eslint-disable-next-line solid/reactivity
      (hasCustomThemes()
        ? // eslint-disable-next-line solid/reactivity
          props.themes![0].id
        : GrapeSLightTheme.id)
  );

  const themes = createMemo<Themes>(() =>
    hasCustomThemes()
      ? props.themes!
      : ([GrapeSLightTheme, GrapeSDarkTheme] as Themes)
  );

  const currentTheme = createMemo(
    () => themes().find((t) => t.id === themeId())!
  );

  createEffect(() => {
    if (canUseDocument())
      document.body.style.backgroundColor = currentTheme().normal.bg.toRGBA();
  });

  const globalStyles = createMemo(() => {
    const theme = currentTheme();
    return (
      Object.keys(currentTheme()).filter((k) => !['id'].includes(k)) as (
        | Exclude<keyof Theme<{}>, 'id'>
        | 'accents'
        | 'accent'
        | 'mainAccent'
      )[]
    )
      .map((property) => {
        const value = theme[property as keyof Theme];
        const kebabCaseProperty = property
          .replace(/([a-z])([A-Z])/g, '$1-$2')
          .toLowerCase();

        const stylesForValue: Record<string, string> = {};
        if (Array.isArray(value)) {
          value
            .filter((l) => l instanceof Color)
            .forEach((v: Color, i) => {
              stylesForValue[`--${kebabCaseProperty}-${i}`] = v.toRGBA();
            });
        } else if (typeof value === 'object' && !(value instanceof Color)) {
          (Object.keys(value) as (keyof typeof value)[])
            .filter((key) => value[key] instanceof Color)
            .forEach((key) => {
              const keyKebabCase = key
                .replace(/([a-z])([A-Z])/g, '$1-$2')
                .toLowerCase();
              stylesForValue[`--${kebabCaseProperty}-${keyKebabCase}`] =
                value[key].toRGBA();
            });

          // automatically sets the --accent-bg and --accent-fg based on the accents defined
          if (property === 'accents') {
            const accents = value as unknown as Record<string, BgFgPair>;
            stylesForValue['--accent-bg'] =
              accents[(theme as any).mainAccent].bg.toRGBA();
            stylesForValue['--accent-fg'] =
              accents[(theme as any).mainAccent].fg.toRGBA();
          }
        } else if (value instanceof Color) {
          stylesForValue[`--${kebabCaseProperty}`] = value.toRGBA();
        }
        return stylesForValue;
      })
      .reduce((p, styles) => ({ ...p, ...styles }), {});
  });

  return (
    <GrapeSContext.Provider
      value={{
        themes,
        currentTheme,

        themeId,
        setThemeId
      }}
    >
      <div id={GrapeSGlobalDivID} style={globalStyles()}>
        {props.children}
      </div>
    </GrapeSContext.Provider>
  );
}

export function getGrapeSGlobalDiv(): HTMLDivElement {
  const div = document.getElementById(GrapeSGlobalDivID);

  if (!div) {
    throw new Error(
      "Could not find GrapeS's global div by id, did you perhaps modify it or forget to use the GrapeS component?"
    );
  }

  return div as HTMLDivElement;
}

/**
 * @description Gets access to the global metadata regarding the current theme
 * of the website and available themes.
 *
 * This is supposed to be used inside a `<GrapeS>` component since it is the one whom
 * initializes the global GrapeS context.
 */
export function useGrapeS(): GrapeSThemesProviderValue {
  const providerValue = useContext<GrapeSThemesProviderValue | undefined>(
    GrapeSContext
  );
  if (typeof providerValue === 'undefined') {
    throw new Error(
      'GrapeS context error: You can only have a useGrapeS inside of a GrapeS context!'
    );
  }

  return providerValue;
}
