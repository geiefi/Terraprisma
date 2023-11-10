import { createResource, createSignal, Suspense } from 'solid-js';
import server$ from 'solid-start/server';

import loadLanguages from 'prismjs/components/';
import { IconButton, Tooltip, GrowFade, Icons } from 'terraprisma';

import './CodeBlock.theme.css';
import { Portal } from 'solid-js/web';

const getHighlightedHTML = server$(async (code: string, language: string) => {
  const Prismjs = await import('prismjs');

  if (typeof Prismjs.languages[language] === 'undefined') {
    loadLanguages(language);
  }

  return Prismjs.highlight(code, Prismjs.languages[language], language);
});

export function CodeBlock(props: { code: string; language: string }) {
  const [data] = createResource(() =>
    getHighlightedHTML(props.code, props.language)
  );

  let copyButtonRef: HTMLButtonElement;
  const [isShowingCopyTooltip, setShowingCopyTooltip] = createSignal(false);

  return (
    <pre class={`relative w-full h-fit language-${props.language}`}>
      <Suspense fallback={<>Loading highlighted code...</>}>
        {/* eslint-disable-next-line */}
        <code class="!bg-transparent !p-0" innerHTML={data()}></code>

        <IconButton
          ref={(ref) => (copyButtonRef = ref)}
          onClick={() => navigator.clipboard.writeText(props.code)}
          onMouseOver={() => setShowingCopyTooltip(true)}
          onMouseLeave={() => setShowingCopyTooltip(false)}
          class="absolute left-full top-0 -translate-x-full translate-y-2 -ml-2"
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
