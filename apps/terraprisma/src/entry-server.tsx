import { renderToString } from 'solid-js/web';
import {
  StartServer,
  createHandler,
  renderAsync
} from 'solid-start/entry-server';

export default createHandler(
  renderAsync((event) => <StartServer event={event} />)
);
