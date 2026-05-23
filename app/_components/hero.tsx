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
    <section id="top" className="relative overflow-hidden pb-12 pt-[86px]">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease }}
          className="flex flex-wrap items-center justify-between gap-3 border-y border-[color:var(--rule)] py-3 font-mono text-[11px] uppercase text-[color:var(--ink-mute)]"
        >
          <span className="inline-flex items-center gap-2 text-[color:var(--ink)]">
            <span className="live-dot" />
            {t.status.operational}
          </span>
          <span>{t.status.region}</span>
          <span>{t.status.version}</span>
        </motion.div>

        <div className="grid min-h-[560px] grid-cols-1 items-center gap-10 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:py-12">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.08, ease }}
          >
            <div className="mb-8 flex flex-wrap items-center gap-3">
              <span className="font-mono text-[11px] uppercase text-[color:var(--accent)]">
                {t.hero.eyebrow}
              </span>
              <span className="h-px w-14 bg-[color:var(--rule-strong)]" />
              <span className="font-mono text-[11px] uppercase text-[color:var(--ink-mute)]">
                {t.hero.kicker}
              </span>
            </div>

            <h1
              aria-label={`${t.hero.l1} ${t.hero.l2} ${t.hero.l3em}`}
              className="display max-w-[980px] text-[40px] min-[380px]:text-[48px] sm:text-[62px] md:text-[74px] xl:text-[84px]"
            >
              <Reveal delay={0.04}>{t.hero.l1}</Reveal>
              <Reveal delay={0.14}>{t.hero.l2}</Reveal>
              <Reveal delay={0.24}>
                <span className="text-[color:var(--accent)]">
                  {t.hero.l3em}
                </span>
              </Reveal>
            </h1>

            <p className="mt-7 max-w-[720px] text-[17px] leading-[1.65] text-[color:var(--ink-soft)] md:text-[18px]">
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

            <div className="mt-10 grid max-w-[820px] grid-cols-1 gap-3 sm:grid-cols-3">
              {t.hero.proofs.map((item) => (
                <div key={item.label} className="surface p-4">
                  <div className="font-mono text-[18px] text-[color:var(--ink)]">
                    {item.value}
                  </div>
                  <div className="mt-5 text-[14px] font-semibold">
                    {item.label}
                  </div>
                  <div className="mt-1 text-[13px] leading-[1.45] text-[color:var(--ink-soft)]">
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
            <DeliveryPanel items={t.hero.map} label={t.hero.open} lang={lang} />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.45 }}
          className="overflow-hidden border-t border-[color:var(--rule)] py-5"
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

function DeliveryPanel({
  items,
  label,
  lang,
}: {
  items: readonly { label: string; detail: string }[];
  label: string;
  lang: "ru" | "en";
}) {
  const copy =
    lang === "ru"
      ? {
          title: "Контур разработки",
          system: "Схема Turanix",
          lead: "Один подрядчик для сайта, приложения, интеграций и поддержки.",
          pipeline: "Процесс",
          stages: ["Разбор", "Дизайн", "Код", "Запуск"],
          response: "Ответ в рабочее время",
          phone: "Рабочий телефон",
        }
      : {
          title: "Delivery system",
          system: "Turanix OS",
          lead: "One partner for website, app, integrations and support.",
          pipeline: "Process",
          stages: ["Discovery", "Design", "Code", "Launch"],
          response: "Business-hours reply",
          phone: "Work phone",
        };

  return (
    <div className="surface-dark overflow-hidden p-5 shadow-2xl shadow-black/20 md:p-7">
      <div className="flex flex-wrap items-start justify-between gap-5 border-b border-white/10 pb-6">
        <div>
          <div className="font-mono text-[11px] uppercase text-white/46">
            {copy.system}
          </div>
          <div className="mt-2 text-[28px] font-semibold">{copy.title}</div>
          <p className="mt-3 max-w-[430px] text-[14px] leading-[1.6] text-white/58">
            {copy.lead}
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-[color:var(--signal)] px-3 py-1.5 font-mono text-[10px] uppercase text-[color:var(--dark)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--dark)]" />
          {label}
        </span>
      </div>

      <div className="grid gap-3 py-6">
        {items.map((item, index) => (
          <div
            key={item.label}
            className="grid grid-cols-[42px_1fr] items-center gap-4 rounded-lg border border-white/10 bg-white/[0.055] p-4"
          >
            <span className="font-mono text-[11px] uppercase text-[color:var(--signal)]">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="grid gap-1 sm:grid-cols-[150px_1fr] sm:items-center">
              <div className="text-[18px] font-semibold">{item.label}</div>
              <div className="font-mono text-[11px] uppercase text-white/44">
                {item.detail}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-3 border-t border-white/10 pt-5 sm:grid-cols-2">
        <div>
          <div className="font-mono text-[10px] uppercase text-white/38">
            {copy.pipeline}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {copy.stages.map((stage) => (
              <span
                key={stage}
                className="rounded-full border border-white/12 px-3 py-1.5 text-[12px] text-white/62"
              >
                {stage}
              </span>
            ))}
          </div>
        </div>
        <div className="sm:text-right">
          <div className="font-mono text-[10px] uppercase text-white/38">
            {copy.phone}
          </div>
          <a
            href="tel:+77011070260"
            className="mt-3 block text-[18px] font-semibold text-white hover:text-[color:var(--signal)]"
          >
            +7 701 107 02 60
          </a>
          <div className="mt-1 text-[12px] text-white/42">{copy.response}</div>
        </div>
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
          className="flex items-center gap-3 whitespace-nowrap font-mono text-[11px] uppercase text-[color:var(--ink-mute)]"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" />
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
