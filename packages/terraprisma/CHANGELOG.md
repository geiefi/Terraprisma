# terraprisma

## 0.0.0-testing-20240309094333

### Patch Changes

- custom fields for createForm and allow fields to be associated with object types

## 0.0.0-testing-20240308004120

### Patch Changes

- new createDismissableListener primtiive for use with popovers and usage of it on Datepicker and Select

## 0.0.0-testing-20240305021556

### Patch Changes

- Rename the Dropdown to Popover, add position to its props and use solid-floating-ui for its positioning

## 0.0.0-testing-20240303184757

### Patch Changes

- fix misaligned icon and text in select options

## 0.0.0-testing-20240303163149

### Patch Changes

- fix inputs not appearing without a InputLikeBase

## 0.0.0-testing-20240303162056

### Patch Changes

- Input: Allow to completely modify the InputLikeBase through Solid's <Dynamic/>
  Select: Fix positioning of the checkmark on selected options

## 0.0.0-testing-20240303154453

### Patch Changes

- add sizes into the Select and propagate into used components

## 0.0.0-testing-20240228172910

### Patch Changes

- fix values being set to the same when the values store is provided with predefined content in the form

## 0.0.0-testing-20240224152148

### Patch Changes

- Fix zero values being ignored on Form Field initilization due to a `||`

## 0.0.0-testing-20240221152853

### Patch Changes

- remove default font family definition from styles

## 0.0.0-testing-20240221023548

### Patch Changes

- b963c3b: fix tailwind-colors breaking with accent colors that have numbers

## 0.0.0-testing-20240218173218

### Patch Changes

- fix non-granular updates for form fields

## 0.0.0-testing-20240213205645

### Patch Changes

- Fixed the Input's background appearing after SSR

## 0.0.0-testing-20240213200811

### Patch Changes

- name prop for most fields for use with the <form> element

## 0.0.0-testing-20240212005913

### Patch Changes

- remove dbg from useIsHydrating

## 0.0.0-testing-20240212005607

### Patch Changes

- One extra adjustment to the useIsHydrating primitive

## 0.0.0-testing-20240212005406

### Patch Changes

- fix hydartion errors on Ripple

## 0.0.0-testing-20240211224437

### Patch Changes

- fix certain fields not validating on blur

## 0.0.0-testing-20240210212559

### Patch Changes

- allow users to pass their own store of values to the createForm

## 0.0.0-testing-20240210174359

### Patch Changes

- add missing opacity variant for tailwind's colors

## 0.0.0-testing-20240210171820

### Patch Changes

- fix tailwind colors generation not using the css variables

## 0.0.0-testing-20240207210117

### Patch Changes

- changes

## 0.0.0-testing-20240207205010

### Patch Changes

- Add rail, track and thumb options to the Slider to make it more flexible

## 0.0.0-testing-20240207010617

### Patch Changes

- fix wrong export for the Input component through the Form

## 0.0.0-testing-20240206183827

### Patch Changes

- testing release

## 0.0.0-testing-20240121163753

### Patch Changes

- Fix overall SSR

## 0.0.0-testing-20231229055905

### Patch Changes

- fix (forms):errors on other deep methods

## 0.0.0-testing-20231229054352

### Patch Changes

- fix getByPath problem with single property deep accesses

## 0.0.0-testing-20231211045257

### Patch Changes

- update typescript and solid

## 0.0.0-testing-20231210212643

### Patch Changes

- add size variant treatment for the Select's dropdown

## 0.0.0-testing-20231210211026

### Patch Changes

- fix setter for manually controlled form fields

## 0.0.0-testing-20231210110630

### Patch Changes

- fix onChange of Input having wrong types

## 0.0.0-testing-20231210090733

### Patch Changes

- fix positioning of the rightmost icon for the input-like base

## 0.0.0-testing-20231210085301

### Patch Changes

- fixed error on the FormField component

## 0.0.0-testing-20231210083040

### Patch Changes

- change the name from InputContainer to InputLikeBase

