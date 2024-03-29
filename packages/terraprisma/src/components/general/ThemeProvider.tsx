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
import { isServer } from 'solid-js/web';
import { Themes } from '../..';
import { Theme, Accent } from '../../theming/Theme';
import { generateStyleVariablesFrom } from '../../utils';

export type ThemesProviderValue = {
  themes: Themes;
  currentTheme: Accessor<Themes[number]>;

  themeId: Accessor<Themes[number]['id']>;
  setThemeId: Setter<Themes[number]['id']>;
};

const TerraprismaContext = createContext<ThemesProviderValue>();

export const GalobalWrapperID = 'terraprisma-app';

const getStylesFromTheme = (theme: Themes[number]) => {
  let obj: any;
  if ('mainAccent' in theme && 'accents' in theme) {
    const { id, mainAccent, ...objWithStyles } = {
      ...(theme as Theme<Record<string, Accent>>)
    };
    obj = {
      ...objWithStyles,
      accent: objWithStyles.accents[mainAccent]
    };
  } else {
    const { id, ...objWithStyles } = { ...theme };
    obj = objWithStyles;
  }
  return generateStyleVariablesFrom(obj);
};

/**
 * A component that creates Terraprisma's global context with the themes defined and creates
 * the signal that will hold the current theme.
 *
 * If there are no custom themes defined, Terraprisma's default themes are used.
 *
 * @param defaultThemeId The theme that is going to be used by default - defaults to the first theme in {@link themes}
 */
export function setupTerraprisma(
  themes: Themes, // should themes be reactive as well?
  defaultThemeId: Themes[number]['id'] = themes[0].id
) {
  const initialTheme = themes.find((t) => t.id === defaultThemeId)!;
  const initialStyles = getStylesFromTheme(initialTheme);

  return [
    (props: ParentProps) => {
      const [themeId, setThemeId] =
        createSignal<Themes[number]['id']>(defaultThemeId);

      const currentTheme = createMemo(
        () => themes.find((t) => t.id === themeId())!
      );

      const currentGlobalStyles = createMemo(() =>
        getStylesFromTheme(currentTheme())
      );

      createEffect(() => {
        if (!isServer) {
          const styles = currentGlobalStyles();
          Object.keys(styles).forEach((key) =>
            document.body.style.setProperty(key, styles[key])
          );
        }
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
          {props.children}
        </TerraprismaContext.Provider>
      );
    },
    initialStyles
  ] as const;
}

/**
 * @description Gets access to the global metadata regarding the current theme
 * of the website and available themes.
 *
 * This is supposed to be used inside a `<ThemeProvider>` component since it is the one whom
 * initializes the global Terraprisma context.
 */
export function useTheme(): ThemesProviderValue {
  const providerValue = useContext<ThemesProviderValue | undefined>(
    TerraprismaContext
  ) as ThemesProviderValue | undefined;
  if (typeof providerValue === 'undefined') {
    throw new Error(
      'useTheme() error: You can only have a useTheme inside of a Terraprisma context!'
    );
  }

  return providerValue;
}
