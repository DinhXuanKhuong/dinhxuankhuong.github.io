# Writing and publishing

## The everyday workflow

1. Run `npm run new -- post "Your title"` (or use `poem` / `project`).
2. Open the new file under `src/content/` and write in Markdown.
3. Update the title, date, short description, and category at the top.
4. Set `draft: false` to include it in the site.
5. Preview with `npm run dev`; run `npm test` and `npm run check` before committing.
6. Push to `main` to publish after the one-time GitHub Pages setup in the README.

The creation command uses the date in Vietnam. To choose another date:

```sh
npm run new -- post "A learning note" --date 2026-11-11
```

Files are never overwritten by the command. You can also create Markdown files manually, following the examples below. Use a stable filename: it determines the URL. Changing the displayed title does not change the URL.

## Blog post

Create `src/content/posts/2026-11-11-my-learning-note.md`:

```markdown
---
title: "My learning note"
date: 2026-11-11
description: "One or two sentences describing the post."
category: Deep learning
draft: true
---

Start with the idea you want to share.

## What I learned

Write paragraphs, **bold text**, *italics*, and [links](https://example.com).

- An observation
- An experiment
- A question for next time
```

When you set `draft: false`, it appears at `/posts/2026-11-11-my-learning-note.html`. Blog entries are sorted newest first, and the latest one appears on the homepage automatically. Dates are required and are displayed in UTC so they do not shift by a day. A future date does not schedule publication: `draft` controls visibility.

Use fenced code blocks (three backticks, optionally followed by a language such as `python`). Template syntax such as `{{ example }}` inside Markdown is left untouched. Code blocks use a readable monospace style without a syntax-highlighting dependency.

## Equations

Add `math: true` to a post's front matter to load the math stylesheet. Use LaTeX notation with single dollar signs for inline math and double dollar signs on separate lines for display equations:

```markdown
The key dimension is $d_k$.

$$
\operatorname{Attention}(Q,K,V) = \operatorname{softmax}\left(\frac{QK^{\mathsf T}}{\sqrt{d_k}}\right)V
$$
```

KaTeX renders equations during the build, including accessible MathML. Fonts and styles are served locally; visitors do not need JavaScript for the equations. Invalid formulas stop the build so you can fix them before publishing. Keep programming examples in backticks or fenced code blocks; these are not rendered as math. Escape a literal dollar sign as `\$` when needed.

## Poem

Create `src/content/poems/2026-11-11-ten-bai-tho.md`:

```markdown
---
title: "Tên bài thơ"
date: 2026-11-11
description: "A short introduction to the poem."
category: Poetry
language: vi
draft: true
---

Dòng đầu tiên của bài thơ
Dòng thứ hai của bài thơ

Một khổ thơ mới
Bắt đầu sau một dòng trống
```

Each line stays on its own line; a blank line starts a new stanza. Vietnamese characters are supported in titles and text. Use `language: vi` for Vietnamese poems or `language: en` for English (the default). Published poems appear on the Poems page, newest first, and each has its own page.

To feature a published poem in the homepage’s **Selected poem** section, add `featured: true` to its front matter. Remove that field to stop featuring it.

## Project

Create `src/content/projects/my-project.md`:

```markdown
---
title: "My project"
date: 2026-11-11
description: "What the project does and why it matters."
category: Machine learning
repository: https://github.com/DinhXuanKhuong/my-project
# demo: https://example.com
# order: 1
draft: true
---

## Overview

Explain the problem and what you built.

## What I contributed

Describe your work, experiments, and results.
```

`repository` and `demo` are optional. Set `order: 1`, `order: 2`, etc. to pin projects in a chosen order; otherwise they appear after ordered projects, newest first. Each project automatically gets a detail page and an archive card. Projects remain off the homepage, as requested.

## Images

Put files in `src/assets/images/` and use a root-relative URL:

```markdown
![A clear description of the image](/assets/images/my-experiment.jpg)
```

Use `/assets/...` rather than a path relative to the article. That works from nested post, poem, and project pages. Images resize to the reading column.

## Drafts and deleting content

Use the boolean `draft: true`, without quotation marks. Drafts are excluded from archives, the homepage, and generated detail pages. To preview a draft locally, temporarily set it to `false`, then restore `true` before publishing if it is not ready.

Delete a content file to remove it. A fresh `npm run build` clears stale pages, including a formerly published page changed back to draft. Restart the local preview after deleting, renaming, or unpublishing content to clear old preview files. Keep filenames stable after sharing a URL.

## Layouts and shared data

Navigation, metadata, fonts, and the footer are defined once in `src/_includes/`. Name, email, and social links live in `src/_data/site.json`. Archive templates loop through the content collections, so adding a file does not require editing another page.

Original design exports live under `design/`; they are not shipped in `_site/`. Generated HTML is disposable output. Always edit `src/` instead.
