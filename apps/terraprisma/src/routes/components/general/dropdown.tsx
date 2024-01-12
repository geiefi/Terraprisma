import { createSignal } from 'solid-js';
import { Portal } from 'solid-js/web';

import { Box, Button, Dropdown, Icons, List, ListItem } from 'terraprisma';

import { CodeExample } from '~/components/CodeExample';
import { PropsTable } from '~/components/PropsTable';

export default function DropdownPage() {
  return (
    <article>
      <h1>Dropdown</h1>

      <p>
        This is a primitve component that is used by many internal components,
        like the <a href="/components/navigation/menu">Menu</a>.
      </p>

      <p>
        This component just renders a div conditionally based on its{' '}
        <code>visible</code> property and proxies its <code>children</code>
        into it. It by default positions it bellow an anchor passed through{' '}
        <code>for</code> but will automatically position it above if it sees it
        would be outside the user's view.
      </p>

      <h2>Example</h2>

      <p>
        Bellow is an example of a dropdown that mimics the{' '}
        <a href="/components/navigation/menu">Menu</a> design that would allow
        for selecting your favorite game.
      </p>

      <CodeExample
        source={`const [isVisible, setVisible] = createSignal(false);

const [buttonRef, setButtonRef] = createSignal<HTMLButtonElement>();

return (
  <>
    <Button ref={setButtonRef} onClick={() => setVisible((v) => !v)}>
      Select which game is the best <arrowDropDown />
    </Button>

    <Portal>
      {/* Always recommended to wrap it in a Portal for positioning to work well */}
      <Dropdown visible={isVisible()} for={buttonRef()!}>
        <List>
          <ListItem
            active
            clickable
            class="relative flex items-center align-middle gap-3 cursor-pointer"
          >
            Terraria
            <span class="absolute left-full top-1/2 -translate-x-[calc(100%+0.75rem)] -translate-y-1/2">
              <Icons.Check variant="rounded" />
            </span>
          </ListItem>

          <ListItem
            clickable
            class="relative flex items-center align-middle gap-3 cursor-pointer"
          >
            Minecraft
          </ListItem>

          <ListItem
            clickable
            class="relative flex items-center align-middle gap-3 cursor-pointer"
          >
            Stardew Valley
          </ListItem>
        </List>
      </Dropdown>
    </Portal>
  </>
);`}
        preview={() => {
          const [isVisible, setVisible] = createSignal(false);

          const [buttonRef, setButtonRef] = createSignal<HTMLButtonElement>();

          return (
            <>
              <Button ref={setButtonRef} onClick={() => setVisible((v) => !v)}>
                Select which game is the best <Icons.ArrowDropDown />
              </Button>

              <Portal>
                {/* Always recommended to wrap it in a Portal for positioning to work well */}
                <Dropdown visible={isVisible()} for={buttonRef()!}>
                  <List>
                    <ListItem
                      active
                      clickable
                      class="relative flex items-center align-middle gap-3 cursor-pointer"
                    >
                      Terraria
                      <span class="absolute left-full top-1/2 -translate-x-[calc(100%+0.75rem)] -translate-y-1/2">
                        <Icons.Check variant="rounded" />
                      </span>
                    </ListItem>

                    <ListItem
                      clickable
                      class="relative flex items-center align-middle gap-3 cursor-pointer"
                    >
                      Minecraft
                    </ListItem>

                    <ListItem
                      clickable
                      class="relative flex items-center align-middle gap-3 cursor-pointer"
                    >
                      Stardew Valley
                    </ListItem>
                  </List>
                </Dropdown>
              </Portal>
            </>
          );
        }}
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
            for: {
              type: 'HTMLElement',
              description: (
                <p>
                  The element the <code>Dropdown</code> will be anchored to.
                  This element is necessary to know where the dropdown will be
                  <b>positioned and sized</b> according to.
                </p>
              )
            },
            align: {
              type: '"left" | "center" | "right"',
              default: '"center"',
              description: (
                <p>
                  The alignment of the dropdown relative to the anchor, this
                  only changes if the dropdown <b>aligns</b> with either the{' '}
                  <code>left</code>, <code>center</code> or <code>right</code>{' '}
                  of the anchor not weather it is on the top or the bottom of
                  it, this is computed automatically to position it inside the
                  user's view.
                </p>
              )
            },
            visible: {
              type: 'boolean',
              default: 'false',
              description: (
                <p>
                  The component has an internal Show that can be tweaked through
                  this <code>visible</code> prop.
                </p>
              )
            },
            offsetFromAnchor: {
              type: 'boolean',
              default: 'false',
              description:
                "Weather or not the Ripple should come from the center instead of the mouse's position"
            }
          }}
        />
      </Box>
    </article>
  );
}
