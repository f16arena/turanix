"use client";

import Link from "next/link";
import Image from "next/image";
import { useLang, useT } from "../_lib/i18n";

export function Footer() {
  const t = useT();
  const { lang } = useLang();

  const sitemap = [
    ["#services", t.nav.services],
    ["#work", t.nav.work],
    ["#studio", t.nav.studio],
    ["#stack", t.nav.stack],
    ["#contact", t.nav.contact],
  ];

  return (
    <footer className="border-t border-[color:var(--rule)] bg-[#fbfbf7] py-12">
      <div className="container-wide">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.25fr_0.75fr_0.75fr_0.75fr]">
          <div className="surface p-6">
            <div className="flex items-center gap-3">
              <Image
                src="/brand/turanix-logo-full.png"
                alt="Turanix"
                width={340}
                height={72}
                className="h-10 w-auto max-w-[220px]"
              />
            </div>
            <p className="mt-6 max-w-[560px] text-[15px] leading-[1.65] text-[color:var(--ink-soft)]">
              {t.footer.tagline}
            </p>
            <div className="mt-10 grid gap-2 font-mono text-[11px] uppercase text-[color:var(--ink-mute)]">
              <span>{t.footer.legal}</span>
              <span>{t.footer.address}</span>
              <span>{t.footer.copy}</span>
            </div>
          </div>

          <FooterColumn title={t.footer.sitemap}>
            {sitemap.map(([href, label]) => (
              <a key={href} href={href}>
                {label}
              </a>
            ))}
          </FooterColumn>

          <FooterColumn title={t.footer.elsewhere}>
            <a href="https://t.me/turanix" target="_blank" rel="noreferrer">
              Telegram
            </a>
            <a
              href="https://instagram.com/turanix"
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </a>
            <a href="mailto:hello@turanix.kz">
              {lang === "ru" ? "Почта" : "Email"}
            </a>
          </FooterColumn>

          <FooterColumn title={t.footer.documents}>
            <Link href="/offer">{t.nav.offer}</Link>
            <Link href="/privacy">{t.nav.privacy}</Link>
          </FooterColumn>
        </div>

        <div className="mt-5 overflow-hidden rounded-lg border border-[color:var(--rule)] bg-[color:var(--dark)] px-4 py-6 text-white">
          <Image
            src="/brand/turanix-logo-full.png"
            alt="Turanix Software & Automation"
            width={1200}
            height={253}
            className="h-auto w-full max-w-[920px] invert"
          />
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="surface min-h-[220px] p-5">
      <div className="eyebrow mb-8">{title}</div>
      <div className="grid gap-3 text-[14px] text-[color:var(--ink-soft)] [&_a:hover]:text-[color:var(--ink)]">
        {children}
      </div>
    </div>
  );
}
