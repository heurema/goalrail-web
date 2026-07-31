# Landing page: truth, positioning, funding — owner discussion, 2026-07-31

Input for the next session. This is a discussion record, not confirmed intent:
the work starts from its own reading of these facts and its own owner
confirmation.

## Why now

The product moved and the page did not. Between 2026-07-30 and 2026-07-31 the
`goalrail` repository gained a release channel (prebuilt binaries, `v0.1.1` and
`v0.1.2` published) and an update check in `gr doctor`. The page still describes
the world before both.

Two review rounds were run against the page — four lenses, then adversarial
verification of every finding. **Fifteen findings confirmed, three refuted.**
What follows is the confirmed set, with the refutations kept because one of them
overturned the reviewer's own recommendation.

## Verified facts, so the next session does not re-derive them

Checked on 2026-07-31 against the live site, the live releases, and both
repositories.

| Fact | How it was established |
|---|---|
| Adoption is 2 stars, 0 forks, 0 watchers; 8 views / 4 uniques over 14 days. | `gh api repos/heurema/goalrail`, traffic API. |
| Total release-asset downloads across both releases: 8, all `darwin_arm64`. Consistent with the maintainer's own two agent runs and this session's testing, and nothing else. | `gh release view --json assets`. The 2008 clones are module-proxy and CI traffic, not people. |
| `releases/latest/download/checksums.txt` returns 200 with four `v0.1.2` archives. | `curl`. |
| The site's install prompt, its `install.md`, its `llms.txt` and its `llms-full.txt` all still say `go install`, and `install.md` states "Prebuilt binaries are not published yet". | `curl` of each; the deployed bundle contains the same string. |
| `gr init` in a fresh repository returns exit 0 with the registration applied and one notice about the marker — it does not "refuse", which is the condition the site's prompt tells the agent to look for. | Built `./cmd/gr` and ran it in a scratch repository. |
| No GitHub Sponsors profile exists: `github.com/sponsors/heurema` redirects to the org. | HTTP. |
| `.github/FUNDING.yml` carries only `custom: ["https://goalrail.dev/support"]`, and that page offers four crypto wallets and no fiat rail. | Read both. |
| `gr doctor` now makes an outbound request to `proxy.golang.org`, and the site documents doctor in five clauses and six guarantees without mentioning it. | Read the promoted specs and every page. |
| Sources are generated: `public/llms.txt` and `public/llms-full.txt` come from `public/docs` via `scripts/build-llms.mjs`; `dist/` is gitignored. | `package.json`, `.gitignore`. |

## Confirmed findings

### The page's one call to action is the superseded route

Five findings across three lenses land on this. `INSTALL_PROMPT`
(`src/content.ts:27`) and `public/docs/install.md` hand the agent `go install`.
The product's README prompt — rewritten after two live agent runs and verified
on a machine with no Go — opens with "Do not use `go install`". The site's docs
prompt also still carries the exact sentence run 1 proved defective: it tells the
agent to act "if it refuses to register the session hooks", and initialization
does not refuse; it succeeds and prints a notice.

Precision that matters: `go install` is **not** forbidden outright. The README
keeps it under "Or install with Go" for a human who has Go. The defect is scoped
to the agent-facing prompt, and to `install.md` claiming binaries do not exist.

### The page's own evidence fails the standard the product sells

`DOCTOR_OUTPUT` (`src/content.ts:76`) is labelled "Verbatim from a run" under a
file rule that reads "Nothing is invented … the doctor output is what the binary
actually prints". It shows `goalrail 0.1.0` — a string **no build can produce**,
because versions now come from build information and carry a leading `v` — and
it omits three of the nine lines the binary prints, including the new `update:`
line and the `codex:` attachment line.

The site publishes the guarantee "A report never claims more than it verified".
The page breaks it in the one place a skeptic checks.

### The headline sells the wrong category

"A coding agent that asks instead of guessing" reads as a category claim.
Goalrail is not an agent; it is a harness for the agent the reader already has. A
Claude Code user parses the headline as "another agent, I have one" and leaves.
The README corrects this four lines under the same tagline. The page never
corrects it anywhere a human can reach, and names no supported tool in positive
terms.

Constraint on the fix: `src/content.ts:12` states its own rule — one sentence per
value, or it belongs in the specification. A two-sentence replacement breaks it.

### The network is undisclosed

`gr doctor` talks to `proxy.golang.org`. The page says of `gr update` that it
"makes no network request", which reads as a tool that never touches the network
at all. For a product selling honesty this is the worst kind of omission, and it
is now also a privacy claim the page does not make correctly.

### "Never your user-level config" is false on one supported path

Third hero fact, `src/content.ts:46`. `gr connect --scaffold codex --yes` writes
to the user's home directory by design — Codex cannot register inside a
repository. The true anchor is consent, not "never": nothing at user level
without a separate consented command.

### Documentation exists for agents and not for humans

`public/docs/*.md` render, and `llms.txt` indexes them for agents. The landing
page contains **no link to any of them**; humans are sent to a raw GitHub specs
tree. The tab title is `goalrail-web`, and there is no description, no Open
Graph, no `og:image` — every shared link renders as an empty card.

### The strongest available claim is never made

The obvious objection to this product is "you want me to install a hook into my
agent's session startup — what happens when it breaks?" The promoted specs
answer it: "A malfunction never reaches your session." The site publishes that in
`guarantees.md` and never surfaces it on the page or links to it.

## Funding — including a recommendation this session got wrong

