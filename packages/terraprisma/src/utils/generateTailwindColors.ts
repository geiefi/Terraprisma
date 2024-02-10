export function generateTailwindColors(
  initialStyles: Record<`--${string}`, string>
) {
  return Object.entries(initialStyles).reduce(
    (acc: Record<string, any>, [key, value]) => {
      const match = key.match(/^--([a-z]+(?:-[a-z]+)*)-?(\d*)$/);
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
