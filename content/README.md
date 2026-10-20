# Site languages and screenshots

The site is served in 12 languages, one URL per language: English at the root, the rest under
`/es/ /de/ /fr/ /it/ /pt/ /ar/ /hi/ /zh/ /ja/ /ko/ /vi/` (same set as the app).

- Text lives in `content/<code>/`: `site.json` (UI + every landing string) and `privacy.html`, `terms.html`,
  `support.html` (front matter + body). English is the source of truth.
- `scripts/build-pages.mjs` generates the HTML pages (git-ignored) and runs before `dev` and `build`.
- `npm run check` verifies every language has the same structure as English and no untranslated strings.
- Set `SITE_URL=https://your.domain npm run build` to emit `hreflang` and canonical links (they need absolute URLs).
- Screenshots are real app captures per language: `scripts/capture-shots.sh [lang ...]` drives a DEBUG build in the
  iOS Simulator (launch args `-app_language`, `-debugTab`, `-debugScroll`, ... see `RootView.swift`) and writes
  `raw-shots/<code>/<name>.png`; `npm run shots` turns them into `public/shots/<folder>/<name>.webp`.
