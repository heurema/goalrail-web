/**
 * Fails when a claim this site makes about the product stops matching the
 * product.
 *
 * This repository describes something it does not contain, so its failure mode
 * is not a broken build but drift: the page still explaining a world the tool
 * has left. A specification cannot catch that and neither can a promise to
 * remember. A check can, and this is the cheap half of that trade.
 *
 * What it guards today is the one string the whole page exists to hand over.
 * The agent-facing install prompt was settled by two live agent runs in the
 * product repository, and the version this replaced had already gone wrong in a
 * way review did not catch: it told the agent to watch for a refusal that
 * initialization does not perform, and it sent the agent down `go install` after
 * the product had published binaries and told it not to. Both surfaces here —
 * the card's copy button and the markdown an agent fetches — must carry that
 * wording verbatim, so both are compared against the source rather than trusted.
 *
 * Whitespace is normalized on every side. The README wraps the prompt as a
 * blockquote, `install.md` wraps it inside a fence, and the page holds it on one
 * line; those are three renderings of one sentence stream, and re-wrapping any
 * of them is not drift.
 *
 * The comparison is against the product's `main` rather than a pinned tag on
 * purpose: the point is to notice the day the product moves, not the day someone
 * remembers to bump a pin. That means this check needs the network, and it fails
 * loudly when it cannot reach it — a check that passes when it did not run is
 * the promise it was meant to replace.
 *
 * Run with `npm run check:claims`.
 */

import {readFile} from 'node:fs/promises';
import {
  DOCTOR_CAPTURE,
  DOCTOR_OUTPUT,
  INSTALL_PROMPT,
  INSTALL_PROMPT_VISIBLE,
} from '../src/content.ts';

const README =
  'https://raw.githubusercontent.com/heurema/goalrail/main/README.md';

/** The heading in the README whose blockquote is the prompt. */
const HEADING = '### Or hand it to your agent';

/** The heading in install.md whose first fenced block is the prompt. */
const DOC_HEADING = '## Hand this to your agent';

const DOC = 'public/docs/install.md';

/** Where the newest published release announces itself. */
const LATEST = 'https://api.github.com/repos/heurema/goalrail/releases/latest';

/** The page's copy of the same capture, which must not drift from the page. */
const COMMANDS = 'public/docs/commands.md';

/** One sentence stream, however the surface it came from wrapped it. */
function normalize(text) {
  return text.replace(/\s+/g, ' ').trim();
}

/** The contiguous blockquote that follows a heading, with its markers removed. */
function blockquoteAfter(markdown, heading) {
  const lines = markdown.split('\n');
  const start = lines.indexOf(heading);
  if (start < 0) return null;

  const quoted = [];
  for (const line of lines.slice(start + 1)) {
    if (line.startsWith('>')) {
      quoted.push(line.replace(/^>\s?/, ''));
      continue;
    }
    // Blank lines before the quote begins are the gap after the heading;
    // once it has begun, the first unquoted line ends it.
    if (line.trim() === '' && quoted.length === 0) continue;
    if (quoted.length > 0) break;
    // Prose between the heading and the quote is allowed and skipped.
  }
  return quoted.length > 0 ? quoted.join('\n') : null;
}

/** The first fenced block that follows a heading. */
function fenceAfter(markdown, heading) {
  const after = markdown.split(heading)[1];
  if (after === undefined) return null;
  return after.match(/```[a-z]*\n([\s\S]*?)```/)?.[1] ?? null;
}

/** Where two strings first disagree, with enough either side to see it. */
function firstDifference(actual, expected) {
  let index = 0;
  while (
    index < actual.length &&
    index < expected.length &&
    actual[index] === expected[index]
  ) {
    index += 1;
  }
  const from = Math.max(0, index - 40);
  return [
    `      first differs at character ${index}`,
    `      here:   …${actual.slice(from, index + 40)}…`,
    `      source: …${expected.slice(from, index + 40)}…`,
  ].join('\n');
}

let failed = false;

function report(subject, problem) {
  if (problem === null) {
    console.log(`ok    ${subject}`);
    return;
  }
  failed = true;
  console.error(`FAIL  ${subject}`);
  console.error(problem);
}