## 0.0.0-testing-20231210082232

### Patch Changes

- new field definition pattern that is more extendable

## 0.0.0-testing-20231210062312

### Patch Changes

- export all form components

## 0.0.0-testing-20231210061853

### Patch Changes

- fix input container's design for all sizes

## 0.0.0-testing-20231209230450

### Patch Changes

- fix label being 5px instead of 9 when focused

## 0.0.0-testing-20231209225739

### Patch Changes

- fix not using group-data attribute for the label on the input container

## 0.0.0-testing-20231209225310

### Patch Changes

- fix label for input container getting too small

## 0.0.0-testing-20231207190800

### Patch Changes

- fix InputContainer's label being misplaced and wrong border radius for small size

## 0.0.0-testing-20231207190338

### Patch Changes

- add size variants to all fields using the InputContainer

## 0.0.0-testing-20231207185854

### Patch Changes

- add size variants to the input container

## 0.0.0-testing-20231206071717

### Patch Changes

- fix deep get type

## 0.0.0-testing-20231206062215

### Patch Changes

- add ForceManualControl component

## 0.0.0-testing-20231204035353

### Patch Changes

- do not remove fields after the component for them cleans up

## 0.0.0-testing-20231204032944

### Patch Changes

- unwrap initial value passed onto the createForm

## 0.0.0-testing-20231204024421

### Patch Changes

- make the provider value for the form inside of the createForm and return it instead of defining it in the Form component

## 0.0.0-testing-20231204022019

### Patch Changes

- add a way to get the form provider value directly by defining a function in the children of the form

## 0.0.0-testing-20231202190035

### Patch Changes

- fix input type number not parsing value into a float before updating form

## 0.0.0-testing-20231202170739

### Patch Changes

- fix problems with types on the Input and with the RadioGroup

## 0.0.0-testing-20231201035624

### Patch Changes

- fix placeholder not appearing on inputs without labels, content and with placeholder

## 0.0.0-testing-20231127064046

### Patch Changes

- fix type issues with Select.Dropdown

## 0.0.0-testing-20231127063636

### Patch Changes

- fix types for Select.Dropdown

## 0.0.0-testing-20231127063413

### Patch Changes

- improved composability for the Select component

## 0.0.0-testing-20231126010501

### Patch Changes

- remove field internal wrapper's padding

## 0.0.0-testing-20231125233950

### Patch Changes

- 450f324: fix content's opacity disappearing on the Input

## 0.0.0-testing-20231125233640

### Patch Changes

- fix problems with class merging and the input's layout

## 0.0.0-testing-20231113011417

### Patch Changes

- add missing extendPropsFrom key on dropdown

## 0.0.0-testing-20231112210109

### Patch Changes

- add align prop to the Dropdown and use align="right" on all fields that use it

## 0.0.0-testing-20231112204523

### Patch Changes

- Fixed exports from `themes`

## 0.0.0-testing-20231112142213

### Patch Changes

- make the positioning of the Dropdown automatic depending on weather it will be outside the screen or not

## 0.0.0-testing-20231112132044

### Patch Changes

- fixed most ssr problems with solid by generating code for the server and client and making them both hydrated

## 0.0.0-testing-20231111165856

### Patch Changes

- remove extra styles css addition

## 0.0.0-testing-20231111165507

### Patch Changes

- make the recursive css copying have limitless depth

## 0.0.0-testing-20231111162248

### Patch Changes

- include the css files in the source folder

## 0.0.0-testing-20231111152603

### Patch Changes

- use rollup-preset-solid to have hydratable markers

## 0.0.0-testing-20231111140606

### Patch Changes

- remove baseDir and the aliases it provided from all imports

## 0.0.0-testing-20231111131128

### Patch Changes

- remove all aliases from source code and fix all imports

## 0.0.0-testing-20231110174448

### Patch Changes

- preserve jsx for vite to compile depending on the solid app cofig

## 0.0.0-testing-20231110170127

### Patch Changes

- initial testing version
