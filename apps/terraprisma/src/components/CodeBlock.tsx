import { createMemo, createSignal, Suspense } from 'solid-js';
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

  return (
    <pre
      class={`relative w-full h-fit max-h-[600px] overflow-auto language-${props.language}`}
    >
      <Suspense fallback={<>Loading highlighted code...</>}>
        {/* eslint-disable-next-line */}
        <code class="!bg-transparent !p-0" innerHTML={prismGeneratedHTML()}></code>

        <IconButton
          ref={(ref) => (copyButtonRef = ref)}
          onClick={() => navigator.clipboard.writeText(props.code)}
          onMouseOver={() => setShowingCopyTooltip(true)}
          onMouseLeave={() => setShowingCopyTooltip(false)}
          class="sticky left-full bottom-full -translate-x-full translate-y-2 -ml-2"
          size="small"
          squarish
        >
          <Icons.ContentCopy />
        </IconButton>
        <Portal>
          <GrowFade>
            <Tooltip
              visible={isShowingCopyTooltip()}
              identification="Copy to code block clipboard tooltip"
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
