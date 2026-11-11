# Dinh Xuan Khuong — personal website

A Markdown-based blog, project portfolio, and poetry archive built with [Eleventy](https://www.11ty.dev/). The shared layouts preserve the site's academic design. Adding content updates its archive automatically; the homepage always shows the latest published blog post.

## Start locally

Use Node.js 22 or newer. Install dependencies once, then start the preview:

```sh
npm ci
npm run dev
```

Open [localhost:8000](http://localhost:8000). Saving a source file rebuilds the site and refreshes the preview. Stop the server with Ctrl+C. The previous Python server is no longer needed.

## Add a post, poem, or project

```sh
npm run new -- post "My next learning note"
npm run new -- poem "Điều anh muốn nói"
npm run new -- project "My new project"
```

Each command creates a Markdown file in `src/content/`. Open the file, replace the starter text and description, then set `draft: false` when ready. New files start as drafts and stay out of the built website. No archive or navigation edits are needed.

See [the writing guide](docs/WRITING.md) for examples, images, code blocks, project links, poem line breaks, and publishing instructions.

## Folder guide

```text
src/
  content/
    posts/           Blog posts (.md)
    poems/           Poems (.md)
    projects/        Project descriptions (.md)
  _data/
    site.json        Name, email, social links, footer
    navigation.json  Shared navigation
  _includes/
    layouts/         Shared page and article layouts
    partials/        Header, footer, archive entry
  assets/            Stylesheet, profile picture, favicon, uploaded images
  index.njk          Homepage introduction and sections
  *.njk              Archive pages, life goals, publications, and 404
scripts/             Content creator, clean build, link checker
tests/              Authoring and content-generation checks
docs/               Writing guide
design/             Original Stitch references, excluded from the built website
_site/               Generated website; ignored by Git, never edit directly
```

The `.11tydata.js` file in each content folder supplies its shared layout and URL rules. You only need to add Markdown files beside it. Existing public URLs such as `/blog.html` and `/posts/2026-01-10-welcome.html` are preserved.

## Common changes

- **Introduction or photo caption:** `src/index.njk`.
- **Email and profile links:** `src/_data/site.json`.
- **Menu links:** `src/_data/navigation.json`.
- **Fonts, layout, and colors:** `src/assets/site.css`.
- **Shared page structure:** `src/_includes/layouts/base.njk`.
- **Life goals and publications:** the corresponding `src/*.njk` file.

## Check and build

```sh
npm test
npm run check
```

The checks cover automatic archives, the latest-post selection, draft exclusion, Unicode poems, stable URLs, and local links. `npm run build` produces a fresh `_site/` folder. A clean build removes old pages when content is deleted or changed back to draft. During a live preview, restart `npm run dev` after deleting, renaming, or unpublishing an entry to clear any stale preview output.

## Publish to GitHub Pages

One-time setup in the repository: **Settings → Pages → Build and deployment → Source → GitHub Actions**. The included workflow then tests, builds, and deploys `_site/` when changes are pushed to `main`. Pull requests run checks without deploying.

Commit the source files and `package-lock.json`. Do not commit `node_modules/` or `_site/`. The workflow and instructions are prepared; this refactor has not changed the repository's online settings or pushed a deployment.
