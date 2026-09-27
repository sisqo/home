# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Personal site for sisqo.dev, deployed on Vercel (project `home`). Two halves:

- **Home page**: `index.html` at the repo root, hand-written and fully self-contained (inline `<style>` and `<script>`, no build step).
- **Blog**: generated into `/blog/` from Markdown in `posts/` by `scripts/build-blog.mjs`. `/blog/` is gitignored build output; never edit it by hand.

## Commands

```bash
npm run build     # regenerate blog/ (post pages, blog/index.html, blog/rss.xml)
npm run preview   # build, then serve the repo root with `npx serve .`
```

There are no tests or linter. Vercel runs `npm run build` and serves the repo root as-is (`vercel.json`: `framework: null`, `outputDirectory: "."`).

## Blog pipeline

- Posts are `posts/YYYY-MM-DD-slug.md`. The slug comes from the filename (date prefix stripped) unless frontmatter sets `slug`. The post is served at `/blog/<slug>`.
- Required frontmatter: `title`, `date`, `excerpt`. Optional: `tags` (array), `draft: true` (skipped), `slug`. A post missing a required field or with a bad date is **skipped with a warning**, not a build failure, so check the build output.
- `templates/post.html` and `templates/index.html` are plain `{{PLACEHOLDER}}` templates filled by `render()` in the build script. The post-row markup for the blog index and the RSS items are built as strings inside `build-blog.mjs`, not in the templates.
- Code blocks are highlighted at build time with highlight.js (`hljs language-*` classes).
- The build wipes `blog/` before writing, so anything else put there is lost.

## Shared styling between home and blog

The home page and blog don't share a stylesheet. `assets/blog.css` mirrors the design tokens (`:root` paper/ink/accent palette, Space Grotesk + JetBrains Mono) and header/footer chrome from the inline styles in `index.html`, and `assets/blog.js` duplicates the `[data-reveal]` scroll-reveal script. When you change the visual language on one side, update the other to match. The header/footer markup is also duplicated across `index.html`, `templates/index.html` and `templates/post.html`.

## Home page projects section

Project cards in `index.html` are grouped under `.cat` category headers (Web app, Web sites, Knowledge). Both the per-category count in the header and each card's `.project-num` are hard-coded, so adding, removing or reordering a card means renumbering by hand.

## Design review

The `impeccable` skill's hook runs on edits to design files here (its cache is in `.impeccable/`). It keeps flagging em-dash overuse in `index.html` body text, so avoid adding more em-dashes to copy.
