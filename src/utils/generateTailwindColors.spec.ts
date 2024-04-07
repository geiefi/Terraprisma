import { setupTerraprisma } from '../components';
import { VoidTheme } from '../theming';
import { generateTailwindColors } from './generateTailwindColors';

test.only('generateTailwindColors', () => {
  const [, initialStyles] = setupTerraprisma([VoidTheme]);

  const colors = generateTailwindColors(initialStyles);

  expect(colors).toEqual({
    'bg-backdrop': {
      '10': 'var(--bg-backdrop-10)',
      '20': 'var(--bg-backdrop-20)',
      '30': 'var(--bg-backdrop-30)',
      DEFAULT: 'var(--bg-backdrop)'
    },
    'normal-bg': {
      '10': 'var(--normal-bg-10)',
      '20': 'var(--normal-bg-20)',
      '30': 'var(--normal-bg-30)',
      DEFAULT: 'var(--normal-bg)'
    },
    'normal-fg': {
      '10': 'var(--normal-fg-10)',
      '20': 'var(--normal-fg-20)',
      '30': 'var(--normal-fg-30)',
      DEFAULT: 'var(--normal-fg)'
    },
    'deeper-bg': {
      '10': 'var(--deeper-bg-10)',
      '20': 'var(--deeper-bg-20)',
      '30': 'var(--deeper-bg-30)',
      DEFAULT: 'var(--deeper-bg)'
    },
    'deeper-fg': {
      '10': 'var(--deeper-fg-10)',
      '20': 'var(--deeper-fg-20)',
      '30': 'var(--deeper-fg-30)',
      DEFAULT: 'var(--deeper-fg)'
    },
    'floating-bg': {
      '10': 'var(--floating-bg-10)',
      '20': 'var(--floating-bg-20)',
      '30': 'var(--floating-bg-30)',
      DEFAULT: 'var(--floating-bg)'
    },
    'floating-fg': {
      '10': 'var(--floating-fg-10)',
      '20': 'var(--floating-fg-20)',
      '30': 'var(--floating-fg-30)',
      DEFAULT: 'var(--floating-fg)'
    },
    'floating-border': {
      '10': 'var(--floating-border-10)',
      '20': 'var(--floating-border-20)',
      '30': 'var(--floating-border-30)',
      DEFAULT: 'var(--floating-border)'
    },
    'accent-bg': {
      '10': 'var(--accent-bg-10)',
      '20': 'var(--accent-bg-20)',
      '30': 'var(--accent-bg-30)',
      DEFAULT: 'var(--accent-bg)'
    },
    'accent-fg': {
      '10': 'var(--accent-fg-10)',
      '20': 'var(--accent-fg-20)',
      '30': 'var(--accent-fg-30)',
      DEFAULT: 'var(--accent-fg)'
    },
    'accent-hover': {
      '10': 'var(--accent-hover-10)',
      '20': 'var(--accent-hover-20)',
      '30': 'var(--accent-hover-30)',
      DEFAULT: 'var(--accent-hover)'
    },
    'muted-bg': {
      '10': 'var(--muted-bg-10)',
      '20': 'var(--muted-bg-20)',
      '30': 'var(--muted-bg-30)',
      DEFAULT: 'var(--muted-bg)'
    },
    'muted-fg': {
      '10': 'var(--muted-fg-10)',
      '20': 'var(--muted-fg-20)',
      '30': 'var(--muted-fg-30)',
      DEFAULT: 'var(--muted-fg)'
    },
    'marked-bg': {
      '10': 'var(--marked-bg-10)',
      '20': 'var(--marked-bg-20)',
      '30': 'var(--marked-bg-30)',
      DEFAULT: 'var(--marked-bg)'
    },
    'marked-fg': {
      '10': 'var(--marked-fg-10)',
      '20': 'var(--marked-fg-20)',
      '30': 'var(--marked-fg-30)',
      DEFAULT: 'var(--marked-fg)'
    },
    'success-bg': {
      '10': 'var(--success-bg-10)',
      '20': 'var(--success-bg-20)',
      '30': 'var(--success-bg-30)',
      DEFAULT: 'var(--success-bg)'
    },
    'success-fg': {
      '10': 'var(--success-fg-10)',
      '20': 'var(--success-fg-20)',
      '30': 'var(--success-fg-30)',
      DEFAULT: 'var(--success-fg)'
    },
    'success-hover': {
      '10': 'var(--success-hover-10)',
      '20': 'var(--success-hover-20)',
      '30': 'var(--success-hover-30)',
      DEFAULT: 'var(--success-hover)'
    },
    'warning-bg': {
      '10': 'var(--warning-bg-10)',
      '20': 'var(--warning-bg-20)',
      '30': 'var(--warning-bg-30)',
      DEFAULT: 'var(--warning-bg)'
    },
    'warning-fg': {
      '10': 'var(--warning-fg-10)',
      '20': 'var(--warning-fg-20)',
      '30': 'var(--warning-fg-30)',
      DEFAULT: 'var(--warning-fg)'
    },
    'warning-hover': {
      '10': 'var(--warning-hover-10)',
      '20': 'var(--warning-hover-20)',
      '30': 'var(--warning-hover-30)',
      DEFAULT: 'var(--warning-hover)'
    },
    'danger-bg': {
      '10': 'var(--danger-bg-10)',
      '20': 'var(--danger-bg-20)',
      '30': 'var(--danger-bg-30)',
      DEFAULT: 'var(--danger-bg)'
    },
    'danger-fg': {
      '10': 'var(--danger-fg-10)',
      '20': 'var(--danger-fg-20)',
      '30': 'var(--danger-fg-30)',
      DEFAULT: 'var(--danger-fg)'
    },
    'danger-hover': {
      '10': 'var(--danger-hover-10)',
      '20': 'var(--danger-hover-20)',
      '30': 'var(--danger-hover-30)',
      DEFAULT: 'var(--danger-hover)'
    }
  });
});
