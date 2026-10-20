import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { AppleLogo, Globe, CaretDown } from "@phosphor-icons/react";
import { t, langHref, current } from "./i18n.js";

export const APP_STORE_URL = "https://apps.apple.com/app/id6819292116";
export const EASE = [0.16, 1, 0.3, 1];

/* Device frame: the screenshots already include the Dynamic Island and status bar,
   so the frame is only a bezel. Radii are percentages so it scales with width. */
export function Phone({ src, alt, className = "", eager = false }) {
  return (
    <div
      className={`aspect-[1242/2688] bg-[#1d2128] p-[2.2%] shadow-[0_44px_80px_-28px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.07)] ${className}`}
      style={{ borderRadius: "13% / 6%" }}
    >
      <img
        src={src}
        alt={alt}
        width="780"
        height="1688"
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className="block h-full w-full bg-white object-cover"
        style={{ borderRadius: "11% / 5.1%" }}
      />
    </div>
  );
}

export function Reveal({ children, delay = 0, className = "", as = "div" }) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </Tag>
  );
}

export function StoreButton({ className = "", compact = false }) {
  return (
    <a
      href={APP_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2.5 whitespace-nowrap rounded-control bg-accent font-medium text-white transition-[transform,background-color] duration-200 hover:bg-[#1f4ec9] active:translate-y-px active:scale-[0.98] ${
        compact ? "h-11 px-3 text-sm min-[480px]:px-4" : "h-12 px-5 text-[15px]"
      } ${className}`}
    >
      <AppleLogo size={compact ? 18 : 20} weight="fill" aria-hidden="true" />
      <span className={compact ? "sr-only min-[480px]:not-sr-only" : undefined}>{t.ui.getApp}</span>
    </a>
  );
}

/* Language switcher: a plain <details> menu of real links, one per language page. */
export function LangMenu() {
  const ref = useRef(null);
  useEffect(() => {
    const close = (e) => {
      if (ref.current?.open && (e.type === "keydown" ? e.key === "Escape" : !ref.current.contains(e.target))) ref.current.open = false;
    };
    document.addEventListener("click", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("click", close);
      document.removeEventListener("keydown", close);
    };
  }, []);
  return (
    <details ref={ref} className="relative">
      <summary
        aria-label={t.ui.language}
        className="flex h-11 cursor-pointer list-none items-center gap-1.5 rounded-control border border-line px-3 text-sm text-text transition-colors hover:bg-surface-2 [&::-webkit-details-marker]:hidden"
      >
        <Globe size={18} aria-hidden="true" />
        <span lang={current.htmlLang} className="min-[560px]:hidden">{(current.slug || "en").toUpperCase()}</span>
        <span lang={current.htmlLang} className="hidden min-[560px]:inline">{current.name}</span>
        <CaretDown size={12} weight="bold" aria-hidden="true" className="text-muted" />
      </summary>
      <ul className="absolute end-0 top-full z-50 mt-2 max-h-[70vh] w-56 overflow-auto rounded-2xl border border-line bg-surface p-2 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.8)]">
        {t.languages.map((l) => (
          <li key={l.code}>
            <a
              lang={l.htmlLang}
              hreflang={l.htmlLang}
              href={langHref(l)}
              aria-current={l.code === t.current ? "true" : undefined}
              className={`flex min-h-11 items-center justify-between gap-4 rounded-lg px-3 text-[15px] transition-colors hover:bg-surface-2 ${
                l.code === t.current ? "text-text" : "text-muted"
              }`}
            >
              {l.name}
              {l.code === t.current && (
                <span aria-hidden="true" className="num text-accent-text">•</span>
              )}
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}
