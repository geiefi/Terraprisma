# GrapeS: Opinionated SolidJS UI Library based on Material Design

<p align="center">
  <img
    src="https://raw.githubusercontent.com/gabrielmfern/GrapeS/master/grapos.png"
    alt="GrapeS Logo"
  />
</p>

<p align="center">
  <img
    src="https://raw.githubusercontent.com/gabrielmfern/GrapeS/master/Components%20showcase.png"
    alt="Components Showcase"
  />
</p>

WARNING: Anything that is currently said here may still be changed due to me not being so satified with the current APIs,
so the README may still not be updated.

---

Hey there! I'm Gabriel, the creator of GrapeS, and I'm excited to introduce you to a whole new way of building user interfaces with SolidJS. GrapeS is not just another UI library; it's my personal project that's been crafted with love and care, bringing together the power of SolidJS and the elegance of Material Design.

## What Makes GrapeS Special

GrapeS isn't your typical run-of-the-mill UI library. It's shaped by a set of guiding principles that I believe make it stand out from the crowd.

### Type-Safety, because Peace of Mind Matters

With GrapeS, type-safety isn't just a checkbox on the list – it's a core principle. I've taken the extra step to align form field names and values with their type counterparts. This not only enhances your development experience but also ensures that your code is more reliable and bug-resistant.

### Clarity in Errors, for Swift Debugging

You are not alone, I've been there when we have problems debugging some UI library thrown error that just does not point
you to the right place properly and it requires lots of annoyting debugging to find.

So my thoughts were: bebugging should be a breeze, not a headache. That's why I've introduced the `identification` prop (with some variations for form fields components), a simple yet powerful tool that accompanies every GrapeS component that can error.

When things go awry, this prop points you directly to the source of the issue, helping you get to the bottom of problems *faster*.

### Flexibility with a Familiar Touch

Flexibility is key, but I believe in providing it in a familiar way. Each GrapeS component receives native props that you'd expect for the main internal element. For example, the `Button` component integrates seamlessly with the button element-specific props, giving you the control you need without compromising simplicity.

Though the implementation of flexibility for GrapeS follows this pattern currently, there are some considerations of mine
to try improving it further without giving up simplicity, flexibility nor readability.

---

## Getting Started: A Smooth Setup Process

Setting up GrapeS is as smooth as sipping a *☕ pingado*. Just install the `grapos` npm package, where all the components, transitions, and helpers reside.

Here's a quick peek at how to incorporate GrapeS into your project:

```tsx
import { GrapeS } from 'grapos';

const App = () => {
  return (
    <GrapeS defaultThemeId='dark'>
      {/* Your components and content here */}
    </GrapeS>
  );
};
```

Yes, it's that easy! The global context within GrapeS manages your current theme, and you can easily switch between the light and dark default themes. But wait, there's more! If you want to get fancy, you can specify your own themes with the `themes` prop and use the `defaultThemeId` to make your mark.

## A Note of Caution: Almost There, but Not Quite

Before you dive headfirst into the GrapeS world, there's something I'd like to clarify. While GrapeS is hanging out on `npm`, it's not quite ready for all the prime time action. This means you might stumble upon many quirks, bugs, or missing features. But hey, that's where you come in! I'm eager to hear your thoughts, ideas, and yes, even the bugs you discover – just open an issue, and we'll tackle it together, maybe even a pretty PR.

## Unveiling the Road Ahead: Missing Pieces and Beyond

GrapeS is like a work of art that's constantly evolving. Some components are still a work in progress, and I've got a detailed to-do list to make GrapeS even better. Accessibility, flexibility, and various other aspects are on my radar, and I'm weaving in ideas from different patterns to make GrapeS a complete and delightful experience for you.

Thank you for joining me on this journey to reshape UI development with GrapeS. I can't wait to share version 0.1.0 with you by the end of the year! Stay tuned, and let's craft some amazing user interfaces together.

Cheers,
*Gabriel*
