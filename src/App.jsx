import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { List, X } from "@phosphor-icons/react";
import { Phone, Reveal, StoreButton, LangMenu, EASE } from "./ui.jsx";
import { t, root, langHref, current } from "./i18n.js";

const L = t.landing;
// Screenshots are captured from the app in each language (scripts/capture-shots.sh).
const shot = (name) => `${root}shots/${current.slug || "en"}/${name}.webp`;

const navLinks = [
  { href: "#privacy", label: L.nav.privacy },
  { href: "#breakdowns", label: L.nav.breakdowns },
  { href: "#tools", label: L.nav.tools },
  { href: "#pro", label: L.nav.pro },
];

function Nav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-bg/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-4 sm:gap-3 sm:px-6">
        <a href="#top" className="flex h-11 min-w-0 items-center gap-2.5 font-semibold tracking-tight">
          <img src={`${root}favicon.png`} alt="" width="28" height="28" className="size-7 shrink-0 rounded-[7px]" />
          <span className="hidden truncate text-[15px] min-[440px]:inline">levelplaymonetization</span>
          <span className="sr-only min-[440px]:hidden">levelplaymonetization</span>
        </a>

        <nav aria-label={t.ui.navPrimary} className="hidden items-center gap-2 text-sm text-muted md:flex">
          {navLinks.map((l) => (
            <a key={l.href} className="rounded-control px-3 py-3 transition-colors hover:text-text" href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <LangMenu />
          <StoreButton compact />
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t.ui.closeMenu : t.ui.openMenu}
            onClick={() => setOpen((o) => !o)}
            className="grid size-11 place-items-center rounded-control text-muted transition-colors hover:text-text md:hidden"
          >
            {open ? <X size={22} /> : <List size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-menu" aria-label={t.ui.navSections} className="border-t border-line bg-bg md:hidden">
          <ul className="mx-auto max-w-6xl px-3 py-2">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="flex h-12 items-center rounded-control px-3 text-[17px] text-text"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}

function Hero() {
  const reduce = useReducedMotion();
  const rise = (delay) => ({
    initial: reduce ? false : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: EASE },
  });
  return (
    <section id="top" className="mx-auto grid max-w-6xl items-center gap-10 px-6 pt-12 md:min-h-[calc(100dvh-4rem)] md:grid-cols-[1.05fr_0.95fr] md:pt-0 lg:gap-16">
      <div className="max-w-xl">
        <motion.h1
          {...rise(0.05)}
          className="text-balance text-[2.75rem] font-semibold leading-[1.04] tracking-tight sm:text-6xl lg:text-[4.25rem]"
        >
          {L.hero.title}
        </motion.h1>
        <motion.p {...rise(0.15)} className="mt-6 max-w-[52ch] text-lg leading-relaxed text-muted">
          {L.hero.text}
        </motion.p>
        <motion.div {...rise(0.25)} className="mt-9">
          <StoreButton />
        </motion.div>
      </div>

      <motion.div
        {...rise(0.2)}
        className="relative mx-auto h-[520px] w-full max-w-[460px] overflow-hidden sm:h-[600px] md:h-[640px]"
        style={{ maskImage: "linear-gradient(to bottom, #000 86%, transparent)" }}
      >
        <Phone
          src={shot("apps")}
          alt={L.hero.altApps}
          className="absolute right-0 top-16 hidden w-[56%] sm:block"
          eager
        />
        <Phone
          src={shot("overview")}
          alt={L.hero.altOverview}
          className="absolute left-1/2 top-4 w-[64%] -translate-x-1/2 sm:left-0 sm:translate-x-0"
          eager
        />
      </motion.div>
    </section>
  );
}

function Attention() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-14 px-6 py-24 md:grid-cols-[1.1fr_0.9fr] md:py-32">
      <div>
        <Reveal>
          <p
            aria-hidden="true"
            className="num text-[clamp(5.5rem,17vw,12rem)] font-medium leading-[0.9] tracking-[-0.04em]"
          >
            -39%
          </p>
          <p className="mt-6 text-xl font-medium sm:text-2xl">{L.attention.label}</p>
          <p className="mt-2 text-[15px] text-muted">{L.attention.note}</p>
        </Reveal>
        <Reveal delay={0.1} className="mt-16 max-w-md">
          <h2 className="text-balance text-3xl font-semibold leading-[1.1] tracking-tight sm:text-4xl">
            <span className="block">{L.attention.line1}</span>
            <span className="block">{L.attention.line2}</span>
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            {L.attention.text}
          </p>
        </Reveal>
      </div>
      <Reveal delay={0.1} className="relative mx-auto h-[500px] w-full max-w-[420px] sm:h-[560px]">
        <Phone
          src={shot("breakdown")}
          alt={L.attention.altBreakdown}
          className="absolute bottom-0 right-0 w-[52%]"
        />
        <Phone
          src={shot("attention")}
          alt={L.attention.altAttention}
          className="absolute left-0 top-0 w-[62%]"
        />
      </Reveal>
    </section>
  );
}

