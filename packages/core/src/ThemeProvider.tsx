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

import { Theme, DarkTheme, LightTheme, Color, BgFgPair } from './themes';

export type ThemesProviderValue<Themes extends Theme[] = Theme[]> = {
  themes: Themes;
  currentTheme: Accessor<Themes[number]>;

  themeId: Accessor<Themes[number]['id']>;
  setThemeId: Setter<Themes[number]['id']>;
};

const TerraprismaContext = createContext<ThemesProviderValue>();

export const GalobalWrapperID = 'terraprisma-app';

/**
 * A component that creates Terraprisma's global context with the themes defined and creates
 * the signal that will hold the current theme.
 *
 * If there are no custom themes defined, Terraprisma's default themes are used.
 *
 * @param defaultThemeId The theme that is going to be used by default - defaults to the first theme in {@link themes}
 */
export function makeThemeProvider<
  Themes extends Theme[] = [typeof DarkTheme, typeof LightTheme]
>(
  themes: Themes = [DarkTheme, LightTheme] as Themes, // should themes be reactive as well?
  defaultThemeId: Themes[number]['id'] = themes[0].id
) {
  (props: ParentProps) => {
    const [themeId, setThemeId] =
      createSignal<Themes[number]['id']>(defaultThemeId);

    const currentTheme = createMemo(
      () => themes.find((t) => t.id === themeId())!
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
      <TerraprismaContext.Provider
        value={{
          themes,
          currentTheme,

          themeId,
          setThemeId
        }}
      >
        <div id={GalobalWrapperID} style={globalStyles()}>
          {props.children}
        </div>
      </TerraprismaContext.Provider>
    );
  };
}

export function getGlobalWrapper(): HTMLDivElement {
  const div = document.getElementById(GalobalWrapperID);

  if (!div) {
    throw new Error(
      "Could not find Terraprisma's global div by id, did you perhaps modify it or forget to use the ThemeProvider component?"
    );
  }

  return div as HTMLDivElement;
}

/**
 * @description Gets access to the global metadata regarding the current theme
 * of the website and available themes.
 *
 * This is supposed to be used inside a `<ThemeProvider>` component since it is the one whom
 * initializes the global Terraprisma context.
 */
export function useTheme<
  Themes extends Theme[] = [typeof LightTheme, typeof DarkTheme]
>(): ThemesProviderValue<Themes> {
  const providerValue = useContext<ThemesProviderValue | undefined>(
    TerraprismaContext
  ) as ThemesProviderValue<Themes> | undefined;
  if (typeof providerValue === 'undefined') {
    throw new Error(
      'GrapeS context error: You can only have a useGrapeS inside of a GrapeS context!'
    );
  }

  return providerValue;
}
