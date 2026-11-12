# Updating your life goals

Edit **`src/life-goals.md`**. This is the only file you need for your list: the introduction, date, goals, notes, links, and progress all live there. The page layout and totals update automatically.

## Add a goal

Copy these lines into the `goals:` list, above the closing `---`:

```yaml
  - title: "Publish a collection of poems"
    progress: 0
```

Keep the indentation shown. Use quotation marks around titles and notes, especially when they contain a colon. The order in the file is the numbered order on the page; adding or moving a goal updates the numbering automatically.

## Update progress

- `progress: 0` → ✗ Not yet
- `progress: 25` → ~ In progress (25% done)
- `progress: 100` → ✓ Completed

Use any number from 0 to 100. If omitted, progress defaults to 0. The overall total counts partial progress: one completed goal plus one goal at 50% gives **1.5 / 2**. Completed and in-progress counts are also calculated automatically.

## Add a note or link

```yaml
  - title: "Publish a collection of poems"
    progress: 25
    note: "I’ve finished the first few drafts."
    url: /poems.html
```

`note` and `url` are optional. A link can point to a page on your website (`/poems.html`) or an external site (`https://...`). The note appears below the goal; the title becomes the link. This also works for evidence of a completed goal:

```yaml
  - title: "Ship my first open-source project"
    progress: 100
    note: "Released in November 2026."
    url: https://github.com/DinhXuanKhuong
```

These are examples only; they are not added to your public list.

## Date and introduction

Change `updated: YYYY-MM-DD` at the top when you revise your list. It appears beside the progress total. Write the introduction in normal Markdown below the closing `---`.

## Preview and publish

1. Start `npm run dev` and open http://localhost:8000/life-goals.html.
2. Edit and save `src/life-goals.md`; the preview refreshes automatically.
3. Run `npm run check` before committing.
4. Commit and push as usual; GitHub Actions builds the updated page.

The public page displays your list. Editing the source file keeps the changes persistent and versioned in Git, without a separate login, database, or browser-only storage.
