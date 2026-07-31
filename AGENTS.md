# AGENTS.md

Project-specific guidance for AI coding agents.

<!-- ASTRYX:START -->
Astryx v0.1.9 · 153 components
CLI: run every command as `npx astryx <cmd>` (shown below as `astryx ...`).

SETUP (once, in your app entry e.g. main.tsx) — without these, components render unstyled:
  import "@astryxdesign/core/reset.css";
  import "@astryxdesign/core/astryx.css";

WORKFLOW — discover, don't guess. Before writing UI:
1. `astryx build "<idea>"` — START HERE: returns a kit (closest [page] + [block]s + [component]s). No args = full playbook.
2. `astryx template <name> [--skeleton]` — scaffold the [page]/[block]s it named, or study their layout. Templates are reference code.
3. `astryx component <Name>` — props + examples for every component you use.

RULES:
- No <div> — components do all layout/spacing. Full page → AppShell; sidebar nav → SideNav.
- Frame first: pick the shell (AppShell / Layout+LayoutPanel) and budget regions in px BEFORE writing content (`astryx docs layout`).
- Dense data = rows (Table, List/Item) edge-to-edge — never Card-wrapped list items. Card = dashboard widgets, galleries, settings groups only.
- Status → StatusDot/Token; Badge only for counts and enumerated states, never decoration.
- Custom styling: component props first; else style/className with tokens — var(--color-*|--spacing-*|--radius-*). No raw hex/px. (No StyleX/Tailwind compiler here — don't use xstyle/utility classes.)
- Tokens for every value (`astryx docs tokens`). Brand/accent via `astryx theme` — never override --color-* in :root.
- SELF-CHECK before you finish: re-read the file and replace any raw <div>/<span> layout, imported .css/@apply, or hardcoded value (#hex, 16px) with the component or a token (var(--color-*|--spacing-*|…)). If unsure a component/prop exists, run `astryx component <Name>` / `astryx search "<thing>"`; don't hand-roll CSS.

MORE CLI:
  search "<query>"   find any component / hook / doc / template / block
  component --list   153 components by category
  template --list    page + block recipes
  docs <topic>       color, elevation, icons, illustrations, internationalization, layout, migration, motion, principles, shape, spacing, styling, theme, tokens, typography
  swizzle <Name>     eject component source for deep customization
  upgrade --apply    run after any @astryxdesign/core bump
<!-- ASTRYX:END -->

## How changes are made here

This repository does **not** use the OpenSpec intent cycle that governs the
`goalrail` product repository, and that is a decision rather than an omission.

The cycle there protects promises: promoted requirements are what the product
tells its users, and the ceremony exists so a promise cannot change quietly. This
repository makes no promises of its own — it *describes* the product. Its failure
mode is therefore not a violated contract but drift: the page saying something
the product no longer does. A specification does not catch drift. A check does.

So changes here take an ordinary shape — a branch, a commit that explains itself,
a pull request — and the effort that would have gone into artifacts goes into
keeping the page's claims derived from the product rather than retyped from it.

Two things follow, and both are load-bearing:

- **A claim about the product belongs to the product.** The agent-facing install
  prompt and any sample command output are paid-for artifacts: the prompt's
  current wording came from two live agent runs. Copy them verbatim from
  `goalrail`'s README and specs, and prefer a check that fails when they diverge
  over a promise to remember.
- **Revisit this decision when this repository starts holding state that is not
  its own.** An admin surface with sessions, credentials, or another party's data
  is a different repository in every way that matters, and the question it raises
  first is not which tooling to use here but whether the product acquires a
  hosted surface at all — a promoted non-goal in `goalrail` currently says it
  does not, and retiring that belongs to the cycle over there.

## Merging is deploying

There is no deploy command and no separate release step. A merge to `main`
publishes an image that Flux rolls out to the live site within minutes, so
**merging is the externally visible act** and carries the gate that a release
carries elsewhere. Open the pull request, let CI finish, and merge only on an
explicit instruction — never as the natural end of finishing the work.

CI already asserts the routes that have broken before: the client-route fallback,
the raw markdown an agent fetches and its content type, and a missing document
answering 404 rather than 200 with the page shell. Content truthfulness is not
among them, which is the gap the point above is about.
