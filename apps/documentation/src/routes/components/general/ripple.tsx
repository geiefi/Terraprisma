import { A } from 'solid-start';

import { Box, Ripple } from '@terraprisma/general';

import { CodeExample } from '~/components/CodeExample';
import { PropsTable } from '~/components/PropsTable';

export default function RipplePage() {
  return (
    <article>
      <h1>Ripple</h1>

      <p>
        This is a utility component that is useful when you want to make
        something clickable. All it does is add an additional click event
        listener on its child and then render on the <code>body</code> of the{' '}
        <b>website</b> a list of ripples that are created each time the element
        is clicked.
      </p>

      <p>
        This component also does a few other things, like adjusting the radius
        of the wrapper of a ripple, or updating its positioning that I won't go
        into detail.
      </p>

      <h2>Usage</h2>

      <p>
        This is not a hard component to use, it is one of which I am the
        proudest with on DX.
      </p>

      <p>
        All you need to do is wrap your element with the{' '}
        <code>{'<Ripple>'}</code> and it will magically work. It will not even
        mess around with the positioning of the child element, it makes no
        difference in the layout at the end.
      </p>

      <CodeExample
        source={`<Ripple>
  <a
    style={{
      width: 'fit-content',
      height: 'fit-content',
      'border-radius': '5px',
      'padding-inline': '10px',
      'padding-block': '5px'
    }}
    href="#"
  >
    This is an {'<a>'} element, but with a ripple
  </a>
</Ripple>`}
        preview={
          <Ripple>
            <a
              style={{
                width: 'fit-content',
                height: 'fit-content',
                'border-radius': '5px',
                'padding-inline': '10px',
                'padding-block': '5px'
              }}
              href="#"
            >
              This is an {'<a>'} element, but with a ripple
            </a>
          </Ripple>
        }
      />

      <h2>API Reference</h2>

      <Box>
        <p>
          It is also good to note that besides the bellow props, all of the html
          attributes available for a <code>{'<div></div>'}</code> element are
          also availalbe for this component.
        </p>

        <PropsTable
          schemaPerProperty={{
            noRipple: {
              type: 'boolean',
              description:
                'This will basically disable the ripple animation and the effect overall',
              default: 'false'
            },
            color: {
              type: 'Accents',
              default: 'accent',
              description: (
                <>
                  <p>
                    One of the available accenting colors from your themes's
                    definitions.
                  </p>
                  <p>
                    See <A href="/concepts/theming">theming</A> for more
                    information
                  </p>
                </>
              )
            },
            center: {
              type: 'boolean',
              default: 'false',
              description:
                "Weather or not the Ripple should come from the center instead of the mouse's position"
            },
            wrapperProps: {
              type: (
                <>
                  all the attributes for the <code>{'<div></div>'}</code>{' '}
                  element, but without the style or children
                </>
              ),
              description: (
                <>
                  Each Ripple that is created on click of an element has a
                  wrapper so that we can do proper positioning of the ripple,
                  this forces us to have a prop llike this to still allow for
                  flexibility where the Ripple may be used.
                </>
              )
            },
            contrastWithBg: {
              type: 'boolean',
              default: 'false',
              description: (
                <>
                  By default, the Ripple will be colored as a opaque version of
                  the <code>[color]-bg</code> variant of the choosen{' '}
                  <code>color</code>. But with this prop set to true the one
                  that will be used will be <code>[color]-fg</code> instead.
                </>
              )
            }
          }}
        />
      </Box>
    </article>
  );
}