**The measured position: there is no audience yet.** Eight downloads, four
unique visitors in two weeks. People are not declining to donate; there is
nobody to decline. Every funding scheme priced on adoption is therefore
premature, and saying so is the honest answer to "why do people donate
reluctantly".

**A recommendation made in session and then refuted.** It was proposed that
crypto-only sponsorship blocks corporate money and that GitHub Sponsors should be
added. Verification overturned it on the primary sources:

- Filippo Valsorda, cited to diagnose donation rails, writes in the same passage
  that "GitHub Sponsors and Patreon are a nice way to show gratitude, but they
  are an extremely unserious compensation structure" — the prescription cited its
  own source against itself.
- Invoiced sponsorship through GitHub is **organizations only, minimum $5,000 per
  invoice, 3% fee**. That is a conversation with a budget owner, not a frictionless
  corporate rail.

So: adding a second donation rail is not the answer. The finding that survived
is different.

**What is documented to work before adoption exists: selling the person, not the
product.** Valsorda's retainer clients (Tailscale, Teleport, Smallstep,
Interchain, Ava Labs, Sigsum) buy "a direct line to a maintainer" — priced on
expertise, not install counts. The reverse ordering is documented to fail: Mike
Perham licensed Sidekiq commercially before adoption and it "didn't sell very
well"; the business came after Rails-wide adoption. The Wix Toolset maintenance
fee and Astral's paid enterprise tier both need substantial existing usage.

**And that ask is already written** — `README.md`'s Pilot section: "founder-led
and looking for small product teams already using coding agents in real
development … decide whether there is a useful first experiment." On the site it
has decayed to "Founder-led. Talk to us" beside a Telegram link: the channel is
there, the offer is not. No audience named, no offer, no next step.

## The asset nobody can copy

This project publishes, dated and in the shipped repository, the specific claims
it made that later proved false — that `tar` does not propagate quarantine; that
"about a minute" described the check when it described ingest. That is not
process documentation, it is a costly, falsifiable trust signal, and it is the
only kind of proof a product promising "never guesses" can offer without asking
for faith.

The page makes no version of this claim. If it is used, the wording must be
counted, not estimated — a reviewer already rejected a draft sentence that said
"four times" where only two were documentation corrections.

## Tripwires for the next session

- **Edit sources, not outputs.** `public/docs/*.md` and `src/content.ts` are
  hand-maintained; `public/llms*.txt` are generated by `npm run llms`; `dist/` is
  gitignored. Hand-editing the generated files loses the edit.
- **The prompt was paid for twice.** Two live agent runs produced the README's
  current wording. Copy it verbatim rather than paraphrasing it, and prefer one
  source both the README and the page render from.
- **`content.ts` has a one-sentence rule** and its first draft already broke a
  different one of its own rules. Any replacement string must fit the rule.
- **The `WALLETS` comment is stale**: it says the list is deliberately empty
  until real addresses exist, and the list now has four.
- The site is deployed from this repository; check `README.md` and
  `.github/` for the deploy path before assuming how a change ships.

## The tooling decision, settled

Asked and answered on 2026-07-31: **this repository does not adopt the OpenSpec
cycle.** The reasoning is recorded in `AGENTS.md` under "How changes are made
here"; in short, the cycle protects promises and this repository makes none —
it describes a product, so its failure mode is drift, and drift is caught by a
check rather than by a specification. All fifteen findings in this brief are
drift.

What to build instead, and it is the cheaper half of the trade: make the page's
product claims derived or verified rather than retyped. There is no test runner
here today, so this is a small addition, and CI already has the shape for it —
it asserts route behaviour, just not content truthfulness.

Revisit condition: this repository starts holding state that is not its own. An
admin surface is that, and it raises a product question before a tooling one —
`goalrail`'s promoted record currently carries the non-goal "No hosted or
multi-tenant observability", and whether the product acquires a hosted surface
belongs to the cycle over there, exactly as retiring the no-update-check
non-goal did. Whether such a surface lives in this repository at all is a second
question: a static page behind nginx and an authenticated service with sessions
share neither a deploy profile nor a security one.

## Merging is deploying — read this before finishing anything

There is no deploy command. A merge to `main` publishes an image that Flux rolls
out to the live site within minutes. **The merge is the external act**, and it
carries the gate that tagging a release carries in the product repository. CI
lints, type-checks, builds the image, serves it and asserts the routes that have
broken before; only then is the image published. A bad image cannot take the
site down, because the running pod keeps serving until the new one is ready —
but a false claim ships the moment the merge lands.

## Open questions for the intent

1. Does the page adopt the README's agent prompt verbatim, or does one source
   become canonical and both surfaces render from it?
2. Does the headline stay and the subhead carry the category, or does the
   headline itself change? Both must respect the one-sentence rule.
3. Is the self-correction record used as a public claim, and if so where — the
   landing page, or a documentation page the landing page links to?
4. Does "Talk to us" become the README's pilot ask, and does that change what
   the support page is for — expertise first, wallets second?
5. Does anything about funding change at all before there are users, or is the
   honest answer to leave it and spend the effort on the first real user?

## Boundaries

- Nothing here authorizes a deploy. The site is live; publishing a change to it
  is an external action with its own owner gate.
- The wallet addresses are verified against their own checksums by
  `npm run verify:wallets`, which runs in `build`. Do not edit an address without
  it, and do not invent one.
- The product repository is at `v0.1.2` with everything merged and archived;
  nothing in this brief requires a product change, only that the page stop
  describing a product that no longer exists.
