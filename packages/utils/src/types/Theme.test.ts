import { PossibleColors } from './Theme';
import { GrapeSDarkTheme } from './GrapeSDark';

function bShouldExtendA<A, _B extends A>() {}

describe('PossibleColors type', () => {
  it('should contain "accent" in its resulting union', () => {
    bShouldExtendA<PossibleColors<typeof GrapeSDarkTheme>, 'accent'>();
    bShouldExtendA<PossibleColors, 'accent'>();
  });

  it('should generate the correct colors', () => {
    type CorrectColors =
      | 'accent'
      | 'marked'
      | 'success'
      | 'warning'
      | 'danger'
      | 'floating'
      | 'normal';
    bShouldExtendA<CorrectColors, PossibleColors<typeof GrapeSDarkTheme>>;
  });
});
