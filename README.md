# Dinh Xuan Khuong — personal blog

A clean, static personal blog based on the academic archive designs in `stitch_academic_research_portfolio_site/`. The original design exports are kept intact for reference. The working website lives at the repository root, ready for GitHub Pages.

## Local preview

Run `python3 -m http.server 8000 --bind 127.0.0.1` from this folder, then open http://localhost:8000. No installation or build is needed.

## Structure

- `index.html` — introduction, interests, latest writing, and selected projects.
- `blog.html` — writing archive.
- `posts/` — individual articles; the original welcome post is retained.
- `projects.html` — selected repositories linked from the previous site.
- `publications.html` — publication archive, empty until real papers are added.
- `life-goals.html` — goals retained from the previous wishlist.
- `assets/` — shared stylesheet, favicon, and optimized personal photograph.
- `stitch_academic_research_portfolio_site/` — supplied design references, not the live site.

## Editing

Edit the HTML files directly. To add a post, copy the existing article, update its title, description, date, and body, then add a link in `blog.html` and the homepage’s latest-writing section. Keep shared navigation consistent across pages. All styling is in `assets/site.css`.

The site runs without JavaScript or a CSS framework. Google Fonts are optional; local fallback fonts keep it readable without a connection. No fictional academic affiliations, publications, or contact details from the design samples are included.

## GitHub Pages

Publish from the repository’s default branch, using **/(root)** in **Settings → Pages → Deploy from a branch**. No deployment has been made as part of this local rebuild.
