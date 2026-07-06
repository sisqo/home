import { readFileSync, readdirSync, mkdirSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const POSTS_DIR = join(ROOT, 'posts');
const TEMPLATES_DIR = join(ROOT, 'templates');
const OUT_DIR = join(ROOT, 'blog');

const marked = new Marked(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    },
  })
);

function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function pad(n) {
  return String(n).padStart(2, '0');
}

function formatDateDisplay(date) {
  return `${date.getUTCFullYear()}.${pad(date.getUTCMonth() + 1)}.${pad(date.getUTCDate())}`;
}

function slugFromFilename(filename) {
  const base = filename.replace(/\.md$/, '');
  const match = base.match(/^\d{4}-\d{2}-\d{2}-(.+)$/);
  return match ? match[1] : base;
}

function render(template, replacements) {
  let out = template;
  for (const [key, value] of Object.entries(replacements)) {
    out = out.replaceAll(`{{${key}}}`, value);
  }
  return out;
}

function loadPosts() {
  if (!existsSync(POSTS_DIR)) return [];
  const files = readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md'));
  const posts = [];

  for (const file of files) {
    try {
      const raw = readFileSync(join(POSTS_DIR, file), 'utf-8');
      const { data, content } = matter(raw);

      if (!data.title || !data.date || !data.excerpt) {
        throw new Error('missing required frontmatter field (title, date, excerpt)');
      }
      if (data.draft) continue;

      const date = data.date instanceof Date ? data.date : new Date(data.date);
      if (Number.isNaN(date.getTime())) {
        throw new Error(`invalid date "${data.date}"`);
      }

      const slug = data.slug || slugFromFilename(file);
      const tags = Array.isArray(data.tags) ? data.tags : [];

      posts.push({
        slug,
        title: data.title,
        excerpt: data.excerpt,
        tags,
        date,
        html: marked.parse(content),
      });
    } catch (err) {
      console.warn(`[build-blog] skipping "${file}": ${err.message}`);
    }
  }

  posts.sort((a, b) => b.date.getTime() - a.date.getTime());
  return posts;
}

function tagPills(tags) {
  return tags.map((t) => `<span class="stack-pill">${escapeHtml(t)}</span>`).join('');
}

function buildPostPage(post, postTemplate) {
  const html = render(postTemplate, {
    TITLE: escapeHtml(post.title),
    EXCERPT: escapeHtml(post.excerpt),
    SLUG: post.slug,
    DATE_ISO: post.date.toISOString(),
    DATE_DISPLAY: formatDateDisplay(post.date),
    TAG_PILLS: tagPills(post.tags),
    CONTENT: post.html,
  });

  const dir = join(OUT_DIR, post.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), html);
}

function buildIndexPage(posts, indexTemplate) {
  const rows = posts.length
    ? posts
        .map(
          (p) => `      <a class="post-row" href="/blog/${p.slug}">
        <span class="post-date">${formatDateDisplay(p.date)}</span>
        <span class="post-title">${escapeHtml(p.title)}</span>
        <span class="post-excerpt">${escapeHtml(p.excerpt)}</span>
        <span class="post-tags">${tagPills(p.tags)}</span>
      </a>`
        )
        .join('\n')
    : '      <div class="empty-state">nothing here yet. check back soon.</div>';

  const html = render(indexTemplate, { POST_ROWS: rows });
  writeFileSync(join(OUT_DIR, 'index.html'), html);
}

function buildRss(posts) {
  const items = posts
    .map(
      (p) => `    <item>
      <title>${escapeHtml(p.title)}</title>
      <link>https://sisqo.dev/blog/${p.slug}</link>
      <guid>https://sisqo.dev/blog/${p.slug}</guid>
      <pubDate>${p.date.toUTCString()}</pubDate>
      <description>${escapeHtml(p.excerpt)}</description>
    </item>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>SisQo Dev — Blog</title>
    <link>https://sisqo.dev/blog</link>
    <description>Personal notes and long-form writing from Francesco Limberti (SisQo).</description>
${items}
  </channel>
</rss>
`;
  writeFileSync(join(OUT_DIR, 'rss.xml'), xml);
}

function main() {
  rmSync(OUT_DIR, { recursive: true, force: true });
  mkdirSync(OUT_DIR, { recursive: true });

  const posts = loadPosts();
  const postTemplate = readFileSync(join(TEMPLATES_DIR, 'post.html'), 'utf-8');
  const indexTemplate = readFileSync(join(TEMPLATES_DIR, 'index.html'), 'utf-8');

  for (const post of posts) {
    buildPostPage(post, postTemplate);
  }
  buildIndexPage(posts, indexTemplate);
  buildRss(posts);

  console.log(`[build-blog] built ${posts.length} post(s) → blog/`);
}

main();
