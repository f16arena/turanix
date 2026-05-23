"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { useLang, useT } from "../_lib/i18n";

const phone = "+7 701 107 02 60";
const phoneHref = "tel:+77011070260";
const whatsappHref = "https://wa.me/77011070260";

export function Contact() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12%" });
  const t = useT();
  const { lang } = useLang();
  const copy =
    lang === "ru"
      ? {
          email: "Почта",
          phone: "Телефон",
          whatsapp: "WhatsApp",
          scope: "Задача",
          legal: "Реквизиты",
          company: "ТОО «Turanix»",
          bin: "БИН 260540022744",
          telegram: "Telegram - по запросу",
          write: "Написать",
          call: "Позвонить",
        }
      : {
          email: "Email",
          phone: "Phone",
          whatsapp: "WhatsApp",
          scope: "Scope",
          legal: "Legal",
          company: "Turanix LLP",
          bin: "BIN 260540022744",
          telegram: "Telegram on request",
          write: "Write",
          call: "Call",
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
          className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1fr] lg:items-end"
        >
          <div>
            <div className="mb-5 font-mono text-[11px] uppercase text-[color:var(--signal)]">
              {t.contact.eyebrow}
            </div>
            <h2
              aria-label={`${t.contact.h1} ${t.contact.h2em} ${t.contact.h2}`}
              className="display max-w-[900px] text-[40px] min-[380px]:text-[48px] sm:text-[68px] md:text-[86px]"
            >
              {t.contact.h1}{" "}
              <span className="text-[color:var(--signal)]">
                {t.contact.h2em}
              </span>{" "}
              {t.contact.h2}
            </h2>
            <p className="mt-8 max-w-[700px] text-[16px] leading-[1.75] text-white/64">
              {t.contact.lede}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="mailto:info@turanix.kz" className="button-accent">
                info@turanix.kz
                <Arrow />
              </a>
              <a href={phoneHref} className="button-dark">
                {phone}
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <InfoBlock label={t.contact.studio}>
              {t.contact.address.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </InfoBlock>
            <InfoBlock label={t.contact.channels}>
              <a href="mailto:info@turanix.kz">{copy.email}: info@turanix.kz</a>
              <a href={phoneHref}>{copy.phone}: {phone}</a>
              <a href={whatsappHref} target="_blank" rel="noreferrer">
                {copy.whatsapp}
              </a>
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
    <div className="min-h-[182px] rounded-lg border border-white/12 bg-white/[0.055] p-5">
      <div className="mb-8 font-mono text-[11px] uppercase text-[color:var(--signal)]">
        {label}
      </div>
      <div className="grid gap-1.5 text-[14px] leading-[1.55] text-white/68 [&_a:hover]:text-white">
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
