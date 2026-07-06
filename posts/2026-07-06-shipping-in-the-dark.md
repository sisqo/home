---
title: "Shipping in the Dark"
date: 2026-07-06
excerpt: "Notes on building without knowing if anyone will ever open the thing — and why I keep doing it anyway."
tags: [writing, process]
draft: false
---

Most of what I've shipped over the last thirty years has gone out into silence. No launch party, no press release, just a `git push` and whatever happens next. Most of the time, nothing happens. And that's fine — that's the job.

## The gap between deploy and feedback

There's a stretch of time between pushing code and finding out whether it mattered, and it can last anywhere from a few seconds to a few years. Early in my career that gap used to terrify me. Now I mostly ignore it, because worrying about it doesn't shrink it.

What actually helps is having a short, boring feedback loop for the things I *can* verify immediately:

- Does it build?
- Does it deploy?
- Does the thing I just wrote actually run, on the actual infrastructure it'll run on?

Everything past that — whether someone opens it, whether it's useful, whether it was worth building at all — happens on its own schedule, not mine.

## A small ritual

Before any deploy that matters, I run the same three checks, roughly in this order:

```bash
# the only three commands that have ever mattered
npm run build
npx serve .
curl -I https://example.com/health
```

Nothing clever. But `curl -I` against a health endpoint has caught more of my own mistakes than any amount of staring at a diff before merging.

## Why keep doing it

Because the alternative — waiting for certainty before shipping — doesn't actually remove risk, it just relocates it to a later, more expensive moment. I'd rather find out today that something is broken than find out in three months that nobody ever saw it because it was never sent.

Three decades of `git push && pray` have taught me exactly one thing worth writing down: shipping in the dark is still shipping. Waiting for the lights to come on is not.
