# Corrections

A tool that promises never to guess has a problem no wording solves: every
project says it is careful, and saying it costs nothing. What costs something is
naming the times the promise failed.

Three claims Goalrail published reached users and turned out to be false. Each
is dated, each is still in the repository with the change that corrected it, and
none was quietly rewritten. They are listed here because a reader deciding
whether to trust a report should be able to check what happened when a report
was wrong.

This is not the whole list of things the project got wrong. It is the list of
things it got wrong **in public**. Mistakes caught before they reached anyone —
a measurement overstated by a factor of two, a blocker that turned out not to
exist, a warning about macOS quarantine that live testing disproved before it
shipped — stay recorded in
[the change archive](https://github.com/heurema/goalrail/tree/main/openspec/changes/archive),
where they can be read in full. Counting those here would inflate the number
with work that went the way it was supposed to.

## The install prompt did not survive its first agent

**2026-07-30.** The README's agent-facing prompt told an agent what to do "if it
refuses to register the session hooks". Initialization does not refuse there: it
succeeds, exits 0, and prints a notice. Two agents were given the prompt verbatim
on a machine with no Go toolchain and forbidden to read any documentation. The
first reported the defect in its own words:

> The first `gr init` did not actually fail (exit 0) — it succeeded but printed a
> notice about the marker. I treated that notice as the trigger condition
> described in the task.

The prompt also named one of the two things initialization can report about
git-ignoring, and said nothing about a machine with no scaffold configured —
leaving the agent to show a diagnosis that reads like a failed install when
nothing had failed.

Both sentences were rewritten and a second run was made under identical bounds,
the same day. The correction reached the main line in
[`c498146`](https://github.com/heurema/goalrail/commit/c498146), which replaces
the sentence above with the one the prompt carries now.

## A promoted requirement generalized from one provider

**2026-07-30.** A published requirement recorded that registering hooks inside a
repository is externally blocked. That was a true observation about one
provider, where project-local hooks are silently skipped behind a trust gate. It
was written as a property of attachment in general, and it is not: for another
scaffold, project-level hooks are an ordinary settings layer that merges with
user settings.

The requirement was promoted — it was part of the published contract, not a
draft. Corrected in
[`d2563ba`](https://github.com/heurema/goalrail/commit/d2563ba).

## The update check reported "nothing newer" while newer existed

**2026-07-31.** `v0.1.2` shipped a step that warms the answer the update check
reads, so a new release becomes visible quickly instead of after an unbounded
wait. It warmed the wrong answer: the step requested one endpoint and the
diagnosis reads another, each with its own cache.

Observed live: between 09:34:38Z and about 09:37 the check reported `nothing
newer` while a newer release already existed. The claim behind the design —
"about a minute" — had been measured about ingest and was read as though it were
about the check.

This one is the sharpest of the three, because the guarantee it broke is the one
this project sells: a report never claims more than it verified. Corrected in
[`4376c92`](https://github.com/heurema/goalrail/commit/4376c92), the following
day, and the remaining floor is now the endpoint's own cache rather than
discovery — measured at the next release rather than asserted here.

## Why the count is three

An earlier draft of this page was going to be built on two examples, and one of
them was wrong: the macOS quarantine claim never reached a published document.
It was disproved by live testing while the documentation was still being
written, which is the process working rather than failing.

The number here is counted, not estimated. If it grows, this page grows.
