# The loop

Goalrail exists for one moment: the one where an agent cannot do what was asked
and would otherwise guess.

## 1. A session opens

The hook tells the agent, in one fixed line, that this repository accepts one
escalation and where to write it. It names no provider, describes no task, and
suggests no conflict.

```text
This repository accepts one escalation.

If the work item cannot be completed as specified from this repository alone,
write the question to .goalrail/blocked.md and change nothing else in
the same act. The question is retained for the owner, who answers it as a new
intent version; the current session does not resume.

The payload format is goalrail.escalation/v0.
```

If a question from an earlier session is still sitting at that path, it is
archived out of the way first, so a stale question is never attributed to a new
session.

## 2. The agent stops

Faced with something it cannot settle — contradictory requirements, a decision
that is not its to make — it writes the question and changes nothing else.

```markdown
# Blocked: requirements.md specifies contradictory empty-list behaviour

- REQ-1 states Validate must reject an empty list and return an error.
- REQ-2 states Validate must accept an empty list and return no error.

A single implementation cannot both return an error and return nil for the
same input.

## Question for the owner

Which behaviour is authoritative for an empty list — reject with an error
(REQ-1) or accept with nil (REQ-2)?
```

That example is verbatim from a live run, not an illustration.

## 3. The question is kept

At the end of the session the question is retained outside the repository, in
the state root, with its own identity, its digest, the session reference, and
the intent it belongs to. Deleting the file from your working tree afterwards
loses nothing.

Two sessions asking a byte-identical question keep separate records, so each can
be answered on its own.

If no single active confirmed intent can be identified, the record is kept
unbound with an explicit reason rather than bound by guessing.

## 4. You answer

By confirming a new version of the intent, citing the question's identifier. The
next session works from that version.

There is no dialogue, no acknowledgement, and no resume. That is deliberate: a
second answering mechanism would be a second source of truth.

## What failure looks like

Nothing. A malfunction in the background path is a silent no-op toward your
session: it starts, runs, and ends exactly as if Goalrail were not installed.
Errors worth keeping are written to the state root, where `gr doctor` and you
can read them later.
