"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { useLang, useT } from "../_lib/i18n";

export function Contact() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12%" });
  const t = useT();
  const { lang } = useLang();
  const copy =
    lang === "ru"
      ? {
          email: "Почта",
          scope: "Задача",
          legal: "Реквизиты",
          company: "ТОО Turanix",
          bin: "БИН 260540022744",
          telegram: "Telegram — по запросу",
        }
      : {
          email: "Email",
          scope: "Scope",
          legal: "Legal",
          company: "Turanix LLP",
          bin: "BIN 260540022744",
          telegram: "Telegram on request",
        };

  return (
    <section
      id="contact"
      ref={ref}
      className="section border-white/10 bg-[color:var(--dark)] text-white"
    >
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-1 gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end"
        >
          <div>
            <div className="mb-5 font-mono text-[11px] uppercase text-[color:var(--signal)]">
              {t.contact.eyebrow}
            </div>
            <h2
              aria-label={`${t.contact.h1} ${t.contact.h2em} ${t.contact.h2}`}
              className="display max-w-[820px] text-[38px] min-[380px]:text-[44px] sm:text-[64px] md:text-[82px]"
            >
              {t.contact.h1}{" "}
              <span className="text-[color:var(--signal)]">
                {t.contact.h2em}
              </span>{" "}
              {t.contact.h2}
            </h2>
            <p className="mt-8 max-w-[680px] text-[16px] leading-[1.7] text-white/66">
              {t.contact.lede}
            </p>
            <a
              href="mailto:info@turanix.kz"
              className="button-primary mt-9 w-full sm:w-auto"
            >
              info@turanix.kz
              <Arrow />
            </a>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <InfoBlock label={t.contact.studio}>
              {t.contact.address.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </InfoBlock>
            <InfoBlock label={t.contact.channels}>
              <a href="mailto:info@turanix.kz">{copy.email}</a>
              <span>{copy.telegram}</span>
            </InfoBlock>
            <InfoBlock label={copy.scope}>
              {t.contact.scope.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </InfoBlock>
            <InfoBlock label={copy.legal}>
              <span>{copy.company}</span>
              <span>{copy.bin}</span>
            </InfoBlock>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function InfoBlock({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[170px] rounded-lg border border-white/12 bg-white/[0.055] p-5">
      <div className="mb-8 font-mono text-[11px] uppercase text-[color:var(--signal)]">
        {label}
      </div>
      <div className="grid gap-1 text-[14px] leading-[1.55] text-white/68 [&_a:hover]:text-white">
        {children}
      </div>
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
