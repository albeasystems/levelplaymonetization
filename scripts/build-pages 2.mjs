// Generates one set of static pages per language from content/<code>/.
//   content/<code>/site.json            UI strings and every landing page string
//   content/<code>/{privacy,terms,support}.html   legal pages (front matter + body)
// English is served from the site root, every other language from /<slug>/.
// Output (git-ignored): index.html, privacy.html, terms.html, support.html and <slug>/*.html.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const web = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const LANGUAGES = [
  { code: "en", slug: "" },
  { code: "es", slug: "es" },
  { code: "de", slug: "de" },
  { code: "fr", slug: "fr" },
  { code: "it", slug: "it" },
  { code: "pt", slug: "pt" },
  { code: "ar", slug: "ar" },
  { code: "hi", slug: "hi" },
  { code: "zh-Hans", slug: "zh" },
  { code: "ja", slug: "ja" },
  { code: "ko", slug: "ko" },
  { code: "vi", slug: "vi" },
];
const PAGES = ["privacy", "terms", "support"];
const SITE_URL = (process.env.SITE_URL || "").replace(/\/$/, "");

const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const read = (code, file) => readFileSync(resolve(web, "content", code, file), "utf8");

const sites = Object.fromEntries(LANGUAGES.map((l) => [l.code, JSON.parse(read(l.code, "site.json"))]));
const languages = LANGUAGES.map((l) => ({ ...l, name: sites[l.code].name, htmlLang: sites[l.code].htmlLang }));

const rootOf = (l) => (l.slug ? "../" : "./");
const hrefTo = (from, to, file) => `${rootOf(from)}${to.slug ? `${to.slug}/` : ""}${file}`;
const pathOf = (l, file) => `${l.slug ? `${l.slug}/` : ""}${file}`;

function alternates(file) {
  if (!SITE_URL) return "";
  const link = (hreflang, l) => `    <link rel="alternate" hreflang="${hreflang}" href="${SITE_URL}/${pathOf(l, file)}" />`;
  return [
    ...languages.map((l) => link(l.htmlLang, l)),
    link("x-default", languages[0]),
    `    <link rel="canonical" href="__CANONICAL__" />`,
  ].join("\n");
}

function langMenu(l, file, ui) {
  const items = languages
    .map((m) => {
      const cur = m.code === l.code ? ' aria-current="true"' : "";
      return `<li><a lang="${m.htmlLang}" hreflang="${m.htmlLang}" href="${hrefTo(l, m, file)}"${cur} class="flex min-h-11 items-center justify-between gap-4 rounded-lg px-3 text-[15px] transition-colors hover:bg-surface-2 ${m.code === l.code ? "text-text" : "text-muted"}">${m.name}${m.code === l.code ? '<span aria-hidden="true" class="num text-accent-text">•</span>' : ""}</a></li>`;
    })
    .join("");
  return `<details class="lang-menu relative">
          <summary aria-label="${esc(ui.language)}" class="flex h-11 cursor-pointer list-none items-center gap-1.5 rounded-control border border-line px-3 text-sm text-text transition-colors hover:bg-surface-2 [&::-webkit-details-marker]:hidden">
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 256 256" fill="currentColor"><path d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm88 104a87.6 87.6 0 0 1-3.33 24h-38.51a157.4 157.4 0 0 0 0-48h38.51a87.6 87.6 0 0 1 3.33 24ZM102 168h52a115.1 115.1 0 0 1-26 45 115.1 115.1 0 0 1-26-45Zm-3.9-16a140.8 140.8 0 0 1 0-48h59.8a140.8 140.8 0 0 1 0 48ZM40 128a87.6 87.6 0 0 1 3.33-24h38.51a157.4 157.4 0 0 0 0 48H43.33A87.6 87.6 0 0 1 40 128Zm114-40h-52a115.1 115.1 0 0 1 26-45 115.1 115.1 0 0 1 26 45Zm52.33 0h-34.15a132.3 132.3 0 0 0-25.57-41.71A88.4 88.4 0 0 1 206.37 88ZM108.4 46.29A132.3 132.3 0 0 0 82.82 88H48.63a88.4 88.4 0 0 1 59.77-41.71ZM48.63 168h34.19a132.3 132.3 0 0 0 25.58 41.71A88.4 88.4 0 0 1 48.63 168Zm99 41.71A132.3 132.3 0 0 0 173.18 168h34.19a88.4 88.4 0 0 1-59.74 41.71Z"/></svg>
            <span lang="${sites[l.code].htmlLang}" class="min-[560px]:hidden">${(l.slug || "en").toUpperCase()}</span>
            <span lang="${sites[l.code].htmlLang}" class="hidden min-[560px]:inline">${sites[l.code].name}</span>
            <svg aria-hidden="true" width="12" height="12" viewBox="0 0 256 256" fill="currentColor" class="text-muted"><path d="M213.66 101.66l-80 80a8 8 0 0 1-11.32 0l-80-80a8 8 0 0 1 11.32-11.32L128 164.69l74.34-74.35a8 8 0 0 1 11.32 11.32Z" stroke="currentColor" stroke-width="16"/></svg>
          </summary>
          <ul class="absolute end-0 top-full z-50 mt-2 max-h-[70vh] w-56 overflow-auto rounded-2xl border border-line bg-surface p-2 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.8)]">${items}</ul>
        </details>`;
}

