// Strings for the current page, inlined by scripts/build-pages.mjs as <script id="i18n">.
const el = document.getElementById("i18n");
export const t = JSON.parse(el.textContent);
export const root = document.documentElement.dataset.root || "./";

const current = t.languages.find((l) => l.code === t.current);
export const langHref = (to, file = "") => `${root}${to.slug ? `${to.slug}/` : ""}${file}`;
export { current };
