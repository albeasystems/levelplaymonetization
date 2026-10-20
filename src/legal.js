import "@fontsource-variable/geist";
import "@fontsource-variable/geist-mono";
import "./index.css";

// Language menu (a <details>): close on outside click or Escape.
const menu = document.querySelector("details.lang-menu");
if (menu) {
  document.addEventListener("click", (e) => {
    if (menu.open && !menu.contains(e.target)) menu.open = false;
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") menu.open = false;
  });
}