function Privacy() {
  return (
    <section id="privacy" className="scroll-mt-16 border-y border-line bg-surface py-24 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <h2 className="text-balance max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            {L.privacy.title1}<span className="text-accent-text">{L.privacy.title2}</span>
          </h2>
        </Reveal>
        <dl className="mt-14 grid gap-x-12 gap-y-10 md:grid-cols-2">
          {L.privacy.items.map((p, i) => (
            <Reveal key={p.t} delay={(i % 2) * 0.08} className="border-t border-line pt-6">
              <dt className="font-medium">{p.t}</dt>
              <dd className="mt-3 max-w-[46ch] leading-relaxed text-muted">{p.d}</dd>
            </Reveal>
          ))}
        </dl>
        <p className="mt-12">
          <a className="font-medium text-accent-text underline underline-offset-4 transition-colors hover:text-text" href="./privacy.html">
            {L.privacy.link}
          </a>
        </p>
      </div>
    </section>
  );
}

const adTypes = [
  { name: L.breakdowns.banner, color: "var(--color-banner)" },
  { name: L.breakdowns.interstitial, color: "var(--color-interstitial)" },
  { name: L.breakdowns.rewarded, color: "var(--color-rewarded)" },
];

function Breakdowns() {
  return (
    <section id="breakdowns" className="scroll-mt-16 py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="max-w-2xl">
          <h2 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
            {L.breakdowns.title}
          </h2>
          <p className="mt-6 max-w-[56ch] text-lg leading-relaxed text-muted">
            {L.breakdowns.text}
          </p>
          <ul className="num mt-8 flex flex-wrap gap-x-7 gap-y-3 text-sm text-muted" aria-label={L.breakdowns.legendLabel}>
            {adTypes.map((t) => (
              <li key={t.name} className="flex items-center gap-2.5">
                <span aria-hidden="true" className="h-1 w-8 rounded-full" style={{ background: t.color }} />
                {t.name}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
      <div
        role="region"
        aria-label={L.breakdowns.screens}
        tabIndex={0}
        className="snap-row mt-14 flex snap-x snap-mandatory gap-8 overflow-x-auto px-6 pb-8 scroll-pl-6 lg:pl-[max(1.5rem,calc((100vw_-_72rem)/2_+_1.5rem))] lg:scroll-pl-[max(1.5rem,calc((100vw_-_72rem)/2_+_1.5rem))]"
      >
        {L.breakdowns.cuts.map((c) => (
          <figure key={c.img} className="w-[250px] shrink-0 snap-start sm:w-[280px]">
            <Phone src={shot(c.img)} alt={c.alt} />
            <figcaption className="mt-6">
              <p className="font-medium">{c.title}</p>
              <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{c.text}</p>
            </figcaption>
          </figure>
        ))}
        <div aria-hidden="true" className="w-6 shrink-0" />
      </div>
    </section>
  );
}


function Tools() {
  return (
    <section id="tools" className="mx-auto max-w-6xl scroll-mt-16 px-6 pb-28 md:pb-36">
      <Reveal className="max-w-2xl">
        <h2 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
          {L.tools.title}
        </h2>
      </Reveal>

      <div className="mt-14 grid gap-5 md:grid-cols-12">
        <Reveal className="flex min-h-[480px] flex-col overflow-hidden rounded-panel bg-accent p-8 text-white md:col-span-5">
          <h3 className="text-2xl font-semibold tracking-tight">{L.tools.alertsTitle}</h3>
          <p className="mt-3 max-w-[34ch] leading-relaxed text-white/85">
            {L.tools.alertsText}
          </p>
          <Phone
            src={shot("alert")}
            alt={L.tools.alertsAlt}
            className="mx-auto mt-auto w-[68%] translate-y-[22%] md:w-[58%] md:translate-y-[28%]"
          />
        </Reveal>

        <Reveal delay={0.08} className="relative flex flex-col overflow-hidden rounded-panel border border-line bg-surface-2 md:min-h-[480px] p-8 md:col-span-7 md:flex-row">
          <div className="relative z-10 max-w-[30ch]">
            <h3 className="text-2xl font-semibold tracking-tight">{L.tools.reportsTitle}</h3>
            <p className="mt-3 leading-relaxed text-muted">
              {L.tools.reportsText}
            </p>
          </div>
          <Phone
            src={shot("report")}
            alt={L.tools.reportsAlt}
            className="mx-auto mt-8 w-[66%] translate-y-[24%] md:absolute md:-bottom-24 md:right-10 md:mx-0 md:mt-0 md:w-[46%] md:max-w-[250px] md:translate-y-0"
          />
        </Reveal>

        <Reveal className="rounded-panel border border-line bg-surface p-8 md:col-span-7">
          <h3 className="text-2xl font-semibold tracking-tight">{L.tools.metricsTitle}</h3>
          <p className="mt-3 max-w-[44ch] leading-relaxed text-muted">
            {L.tools.metricsText}
          </p>
          <ul className="num mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xl sm:text-2xl">
            {L.tools.metrics.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.08} className="rounded-panel border border-line bg-surface p-8 md:col-span-5">
          <h3 className="text-2xl font-semibold tracking-tight">{L.tools.languagesTitle}</h3>
          <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xl text-muted">
            {t.languages.map((l) => (
              <li key={l.code} lang={l.htmlLang}>
                <a href={langHref(l)} className="transition-colors hover:text-text">
                  {l.name}
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pro" className="mx-auto max-w-6xl scroll-mt-16 px-6 pb-28 md:pb-36">
      <Reveal>
        <h2 className="text-balance max-w-2xl text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
          {L.pricing.title}
        </h2>
      </Reveal>
      <div className="mt-14 grid items-start gap-12 md:grid-cols-2 md:gap-8">
        <Reveal className="md:pr-8">
          <p className="num text-sm text-muted">{L.pricing.free}</p>
          <ul className="mt-6 space-y-4 text-lg">
            {L.pricing.freeItems.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.08} className="rounded-panel bg-surface-2 p-8 md:p-10">
          <p className="num text-sm text-accent-text">{L.pricing.pro}</p>
          <ul className="mt-6 space-y-4 text-lg">
            {L.pricing.proItems.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
          <p className="mt-8 text-[15px] text-muted">{L.pricing.price}</p>
        </Reveal>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="border-t border-line">
      <Reveal className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-24 md:grid-cols-[1fr_auto] md:py-32">
        <div className="flex flex-col items-start gap-8">
          <h2 className="text-balance max-w-2xl text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
            {L.cta.title}
          </h2>
          <StoreButton />
        </div>
        <div className="hidden md:block">
          <img
            src={`${root}qr.svg`}
            alt={L.cta.qrAlt}
            width="168"
            height="168"
            className="size-[168px] rounded-panel"
          />
          <p className="mt-4 max-w-[168px] text-sm text-muted">{L.cta.qrText}</p>
        </div>
      </Reveal>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-10 text-sm text-muted md:flex-row md:items-center md:justify-between">
        <p>{t.ui.disclaimer}</p>
        <nav aria-label={t.ui.navFooter} className="flex gap-5">
          <a className="py-2 transition-colors hover:text-text" href="./privacy.html">{t.ui.privacy}</a>
          <a className="py-2 transition-colors hover:text-text" href="./terms.html">{t.ui.terms}</a>
          <a className="py-2 transition-colors hover:text-text" href="./support.html">{t.ui.support}</a>
        </nav>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Attention />
        <Privacy />
        <Breakdowns />
        <Tools />
        <Pricing />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
