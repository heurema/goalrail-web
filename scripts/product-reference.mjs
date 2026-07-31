/**
 * Rendering the product's own surface into the documentation, with no product
 * present.
 *
 * These functions are here rather than in `sync-product.mjs` because both the
 * generator and the cheap check need them, and the generator downloads and runs
 * a binary at import time. The check runs on every pull request and must not do
 * that, so what they share lives where importing it costs nothing.
 */

/** The marked blocks these functions own, in the pages they own them in. */
export const COMMANDS = 'public/docs/commands.md';
export const SURFACE = 'product/surface.json';
export const PIN = 'product/pin.json';

/** The table one generated block holds. */
export function render(flags) {
  if (flags.length === 0) return '_This command takes no flags._';
  return [
    '| Flag | Effect |',
    '|---|---|',
    ...flags.map(({flag, effect}) => `| \`${flag}\` | ${effect} |`),
  ].join('\n');
}

/**
 * Every `<!-- generated: gr x --help -->` block, replaced from the surface.
 *
 * Prose outside the markers is never touched, which is the whole arrangement:
 * the reference is derived and the explanation around it is written.
 */
export function rewrite(markdown, surface) {
  const missing = [];
  const rewritten = markdown.replace(
    /(<!-- generated: gr (\S+) --help -->\n)[\s\S]*?(<!-- \/generated -->)/g,
    (whole, open, command, close) => {
      const found = surface.commands.find((entry) => entry.name === command);
      if (!found) {
        missing.push(command);
        return whole;
      }
      return `${open}${render(found.flags)}\n${close}`;
    },
  );
  if (missing.length > 0) {
    throw new Error(
      `${COMMANDS} has a generated block for ${missing.join(', ')},` +
        ' which the binary does not accept',
    );
  }
  return rewritten;
}

/**
 * Which commands the page teaches, read from its own headings.
 *
 * Derived rather than listed so that documenting a command is one act instead
 * of two, and so a list cannot fall out of step with the page it describes.
 * One heading may name two commands, as `gr connect` / `gr disconnect` does.
 */
export function documented(markdown) {
  const headings = markdown.match(/^## .+$/gm) ?? [];
  return new Set(
    headings.flatMap((heading) =>
      [...heading.matchAll(/`gr ([a-z-]+)`/g)].map((match) => match[1]),
    ),
  );
}
