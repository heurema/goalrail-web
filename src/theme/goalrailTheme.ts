/**
 * The Goalrail theme.
 *
 * Derived from Linear's extracted design system — "observatory console behind
 * dark glass" — which the owner chose after comparing it against Factory.ai and
 * shadcn/ui rendered on this same page. Its values are taken as given rather
 * than averaged: a five-level grey stack, hairline borders, no shadows, a 4px
 * base with 4/8 radii.
 *
 * Two decisions are ours rather than the reference's.
 *
 * There is no chromatic accent. The blue from the mark was tried and did not
 * land, and near-white fed to the palette generator produced a cyan button, so
 * `--color-accent` is overridden explicitly to ink — white on dark, black on
 * light — the way the stock neutral theme does it. Colour is left to the two
 * states the product actually reports.
 *
 * Sans for text, mono for code and labels. Monospace at display sizes was this
 * project's own invention and it read thin; both reference systems use a sans
 * for prose and reserve mono for code.
 */

import {defineTheme} from '@astryxdesign/core/theme';

const MONO =
  'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, monospace';
const SANS =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

/**
 * Linear — "observatory console behind dark glass."
 * Five-level grey stack, hairline borders, no shadows, tight negative tracking,
 * 4px base with 4/8 radii.
 */
export const goalrailTheme = defineTheme({
  name: 'goalrail',
  color: {accent: '#8a8f98', neutralStyle: 'cool'},
  typography: {
    scale: {base: 15, ratio: 1.2},
    body: {family: 'Inter', fallbacks: SANS},
    heading: {family: 'Inter', fallbacks: SANS},
    code: {family: 'ui-monospace', fallbacks: MONO},
  },
  radius: {base: 4, multiplier: 1},
  motion: {fast: 120, medium: 260, ratio: 0.75},
  tokens: {
    '--color-background-body': ['#f7f8f8', '#08090a'],
    '--color-background-card': ['#ffffff', '#141516'],
    '--color-background-surface': ['#ffffff', '#1c1c1f'],
    '--color-background-popover': ['#ffffff', '#23252a'],
    '--color-background-muted': ['#f7f8f8', '#141516'],
    '--color-text-primary': ['#08090a', '#f7f8f8'],
    '--color-text-secondary': ['#5c5f66', '#8a8f98'],
    '--color-border': ['#d0d6e0', '#34343a'],
    '--color-accent': ['#08090a', '#f7f8f8'],
    '--color-text-accent': ['#08090a', '#f7f8f8'],
    '--color-success': ['#16833C', '#45D483'],
    '--color-warning': ['#9A5B00', '#F2B84B'],
  },
});
