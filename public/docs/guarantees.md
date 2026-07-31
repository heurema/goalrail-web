# Guarantees

These are not marketing claims. Each one is a published requirement in the
project's own specifications, which live at
[openspec/specs](https://github.com/heurema/goalrail/tree/main/openspec/specs).

## Consent is never spent on your behalf

Trust is a standing consent to run a command in your own sessions. It is not
transferable, so a registration a commit could hand to a teammate is refused
rather than written — Goalrail names the reason and what would make it possible.

Initialization never modifies user-level scaffold configuration, for any reason,
including removing a registration left by an earlier arrangement. That removal
goes through the consented command that owns it.

## Trust is never forged

Goalrail does not write, compute, reproduce, or simulate a scaffold's hook-trust
record. That this is technically possible, and is practised by other
integrations, does not make it permissible: it would convert an explicit consent
into an assumed one.

Reading a trust record is observation and is allowed. Reporting one is not
claiming it still matches.

## A report never claims more than it verified

Where something could not be established, the report says so and names the gap.
Where a scaffold's behaviour was observed live, it is stated as observed; where
only the provider's documentation says it, that is stated as documentation.

Absent facts are reported as absent, not smoothed over.

## A line that rests on a network answer names its counterparty

One `gr` command reaches the network: the diagnosis, asking `proxy.golang.org`
whether a newer release exists. Initialization, the update command, the session
hooks, and the escalation loop reaching it would each violate this requirement.

Where a reported line rests on an answer from a network source, the report names
that source — so the disclosure is where you are, not only in documentation.
Where there is no answer and no counterparty, it names none.

The request discloses nothing that identifies the tool, its version, its
platform, the repository, or the invocation, and carries no query parameter: its
shape is the standard one the toolchain itself produces. A refusal you have
already given the toolchain is honoured rather than worked around, a dedicated
switch turns the check off on its own, and it never runs in continuous
integration.

## Sessions outside initialized repositories are not observed

The first act of every hook invocation is to check whether the directory is an
initialized repository. Everywhere else it exits immediately — reading nothing,
writing nothing, retaining nothing. The scaffold's event payload is not read
before that check passes, because a payload can carry prompts and transcript
paths.

## A malfunction never reaches your session

The background path is fail-quiet by contract. If Goalrail breaks, your session
starts, runs, and ends as if it were not installed.

The wrapper lifecycle is deliberately the opposite and stays fail-closed: a run
it cannot certify is refused.

## Nothing runs a toolchain you did not ask for

No `gr` command executes Node, a package runner, or the stock OpenSpec CLI. The
harness is inert repository content and the tool that manages it is one binary.
Validating and archiving changes uses that CLI — that dependency is your agent's,
and `gr doctor` reports it as a fact rather than enforcing it.
