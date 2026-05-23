"use client";

import Link from "next/link";
import Image from "next/image";
import { useLang, useT } from "../_lib/i18n";

const phone = "+7 701 107 02 60";

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

  const labels =
    lang === "ru"
      ? {
          requisites: "Реквизиты",
          company: "Компания",
          bin: "БИН",
          address: "Адрес",
          email: "Почта",
          phone: "Телефон",
          country: "Республика Казахстан",
          social: "Соцсети после запуска",
        }
      : {
          requisites: "Company details",
          company: "Company",
          bin: "BIN",
          address: "Address",
          email: "Email",
          phone: "Phone",
          country: "Republic of Kazakhstan",
          social: "Social accounts after launch",
        };

  return (
    <footer className="border-t border-[color:var(--rule)] bg-[#fbfcf8] py-12">
      <div className="container-wide">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Image
              src="/brand/turanix-logo-full.png"
              alt="Turanix"
              width={380}
              height={80}
              className="h-auto w-full max-w-[250px]"
            />
            <p className="mt-7 max-w-[620px] text-[16px] leading-[1.7] text-[color:var(--ink-soft)]">
              {t.footer.tagline}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <FooterColumn title={t.footer.sitemap}>
              {sitemap.map(([href, label]) => (
                <a key={href} href={href}>
                  {label}
                </a>
              ))}
            </FooterColumn>

            <FooterColumn title={t.footer.elsewhere}>
              <a href="mailto:info@turanix.kz">info@turanix.kz</a>
              <a href="tel:+77011070260">{phone}</a>
              <span>{labels.social}</span>
            </FooterColumn>

            <FooterColumn title={t.footer.documents}>
              <Link href="/offer">{t.nav.offer}</Link>
              <Link href="/privacy">{t.nav.privacy}</Link>
            </FooterColumn>
          </div>
        </div>

        <div className="mt-10 border-t border-[color:var(--rule)] pt-7">
          <div className="mb-5 font-mono text-[11px] uppercase text-[color:var(--ink-mute)]">
            {labels.requisites}
          </div>
          <dl className="grid grid-cols-1 gap-4 text-[13px] leading-[1.55] text-[color:var(--ink-soft)] md:grid-cols-2 xl:grid-cols-5">
            <Requisite label={labels.company} value={t.footer.legal} />
            <Requisite label={labels.bin} value="260540022744" />
            <Requisite label={labels.address} value={t.footer.address} />
            <Requisite label={labels.email} value="info@turanix.kz" />
            <Requisite label={labels.phone} value={phone} />
          </dl>
          <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-[color:var(--rule)] pt-5 font-mono text-[10px] uppercase text-[color:var(--ink-mute)]">
            <span>{t.footer.copy}</span>
            <span>{labels.country}</span>
          </div>
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
    <div>
      <div className="eyebrow mb-5">{title}</div>
      <div className="grid gap-3 text-[14px] text-[color:var(--ink-soft)] [&_a:hover]:text-[color:var(--ink)]">
        {children}
      </div>
    </div>
  );
}

function Requisite({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[color:var(--rule)] bg-white/62 p-4">
      <dt className="font-mono text-[10px] uppercase text-[color:var(--ink-mute)]">
        {label}
      </dt>
      <dd className="mt-3 text-[color:var(--ink)]">{value}</dd>
    </div>
  );
}
