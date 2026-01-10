# DinhXuanKhuong.github.io

## Run locally

- Python: `python3 -m http.server 8000` then open `http://localhost:8000/`
- Node: `npx serve .`

## Publish (GitHub Pages)

- Push this repo to GitHub
- In GitHub: **Settings → Pages → Build and deployment**
	- Source: **Deploy from a branch**
	- Branch: `main` (root)

## Enable the contact form (Formspree)

This site is static, so the contact form uses Formspree.

1. Create an account at https://formspree.io/
2. Create a new form and copy your endpoint (looks like `https://formspree.io/f/xxxxxxx`)
3. Open [contact.html](contact.html) and replace:
	 - `https://formspree.io/f/YOUR_FORM_ID`
	 with your real endpoint
4. Commit + push. The form will redirect to [thanks.html](thanks.html) after submit.

## Pin favorite repos on the Projects page

Open [projects.html](projects.html) and set the repo names here:

- `data-featured="repo1, repo2, repo3"`

If you leave it empty, the site will automatically feature your top-starred repos.