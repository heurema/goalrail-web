/**
 * Goalrail theme
 *
 * Derived from the existing Goalrail mark, which is set entirely in monospace
 * on #111821, and from three reference systems chosen for this product:
 * Linear (observatory console behind dark glass), Factory.ai (stark black
 * control surface), and shadcn/ui (clinical blueprint on frosted paper).
 *
 * What they share, and what this theme encodes:
 *   - Near-monochrome surfaces. Colour only ever carries meaning.
 *   - No decorative depth. Elevation comes from the surface stack and
 *     hairline borders, not from shadow.
 *   - Monospace as the primary typeface rather than a wrapper for code.
 *   - Small radii. An instrument, not a consumer app.
 *
 * The three accents come from the mark and map onto states the product
 * actually reports through `gr doctor`:
 *   blue   information, links, the pinned invocation
 *   green  working, current, verified
 *   amber  needs attention, drifted, pending
 *
 * Token values are [light, dark] pairs.
 */

import {defineTheme} from '@astryxdesign/core/theme';

const MONO_STACK =
  'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", monospace';

export const goalrailTheme = defineTheme({
  name: 'goalrail',

  // Blue is the single generated accent; green and amber stay explicit status
  // tokens below rather than competing for the accent role.
  color: {accent: '#4DB4FF', neutralStyle: 'cool'},

  // Monospace across body and heading, not only code. This is the strongest
  // signal the existing mark already carries.
  typography: {
    scale: {base: 15, ratio: 1.2},
    body: {family: 'ui-monospace', fallbacks: MONO_STACK},
    heading: {family: 'ui-monospace', fallbacks: MONO_STACK},
    code: {family: 'ui-monospace', fallbacks: MONO_STACK},
  },

  // 4px base: inputs and tags at 4, cards and framed blocks at 8. Nothing
  // rounder — the references converge on small radii for tools.
  radius: {base: 4, multiplier: 1},

  motion: {fast: 120, medium: 260, ratio: 0.75},

  tokens: {
    // Surfaces. Dark is the primary mode; the stack is canvas → card → nested,
    // each step small enough to read as one material under different light.
    '--color-background-body': ['#F6F8FA', '#0B0F14'],
    '--color-background-card': ['#FFFFFF', '#111821'],
    '--color-background-surface': ['#FFFFFF', '#161E28'],
    '--color-background-popover': ['#FFFFFF', '#161E28'],
    '--color-background-muted': ['#F6F8FA', '#111821'],

    // Text. Ink and muted come straight from the mark.
    '--color-text-primary': ['#15202B', '#E6EDF3'],
    '--color-text-secondary': ['#536477', '#91A4B7'],

    // One hairline everywhere. Borders carry the structure that shadow would
    // otherwise carry.
    '--color-border': ['#C8D1DC', '#2A3746'],

    // Status. These are the only colours allowed to appear at once, and only
    // where the product itself reports that state. Token names come from
    // `astryx docs tokens`, not from guesswork — the first draft of this file
    // invented `--color-text-success`, which does not exist.
    '--color-success': ['#16833C', '#45D483'],
    '--color-warning': ['#9A5B00', '#F2B84B'],
    '--color-text-accent': ['#0969DA', '#4DB4FF'],
  },
});
