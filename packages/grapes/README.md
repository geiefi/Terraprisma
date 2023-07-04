<p align="center">
  <p align="center" style="font-size: 48px; margin: 0;">GrapeS</p>
  <p align="center" style="color: #9b66d9; font-size: 8px; font-weight: bolder">When useful meets pleasant</p>
</p>

<p align="center">
  <img 
    src="./Components showcase.png" 
    style="border: 2px solid #5B5858; border-radius: 5px;" 
    width="600px" 
    alt="components showcase"
  />
</p>

GrapeS is a opinionated, flexible and typesafe SolidJS UI library based on Material Design.

## Principles

Being opinionated means that GrapeS has very specific principles that it tries to follow
whenever possible.

| Principle | Description |
| ----------- | ----------------------- |
| Type-safety | This is translated into things like form field names and values for fields matching their type counterpart. |
| Runtime error readability | This is translated into the `identification` prop which used always when a component needs to throw an error. This helps identify much more easily what is causing an error. |
| Flexibility | This is translated into the components also receiving native props to the main internal element of theirs. Such as the Button receiving the button's native props. |
