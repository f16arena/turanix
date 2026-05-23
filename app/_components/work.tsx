"use client";

import { motion, useInView } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { useLang, useT } from "../_lib/i18n";

type Project = {
  index: string;
  name: string;
  domain: string;
  kindRu: string;
  kindEn: string;
  summaryRu: string;
  summaryEn: string;
  tagsRu: string[];
  tagsEn: string[];
  year: string;
  href?: string;
  preview?: "screenshot" | "generated";
  statusRu?: string;
  statusEn?: string;
};

const projects: Project[] = [
  {
    index: "01",
    name: "Orda Ops",
    domain: "ordaops.kz",
    kindRu: "Операционная платформа",
    kindEn: "Operations platform",
    summaryRu:
      "Заказы, финансы, диспетчеризация и аналитика для сервисного бизнеса.",
    summaryEn: "Orders, finance, dispatch and analytics for service teams.",
    tagsRu: ["Next.js", "Postgres", "Финансы"],
    tagsEn: ["Next.js", "Postgres", "Finance"],
    year: "2025",
    href: "https://ordaops.kz",
  },
  {
    index: "02",
    name: "CommRent",
    domain: "commrent.kz",
    kindRu: "Маркетплейс аренды",
    kindEn: "Rental marketplace",
    summaryRu:
      "Каталог, карты и кабинет управления коммерческой недвижимостью.",
    summaryEn: "Listings, maps and a management layer for commercial rentals.",
    tagsRu: ["Маркетплейс", "Карты", "Админка"],
    tagsEn: ["Marketplace", "Maps", "Admin"],
    year: "2025",
    href: "https://commrent.kz",
  },
  {
    index: "03",
    name: "Cyber",
    domain: "cyber-site-five.vercel.app",
    kindRu: "Сайт практики",
    kindEn: "Practice website",
    summaryRu:
      "Техническая бренд-поверхность для экспертизы в кибербезопасности.",
    summaryEn: "A technical brand surface for cybersecurity expertise.",
    tagsRu: ["Бренд", "Контент", "Безопасность"],
    tagsEn: ["Brand", "Content", "Security"],
    year: "2025",
    preview: "generated",
    statusRu: "Архив",
    statusEn: "Archive",
  },
  {
    index: "04",
    name: "PCApp",
    domain: "pcapp-five.vercel.app",
    kindRu: "Сайт приложения",
    kindEn: "App website",
    summaryRu:
      "Маркетинг, скачивание и продуктовая упаковка для Windows-приложения.",
    summaryEn: "Marketing, downloads and product packaging for a Windows app.",
    tagsRu: ["Скачивание", "Windows", "UX"],
    tagsEn: ["Downloads", "Windows", "UX"],
    year: "2026",
    href: "https://pcapp-five.vercel.app",
    preview: "generated",
  },
  {
    index: "05",
    name: "Tubir",
    domain: "tubir.vercel.app",
    kindRu: "Внутренний продукт",
    kindEn: "Internal product",
    summaryRu:
      "Небольшой собственный инструмент, собранный как полноценный продукт.",
    summaryEn: "A focused in-house tool built as a complete product.",
    tagsRu: ["Продукт", "Edge", "Эксперимент"],
    tagsEn: ["Product", "Edge", "Experiment"],
    year: "2026",
    href: "https://tubir.vercel.app",
  },
];

