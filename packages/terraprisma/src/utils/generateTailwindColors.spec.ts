import { setupTerraprisma } from '../components';
import { VoidTheme } from '../theming';
import { generateTailwindColors } from './generateTailwindColors';

test.only('generateTailwindColors', () => {
  const [, initialStyles] = setupTerraprisma([VoidTheme]);

  const colors = generateTailwindColors(initialStyles);

  expect(colors).toEqual({
    'bg-backdrop': { DEFAULT: 'var(--bg-backdrop)' },
    'normal-bg': { DEFAULT: 'var(--normal-bg)' },
    'normal-fg': { DEFAULT: 'var(--normal-fg)' },
    'deeper-bg': { DEFAULT: 'var(--deeper-bg)' },
    'deeper-fg': { DEFAULT: 'var(--deeper-fg)' },
    'floating-bg': { DEFAULT: 'var(--floating-bg)' },
    'floating-fg': { DEFAULT: 'var(--floating-fg)' },
    'floating-border': { DEFAULT: 'var(--floating-border)' },
    'accent-bg': { DEFAULT: 'var(--accent-bg)' },
    'accent-fg': { DEFAULT: 'var(--accent-fg)' },
    'accent-hover': { DEFAULT: 'var(--accent-hover)' },
    'muted-bg': { DEFAULT: 'var(--muted-bg)' },
    'muted-fg': { DEFAULT: 'var(--muted-fg)' },
    'marked-bg': { DEFAULT: 'var(--marked-bg)' },
    'marked-fg': { DEFAULT: 'var(--marked-fg)' },
    'success-bg': { DEFAULT: 'var(--success-bg)' },
    'success-fg': { DEFAULT: 'var(--success-fg)' },
    'success-hover': { DEFAULT: 'var(--success-hover)' },
    'warning-bg': { DEFAULT: 'var(--warning-bg)' },
    'warning-fg': { DEFAULT: 'var(--warning-fg)' },
    'warning-hover': { DEFAULT: 'var(--warning-hover)' },
    'danger-bg': { DEFAULT: 'var(--danger-bg)' },
    'danger-fg': { DEFAULT: 'var(--danger-fg)' },
    'danger-hover': { DEFAULT: 'var(--danger-hover)' }
  });
});
