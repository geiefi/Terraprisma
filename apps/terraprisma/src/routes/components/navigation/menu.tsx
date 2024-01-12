import { createSignal } from 'solid-js';
import { Portal } from 'solid-js/web';

import { Box, Button, Divisor, Menu, MenuItem, Icons } from 'terraprisma';

import { CodeExample } from '~/components/CodeExample';

export default function RipplePage() {
  return (
    <article>
      <h1>Menu</h1>

      <p>
        The is the classical Dropdown Menu that is on almost every website. It
        is basically a composition of a List component and a Dropdown one.
      </p>

      <p>
        Since it is based on the{' '}
        <a href="/components/general/dropdown">Dropdown</a> its positioning will
        be the same as the Dropdown would be in the situtation.
      </p>

      <h2>Usage</h2>

      <p>
        This component is not hard to use, but like most components like this
        one, it is kind of annoying with its refs. So the API for this will
        change but, for now, it looks something like this:
      </p>

      <CodeExample
        source={`const [isVisible, setVisible] = createSignal(false);

const [buttonRef, setButtonRef] = createSignal<HTMLButtonElement>();

return (
  <>
    <Button ref={setButtonRef} onClick={() => setVisible((v) => !v)}>
      Menu button <arrowDropDown />
    </Button>

    <Portal>
      {/* Always recommended to wrap it in a Portal for positioning to work well */}
      <Menu
        class="!w-[256px]"
        visible={isVisible()}
        for={buttonRef()!}
      >
        <MenuItem>new tab</MenuItem>
        <MenuItem>new window</MenuItem>
        <MenuItem>new private window</MenuItem>
        <Divisor /> {/* from components -> layout */}
        <MenuItem>Show bookmarks</MenuItem>
        <MenuItem>Show full URLs</MenuItem>
      </Menu>
    </Portal>
  </>
);`}
        preview={() => {
          const [isVisible, setVisible] = createSignal(false);

          const [buttonRef, setButtonRef] = createSignal<HTMLButtonElement>();

          return (
            <>
              <Button ref={setButtonRef} onClick={() => setVisible((v) => !v)}>
                Menu button <Icons.ArrowDropDown />
              </Button>

              <Portal>
                {/* Always recommended to wrap it in a Portal for positioning to work well */}
                <Menu
                  class="!w-[256px]"
                  visible={isVisible()}
                  for={buttonRef()!}
                >
                  <MenuItem>new tab</MenuItem>
                  <MenuItem>new window</MenuItem>
                  <MenuItem>new private window</MenuItem>
                  <Divisor /> {/* from components -> layout */}
                  <MenuItem>Show bookmarks</MenuItem>
                  <MenuItem>Show full URLs</MenuItem>
                </Menu>
              </Portal>
            </>
          );
        }}
      />

      <h2>API Reference</h2>

      <Box>
        <p>
          This compone thas no props of its own except for <code>children</code>
          .
        </p>
        <p>
          It is also good to note, all of the props attributes available for the
          component <a href="/components/general/dropdown">Dropdown</a> are also
          availalbe for this component.
        </p>
      </Box>
    </article>
  );
}
