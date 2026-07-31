/**
 * Asks the product what it accepts, and writes the answer into the pages.
 *
 * The prose on the documentation pages is written by hand and should stay that
 * way — nothing generates an explanation of why re-running initialization is
 * safe. What does not survive being written by hand is the reference: the list
 * of commands and the flags each one takes. That part is already authored, in
 * the product, as the help text its own users read. Retyping it here produced
 * exactly what retyping produces: the flag table on this site paraphrased four
 * descriptions and none of them matched what the binary prints.
 *
 * So the reference is derived. This script downloads the release named in
 * `product/pin.json`, verifies it against the checksums published beside it,
 * asks it for its help output, and rewrites the marked blocks in
 * `public/docs/commands.md` from what it said. Prose around those blocks is
 * untouched.
 *
 * Two properties are deliberate.
 *
 * It runs from a pin rather than from the newest release, and it writes files
 * that get committed. Generating at build time from whatever is current would
 * mean the deployed page could change without a diff anybody reviewed, which is
 * the opposite of what this repository is for. Bumping the pin is a pull
 * request, and its diff is the product's own changelog as far as this site is
 * concerned.
 *
 * It normalizes exactly one thing and nothing else: Go's flag package prints
 * `-repo`, and every other page here — including the install prompt the product
 * itself authored — writes `--repo`. Rendering the single dash verbatim would
 * contradict the instruction next to it. Descriptions are copied character for
 * character.
 *
 *   npm run sync:product          rewrite the generated blocks
 *   npm run sync:product -- --check   fail if they are not what the pin produces
 *
 * Check mode runs in CI and on the daily schedule alike. Running it only on the
 * schedule was the first plan and it was wrong: the pull request that bumps the
 * pin is the one moment the full check is actually needed, and that plan would
 * have verified it the following morning. It downloads and executes a binary,
 * which is a real cost, but this repository already will not build without
 * reaching the product's README and the releases API.
 *
 * The cheaper half lives in check-claims.mjs and needs neither: that the blocks
 * match the recorded surface, and that every command in it is documented or
 * excused.
 */

