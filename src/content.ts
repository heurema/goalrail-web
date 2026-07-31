/**
 * Every string the page shows.
 *
 * Two rules govern this file, and the first draft broke the second one.
 *
 * 1. Nothing is invented. The question is what an agent actually wrote during a
 *    live run; the doctor output is what the binary actually prints.
 * 2. An artifact is evidence, not copy. The page leads with one sentence pulled
 *    from an artifact — never the artifact itself. Full files live small and
 *    late, for the reader who wants proof after they are already interested.
 *
 * Prose here is measured in lines, not paragraphs. If a value below grows past
 * one sentence, it belongs in the specification instead.
 */

/** The hero. One sentence an agent wrote, and who wrote it. */
export const AGENT_ASKED =
  'Which behaviour is authoritative for an empty list — reject with an error, or accept with nil?';

export const AGENT_ATTRIBUTION = 'your agent, instead of guessing';

export const HEADLINE = 'A coding agent that asks instead of guessing.';

/**
 * The category, because the headline above is a claim about behaviour and a
 * reader supplies the category themselves. "A coding agent that asks" parses as
 * another agent to install, which a Claude Code user already has, and the reader
 * leaves before the page can correct it — the README corrects it four lines
 * under the same tagline, and the page had nowhere that did.
 *
 * It also names a supported tool in positive terms, which nothing on the page
 * did. Codex is supported too and is named in the status line instead, because
 * it needs one more consented step and a subhead cannot carry the difference.
 */
export const SUBHEAD =
  'Not another agent — a harness for the agent you already use, in Claude Code today.';

/**
 * The payload of the page. Copying this is the only action we ask for.
 *
 * It is not written here. It is the blockquote under "Or hand it to your agent"
 * in the product's README, unwrapped to one line and otherwise byte-identical,
 * because that wording was paid for twice: two live agent runs produced it, and
 * the earlier version this replaced told the agent to watch for a refusal that
 * initialization does not perform. `npm run check:claims` fails when the two
 * diverge, so this copy cannot go stale quietly.
 */
export const INSTALL_PROMPT = `Install Goalrail in this repository. Do not use \`go install\`; this machine may have no Go toolchain. Fetch \`https://github.com/heurema/goalrail/releases/latest/download/checksums.txt\`, pick the archive matching this machine's operating system and architecture — \`darwin_arm64\`, \`darwin_amd64\`, \`linux_amd64\`, or \`linux_arm64\` — and download it from that same \`releases/latest/download/\` prefix. Verify it with \`shasum -a 256 --ignore-missing -c checksums.txt\` on macOS or \`sha256sum --ignore-missing -c checksums.txt\` on Linux. Extract \`gr\` into \`~/.local/bin\`: that one write outside this repository is expected, and the binary has to stay there because the session hooks record its absolute path. Then run \`~/.local/bin/gr init\` in the repository root. If its report says anything is not ignored by git — the settings path it registers the hooks in, or the marker file — re-run with \`~/.local/bin/gr init --fix-gitignore\`, which adds those entries. If it says no supported scaffold was detected, tell me that verbatim without guessing why: the harness is still installed, and the diagnosis will report the attachment as missing for that reason rather than because anything failed. Finally run \`~/.local/bin/gr doctor\` and show me its output verbatim. Apart from \`~/.local/bin/gr\`, Goalrail's own state directory at \`~/.local/state/goalrail\` — which \`gr doctor\` writes its update-check cache into — and a scratch download directory you clean up, do not edit any file outside this repository.`;

/**
 * What the card shows, as opposed to what the button copies.
 *
 * The full prompt is two hundred words of platform detail, and a page that
 * prints all of it asks the reader to audit an instruction they were going to
 * paste unread anyway. Shortening it is not an option — the shortened version
 * is what was wrong before — so the card shows a verbatim prefix and says that
 * it is one. The check asserts this is a prefix rather than a paraphrase.
 */
export const INSTALL_PROMPT_VISIBLE =
  'Install Goalrail in this repository. Do not use `go install`; this machine may have no Go toolchain.';

