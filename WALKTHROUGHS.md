# Living ASCII Art — Walkthroughs Guide

This repository is a live, auto-updating ASCII-art tech dashboard.
Bookmark: https://chrisalunlloyd2-sudo.github.io/living-ascii-art/

## How to Add a New Walkthrough

1. Edit `scripts/fetch_data.py`.
2. Append a new object to the `walkthroughs` list inside `load_cached_data()`.
3. Use this schema:

```json
{
  "id": "unique-slug",
  "title": "Human-Readable Title",
  "category": "AI Tools | System Tools | Model Optimization | Developer Workflow",
  "difficulty": "Beginner | Intermediate | Advanced",
  "description": "2-3 sentences explaining what the reader will learn.",
  "steps": [
    "Step 1 with optional `inline code`",
    "Step 2..."
  ],
  "related_links": [
    "https://example.com/docs"
  ]
}
```

4. Run `python3 scripts/fetch_data.py` locally to regenerate `data.json`.
5. Commit and push:

```bash
git add -A
git commit -m "Add walkthrough: <title>"
git push origin main
```

6. GitHub Pages will rebuild within ~1-2 minutes. Hard-refresh the live page.

## Current Walkthroughs

| ID | Title | Category | Difficulty |
|----|-------|----------|------------|
| openai-manager | OpenAI Manager Setup | AI Tools | Beginner |
| proot-sandbox | Proot Sandbox Management | System Tools | Intermediate |
| gguf-quantization | GGUF v3 Quantization | Model Optimization | Advanced |
| code-assist-clis | Install All Code-Assist CLIs | Developer Workflow | Beginner |

## Cache Busting

If you update `app.js` and the browser shows a stale/cached version, bump the query string in `index.html`:

```html
<script src="app.js?v=2"></script>
```

Then push.

## Auto-Update Schedule

The `.github/workflows/update.yml` runs every 5 minutes and calls `scripts/fetch_data.py` to refresh `data.json` with the latest static news/project data.


## How to Submit a Product Review via Aegis

1. Send Aegis plain-English notes about the product.
2. Aegis expands them into `reviews/{product-slug}.md` using the template in `reviews/review-template.md`.
3. Aegis commits the markdown file and regenerates `data.json`.
4. The site renders the review automatically on the next `data.json` refresh.

Current reviews: Kai 9000, OpenClaw, Claude, Google Antigravity, Hermes.
