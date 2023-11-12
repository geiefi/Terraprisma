import { createSignal, JSX, Match, Switch } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import { Box } from 'terraprisma';

import { CodeBlock } from './CodeBlock';
import { Tab, Tabs } from './Tabs';

export function CodeExample(props: {
  source: string;
  preview: () => JSX.Element;
}) {
  const [activeTab, setActiveTab] = createSignal<'source' | 'preview'>(
    'preview'
  );

  return (
    <div class="px-2 py-3">
      <Box class="relative flex flex-col gap-2 pt-14">
        <Tabs
          class="!w-full rounded-b-none absolute left-0 top-0 !bg-[var(--floating-border)]"
          activeTab={activeTab()}
          onActivateTab={(newValue) =>
            setActiveTab(newValue as 'source' | 'preview')
          }
        >
          <Tab value="preview">Preview</Tab>
          <Tab value="source">Source</Tab>
        </Tabs>

        <div class="grid place-items-center">
          <Switch>
            <Match when={activeTab() === 'preview'}>
              <Dynamic component={props.preview} />
            </Match>

            <Match when={activeTab() === 'source'}>
              <CodeBlock code={props.source} language="tsx" />
            </Match>
          </Switch>
        </div>
      </Box>
    </div>
  );
}
