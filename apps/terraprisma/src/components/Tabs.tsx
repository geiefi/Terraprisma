import { ParentProps, createContext, useContext, Accessor } from 'solid-js';

import { TextButton, mergeClass } from 'terraprisma';

const TabsContext = createContext<{
  activateTab: (value: string) => void;
  activeTab: Accessor<string>;
}>();

export function Tab(props: ParentProps<{ value: string }>) {
  const tabProvider = useContext(TabsContext);

  return (
    <TextButton
      color="accent"
      active={tabProvider?.activeTab() === props.value}
      onClick={() => tabProvider && tabProvider.activateTab(props.value)}
    >
      {props.children}
    </TextButton>
  );
}

export function Tabs(
  props: ParentProps<{
    class?: string;
    activeTab: string;
    onActivateTab: (tabValue: string) => any;
  }>
) {
  return (
    <TabsContext.Provider
      value={{
        activeTab: () => props.activeTab,
        activateTab: (value) => props.onActivateTab(value)
      }}
    >
      <div
        class={mergeClass(
          'flex flex-row gap-2 px-1 py-1 bg-deeper-bg w-fit h-fit rounded-md',
          props.class
        )}
      >
        {props.children}
      </div>
    </TabsContext.Provider>
  );
}
