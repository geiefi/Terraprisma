import { mount, StartClient } from "@solidjs/start/client";
import 'solid-devtools';
import { attachDevtoolsOverlay } from '@solid-devtools/overlay'

attachDevtoolsOverlay()

mount(() => <StartClient />, document.getElementById("app"));
