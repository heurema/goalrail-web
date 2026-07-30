/**
 * The typefaces.
 *
 * Chosen by comparing four pairings on the real page rather than from a list of
 * names. Geist carries the prose and the hero, where character competes with
 * meaning; IBM Plex Mono carries the wordmark, the install prompt, and every
 * code block, which is where the brand is actually visible on this site.
 *
 * The first theme named a family and loaded nothing, so every page rendered in
 * the platform's own sans. Both families are loaded in index.html; the stacks
 * below only take over if that fails.
 */

const SANS_FALLBACK =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
const MONO_FALLBACK =
  'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, monospace';

export const SANS = 'Geist';
export const MONO = 'IBM Plex Mono';

export const SANS_STACK = `${SANS}, ${SANS_FALLBACK}`;
export const MONO_STACK = `${MONO}, ${MONO_FALLBACK}`;
