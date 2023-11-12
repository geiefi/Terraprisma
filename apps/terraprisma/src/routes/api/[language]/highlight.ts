import { APIEvent } from 'solid-start';

import Prismjs from 'prismjs';
import loadLanguages from 'prismjs/components/';

export async function POST(event: APIEvent) {
  console.log(event);
  const language = event.params.language;
  const code = await event.request.text();

  loadLanguages();

  return new Response(
    Prismjs.highlight(code, Prismjs.languages[language], language)
  );
}