let source;
try {
  const response = await fetch(README);
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  source = await response.text();
} catch (error) {
  console.error(`FAIL  could not read the product's README at ${README}`);
  console.error(`      ${error.message}`);
  console.error(
    '\nThe check did not run, which is not the same as passing. Nothing should ship.',
  );
  process.exit(1);
}

const quoted = blockquoteAfter(source, HEADING);
if (quoted === null) {
  console.error(`FAIL  the README no longer has a blockquote under "${HEADING}"`);
  console.error(
    '      The prompt moved or was restructured; find it and update this check' +
      ' before updating the page, so the page is still derived from something.',
  );
  process.exit(1);
}

const expected = normalize(quoted);

report(
  'the copied prompt matches the product README',
  normalize(INSTALL_PROMPT) === expected
    ? null
    : `      src/content.ts INSTALL_PROMPT has drifted from ${README}\n` +
        firstDifference(normalize(INSTALL_PROMPT), expected),
);

const doc = await readFile(DOC, 'utf8');
const fenced = fenceAfter(doc, DOC_HEADING);

report(
  `the prompt an agent fetches from ${DOC} matches it too`,
  fenced === null
    ? `      no fenced block under "${DOC_HEADING}"`
    : normalize(fenced) === expected
      ? null
      : `      ${DOC} has drifted from ${README}\n` +
        firstDifference(normalize(fenced), expected),
);

report(
  'the card shows a prefix of the prompt rather than a paraphrase',
  INSTALL_PROMPT.startsWith(INSTALL_PROMPT_VISIBLE)
    ? null
    : '      INSTALL_PROMPT_VISIBLE is not the opening of INSTALL_PROMPT.\n' +
        '      Shortening the prompt is how the previous version went wrong;' +
        ' the visible text may only ever be a verbatim prefix of it.',
);

// --- the doctor capture --------------------------------------------------

/**
 * A pasted terminal capture is the one artifact that cannot age gracefully: it
 * looks exactly as authoritative the day it goes stale as the day it was taken.
 * The version it shows is therefore compared with the newest published release,
 * so a release is what forces a re-capture rather than someone noticing.
 *
 * Re-taking it is not a text edit. Install that release — `go install
 * github.com/heurema/goalrail/cmd/gr@<tag>` stamps the tag the same way the
 * release build does — run `gr init` and `gr doctor` in a scratch repository
 * with a terminal attached, and paste what it prints.
 */
const captured = DOCTOR_OUTPUT.match(/^goalrail (v\S+)/)?.[1] ?? null;
const claimed = DOCTOR_CAPTURE.match(/gr (v\S+)/)?.[1] ?? null;

let latest = null;
try {
  const response = await fetch(LATEST, {
    headers: {accept: 'application/vnd.github+json'},
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  latest = (await response.json()).tag_name;
} catch (error) {
  report('the doctor capture is the current release', `      ${error.message}`);
}

report(
  'the doctor capture names the version its own caption claims',
  captured !== null && captured === claimed
    ? null
    : `      the block opens with ${captured ?? 'no version'} and the caption` +
        ` says ${claimed ?? 'none'}; they are one capture and must agree`,
);

if (latest !== null) {
  report(
    `the doctor capture is the current release (${latest})`,
    captured === latest
      ? null
      : `      the page shows output from ${captured}, and ${latest} is` +
          ' published. Re-run the capture against the release rather than' +
          ' editing the version string — the other lines move too.',
  );
}

const commands = await readFile(COMMANDS, 'utf8');

report(
  `${COMMANDS} shows the same capture as the page`,
  commands.includes(DOCTOR_OUTPUT)
    ? null
    : `      the block in ${COMMANDS} is not the one in src/content.ts.` +
        ' Two copies of one run must be one string, or a reader is comparing' +
        ' two claims and cannot tell which is the artifact.',
);

report(
  'the page discloses the service the update check asks',
  DOCTOR_OUTPUT.includes('proxy.golang.org') &&
    commands.includes('proxy.golang.org')
    ? null
    : '      the capture or the commands page stopped naming' +
        ' proxy.golang.org. The report names its counterparty; a page that' +
        ' reproduces the report must not quietly drop that line.',
);

if (failed) {
  console.error(
    '\nA claim about the product no longer matches the product.' +
      ' Copy the wording from the source rather than editing it here.',
  );
  process.exit(1);
}