export function Work() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12%" });
  const t = useT();
  const { lang } = useLang();

  return (
    <section id="work" ref={ref} className="section bg-[#fbfbf7]">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_auto] lg:items-end"
        >
          <div>
            <div className="eyebrow mb-5">{t.work.eyebrow}</div>
            <h2 className="display section-title">
              {t.work.title1}{" "}
              <span className="text-[color:var(--accent)]">
                {t.work.titleEm}
              </span>{" "}
              {t.work.title2}
            </h2>
          </div>
          <div className="font-mono text-[11px] uppercase text-[color:var(--ink-mute)]">
            {t.work.count(projects.length)}
          </div>
        </motion.div>

        <ul className="grid auto-rows-fr grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.name}
              project={project}
              delay={index * 0.05}
              inView={inView}
              kind={lang === "ru" ? project.kindRu : project.kindEn}
              summary={lang === "ru" ? project.summaryRu : project.summaryEn}
              tags={lang === "ru" ? project.tagsRu : project.tagsEn}
              visit={t.work.visit}
              live={t.work.live}
              lang={lang}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  delay,
  inView,
  kind,
  summary,
  tags,
  visit,
  live,
  lang,
}: {
  project: Project;
  delay: number;
  inView: boolean;
  kind: string;
  summary: string;
  tags: string[];
  visit: string;
  live: string;
  lang: "ru" | "en";
}) {
  const isLinked = Boolean(project.href);
  const status =
    (lang === "ru" ? project.statusRu : project.statusEn) ?? live;
  const action = isLinked
    ? visit
    : lang === "ru"
      ? "Кейс без ссылки"
      : "Case only";
  const imageUrl = project.href
    ? `https://image.thum.io/get/width/1200/crop/820/noanimate/${project.href}`
    : null;
  const cardClass = `surface group flex h-full min-h-[500px] flex-col overflow-hidden ${
    isLinked ? "" : "cursor-default"
  }`;

  const content = (
    <>
        <div className="border-b border-[color:var(--rule)] p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="font-mono text-[10px] uppercase text-[color:var(--ink-mute)]">
                {project.index} / {kind}
              </div>
              <h3 className="mt-2 text-[24px] font-semibold leading-[1.1]">
                {project.name}
              </h3>
            </div>
            <span
              className={`inline-flex items-center gap-2 rounded-full border border-[color:var(--rule)] px-2 py-1 font-mono text-[10px] uppercase ${
                isLinked
                  ? "text-[color:var(--accent)]"
                  : "text-[color:var(--ink-mute)]"
              }`}
            >
              {isLinked ? (
                <span className="live-dot" />
              ) : (
                <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--ink-mute)]" />
              )}
              {status}
            </span>
          </div>
        </div>

        <div className="border-b border-[color:var(--rule)] bg-[color:var(--dark)] p-2">
          <div className="mb-2 flex items-center gap-1.5 px-1">
            <span className="h-2 w-2 rounded-full bg-[#ff6b5f]" />
            <span className="h-2 w-2 rounded-full bg-[#f6c34a]" />
            <span className="h-2 w-2 rounded-full bg-[#48c774]" />
            <span className="ml-2 truncate rounded-full bg-white/8 px-2 py-1 font-mono text-[9px] uppercase text-white/44">
              {project.domain}
            </span>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[6px] bg-white">
            {project.preview === "generated" || !imageUrl ? (
              <GeneratedPreview
                name={project.name}
                lang={lang}
                variant={project.name === "Cyber" ? "security" : "app"}
              />
            ) : (
              <Image
                src={imageUrl}
                alt={`${project.name} preview`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 20vw"
                loading="lazy"
                decoding="async"
                className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.025]"
              />
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-between gap-8 p-4">
          <p className="text-[14px] leading-[1.6] text-[color:var(--ink-soft)]">
            {summary}
          </p>

          <div>
            <div className="mb-4 flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span key={tag} className="tech-badge">
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-[color:var(--rule)] pt-4 font-mono text-[11px] uppercase text-[color:var(--ink-mute)]">
              <span className="min-w-0 truncate">{project.year}</span>
              <span className="shrink-0 text-[color:var(--ink)]">
                {action}
              </span>
            </div>
          </div>
        </div>
    </>
  );

  return (
    <motion.li
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
      {project.href ? (
        <a
          href={project.href}
          target="_blank"
          rel="noreferrer"
          className={cardClass}
        >
          {content}
        </a>
      ) : (
        <article aria-label={`${project.name} case`} className={cardClass}>
          {content}
        </article>
      )}
    </motion.li>
  );
}

function GeneratedPreview({
  name,
  lang,
  variant = "app",
}: {
  name: string;
  lang: "ru" | "en";
  variant?: "app" | "security";
}) {
  const isSecurity = variant === "security";
  const utility = isSecurity
    ? lang === "ru"
      ? "кибербез-практика"
      : "security practice"
    : lang === "ru"
      ? "Windows-утилита"
      : "Windows utility";
  const detail = isSecurity
    ? lang === "ru"
      ? "аудит / контент / защита"
      : "audit / content / protection"
    : lang === "ru"
      ? "скачивание / обновления / поддержка"
      : "downloads / updates / support";

  return (
    <svg
      className="absolute inset-0 h-full w-full transition-transform duration-700 group-hover:scale-[1.025]"
      viewBox="0 0 520 390"
      role="img"
      aria-label={`${name} product preview`}
    >
      <rect width="520" height="390" fill="#101216" />
      <path d="M0 86H520" stroke="white" strokeOpacity="0.08" />
      <rect x="30" y="28" width="138" height="18" rx="9" fill="white" opacity="0.18" />
      <rect x="348" y="28" width="110" height="18" rx="9" fill="#e2ff67" />
      <rect x="30" y="116" width="168" height="220" rx="10" fill="white" opacity="0.07" />
      <rect x="226" y="116" width="264" height="86" rx="10" fill="white" opacity="0.1" />
      <rect x="226" y="226" width="124" height="110" rx="10" fill="#355cff" opacity="0.78" />
      <rect x="366" y="226" width="124" height="110" rx="10" fill="#e2ff67" opacity="0.9" />
      <rect x="54" y="146" width="74" height="10" rx="5" fill="white" opacity="0.8" />
      <rect x="54" y="174" width="112" height="10" rx="5" fill="white" opacity="0.34" />
      <rect x="54" y="198" width="94" height="10" rx="5" fill="white" opacity="0.24" />
      <rect x="250" y="146" width="138" height="12" rx="6" fill="white" opacity="0.76" />
      <rect x="250" y="174" width="188" height="10" rx="5" fill="white" opacity="0.28" />
      <text x="54" y="298" fill="#e2ff67" fontSize="30" fontFamily="monospace" fontWeight="700">
        {name}
      </text>
      <text x="250" y="292" fill="#f7f8f3" fontSize="16" fontFamily="monospace">
        {utility}
      </text>
      <text x="250" y="316" fill="#f7f8f3" opacity="0.58" fontSize="13" fontFamily="monospace">
        {detail}
      </text>
    </svg>
  );
}