function shell(l, file, { title, description, body, scripts = "", extraHead = "" }) {
  const ui = sites[l.code].ui;
  return `<!doctype html>
<html lang="${sites[l.code].htmlLang}" dir="${sites[l.code].dir}" data-root="${rootOf(l)}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}" />
    <meta name="color-scheme" content="dark" />
    <meta name="theme-color" content="#0c0e11" />
${extraHead}
    <link rel="icon" type="image/png" href="${rootOf(l)}favicon.png" />
    <link rel="apple-touch-icon" href="${rootOf(l)}apple-touch-icon.png" />
${alternates(file).replace("__CANONICAL__", `${SITE_URL}/${pathOf(l, file)}`)}
${scripts}
  </head>
${body}
</html>
`;
}

function legalPage(l, page) {
  const raw = read(l.code, `${page}.html`);
  const m = raw.match(/^---\ntitle: (.*)\ndescription: (.*)\n---\n([\s\S]*)$/);
  if (!m) throw new Error(`${l.code}/${page}.html: bad front matter`);
  const [, title, description, main] = m;
  const ui = sites[l.code].ui;
  const link = (id, label) =>
    `<a class="rounded-control px-1.5 py-3 max-[380px]:text-xs sm:px-3 ${id === page ? "text-text" : "transition-colors hover:text-text"}" href="./${id}.html"${id === page ? ' aria-current="page"' : ""}>${label}</a>`;
  const foot = (id, label) => `<a class="py-2 transition-colors hover:text-text" href="./${id}.html">${label}</a>`;
  const body = `  <body>
    <header class="sticky top-0 z-40 border-b border-line/70 bg-bg/90 backdrop-blur-md">
      <div class="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-4 sm:gap-4 sm:px-6">
        <a href="./" class="flex h-11 items-center gap-2.5 font-semibold tracking-tight">
          <img src="${rootOf(l)}favicon.png" alt="" width="28" height="28" class="size-7 rounded-[7px]" />
          <span class="hidden text-[15px] min-[440px]:inline">levelplaymonetization</span>
          <span class="sr-only min-[440px]:hidden">${esc(ui.home)}</span>
        </a>
        <div class="flex items-center gap-1">
          <nav aria-label="${esc(ui.navLegal)}" class="flex items-center text-[13px] text-muted sm:gap-1 sm:text-sm">
            ${link("privacy", ui.privacy)}
            ${link("terms", ui.terms)}
            ${link("support", ui.support)}
          </nav>
          ${langMenu(l, `${page}.html`, ui)}
        </div>
      </div>
    </header>

    <main class="legal">
${main.trimEnd().split("\n").map((x) => (x ? "      " + x : x)).join("\n")}
    </main>

    <footer class="border-t border-line">
      <div class="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-10 text-sm text-muted md:flex-row md:items-center md:justify-between">
        <p>${ui.disclaimer}</p>
        <nav aria-label="${esc(ui.navFooter)}" class="flex gap-5">
          ${foot("privacy", ui.privacy)}
          ${foot("terms", ui.terms)}
          ${foot("support", ui.support)}
        </nav>
      </div>
    </footer>
  </body>`;
  return shell(l, `${page}.html`, {
    title,
    description,
    body,
    scripts: `    <script type="module" src="/src/legal.js"></script>`,
  });
}

function landingPage(l) {
  const site = sites[l.code];
  const data = JSON.stringify({ ...site, current: l.code, languages }).replace(/</g, "\\u003c");
  return shell(l, "", {
    title: site.landing.title,
    description: site.landing.description,
    extraHead: `    <meta property="og:title" content="levelplaymonetization" />
    <meta property="og:description" content="${esc(site.landing.ogDescription)}" />
    <meta property="og:type" content="website" />
    <meta name="apple-itunes-app" content="app-id=6819292116" />`,
    scripts: `    <script id="i18n" type="application/json">${data}</script>`,
    body: `  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>`,
  });
}

export function generate() {
  const written = [];
  for (const l of LANGUAGES) {
    if (l.slug) mkdirSync(resolve(web, l.slug), { recursive: true });
    const out = (file, html) => {
      writeFileSync(resolve(web, pathOf(l, file)), html);
      written.push(pathOf(l, file));
    };
    out("index.html", landingPage(l));
    for (const p of PAGES) out(`${p}.html`, legalPage(l, p));
  }
  return written;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const files = generate();
  console.log(`Generated ${files.length} pages for ${LANGUAGES.length} languages.`);
}
