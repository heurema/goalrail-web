# Install

Goalrail is meant to be installed by the agent, not by hand.

## Hand this to your agent

```text
Install Goalrail in this repository. Run `go install github.com/heurema/goalrail/cmd/gr@latest`, then `gr init` in the repository root. If it refuses to register the session hooks because the settings path is not ignored by git, read the reason it prints and re-run with `gr init --fix-gitignore`. Finally run `gr doctor` and show me its output verbatim. Do not edit any file outside this repository.
```

The last step matters: the agent proves the installation rather than claiming it.

## By hand

```sh
go install github.com/heurema/goalrail/cmd/gr@latest
gr init
```

Prebuilt binaries are not published yet, so installing needs a Go toolchain.

## What `gr init` writes

| Path | What it is |
|---|---|
| `openspec/schemas/goalrail-intent/**` | the workflow schema and its templates, materialized from a copy inside the binary |
| `openspec/config.yaml` | created if absent; afterwards only its `schema:` key is managed |
| `.goalrail/ambient.json` | the marker saying this repository participates — git-ignored, per clone |
| `.claude/settings.local.json` | the session hooks, in the per-user project file, only if git ignores it |

A registration a commit could carry would run in every teammate's session on one
user's consent, so initialization refuses to write one and names what would make
it possible. It never touches user-level scaffold configuration.

## Scaffolds

**Claude Code** — `gr init` is the whole attachment. The hooks live in the
repository, so they are never invoked in unrelated sessions. A live session
confirmed a registered hook runs with no approval step.

**Codex** — registering inside a repository is blocked there by an external
defect, so it registers at user scope:

```sh
gr connect --scaffold codex --yes
```

Then review and trust the hooks with `/hooks` inside Codex. Until you do, nothing
runs. `gr doctor` names that exact state, which otherwise looks like a broken
install.

## Removing it

```sh
gr disconnect --scaffold <name>
```

That removes every registration, in whichever scope it lives. The files under
`openspec/` and `.goalrail/` are ordinary repository content — deleting them is
your act, not Goalrail's.
