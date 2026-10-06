import { motion, useReducedMotion } from "motion/react";
import { AppleLogo } from "@phosphor-icons/react";

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
        compact ? "h-11 px-4 text-sm" : "h-12 px-5 text-[15px]"
      } ${className}`}
    >
      <AppleLogo size={compact ? 18 : 20} weight="fill" aria-hidden="true" />
      Get the free app
    </a>
  );
}
