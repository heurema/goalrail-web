# Commands

## `gr init`

Installs the harness in one repository: the OpenSpec overlay carrying the
Goalrail schema, the participation marker, and the session hooks where the
scaffold's settings layer allows it. Reports what it created, what it changed,
what it left alone, and the pinned invocation the repository is now driven by.

Repeating it changes nothing. Re-running it repairs a registration that is
stale, unscoped, or naming an event this arrangement supersedes.

| Flag | Effect |
|---|---|
| `--repo <path>` | repository to initialize, default the working directory |
| `--scaffold <name>` | override detection |
| `--fix-gitignore` | add the ignore entries the registration and marker need |
| `--confirm-schema-switch` | adopt a configuration that names another custom schema |

## `gr doctor`

One diagnosis of the harness in this repository: attachment state per scaffold,
overlay drift reported per file, whether the overlay is behind the canon the
binary carries, whether the runtime the stock OpenSpec CLI needs is present, and
one line for observability.

```
goalrail 0.1.0 — ~/code/acme-api
harness: working
overlay: current (sha256:12cf770f…)
claude-code: active (repository scope)
openspec cli: available
observability: not configured (optional)
```

Every state that is not working names its next action, and every action names a
command this tool accepts. Optional absences — no Node runtime, no observability
— are stated as facts and never make the verdict unhealthy.

Exit status: `0` healthy, `1` a harness problem you can act on, `2` the check
itself did not run. `--json` emits the same report for a machine.

`gr health` still works and names its successor.

## `gr update`

Brings this repository's overlay up to what the installed binary carries.
Verifies the result by digest rather than assuming the writes succeeded, reports
every file it rewrote and which canon it moved from, and keeps the replaced
files under the state root so the previous state is recoverable.

A local edit stops it. It names the drifted files and changes nothing;
`--discard-local-edits` proceeds and says that it discarded them.

It does not update the `gr` binary, and makes no network request.

## `gr connect` / `gr disconnect`

`connect` attaches a scaffold that can only register at user scope; it needs
`--yes`. For a scaffold that registers inside the repository it writes nothing
and points at `gr init`.

`disconnect` removes every registration, in whichever scope it lives, and leaves
entries it did not add untouched.

## `gr version`

The binary's version and the overlay it carries. Nothing about a repository is
decided by reading it — currency is decided by comparing digests.
