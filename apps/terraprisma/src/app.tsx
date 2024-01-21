// @refresh reload
import { Suspense } from 'solid-js';
import { Router, useNavigate } from '@solidjs/router';
import { FileRoutes } from '@solidjs/start';

import { Shell } from './shell';

import 'terraprisma/styles.css';
import 'material-symbols';
import 'fdbg';

import './app.css';

export default function Root() {
  return (
    <Router
      root={(props) => {
        return (<Shell>
          <Suspense>
            {props.children}
          </Suspense>
        </Shell>);
      }}
    >
      <FileRoutes />
    </Router>
  );
}
