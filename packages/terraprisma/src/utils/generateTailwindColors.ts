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
          acc[colorName][opacity] = value;
        } else {
          acc[colorName]['DEFAULT'] = value;
        }
      }
      return acc;
    },
    {}
  );
}
