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

export const SUBHEAD = 'One command installs it. Your sessions do not change.';

/** The payload of the page. Copying this is the only action we ask for. */
export const INSTALL_PROMPT = `Install Goalrail in this repository. Run \`go install github.com/heurema/goalrail/cmd/gr@latest\`, then \`gr init\` in the repository root. Finally run \`gr doctor\` and show me its output verbatim.`;

export const PROMPT_LABEL = 'Hand this to your agent';

export const PROMPT_NOTE = 'The last step is the point: it proves the install rather than claiming it.';

export const STATUS = 'Early. Needs Go. Codex needs one more consented step.';

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
    line: 'Never your user-level config, never a file a commit could hand to a teammate.',
  },
];

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

/** Verbatim from a run; only the repository path is substituted. */
export const DOCTOR_OUTPUT = `goalrail 0.1.0 — ~/code/acme-api
harness: working
overlay: current (sha256:12cf770f…)
claude-code: active (repository scope)
openspec cli: available
observability: not configured (optional)`;

/**
 * Sponsorship, on its own page and reachable by one word in the colophon.
 *
 * `WALLETS` is deliberately empty until real addresses exist. An address that
 * is wrong, or invented to make a page look finished, sends someone's money
 * somewhere it cannot be recovered from — so the page renders no wallet rather
 * than a plausible one, and the colophon link stays hidden while the list is
 * empty.
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