export const PROMPT_LABEL = 'Hand this to your agent';

export const PROMPT_NOTE = 'The last step is the point: it proves the install rather than claiming it.';

export const PROMPT_FULL_NOTE =
  'The button copies the whole prompt: it names the archive to download, the checksum to verify, and the one path outside this repository the agent may write.';

export const STATUS = 'Early. macOS and Linux, no Go toolchain needed. Codex needs one more consented step.';

/** Three facts, one line each. Not a features grid — these are boundaries. */
export const FACTS: ReadonlyArray<{term: string; line: string}> = [
  {
    term: 'It stops',
    line: 'When the work cannot be done as specified, it writes the question down and changes nothing else.',
  },
  {
    term: 'You answer once',
    line: 'By confirming a new version of the intent. No dialogue, no resume.',
  },
  {
    term: 'It stays yours',
    // "Never your user-level config" was false on a supported path: attaching
    // Codex writes to the home directory, because Codex cannot register inside
    // a repository. The anchor is consent, not never — nothing lands at user
    // level except through a command you run for that purpose.
    line: 'Nothing at user level except through a command you run for it, and never a file a commit could hand to a teammate.',
  },
];

/**
 * The objection this product exists to answer, in the words it is published in.
 *
 * A reader is being asked to install a hook into their agent's session startup,
 * and the first thing they want to know is what happens when it breaks. The
 * specification answers it and the page never said so.
 */
export const GUARANTEE =
  'A malfunction never reaches your session: if Goalrail breaks, your session starts, runs, and ends as if it were not installed.';

/**
 * The ask, which the page had lost.
 *
 * "Founder-led. Talk to us" beside a Telegram link is a channel, not an offer:
 * no audience named, nothing offered, no next step. The README's Pilot section
 * has all three and this is that ask, shortened to fit the page.
 *
 * It asks for a conversation rather than money on purpose. Eight downloads and
 * four unique visitors in two weeks is not an audience declining to sponsor —
 * it is nobody there to decline, which makes every scheme priced on adoption
 * premature and makes the first real user worth more than a second donation
 * rail.
 */
export const PILOT =
  'Goalrail is founder-led and looking for small product teams already using coding agents in real development: we can look at your setup and decide whether there is a useful first experiment.';

/** Evidence. Shown small and late, for the reader who wants proof. */
export const EVIDENCE_LABEL = 'The file it wrote';

export const AGENT_QUESTION = `---
schema: goalrail.escalation/v0
subject: validate.go — empty-list behaviour for Validate
---

# Blocked: requirements.md specifies contradictory empty-list behaviour

- REQ-1 states Validate must reject an empty list and return an error.
- REQ-2 states Validate must accept an empty list and return no error.

A single implementation cannot both return an error and return nil for the
same input. I cannot pick between them without inventing intent the
requirements do not settle.

## Question for the owner

Which behaviour is authoritative for an empty list — reject with an error
(REQ-1) or accept with nil (REQ-2)?`;

export const DOCTOR_LABEL = 'What it reports';

/**
 * Verbatim from a run; only the repository path is substituted.
 *
 * The version this replaced was `goalrail 0.1.0`, which no build can produce:
 * versions come from build information and carry the leading `v` the tag does.
 * It also showed six of the nine lines, dropping the two that matter most to a
 * skeptic — the attachment that is *not* active, and the update check naming the
 * service it asked. A page selling "a report never claims more than it verified"
 * cannot abridge the report.
 *
 * This one is a real run of the released binary, and it is dated below rather
 * than left to imply it is current, because an undated capture is the same drift
 * again one release later. `npm run check:claims` fails when a newer release
 * makes it stale.
 */
export const DOCTOR_OUTPUT = `goalrail v0.1.2 — ~/code/acme-api
harness: working
overlay: current (sha256:12cf770fb566fd4ae7bbb9d8299064cbbe9d61386c5676850a2d8f329c5ee4ad)
codex: not active (user scope)
claude-code: active (repository scope)
openspec cli: available (needed for validating and archiving changes with the stock OpenSpec CLI)
observability: not configured (optional)
update: nothing newer than v0.1.2 found as of 2026-07-31T12:13:08Z (asked proxy.golang.org)
invocation: OPENSPEC_TELEMETRY=0 npx --yes @fission-ai/openspec@1.6.0 new change <name> --schema goalrail-intent`;

