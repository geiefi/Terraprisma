import { createEffect, createMemo, createSignal, onCleanup, Show, Suspense } from 'solid-js';
import { Portal } from 'solid-js/web';

import { IconButton, Tooltip, GrowFade, Icons } from 'terraprisma';

import './CodeBlock.theme.css';

import Prismjs from 'prismjs';

import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx'; // import here the langauges needed

export function CodeBlock(props: {
  code: string;
  language: 'tsx' | 'typescript';
}) {
  const prismGeneratedHTML = createMemo(() => {
    return Prismjs.highlight(
      props.code,
      Prismjs.languages[props.language],
      props.language
    );
  });

  let copyButtonRef: HTMLButtonElement;
  const [isShowingCopyTooltip, setShowingCopyTooltip] = createSignal(false);
  const [copied, setCopied] = createSignal(false);

  let hoverTimeout: NodeJS.Timeout | undefined;

  return (
    <pre
      class={`relative w-full h-fit max-h-[600px] overflow-auto language-${props.language}`}
    >
      <Suspense fallback={<>Loading highlighted code...</>}>
        {/* eslint-disable-next-line */}
        <code
          class="!bg-transparent !p-0"
          // eslint-disable-next-line solid/no-innerhtml
          innerHTML={prismGeneratedHTML()}
        ></code>

        <IconButton
          ref={(ref) => (copyButtonRef = ref)}
          onClick={() => {
            navigator.clipboard.writeText(props.code);
            setCopied(true);
          }}
          onMouseOver={() => {
            clearTimeout(hoverTimeout);
            hoverTimeout = setTimeout(() => {
              setShowingCopyTooltip(true);
              clearTimeout(hoverTimeout);
            }, 500);
          }}
          onMouseLeave={() => {
            clearTimeout(hoverTimeout);
            setShowingCopyTooltip(false)
          }}
          class="sticky left-full bottom-full -translate-x-full translate-y-1/2 -ml-2"
          size="small"
          squarish
        >
          <Show when={!copied()} fallback={<Icons.Check class="!text-xl text-[var(--success-bg)]" />}>
            <Icons.ContentCopy />
          </Show>
        </IconButton>
        <Portal>
          <GrowFade>
            <Tooltip
              visible={isShowingCopyTooltip()}
              identification="Copy to code block clipboard tooltip"
              class="text-nowrap"
              position="bottom"
              anchor={copyButtonRef!}
            >
              Copy to clipboard
            </Tooltip>
          </GrowFade>
        </Portal>
      </Suspense>
    </pre>
  );
}
