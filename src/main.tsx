import {StrictMode, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Theme} from '@astryxdesign/core';
import '@astryxdesign/core/reset.css';
import '@astryxdesign/core/astryx.css';
import './page.css';
import {goalrailTheme} from './theme/goalrailTheme';
import {App} from './App';
import {Docs} from './Docs';
import CenteredHero from './reference/CenteredHero';
import DocumentationTechnical from './reference/DocumentationTechnical';

/**
 * The page, plus the untouched Astryx templates the composition borrows from,
 * kept at /centered-hero and /documentation-technical so the adaptation can be
 * checked against its source.
 */
function Root() {
  const [mode, setMode] = useState<'dark' | 'light'>('dark');
  const path = window.location.pathname;

  const docsMatch = path.match(/^\/docs\/?(.*)$/);

  const view =
    path === '/centered-hero' ? (
      <CenteredHero />
    ) : path === '/documentation-technical' ? (
      <DocumentationTechnical />
    ) : docsMatch ? (
      <Docs page={docsMatch[1]} mode={mode} onModeChange={setMode} />
    ) : (
      <App mode={mode} onModeChange={setMode} />
    );

  return (
    <Theme theme={goalrailTheme} mode={mode}>
      {view}
    </Theme>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
