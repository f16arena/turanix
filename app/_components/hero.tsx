"use client";

import { motion } from "motion/react";
import { useLang, useT } from "../_lib/i18n";

const ease = [0.22, 1, 0.36, 1] as const;

const stackChips = [
  "Next.js",
  "React Native",
  "Node.js",
  "PostgreSQL",
  "Telegram API",
  "OpenAI",
  "Claude",
  "Docker",
  "Vercel",
  "AWS",
  "Redis",
  "Resend",
];

export function Hero() {
  const t = useT();
  const { lang } = useLang();

  return (
    <section
      id="top"
      className="relative overflow-hidden bg-[color:var(--dark)] pb-12 pt-[96px] text-white"
    >
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease }}
          className="flex flex-wrap items-center justify-between gap-3 border-y border-white/12 py-3 font-mono text-[11px] uppercase text-white/58"
        >
          <span className="inline-flex items-center gap-2 text-white">
            <span className="live-dot" />
            {t.status.operational}
          </span>
          <span>{t.status.region}</span>
          <span>{t.status.version}</span>
        </motion.div>

        <div className="grid min-h-[620px] grid-cols-1 items-center gap-10 py-12 lg:grid-cols-[1.02fr_0.98fr] lg:py-16">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.08, ease }}
          >
            <div className="mb-8 flex flex-wrap items-center gap-3">
              <span className="font-mono text-[11px] uppercase text-[color:var(--signal)]">
                {t.hero.eyebrow}
              </span>
              <span className="h-px w-14 bg-white/18" />
              <span className="font-mono text-[11px] uppercase text-white/52">
                {t.hero.kicker}
              </span>
            </div>

            <h1
              aria-label={`${t.hero.l1} ${t.hero.l2} ${t.hero.l3em}`}
              className="display max-w-[900px] text-[46px] sm:text-[60px] md:text-[68px] xl:text-[76px]"
            >
              <Reveal delay={0.04}>{t.hero.l1}</Reveal>
              <Reveal delay={0.14}>{t.hero.l2}</Reveal>
              <Reveal delay={0.24}>
                <span className="text-[color:var(--signal)]">
                  {t.hero.l3em}
                </span>
              </Reveal>
            </h1>

            <p className="mt-7 max-w-[720px] text-[17px] leading-[1.65] text-white/68 md:text-[18px]">
              {t.hero.lede}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#contact" className="button-primary">
                {t.hero.ctaPrimary}
                <Arrow />
              </a>
              <a href="#work" className="button-secondary">
                {t.hero.ctaSecondary}
              </a>
            </div>

            <div className="mt-10 grid max-w-[760px] grid-cols-1 gap-3 sm:grid-cols-3">
              {t.hero.proofs.map((item) => (
                <div
                  key={item.label}
                  className="rounded-lg border border-white/12 bg-white/[0.055] p-4"
                >
                  <div className="font-mono text-[18px] text-white">
                    {item.value}
                  </div>
                  <div className="mt-5 text-[14px] font-semibold">
                    {item.label}
                  </div>
                  <div className="mt-1 text-[13px] leading-[1.45] text-white/52">
                    {item.detail}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.18, ease }}
          >
            <SystemMap items={t.hero.map} label={t.hero.open} lang={lang} />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.45 }}
          className="overflow-hidden border-t border-white/12 py-5"
        >
          <div className="marquee">
            <StackTrack />
            <StackTrack />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function SystemMap({
  items,
  label,
  lang,
}: {
  items: readonly { label: string; detail: string }[];
  label: string;
  lang: "ru" | "en";
}) {
  const [web, mobile, crm, telegram, ai] = items;
  const copy =
    lang === "ru"
      ? {
          map: "Карта системы Turanix",
          title: "Бизнес-система",
          core: "Ядро",
          stages: ["дизайн", "разработка", "поддержка"],
        }
      : {
          map: "Turanix delivery map",
          title: "Business system",
          core: "Core",
          stages: ["design", "engineering", "support"],
        };

  return (
    <div className="relative overflow-hidden rounded-lg border border-white/12 bg-white/[0.04] p-5 shadow-2xl shadow-black/30 md:p-7">
      <div className="mb-8 flex items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="font-mono text-[11px] uppercase text-white/52">
            {copy.map}
          </div>
          <div className="mt-2 text-[20px] font-semibold">{copy.title}</div>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-[color:var(--signal)] px-3 py-1.5 font-mono text-[10px] uppercase text-[color:var(--dark)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--dark)]" />
          {label}
        </span>
      </div>

      <div className="relative min-h-[440px]">
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 620 440"
          fill="none"
          aria-hidden
        >
          <path d="M310 74V354" stroke="white" strokeOpacity="0.16" />
          <path d="M150 132H310H470" stroke="white" strokeOpacity="0.16" />
          <path d="M150 306H310H470" stroke="white" strokeOpacity="0.16" />
          <path
            d="M150 132C214 132 232 220 310 220C388 220 406 132 470 132"
            stroke="var(--signal)"
            strokeOpacity="0.8"
            strokeWidth="2"
          />
          <path
            d="M150 306C214 306 234 220 310 220C386 220 406 306 470 306"
            stroke="#5c7cff"
            strokeOpacity="0.72"
            strokeWidth="2"
          />
          <circle cx="310" cy="220" r="54" fill="white" fillOpacity="0.06" />
          <circle cx="310" cy="220" r="16" fill="var(--signal)" />
        </svg>

        <Node className="left-0 top-10" item={web} tone="lime" />
        <Node className="right-0 top-10" item={mobile} tone="blue" />
        <Node className="left-0 bottom-10" item={telegram} tone="blue" />
        <Node className="right-0 bottom-10" item={ai} tone="lime" />

        <div className="absolute left-1/2 top-1/2 w-[190px] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-white/14 bg-[color:var(--dark)] p-5 text-center">
          <div className="font-mono text-[11px] uppercase text-[color:var(--signal)]">
            {crm.label}
          </div>
          <div className="mt-2 text-[26px] font-semibold">{copy.core}</div>
          <div className="mt-3 text-[12px] leading-[1.45] text-white/48">
            {crm.detail}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 border-t border-white/10 pt-4 font-mono text-[10px] uppercase text-white/42">
        <span>{copy.stages[0]}</span>
        <span className="text-center">{copy.stages[1]}</span>
        <span className="text-right">{copy.stages[2]}</span>
      </div>
    </div>
  );
}

