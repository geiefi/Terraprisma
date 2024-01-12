import {
  Box,
  Button,
  IconButton,
  OutlinedButton,
  TextButton,
  Divisor,
  Icons
} from 'terraprisma';

import { PropsTable } from '~/components/PropsTable';
import { CodeExample } from '~/components/CodeExample';

export default function Buttons() {
  return (
    <article>
      <h1>Buttons</h1>

      <p>
        Terraprisma has a few buttons, a few variants separated into differente
        components. A list of these components is:
      </p>

      <ul>
        <li>
          <a href="#default-button">Button</a>
        </li>
        <li>
          <a href="#icon-button">IconButton</a> - circular button made for icons
        </li>
        <li>
          <a href="#outlined-button">OutlinedButton</a> - a button with an
          outline that when hovering becomes the default
        </li>
        <li>
          <a href="#text-button">TextButton</a> - a button that looks like text
          normally and when hovered becomes a opaque version of its color
        </li>
      </ul>

      <h2 id="default-button">Button</h2>

      <CodeExample
        source={`<Button>Click me</Button>`}
        preview={() => <Button>Click me</Button>}
      />

      <h3>API Reference</h3>

      <Box>
        <p>
          It is also good to note that besides the bellow props, all of the html
          attributes available for a <code>{'<button></button>'}</code> element
          are also availalbe for this component.
        </p>

        <PropsTable
          schemaPerProperty={{
            size: {
              type: '"small" | "medium" | "large"',
              default: 'medium'
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
                    See <a href="/concepts/theming">theming</a> for more
                    information
                  </p>
                </>
              )
            },
            disabled: {
              type: 'boolean',
              default: 'false'
            },
            rippleProps: {
              type: 'RippleProps without the children',
              description: (
                <>
                  All the Props from{' '}
                  <a href="/components/general/ripple">Ripple</a> that are
                  passed into the Ripple inside of the Button.
                </>
              )
            }
          }}
        />
      </Box>

      <Divisor />

      <h2 id="icon-button">IconButton</h2>

      <CodeExample
        source={`<IconButton><ContentCopy/></IconButton>`}
        preview={() => (
          <IconButton>
            <Icons.ContentCopy />
          </IconButton>
        )}
      />

      <h3>API Reference</h3>

      <Box>
        <p>
          It is also good to note that besides the bellow props, all of the html
          attributes available for the <a href="#text-button">text button</a>{' '}
          component are also availalbe for this component.
        </p>

        <PropsTable
          schemaPerProperty={{
            squarish: {
              type: 'boolean',
              description:
                'Weather or not the component should be a rounded square instead of a circle',
              default: 'false'
            }
          }}
        />
      </Box>

      <Divisor />

      <h2 id="text-button">TextButton</h2>

      <CodeExample
        source={`<TextButton>I look like a text, but actually am a button!</TextButton>`}
        preview={() => (
          <TextButton>I look like a text, but actually am a button!</TextButton>
        )}
      />

      <h3>API Reference</h3>

      <Box>
        <p>
          It is also good to note that besides the bellow props, all of the html
          attributes available for the{' '}
          <a href="#default-button">default button</a> component are also
          availalbe for this component.
        </p>

        <PropsTable
          schemaPerProperty={{
            active: {
              type: 'boolean',
              description: (
                <>
                  Weather or not the button should get active, when active, it
                  will set its background to the color given through the
                  property <code>color</code> and maintain it that way
                </>
              ),
              default: 'false'
            }
          }}
        />
      </Box>

      <Divisor />

      <h2 id="text-button">OutlinedButton</h2>

      <CodeExample
        source={`<OutlinedButton>I have an outline, but when hovered I get fully accenty!</OutlinedButton>`}
        preview={() => (
          <OutlinedButton>
            I have an outline, but when hovered I get fully accenty!
          </OutlinedButton>
        )}
      />

      <h3>API Reference</h3>

      <Box>
        <p>
          It is also good to note that besides the bellow props, all of the html
          attributes available for the{' '}
          <a href="#default-button">default button</a> component are also
          availalbe for this component.
        </p>

        <PropsTable
          schemaPerProperty={{
            active: {
              type: 'boolean',
              description: (
                <>
                  Weather or not the button should get active, when active, it
                  will act like it is being hovered forever
                </>
              ),
              default: 'false'
            }
          }}
        />
      </Box>
    </article>
  );
}
