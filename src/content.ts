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
