import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {Theme} from '@astryxdesign/core';
import '@astryxdesign/core/reset.css';
import '@astryxdesign/core/astryx.css';
import {goalrailTheme} from './theme/goalrailTheme';
import {App} from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Theme theme={goalrailTheme} mode="dark">
      <App />
    </Theme>
  </StrictMode>,
);
