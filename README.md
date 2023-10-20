# Terraprisma

<p align="center">
  <img
    src="https://github.com/gabrielmfern/Terraprisma/blob/3498e6a4054e1f345299658978b7468851717ca8/showcase.png"
    alt="components showcase"
  />
</p>

A WIP batteries-included UI library for SolidJS.

## What makes Terraprisma special?

Terraprisma is not just another UI library, it tries to improve on various key points
of discomfort that other UI libraries (of all frameworks) have and tries to take the DX to the next level.

Beyond that, I am really dedicated into improving the ecosystem for SolidJS and making it so that
people that are used to using batteries-included UI libraries still get what they want. Also, I just wanted
to use a type-safe UI library like this for once that works as expected.

Really, the thing that motivates me the most is actually making this for myself and my own use.

## The principles

What really makes the DX great, is the principles that are used to guide the development
of Terraprisma.

### Type-safety, because peace of mind matters to us

On Terraprisma, you should not have to worry about things like:
- using validators that should not be used on a certail field,
- types in the value of a Form not matching the field in the actual markup like trying to
associate a `type=number` input to a field that is supposed to be a string.
- when a component needs to have a `color` that is based on the defined theme the allowed colors
are communicated globally through special types so that you have type-safety on your theme colors as well.

### Flexbility that feels like HTML

While Terraprisma is not going to provide the same flexbility as something like `shadcn`,
(which I think we will soon also have with Solid), you can still have flexbility that can take you really far
on the spectrum of changes you can make.

Two of the ways this is currently manifested are:
- Always forwarding the main element's props to the component's props so you can set anything like the normal element
  * Keep in mind this means you won't really be able to easily change properties of elements that are still of the component but that are wrapping the element somehow
- Always trying to make components as composable as possible, with littles pieces, like lego, you can put together to make the resulting UX

### Error traceability even when you don't have source maps

We are going to always try to take the error messages so that they are as informative and as good as possible
for you to be able to debug errors even if you don't have source maps and the code running in production
is not minified and uglified.

One of the ways this is manifested is with the `identification` prop. All components that may error, will, for the most part,
require an `identification` prop that will be used in the error messages so it makes it much easier for you to narrow down
what is the problem, or where it is coming from once you have them.

## Okay, cool, when can I use it?

Currently we don't really have any npm package published, but we plan on publishing at least a `0.1.0`
by the end of **2023** so that we have a more *solid* API nailed down for everything that is already developed.

So yeah, that's basically it, thanks for reading.
