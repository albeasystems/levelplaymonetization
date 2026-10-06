import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { List, X } from "@phosphor-icons/react";
import { Phone, Reveal, StoreButton, EASE } from "./ui.jsx";

const shot = (name) => `./shots/${name}.webp`;

const navLinks = [
  { href: "#privacy", label: "Privacy" },
  { href: "#breakdowns", label: "Breakdowns" },
  { href: "#tools", label: "Tools" },
  { href: "#pro", label: "Pro" },
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
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-6">
        <a href="#top" className="flex h-11 min-w-0 items-center gap-2.5 font-semibold tracking-tight">
          <img src="./favicon.png" alt="" width="28" height="28" className="size-7 shrink-0 rounded-[7px]" />
          <span className="hidden truncate text-[15px] min-[440px]:inline">levelplaymonetization</span>
          <span className="sr-only min-[440px]:hidden">levelplaymonetization</span>
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-2 text-sm text-muted md:flex">
          {navLinks.map((l) => (
            <a key={l.href} className="rounded-control px-3 py-3 transition-colors hover:text-text" href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <StoreButton compact />
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
            className="grid size-11 place-items-center rounded-control text-muted transition-colors hover:text-text md:hidden"
          >
            {open ? <X size={22} /> : <List size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-menu" aria-label="Sections" className="border-t border-line bg-bg md:hidden">
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
          Know what your ads earn, down to the country.
        </motion.h1>
        <motion.p {...rise(0.15)} className="mt-6 max-w-[52ch] text-lg leading-relaxed text-muted">
          For Unity LevelPlay publishers. Revenue, eCPM and fill rate by app, network and country. Keys stay in your Keychain.
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
          alt="Apps screen listing each app with revenue, eCPM, fill rate and ad type mix"
          className="absolute right-0 top-16 hidden w-[56%] sm:block"
          eager
        />
        <Phone
          src={shot("overview")}
          alt="Overview screen showing $2,003 weekly revenue with a stacked chart by ad type"
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
          <p className="mt-6 text-xl font-medium sm:text-2xl">Unity Ads eCPM in the United States</p>
          <p className="mt-2 text-[15px] text-muted">An alert from the Overview, shown with demo data.</p>
        </Reveal>
        <Reveal delay={0.1} className="mt-16 max-w-md">
          <h2 className="text-balance text-3xl font-semibold leading-[1.1] tracking-tight sm:text-4xl">
            <span className="block">Open it.</span>
            <span className="block">See what changed.</span>
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            The Overview starts with what needs attention: an eCPM drop in one country, your best ARPDAU market, each with the numbers behind it.
          </p>
        </Reveal>
      </div>
      <Reveal delay={0.1} className="relative mx-auto h-[500px] w-full max-w-[420px] sm:h-[560px]">
        <Phone
          src={shot("breakdown")}
          alt="Top countries and revenue by ad type, each with change against the previous period"
          className="absolute bottom-0 right-0 w-[52%]"
        />
        <Phone
          src={shot("attention")}
          alt="What needs attention: Unity Ads eCPM in the United States is down 39 percent"
          className="absolute left-0 top-0 w-[62%]"
        />
      </Reveal>
    </section>
  );
}

const privacy = [
  { t: "Demo data first", d: "It opens with demo data, so you can look around before you connect anything." },
  { t: "Keychain only", d: "Your LevelPlay Secret Key and Refresh Token are stored in the iPhone Keychain." },
  { t: "No account with us", d: "There is no backend. The app talks to LevelPlay directly from your device." },
  { t: "What else is contacted", d: "Exchange rates come from frankfurter.dev. The ad SDKs in the free version follow their own policies, and you are asked for consent." },
];

function Privacy() {
  return (
    <section id="privacy" className="scroll-mt-16 border-y border-line bg-surface py-24 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <h2 className="text-balance max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Your keys stay <span className="text-accent-text">on your iPhone.</span>
          </h2>
        </Reveal>
        <dl className="mt-14 grid gap-x-12 gap-y-10 md:grid-cols-2">
          {privacy.map((p, i) => (
            <Reveal key={p.t} delay={(i % 2) * 0.08} className="border-t border-line pt-6">
              <dt className="font-medium">{p.t}</dt>
              <dd className="mt-3 max-w-[46ch] leading-relaxed text-muted">{p.d}</dd>
            </Reveal>
          ))}
        </dl>
        <p className="mt-12">
          <a className="font-medium text-accent-text underline underline-offset-4 transition-colors hover:text-text" href="./privacy.html">
            Read the full Privacy Policy
          </a>
        </p>
      </div>
    </section>
  );
}

const cuts = [
  { img: "apps", title: "Apps", text: "Each app with its trend, ad type mix and key metrics.", alt: "Apps list" },
  { img: "app-detail", title: "App detail", text: "Daily revenue stacked by banner, interstitial and rewarded.", alt: "Pixel Quest detail with revenue chart and key metrics" },
  { img: "countries-map", title: "Countries", text: "A map sized by revenue, eCPM, ARPDAU or fill rate.", alt: "World map with bubbles sized by revenue per country" },
  { img: "countries-matrix", title: "App by country", text: "The matrix that shows where each app earns the most.", alt: "Matrix of revenue by app and country, darker means higher" },
  { img: "networks", title: "Networks", text: "Revenue share and ranking for AdMob, Unity Ads and Meta Audience Network.", alt: "Revenue share donut and network ranking for AdMob, Unity Ads and Meta Audience Network" },
];

const adTypes = [
  { name: "Banner", color: "var(--color-banner)" },
  { name: "Interstitial", color: "var(--color-interstitial)" },
  { name: "Rewarded", color: "var(--color-rewarded)" },
];

function Breakdowns() {
  return (
    <section id="breakdowns" className="scroll-mt-16 py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="max-w-2xl">
          <h2 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
            Every cut of your revenue.
          </h2>
          <p className="mt-6 max-w-[56ch] text-lg leading-relaxed text-muted">
            Switch between today, 7, 30 and 90 days, filter by app or ad type, and compare against the period before.
          </p>
          <ul className="num mt-8 flex flex-wrap gap-x-7 gap-y-3 text-sm text-muted" aria-label="Ad types, with the colours used in the charts">
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
        aria-label="Screens"
        tabIndex={0}
        className="snap-row mt-14 flex snap-x snap-mandatory gap-8 overflow-x-auto px-6 pb-8 scroll-pl-6 lg:pl-[max(1.5rem,calc((100vw_-_72rem)/2_+_1.5rem))] lg:scroll-pl-[max(1.5rem,calc((100vw_-_72rem)/2_+_1.5rem))]"
      >
        {cuts.map((c) => (
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

const metrics = ["eCPM", "ARPDAU", "Fill rate", "Show rate", "Impressions", "Imp. / DAU", "CTR"];
const languages = [
  { n: "English" },
  { n: "Español", lang: "es" },
  { n: "Deutsch", lang: "de" },
  { n: "Français", lang: "fr" },
  { n: "Italiano", lang: "it" },
  { n: "Português", lang: "pt" },
  { n: "العربية", lang: "ar" },
  { n: "हिन्दी", lang: "hi" },
  { n: "简体中文", lang: "zh-Hans" },
];

function Tools() {
  return (
    <section id="tools" className="mx-auto max-w-6xl scroll-mt-16 px-6 pb-28 md:pb-36">
      <Reveal className="max-w-2xl">
        <h2 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
          Alerts, reports and the metrics behind them.
        </h2>
      </Reveal>

      <div className="mt-14 grid gap-5 md:grid-cols-12">
        <Reveal className="flex min-h-[480px] flex-col overflow-hidden rounded-panel bg-accent p-8 text-white md:col-span-5">
          <h3 className="text-2xl font-semibold tracking-tight">Alerts when a number slips</h3>
          <p className="mt-3 max-w-[34ch] leading-relaxed text-white/85">
            Set a rule like eCPM drops by 20%, for any app, country, network or ad type. Included in Pro.
          </p>
          <Phone
            src={shot("alert")}
            alt="Alert rule editor: metric eCPM, condition drops by, value 20 percent"
            className="mx-auto mt-auto w-[68%] translate-y-[22%] md:w-[58%] md:translate-y-[28%]"
          />
        </Reveal>

        <Reveal delay={0.08} className="relative flex flex-col overflow-hidden rounded-panel border border-line bg-surface-2 md:min-h-[480px] p-8 md:col-span-7 md:flex-row">
          <div className="relative z-10 max-w-[30ch]">
            <h3 className="text-2xl font-semibold tracking-tight">PDF and CSV reports</h3>
            <p className="mt-3 leading-relaxed text-muted">
              Share a clean monetization report with revenue, metrics and what needs attention. Included in Pro.
            </p>
          </div>
          <Phone
            src={shot("report")}
            alt="Monetization report preview with revenue chart and key metrics"
            className="mx-auto mt-8 w-[66%] translate-y-[24%] md:absolute md:-bottom-24 md:right-10 md:mx-0 md:mt-0 md:w-[46%] md:max-w-[250px] md:translate-y-0"
          />
        </Reveal>

        <Reveal className="rounded-panel border border-line bg-surface p-8 md:col-span-7">
          <h3 className="text-2xl font-semibold tracking-tight">Seven metrics, each explained</h3>
          <p className="mt-3 max-w-[44ch] leading-relaxed text-muted">
            Tap the info icon on any screen to see how a metric is calculated.
          </p>
          <ul className="num mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xl sm:text-2xl">
            {metrics.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.08} className="rounded-panel border border-line bg-surface p-8 md:col-span-5">
          <h3 className="text-2xl font-semibold tracking-tight">Nine languages</h3>
          <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xl text-muted">
            {languages.map((l) => (
              <li key={l.n} lang={l.lang}>
                {l.n}
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
          Free to use. Pro removes the ads.
        </h2>
      </Reveal>
      <div className="mt-14 grid items-start gap-12 md:grid-cols-2 md:gap-8">
        <Reveal className="md:pr-8">
          <p className="num text-sm text-muted">Free</p>
          <ul className="mt-6 space-y-4 text-lg">
            <li>Overview, Apps, Countries and Networks</li>
            <li>Demo data, or your live LevelPlay account</li>
            <li>Ads, with a rewarded video that gives you 1 hour ad-free</li>
          </ul>
        </Reveal>
        <Reveal delay={0.08} className="rounded-panel bg-surface-2 p-8 md:p-10">
          <p className="num text-sm text-accent-text">Pro, one purchase, no subscription</p>
          <ul className="mt-6 space-y-4 text-lg">
            <li>No ads</li>
            <li>Custom alerts</li>
            <li>PDF and CSV reports</li>
          </ul>
          <p className="mt-8 text-[15px] text-muted">Price shown in the App Store.</p>
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
            Bring your LevelPlay data to your iPhone.
          </h2>
          <StoreButton />
        </div>
        <div className="hidden md:block">
          <img
            src="./qr.svg"
            alt="QR code that opens the App Store page"
            width="168"
            height="168"
            className="size-[168px] rounded-panel"
          />
          <p className="mt-4 max-w-[168px] text-sm text-muted">Scan with your iPhone to open the App Store.</p>
        </div>
      </Reveal>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-10 text-sm text-muted md:flex-row md:items-center md:justify-between">
        <p>levelplaymonetization is an independent app. Not affiliated with Unity or LevelPlay.</p>
        <nav aria-label="Footer" className="flex gap-5">
          <a className="py-2 transition-colors hover:text-text" href="./privacy.html">Privacy</a>
          <a className="py-2 transition-colors hover:text-text" href="./terms.html">Terms</a>
          <a className="py-2 transition-colors hover:text-text" href="./support.html">Support</a>
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