export const DOCTOR_CAPTURE =
  'Captured from gr v0.1.2 on 2026-07-31; only the repository path is substituted.';

/**
 * Sponsorship, on its own page and reachable by one word in the colophon.
 *
 * `WALLETS` was deliberately empty until real addresses existed, and now holds
 * four. The rule that kept it empty still governs it: an address that is wrong,
 * or invented to make a page look finished, sends someone's money somewhere it
 * cannot be recovered from, so nothing goes in this list that has not been
 * verified against its own checksum by `npm run verify:wallets`, which runs in
 * `build`. Emptying the list again hides the colophon link with it, because a
 * support link that leads to an empty page asks twice and answers once.
 *
 * The ask this page does not make is the one that matters more right now. See
 * `PILOT`: with no audience yet, a conversation with a first real user is worth
 * more than another way to send money, and no second donation rail is coming.
 */
export const SUPPORT_TITLE = 'Support';

export const SUPPORT_BODY =
  'Goalrail is founder-led and takes no funding. Sponsorship buys maintenance time — answering issues, keeping the harness working against the scaffolds it attaches to, and publishing releases.';

export const SUPPORT_NOT_BUYING =
  'It does not buy priority, a roadmap seat, or a private build. The specification is public and stays the only thing that decides what the tool does.';

export const SUPPORT_NETWORK_WARNING =
  'Each address is for the network named beside it and no other. Sending on a different network loses the funds, and nobody can return them.';

/**
 * Every address below was checked against its own checksum before it was
 * written here, not merely copied: EIP-55 for the EVM address, bech32 for
 * Bitcoin, base58check for Tron. Solana carries no checksum at all — it is a
 * bare public key — so it was verified only by decoding to the 32 bytes one
 * must be, which is the weakest guarantee on this list.
 *
 * The EVM networks share one entry because they share one address. Listing
 * them separately would print the same string three times and invite a reader
 * to compare three copies of it, which is a way to introduce an error rather
 * than to catch one.
 */
export type Wallet = {
  network: string;
  symbol: string;
  address: string;
  note?: string;
};

export const WALLETS: ReadonlyArray<Wallet> = [
  {
    network: 'Bitcoin',
    symbol: 'BTC',
    address: 'bc1qn30cqehjknvjg8rt96jyqs3457n0n64m7epey8',
    note: 'Native SegWit.',
  },
  {
    network: 'Ethereum, Arbitrum, BNB Chain',
    symbol: 'EVM',
    address: '0xEB10f86bD0Cf8C3DBc9c8bAA0a66F38c33397230',
    note: 'One address on all three, and on any other EVM chain. Arbitrum costs a fraction of mainnet to send on.',
  },
  {
    network: 'Solana',
    symbol: 'SOL',
    address: 'EF4XSS6WxNAqrtaxX58tZRtxAt8mcrKsGkX2by6pnnDg',
  },
  {
    network: 'Tron',
    symbol: 'TRX',
    address: 'TFNtDsWpHYo3qeEwngh1axymj6WG1VBaqy',
    note: 'The cheapest route for USDT.',
  },
];

export const SPEC_URL = 'https://github.com/heurema/goalrail/tree/main/openspec/specs';
export const REPO_URL = 'https://github.com/heurema/goalrail';
export const CONTACT_URL = 'https://t.me/vitnm';

/** The documentation pages, in reading order. Slugs match public/docs/<slug>.md. */
export const DOC_PAGES: ReadonlyArray<{slug: string; title: string}> = [
  {slug: 'install', title: 'Install'},
  {slug: 'the-loop', title: 'The loop'},
  {slug: 'commands', title: 'Commands'},
  {slug: 'guarantees', title: 'Guarantees'},
];
