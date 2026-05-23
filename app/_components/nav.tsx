"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { useLang, useT } from "../_lib/i18n";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const { lang, setLang } = useLang();
  const t = useT();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#services", label: t.nav.services },
    { href: "#work", label: t.nav.work },
    { href: "#studio", label: t.nav.studio },
    { href: "#stack", label: t.nav.stack },
    { href: "#contact", label: t.nav.contact },
  ];

  return (
    <motion.header
      initial={{ y: -14, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 border-b border-white/10 text-white transition-colors duration-300 ${
        scrolled ? "bg-[color:var(--dark)]/94 backdrop-blur-xl" : "bg-[color:var(--dark)]"
      }`}
    >
      <div className="container-wide flex h-[68px] items-center justify-between gap-4">
        <a href="#top" className="flex min-w-0 items-center gap-3">
          <Image
            src="/brand/turanix-logo-full.png"
            alt="Turanix"
            width={310}
            height={65}
            priority
            className="h-8 w-auto max-w-[118px] invert min-[380px]:max-w-[148px] sm:max-w-[190px]"
          />
          <span className="hidden border-l border-white/14 pl-3 font-mono text-[10px] uppercase text-white/52 sm:inline">
            {lang === "ru" ? "ТОО / KZ" : "LLP / KZ"}
          </span>
        </a>

        <nav className="hidden items-center gap-1 rounded-full border border-white/12 bg-white/[0.055] p-1 lg:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-2 text-[13px] text-white/66 transition-colors hover:bg-white/10 hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LangToggle lang={lang} setLang={setLang} />
          <a
            href="#contact"
            aria-label={t.nav.cta}
            className="inline-flex h-9 items-center gap-2 rounded-full bg-[color:var(--signal)] px-3 text-[13px] font-semibold text-[color:var(--dark)] transition-transform hover:-translate-y-px"
          >
            <span className="hidden sm:inline">{t.nav.cta}</span>
            <Arrow />
          </a>
        </div>
      </div>
    </motion.header>
  );
}

function LangToggle({
  lang,
  setLang,
}: {
  lang: "ru" | "en";
  setLang: (l: "ru" | "en") => void;
}) {
  return (
    <div className="inline-flex h-9 items-center rounded-full border border-white/12 bg-white/[0.055] p-1 font-mono text-[10px] uppercase">
      {(["ru", "en"] as const).map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => setLang(item)}
          aria-pressed={lang === item}
          className={`h-7 rounded-full px-2.5 transition-colors ${
            lang === item
              ? "bg-white text-[color:var(--dark)]"
              : "text-white/58 hover:text-white"
          }`}
        >
          {item}
        </button>
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
