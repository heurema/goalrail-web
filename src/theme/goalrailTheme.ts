/**
 * The Goalrail theme.
 *
 * Dracula, taken as given rather than adapted. It is the palette the owner
 * already reads code in, and for a product whose whole surface is a terminal
 * that is the point: the site should look like the place the tool runs, not
 * like a page about a tool that runs somewhere else.
 *
 * The pink is Dracula's accent and it stays the accent here — a committed
 * choice in a category that defaults to blue, which is most of why it works.
 *
 * Light mode is Alucard, Dracula's own light counterpart, rather than an
 * inverted dark theme. Its background is a warm off-white, a colour to be
 * careful with — but here it is the palette's own value rather than a hedge,
 * and every foreground below was contrast-checked against it.
 *
 * Two departures from the raw spec, both forced by readability:
 *
 * Comment `#6272A4` is Dracula's secondary text colour and reaches only 3:1 on
 * the card background, under the 4.5:1 floor for body text. Secondary text uses
 * a lightened value at the same hue, which measures 5.8:1.
 *
 * The canonical `#282A36` is used for cards, with a darker `#21222C` behind
 * them, so a surface reads as raised. That is how Dracula arranges its own
 * editor chrome.
 */

import {defineTheme} from '@astryxdesign/core/theme';
import {MONO, MONO_STACK, SANS, SANS_STACK} from './typefaces';

export const goalrailTheme = defineTheme({
  name: 'goalrail',
  color: {accent: '#FF79C6', neutralStyle: 'cool'},
  typography: {
    scale: {base: 15, ratio: 1.2},
    body: {family: SANS, fallbacks: SANS_STACK},
    heading: {family: SANS, fallbacks: SANS_STACK},
    code: {family: MONO, fallbacks: MONO_STACK},
  },
  radius: {base: 4, multiplier: 1},
  motion: {fast: 120, medium: 260, ratio: 0.75},
  // [light, dark] — Alucard, then Dracula.
  tokens: {
    '--color-background-body': ['#FFFBEB', '#21222C'],
    '--color-background-card': ['#FFFFFF', '#282A36'],
    '--color-background-surface': ['#FFFFFF', '#282A36'],
    '--color-background-popover': ['#FFFFFF', '#343746'],
    '--color-background-muted': ['#F6F1DC', '#282A36'],
    '--color-background-inverted': ['#1F1F1F', '#F8F8F2'],
    '--color-text-primary': ['#1F1F1F', '#F8F8F2'],
    '--color-text-secondary': ['#6C664B', '#9AA4C6'],
    '--color-text-disabled': ['#9A9481', '#6272A4'],
    '--color-text-accent': ['#A3144D', '#FF79C6'],
    '--color-icon-primary': ['#1F1F1F', '#F8F8F2'],
    '--color-icon-secondary': ['#6C664B', '#9AA4C6'],
    '--color-icon-accent': ['#A3144D', '#FF79C6'],
    '--color-border': ['#E0DAC0', '#44475A'],
    '--color-border-emphasized': ['#C3BC9E', '#6272A4'],
    '--color-accent': ['#A3144D', '#FF79C6'],
    '--color-on-accent': ['#FFFBEB', '#282A36'],
    '--color-success': ['#14710A', '#50FA7B'],
    '--color-on-success': ['#FFFBEB', '#282A36'],
    '--color-warning': ['#A34D14', '#FFB86C'],
    '--color-on-warning': ['#FFFBEB', '#282A36'],
    '--color-error': ['#CB3A2A', '#FF5555'],
    '--color-on-error': ['#FFFBEB', '#282A36'],
  },
});