import {execFileSync, spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {mkdir, mkdtemp, readFile, writeFile, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {COMMANDS, PIN, SURFACE, rewrite} from './product-reference.mjs';

const RELEASES = 'https://github.com/heurema/goalrail/releases/download';

const check = process.argv.includes('--check');

/** What the release archives call this machine. */
function platform() {
  const os = {darwin: 'darwin', linux: 'linux'}[process.platform];
  const arch = {arm64: 'arm64', x64: 'amd64'}[process.arch];
  if (!os || !arch) {
    throw new Error(
      `no published archive for ${process.platform}/${process.arch};` +
        ' the release carries darwin and linux on amd64 and arm64',
    );
  }
  return `${os}_${arch}`;
}

async function fetchOrDie(url, as = 'text') {
  const response = await fetch(url, {redirect: 'follow'});
  if (!response.ok) {
    throw new Error(`${url}: ${response.status} ${response.statusText}`);
  }
  return as === 'text'
    ? response.text()
    : Buffer.from(await response.arrayBuffer());
}

/**
 * The published binary, verified the way the site tells an agent to verify it.
 *
 * An unverified download would make every claim below rest on whatever answered
 * the request, which is a strange foundation for a check about honesty.
 */
async function download(tag, into) {
  const want = platform();
  const checksums = await fetchOrDie(`${RELEASES}/${tag}/checksums.txt`);

  const line = checksums
    .split('\n')
    .map((entry) => entry.trim().split(/\s+/))
    .find(([, name]) => name?.includes(want));
  if (!line) {
    throw new Error(`checksums.txt for ${tag} names no archive for ${want}`);
  }
  const [expected, archive] = line;

  const bytes = await fetchOrDie(`${RELEASES}/${tag}/${archive}`, 'binary');
  const actual = createHash('sha256').update(bytes).digest('hex');
  if (actual !== expected) {
    throw new Error(
      `${archive} does not match its published checksum\n` +
        `      published ${expected}\n      downloaded ${actual}`,
    );
  }

  const path = join(into, archive);
  await writeFile(path, bytes);
  execFileSync('tar', ['-xzf', path, '-C', into, 'gr']);
  return join(into, 'gr');
}

/**
 * Help output, whichever stream it came out of and whatever it exited with.
 *
 * Both halves of that sentence are load-bearing. Go's flag package writes usage
 * to standard error, and `gr help --help` exits non-zero while printing exactly
 * what was asked for — so reading stdout on success only, which is what the
 * obvious call does, returns an empty string for every command and finds no
 * flags anywhere. It did, on the first run of this script, silently.
 */
function help(gr, args) {
  const run = spawnSync(gr, args, {encoding: 'utf8'});
  if (run.error) throw run.error;
  const printed = `${run.stdout ?? ''}${run.stderr ?? ''}`;
  if (printed.trim() === '') {
    throw new Error(`\`gr ${args.join(' ')}\` printed nothing`);
  }
  return printed;
}

/** The commands the binary admits to, from the usage line `gr help` prints. */
function commandsOf(gr) {
  const usage = help(gr, ['help']);
  const named = usage.match(/usage: gr <([^>]+)>/)?.[1];
  if (!named) {
    throw new Error(
      '`gr help` no longer opens with a `usage: gr <a|b|c>` line, so the' +
        ' command list cannot be read from it. Teach this script the new shape' +
        ' before touching the pages, so the pages stay derived from something.',
    );
  }
  return named.split('|').map((name) => name.trim());
}

/**
 * The flags one command takes.
 *
 * Go's flag package prints a fixed shape: two spaces, the flag, optionally a
 * type, then the description on the next line behind a tab. Both help headers in
 * this binary — `Usage of x:` and `usage: gr x [flags]` with prose — are
 * followed by that same block, so only the block is parsed and the header is
 * ignored.
 */
function flagsOf(gr, command) {
  const lines = help(gr, [command, '--help']).split('\n');
  const flags = [];

  for (let index = 0; index < lines.length; index += 1) {
    const declared = lines[index].match(/^ {2}-(\S+)(?: (\S+))?$/);
    if (!declared) continue;

    const description = [];
    for (let next = index + 1; next < lines.length; next += 1) {
      if (!/^\s+\t/.test(lines[next])) break;
      description.push(lines[next].replace(/^\s+\t/, '').trim());
      index = next;
    }
    flags.push({
      // The one normalization, and it is about this site's own consistency
      // rather than about the product: everything here writes `--flag`.
      flag: `--${declared[1]}${declared[2] ? ` <${declared[2]}>` : ''}`,
      effect: description.join(' '),
    });
  }
  return flags;
}

// --- run -------------------------------------------------------------------

const pin = JSON.parse(await readFile(PIN, 'utf8'));
const workspace = await mkdtemp(join(tmpdir(), 'goalrail-sync-'));

let surface;
try {
  const gr = await download(pin.tag, workspace);
  surface = {
    $comment:
      'Generated by scripts/sync-product.mjs from the release named in' +
      ' product/pin.json. Do not edit: run `npm run sync:product`.',
    tag: pin.tag,
    commands: commandsOf(gr).map((name) => ({name, flags: flagsOf(gr, name)})),
  };
} finally {
  await rm(workspace, {recursive: true, force: true});
}

const markdown = await readFile(COMMANDS, 'utf8');
const rewritten = rewrite(markdown, surface);
const recorded = `${JSON.stringify(surface, null, 2)}\n`;

if (!check) {
  await mkdir('product', {recursive: true});
  await writeFile(SURFACE, recorded);
  await writeFile(COMMANDS, rewritten);
  console.log(
    `wrote ${SURFACE} and the generated blocks in ${COMMANDS}` +
      ` from ${pin.tag} (${surface.commands.length} commands)`,
  );
  process.exit(0);
}

let failed = false;
const committed = await readFile(SURFACE, 'utf8').catch(() => null);

if (committed !== recorded) {
  failed = true;
  console.error(`FAIL  ${SURFACE} is not what ${pin.tag} reports`);
  console.error('      Run `npm run sync:product` and commit the result.');
}

if (markdown !== rewritten) {
  failed = true;
  console.error(`FAIL  the generated blocks in ${COMMANDS} are stale`);
  console.error('      Run `npm run sync:product` and commit the result.');
}

if (failed) process.exit(1);
console.log(`ok    the reference matches ${pin.tag} as published`);
