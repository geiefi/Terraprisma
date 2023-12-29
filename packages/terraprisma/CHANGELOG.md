# terraprisma

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
