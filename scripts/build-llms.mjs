/**
 * Generates llms.txt and llms-full.txt from the markdown under public/docs.
 *
 * The agent-facing contract is deliberately plain: every page is a real .md
 * file served as-is, llms.txt is the map, and llms-full.txt is every page in one
 * request. Nothing here renders or transforms — a page an agent reads is the
 * same bytes a human's browser fetched.
 *
 * Run by `npm run build`, so the two files can never drift from the pages.
 */

import {readdir, readFile, writeFile} from 'node:fs/promises';
import {join} from 'node:path';

const DOCS = 'public/docs';
const SITE = 'https://goalrail.dev';

const ORDER = ['install.md', 'the-loop.md', 'commands.md', 'guarantees.md'];

const files = (await readdir(DOCS)).filter((name) => name.endsWith('.md'));
const ordered = [
  ...ORDER.filter((name) => files.includes(name)),
  ...files.filter((name) => !ORDER.includes(name)).sort(),
];

const pages = [];
for (const name of ordered) {
  const body = await readFile(join(DOCS, name), 'utf8');
  const title = (body.match(/^#\s+(.+)$/m) ?? [, name])[1];
  const summary = (body.split('\n').find((line) => /^[A-Z]/.test(line)) ?? '').trim();
  pages.push({name, title, summary, body});
}

const index = `# Goalrail

> A coding agent that asks instead of guessing. Goalrail installs a harness into
> one repository; the agent works against intent you confirmed, and writes the
> question down when it cannot proceed.

Every page below is served as markdown at the URL given. Fetch them directly.

## Documentation

${pages.map((p) => `- [${p.title}](${SITE}/docs/${p.name}): ${p.summary}`).join('\n')}

## Source

- [Specifications](https://github.com/heurema/goalrail/tree/main/openspec/specs): the accepted contract, in full
- [Repository](https://github.com/heurema/goalrail): source and change history

## Optional

- [Everything in one file](${SITE}/llms-full.txt)
`;

const full = `# Goalrail — complete documentation

Generated from the same markdown served at ${SITE}/docs.

${pages.map((p) => p.body.trim()).join('\n\n---\n\n')}
`;

await writeFile('public/llms.txt', index);
await writeFile('public/llms-full.txt', full);

console.log(`llms.txt and llms-full.txt written from ${pages.length} pages`);
