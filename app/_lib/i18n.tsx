"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type Lang = "ru" | "en";

export const dict = {
  ru: {
    nav: {
      work: "Проекты",
      studio: "Подход",
      services: "Услуги",
      stack: "Стек",
      contact: "Контакты",
      offer: "Оферта",
      privacy: "Политика",
      cta: "Начать проект",
    },
    status: {
      systems: "Системы",
      operational: "Принимаем проекты на 2026",
      region: "Усть-Каменогорск / UTC+5",
      stack: "Сайты · Приложения · AI · Автоматизация",
      version: "ТОО Turanix / БИН 260540022744",
    },
    hero: {
      eyebrow: "IT-компания полного цикла",
      kicker: "Turanix · Казахстан · с 2026",
      l1: "IT-продукты",
      l2: "для бизнеса",
      l3em: "под ключ.",
      lede:
        "Проектируем и запускаем цифровые продукты: корпоративные сайты, мобильные приложения, CRM, Telegram-интеграции и AI-консультантов. Берём задачу от идеи до продакшена и сопровождения.",
      ctaPrimary: "Обсудить задачу",
      ctaSecondary: "Смотреть проекты",
      currently: "Фокус",
      open: "Сайты · приложения · автоматизация · AI",
      proofs: [
        { value: "01", label: "Один подрядчик", detail: "дизайн, код, запуск" },
        { value: "05", label: "Проектов", detail: "в портфолио" },
        { value: "2026", label: "Набор", detail: "новых проектов" },
      ],
      map: [
        { label: "Сайт", detail: "лендинг / SaaS" },
        { label: "Приложение", detail: "iOS / Android" },
        { label: "CRM", detail: "процессы / данные" },
        { label: "Telegram", detail: "боты / мини-приложения" },
        { label: "AI", detail: "консультант / RAG" },
      ],
    },
    manifesto: {
      eyebrow: "03 — Подход",
      h1: "Сначала разбираем процесс.",
      h2em: "Потом",
      h2: "собираем систему,",
      h3: "которой можно пользоваться каждый день.",
      lede:
        "Turanix не продаёт набор экранов. Мы связываем продукт, данные, интеграции и поддержку в один рабочий контур: чтобы сайт приводил заявки, приложение работало стабильно, а автоматизация снимала ручную работу.",
      stats: [
        { label: "Юр. лицо", value: "ТОО", detail: "БИН 260540022744" },
        { label: "Фокус", value: "B2B", detail: "сайты, приложения, автоматизация" },
        { label: "Формат", value: "Полный цикл", detail: "анализ, интерфейс, разработка, запуск" },
      ],
      principles: [
        { n: "01", title: "Бриф и карта процесса", detail: "фиксируем цель, роли, данные и ограничения" },
        { n: "02", title: "Интерфейс и архитектура", detail: "делаем понятный интерфейс и устойчивую техническую схему" },
        { n: "03", title: "Запуск и сопровождение", detail: "деплой, домены, аналитика, поддержка после релиза" },
      ],
    },
    work: {
      eyebrow: "02 — Проекты",
      title1: "Работы,",
      titleEm: "которые",
      title2: "уже живут в продакшене.",
      count: (n: number) => `${n} проектов · сайты · платформы · продукты`,
      visit: "Открыть",
      live: "Продакшен",
    },
    services: {
      eyebrow: "01 — Услуги",
      title1: "Что",
      titleEm: "делаем",
      title2: "для компаний.",
      lede:
        "Закрываем полный цифровой контур: внешний сайт, мобильный продукт, внутреннюю систему, интеграции с каналами продаж и AI-слой для консультаций или обработки данных.",
      list: [
        {
          n: "01",
          title: "Сайты и веб-платформы",
          points: ["Корпоративные сайты и лендинги", "SaaS, кабинеты и админ-панели", "Платежи, карты, личные кабинеты"],
        },
        {
          n: "02",
          title: "Мобильные приложения",
          points: ["iOS и Android", "React Native и Expo", "Публикация и поддержка релизов"],
        },
        {
          n: "03",
          title: "Автоматизация бизнеса",
          points: ["CRM и операционные системы", "Заявки, склад, финансы, отчёты", "Интеграции между сервисами"],
        },
        {
          n: "04",
          title: "Telegram-интеграции",
          points: ["Боты и мини-приложения", "Уведомления, оплаты, заявки", "Связка с CRM и базами данных"],
        },
        {
          n: "05",
          title: "AI-консультанты",
          points: ["Чат-боты по базе знаний", "RAG, векторный поиск, сценарии", "Интеграция с сайтом и Telegram"],
        },
      ],
    },
    stack: {
      eyebrow: "04 — Стек",
      title1: "Технологии",
      titleEm: "без",
      title2: "лишнего шума.",
      lede:
        "Подбираем стек под задачу: быстрый запуск, понятная поддержка, безопасное масштабирование и нормальная передача проекта владельцу бизнеса.",
      groups: [
        { label: "Фронтенд", items: ["Next.js", "React", "TypeScript", "Tailwind"] },
        { label: "Приложения", items: ["React Native", "Expo", "Swift", "Kotlin"] },
        { label: "Бэкенд", items: ["Node.js", "Python", "PostgreSQL", "Redis"] },
        { label: "Инфра", items: ["Vercel", "AWS", "Docker", "GitHub Actions"] },
        { label: "AI", items: ["Claude", "OpenAI", "Vector DB", "LangChain"] },
      ],
    },
    contact: {
      eyebrow: "05 — Контакты",
      h1: "Есть задача?",
      h2em: "Соберём",
      h2: "её в продукт.",
      lede:
        "Коротко опишите, что нужно запустить: сайт, приложение, автоматизацию, Telegram-бота или AI-консультанта. Вернёмся с понятными шагами и оценкой.",
      studio: "Офис",
      channels: "Каналы",
      address: ["Усть-Каменогорск, Казахстан", "Восточно-Казахстанская область", "UTC+5"],
      scope: ["Сайт / мобильное приложение", "CRM / Telegram / AI-интеграции"],
    },
    footer: {
      tagline:
        "IT-компания из Казахстана: разработка сайтов, мобильных приложений, автоматизация бизнеса и AI-интеграции.",
      sitemap: "Навигация",
      elsewhere: "Каналы",
      copy: "© 2026 ТОО Turanix. Все права защищены.",
      legal: "ТОО «Turanix» · БИН 260540022744",
      address: "пр. Илияса Есенберлина 20-272, Усть-Каменогорск, 070000, KZ",
      documents: "Документы",
    },
  },
  en: {
    nav: {
      work: "Work",
      studio: "Approach",
      services: "Services",
      stack: "Stack",
      contact: "Contact",
      offer: "Offer",
      privacy: "Privacy",
      cta: "Start a project",
    },
    status: {
      systems: "Systems",
      operational: "Accepting 2026 projects",
      region: "Ust-Kamenogorsk / UTC+5",
      stack: "Web · Mobile · AI · Automation",
      version: "Turanix LLP / BIN 260540022744",
    },
    hero: {
      eyebrow: "Full-cycle IT company",
      kicker: "Turanix · Kazakhstan · est. 2026",
      l1: "Digital products",
      l2: "for business",
      l3em: "end to end.",
      lede:
        "We design and launch digital products: company websites, mobile apps, CRM, Telegram integrations and AI consultants. From idea to production and support.",
      ctaPrimary: "Discuss a project",
      ctaSecondary: "See work",
      currently: "Focus",
      open: "Web · mobile · automation · AI",
      proofs: [
        { value: "01", label: "One team", detail: "design, code, launch" },
        { value: "05", label: "Projects", detail: "in portfolio" },
        { value: "2026", label: "Open", detail: "for new work" },
      ],
      map: [
        { label: "Web", detail: "landing / SaaS" },
        { label: "Mobile", detail: "iOS / Android" },
        { label: "CRM", detail: "process / data" },
        { label: "Telegram", detail: "bots / mini apps" },
        { label: "AI", detail: "consultant / RAG" },
      ],
    },
    manifesto: {
      eyebrow: "03 — Approach",
      h1: "We map the process first.",
      h2em: "Then",
      h2: "build the system",
      h3: "people can use every day.",
      lede:
        "Turanix does not sell a pile of screens. We connect product, data, integrations and support into one working loop: so the website brings leads, the app stays reliable, and automation removes manual work.",
      stats: [
        { label: "Entity", value: "LLP", detail: "BIN 260540022744" },
        { label: "Focus", value: "B2B", detail: "web, mobile, automation" },
        { label: "Format", value: "Full cycle", detail: "analysis, UX, development, launch" },
      ],
      principles: [
        { n: "01", title: "Brief and process map", detail: "goals, roles, data and constraints" },
        { n: "02", title: "Interface and architecture", detail: "clear UX and a stable technical scheme" },
        { n: "03", title: "Launch and support", detail: "deploy, domains, analytics and post-release care" },
      ],
    },
    work: {
      eyebrow: "02 — Work",
      title1: "Work",
      titleEm: "already",
      title2: "running in production.",
      count: (n: number) => `${n} projects · sites · platforms · products`,
      visit: "Open",
      live: "Production",
    },
    services: {
      eyebrow: "01 — Services",
      title1: "What we",
      titleEm: "build",
      title2: "for companies.",
      lede:
        "We cover the full digital loop: a public website, mobile product, internal system, sales channel integrations and an AI layer for consulting or data workflows.",
      list: [
        {
          n: "01",
          title: "Websites and platforms",
          points: ["Company sites and landing pages", "SaaS, dashboards and admin panels", "Payments, maps and accounts"],
        },
        {
          n: "02",
          title: "Mobile apps",
          points: ["iOS and Android", "React Native and Expo", "Release publishing and support"],
        },
        {
          n: "03",
          title: "Business automation",
          points: ["CRM and operations systems", "Requests, warehouse, finance, reports", "Integrations between services"],
        },
        {
          n: "04",
          title: "Telegram integrations",
          points: ["Bots and mini apps", "Notifications, payments, requests", "CRM and database connection"],
        },
        {
          n: "05",
          title: "AI consultants",
          points: ["Knowledge-base chatbots", "RAG, vector search, workflows", "Website and Telegram integration"],
        },
      ],
    },
    stack: {
      eyebrow: "04 — Stack",
      title1: "Technology",
      titleEm: "without",
      title2: "extra noise.",
      lede:
        "We choose tools for the job: fast launch, clear maintenance, safe scaling and a clean handover to the business owner.",
      groups: [
        { label: "Frontend", items: ["Next.js", "React", "TypeScript", "Tailwind"] },
        { label: "Mobile", items: ["React Native", "Expo", "Swift", "Kotlin"] },
        { label: "Backend", items: ["Node.js", "Python", "PostgreSQL", "Redis"] },
        { label: "Infra", items: ["Vercel", "AWS", "Docker", "GitHub Actions"] },
        { label: "AI", items: ["Claude", "OpenAI", "Vector DB", "LangChain"] },
      ],
    },
    contact: {
      eyebrow: "05 — Contact",
      h1: "Have a task?",
      h2em: "We turn",
      h2: "it into a product.",
      lede:
        "Briefly describe what you want to launch: a website, app, automation layer, Telegram bot or AI consultant. We'll reply with clear next steps and an estimate.",
      studio: "Office",
      channels: "Channels",
      address: ["Ust-Kamenogorsk, Kazakhstan", "East Kazakhstan Region", "UTC+5"],
      scope: ["Website / mobile app", "CRM / Telegram / AI integrations"],
    },
    footer: {
      tagline:
        "An IT company from Kazakhstan: websites, mobile apps, business automation and AI integrations.",
      sitemap: "Sitemap",
      elsewhere: "Channels",
      copy: "© 2026 Turanix LLP. All rights reserved.",
      legal: "Turanix LLP · BIN 260540022744",
      address: "20-272 Iliyas Yesenberlin Ave, Ust-Kamenogorsk, 070000, KZ",
      documents: "Documents",
    },
  },
} as const;

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
};

const LangContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ru");

  useEffect(() => {
    let raf = 0;
    try {
      const saved = localStorage.getItem("turanix:lang") as Lang | null;
      if (saved === "ru" || saved === "en") {
        raf = requestAnimationFrame(() => setLangState(saved));
      }
    } catch {}
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("turanix:lang", lang);
      document.documentElement.lang = lang;
    } catch {}
  }, [lang]);

  const setLang = useCallback((l: Lang) => setLangState(l), []);
  const toggle = useCallback(
    () => setLangState((l) => (l === "ru" ? "en" : "ru")),
    [],
  );

  return (
    <LangContext.Provider value={{ lang, setLang, toggle }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside LanguageProvider");
  return ctx;
}

export function useT() {
  const { lang } = useLang();
  return dict[lang];
}