function Node({
  item,
  tone,
  className,
}: {
  item: { label: string; detail: string };
  tone: "lime" | "blue";
  className: string;
}) {
  return (
    <div
      className={`absolute w-[145px] rounded-lg border border-white/12 bg-white/[0.07] p-4 backdrop-blur sm:w-[180px] ${className}`}
    >
      <div
        className={`mb-6 h-2 w-2 rounded-full ${
          tone === "lime" ? "bg-[color:var(--signal)]" : "bg-[#5c7cff]"
        }`}
      />
      <div className="text-[18px] font-semibold">{item.label}</div>
      <div className="mt-2 font-mono text-[11px] uppercase text-white/46">
        {item.detail}
      </div>
    </div>
  );
}

function Reveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <span className="block overflow-hidden pb-[0.07em]">
      <motion.span
        initial={{ y: "110%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 0.95, delay, ease }}
        className="block"
      >
        {children}
      </motion.span>
    </span>
  );
}

function StackTrack() {
  return (
    <div className="flex shrink-0 items-center gap-8 px-4">
      {stackChips.map((item) => (
        <span
          key={item}
          className="flex items-center gap-3 whitespace-nowrap font-mono text-[11px] uppercase text-white/48"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--signal)]" />
          {item}
        </span>
      ))}
    </div>
  );
}

function Arrow() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
      <path
        d="M2 11L11 2M4 2h7v7"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="square"
      />
    </svg>
  );
}
