---
title: "The Two Claude Code Skills I Actually Reach For"
date: 2026-07-06
excerpt: "Out of everything Claude Code can do, two skills earn their keep on nearly every session: grill-me before I build, impeccable while I build."
tags: [tools, workflow]
draft: false
---

Claude Code ships with a growing pile of skills, and most of them I've opened once and forgotten about. Two, though, have quietly become part of how I actually work: **grill-me** and **impeccable**. Not because they're flashy, but because each one catches a specific class of mistake I used to only notice after it shipped.

## grill-me

Most bad decisions in a codebase aren't wrong because the code is wrong. They're wrong because a fork in the road got picked silently, without anyone stating the alternatives out loud. `grill-me` exists to stop that: it interviews you about a plan, one question at a time, walking down every branch of the decision tree until there's nothing left unstated.

The part that actually changes my behavior is that it doesn't just ask — it proposes a recommended answer for each question, so agreeing is one word and disagreeing forces you to say why. That asymmetry is the whole trick. It's much cheaper to catch "wait, should this be per-user or global?" as a two-line exchange before any code exists than to catch it three files deep into an implementation that assumed one answer.

```
Question — Should retries happen client-side or server-side?
Recommended: server-side, so a flaky client can't retry into a
duplicate charge. The client just polls status and shows progress.
```

I reach for it anywhere the "obvious" next step actually has two or three defensible shapes: API design, data modeling, anything with a migration attached. If there's only one sane way to do something, grilling myself about it is just friction. The skill is worth it exactly in proportion to how many forks the plan actually has.

## impeccable

If `grill-me` front-loads judgment before you build, `impeccable` back-loads it — it audits what you actually produced, specifically for frontend and design work. Part of it runs on demand as a full review; part of it runs automatically, as a hook that fires on every edit to a design-relevant file and flags patterns before you've even finished the session.

What makes it useful isn't that it enforces some house style. It's that it's tuned to catch a specific, recognizable smell: the stuff that reads as generated rather than designed. Gradient text slapped on a heading for no reason. A whole page in one font family with no hierarchy. Three em-dashes in a paragraph because that's the cadence a language model defaults to when nobody's steering it.

```
[impeccable] gradient-text — Gradient text is decorative rather than
meaningful, a common AI tell on headings. Use a solid color instead.
```

The useful discipline it forces is that a finding isn't automatically a defect — you have to actually look at it and decide: is this a real smell, or is it an intentional, already-established piece of the design system? Rubber-stamping every finding is as lazy as ignoring all of them. The tool's value is in making you look, not in making the decision for you.

## Why these two

Between the two, the pattern is: `grill-me` protects the decisions that are expensive to unmake once code exists on top of them. `impeccable` protects the details that are cheap to fix individually but, left unchecked, add up to work that quietly doesn't look cared for. Different failure modes, different point in the process, both cheaper to catch than to fix later — which is really the only bar a tool has to clear for me to keep reaching for it.
