# Install

Goalrail is meant to be installed by the agent, not by hand.

## Hand this to your agent

```text
Install Goalrail in this repository. Do not use `go install`; this machine may
have no Go toolchain. Fetch
`https://github.com/heurema/goalrail/releases/latest/download/checksums.txt`,
pick the archive matching this machine's operating system and architecture —
`darwin_arm64`, `darwin_amd64`, `linux_amd64`, or `linux_arm64` — and download
it from that same `releases/latest/download/` prefix. Verify it with `shasum -a
256 --ignore-missing -c checksums.txt` on macOS or `sha256sum --ignore-missing
-c checksums.txt` on Linux. Extract `gr` into `~/.local/bin`: that one write
outside this repository is expected, and the binary has to stay there because
the session hooks record its absolute path. Then run `~/.local/bin/gr init` in
the repository root. If its report says anything is not ignored by git — the
settings path it registers the hooks in, or the marker file — re-run with
`~/.local/bin/gr init --fix-gitignore`, which adds those entries. If it says no
supported scaffold was detected, tell me that verbatim without guessing why: the
harness is still installed, and the diagnosis will report the attachment as
missing for that reason rather than because anything failed. Finally run
`~/.local/bin/gr doctor` and show me its output verbatim. Apart from
`~/.local/bin/gr`, Goalrail's own state directory at
`~/.local/state/goalrail` — which `gr doctor` writes its update-check cache
into — and a scratch download directory you clean up, do not edit any file
outside this repository.
```

The last step matters: the agent proves the installation rather than claiming it.

That wording is not authored here. It is copied from the product's README, where
two live agent runs settled it, and a check in this repository's CI fails when
the two diverge.

## By hand

Download the archive for your platform from the latest release, verify it
against `checksums.txt`, and put `gr` somewhere it will stay: `gr init` records
that exact path in the hooks it registers, so a binary left in a downloads
folder stops working the day you tidy up. The commands, the platform table, and
what macOS does to an archive downloaded through a browser are in the
[README](https://github.com/heurema/goalrail#install).

Then, in the repository you want it in:

```sh
gr init
```

### Or with Go

```sh
go install github.com/heurema/goalrail/cmd/gr@latest
```

This route needs a Go toolchain. The download above does not.

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
