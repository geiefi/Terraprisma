export function generateTailwindColors(
  initialStyles: Record<`--${string}`, string>
) {
  return Object.entries(initialStyles).reduce(
    (acc: Record<string, any>, [key, _value]) => {
      const match = key.match(/^--([a-z0-9]+(?:-[a-z0-9]+)*?)-?(\d*)$/);
      if (match) {
        const [, colorName, opacity] = match;
        if (!acc[colorName]) acc[colorName] = {};
        if (opacity) {
          acc[colorName][opacity] = `var(${key})`;
        } else {
          acc[colorName]['DEFAULT'] = `var(${key})`;
        }
      }
      return acc;
    },
    {}
  );
}
