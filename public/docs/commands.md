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
binary carries, whether the runtime the stock OpenSpec CLI needs is present, one
line for observability, and whether a newer release exists.

```
goalrail v0.1.2 — ~/code/acme-api
harness: working
overlay: current (sha256:12cf770fb566fd4ae7bbb9d8299064cbbe9d61386c5676850a2d8f329c5ee4ad)
codex: not active (user scope)
claude-code: active (repository scope)
openspec cli: available (needed for validating and archiving changes with the stock OpenSpec CLI)
observability: not configured (optional)
update: nothing newer than v0.1.2 found as of 2026-07-31T12:13:08Z (asked proxy.golang.org)
invocation: OPENSPEC_TELEMETRY=0 npx --yes @fission-ai/openspec@1.6.0 new change <name> --schema goalrail-intent
```

Captured from gr v0.1.2 on 2026-07-31; only the repository path is substituted.

Every state that is not working names its next action, and every action names a
command this tool accepts. Optional absences — no Node runtime, no observability
— are stated as facts and never make the verdict unhealthy.

### What leaves your machine

The `update:` line is the one place any `gr` command reaches the network. It
makes a single request to `proxy.golang.org` — the same service `go install`
already asks about this module — for the newest released version, and it names
that service in the report rather than only here.

The request's one disclosure is the module path it is asking about. It carries
no version, no platform, no repository, no query parameter, and no header the Go
toolchain would not send for the same module. The answer is remembered for a
day, and a binary that is not itself a release never asks, because there would
be nothing to conclude.

It does not ask at all where you have already said no. If your environment
directs module lookups away from the public proxy, or excludes this module from
it, that answer is read and honoured; the check also never runs in continuous
integration. Either of these turns it off on its own:

```sh
export GR_NO_UPDATE_CHECK=1        # this check only
go env -w GOPROXY=off              # every module lookup on this machine
```

Where the check is declined or fails, the report says which — a decline and a
failure are never printed as the same thing.

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

It does not update the `gr` binary, and makes no network request of its own.
The diagnosis is the only command that reaches the network, and only for the
update check described above; initialization, this command, the session hooks,
and the escalation loop reaching it would each violate a published requirement.

## `gr connect` / `gr disconnect`

`connect` attaches a scaffold that can only register at user scope; it needs
`--yes`. For a scaffold that registers inside the repository it writes nothing
and points at `gr init`.

`disconnect` removes every registration, in whichever scope it lives, and leaves
entries it did not add untouched.

## `gr version`

The binary's version and the overlay it carries. Nothing about a repository is
decided by reading it — currency is decided by comparing digests.
