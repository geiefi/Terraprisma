import { BgColors } from './Theme';
import { VoidTheme } from './void';

function bShouldExtendA<A, _B extends A>() {}

describe('PossibleColors type', () => {
  it('should contain "accent" in its resulting union', () => {
    bShouldExtendA<BgColors<typeof VoidTheme>, 'accent'>();
    bShouldExtendA<BgColors, 'accent'>();
  });

  it('should generate the correct colors', () => {
    type CorrectColors =
      | 'accent'
      | 'marked'
      | 'success'
      | 'warning'
      | 'danger'
      | 'deeper'
      | 'muted'
      | 'floating'
      | 'normal';
    bShouldExtendA<CorrectColors, BgColors<typeof VoidTheme>>;
  });
});
