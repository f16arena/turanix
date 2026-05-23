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
      stack: "Сайты · мобильные приложения · автоматизация · ИИ",
      version: "ТОО Turanix / БИН 260540022744",
    },
    hero: {
      eyebrow: "IT-компания полного цикла",
      kicker: "Сайты, приложения, автоматизация",
      l1: "IT-системы",
      l2: "для бизнеса,",
      l3em: "которые работают.",
      lede:
        "Turanix проектирует и запускает сайты, мобильные приложения, CRM, Telegram-интеграции и ИИ-консультантов. Берем задачу от идеи и интерфейса до продакшена, поддержки и понятной передачи владельцу бизнеса.",
      ctaPrimary: "Обсудить проект",
      ctaSecondary: "Смотреть проекты",
      currently: "Фокус",
      open: "Сайты · мобайл · автоматизация · ИИ",
      proofs: [
        { value: "ТОО", label: "Официальная работа", detail: "договор, счет, документы" },
        { value: "B2B", label: "Для компаний", detail: "заявки, процессы, данные" },
        { value: "2026", label: "Набор проектов", detail: "берем задачи на запуск" },
      ],
      map: [
        { label: "Сайт", detail: "лендинг / платформа" },
        { label: "Мобайл", detail: "iOS / Android" },
        { label: "CRM", detail: "процессы / данные" },
        { label: "Telegram", detail: "боты / мини-приложения" },
        { label: "ИИ", detail: "консультант / база знаний" },
      ],
    },
    manifesto: {
      eyebrow: "03 - Подход",
      h1: "Сначала понимаем процесс.",
      h2em: "Потом",
      h2: "собираем систему,",
      h3: "которой можно пользоваться каждый день.",
      lede:
        "Мы не продаем набор экранов. Мы связываем сайт, приложение, данные, интеграции и поддержку в один рабочий контур: чтобы заявки не терялись, команда видела статус, а автоматизация снимала ручную работу.",
      stats: [
        { label: "Юр. лицо", value: "ТОО", detail: "БИН 260540022744" },
        { label: "Формат", value: "Полный цикл", detail: "анализ, UX, разработка, запуск" },
        { label: "Фокус", value: "B2B", detail: "сайты, мобайл, CRM, ИИ" },
      ],
      principles: [
        { n: "01", title: "Разбор задачи", detail: "фиксируем цель, роли, данные, ограничения и ожидаемый результат" },
        { n: "02", title: "Прототип и архитектура", detail: "показываем логику интерфейса и схему будущей системы" },
        { n: "03", title: "Разработка и интеграции", detail: "пишем код, подключаем API, платежи, Telegram, CRM и ИИ-слой" },
        { n: "04", title: "Запуск и сопровождение", detail: "домен, хостинг, аналитика, проверка сценариев и поддержка после релиза" },
      ],
    },
    work: {
      eyebrow: "02 - Проекты",
      title1: "Работы,",
      titleEm: "которые",
      title2: "уже запущены.",
      count: (n: number) => `${n} проектов · сайты · платформы · продукты`,
      visit: "Открыть",
      live: "Запущен",
    },
    services: {
      eyebrow: "01 - Услуги",
      title1: "Что",
      titleEm: "делаем",
      title2: "для компаний.",
      lede:
        "Закрываем полный цифровой контур: внешний сайт, мобильный продукт, внутреннюю систему, интеграции с каналами продаж и ИИ-слой для консультаций или обработки данных.",
      list: [
        {
          n: "01",
          title: "Сайты и веб-платформы",
          points: ["Корпоративные сайты и лендинги", "SaaS, личные кабинеты и админ-панели", "Платежи, карты, формы и аналитика"],
        },
        {
          n: "02",
          title: "Мобильные приложения",
          points: ["iOS и Android", "React Native и Expo", "Публикация и поддержка релизов"],
        },
        {
          n: "03",
          title: "Автоматизация бизнеса",
          points: ["CRM и операционные системы", "Заявки, склад, финансы, отчеты", "Связка сервисов и баз данных"],
        },
        {
          n: "04",
          title: "Telegram-интеграции",
          points: ["Боты и мини-приложения", "Уведомления, оплаты, заявки", "Интеграция с CRM и сайтом"],
        },
        {
          n: "05",
          title: "ИИ-консультанты",
          points: ["Чат-боты по базе знаний", "RAG, поиск по документам, сценарии", "Подключение к сайту и Telegram"],
        },
      ],
    },
    stack: {
      eyebrow: "04 - Стек",
      title1: "Технологии",
      titleEm: "под",
      title2: "задачу бизнеса.",
      lede:
        "Выбираем стек без моды ради моды: быстрый запуск, понятная поддержка, безопасное масштабирование и нормальная передача проекта владельцу.",
      groups: [
        { label: "Фронтенд", items: ["Next.js", "React", "TypeScript", "Tailwind"] },
        { label: "Мобайл", items: ["React Native", "Expo", "Swift", "Kotlin"] },
        { label: "Бэкенд", items: ["Node.js", "Python", "PostgreSQL", "Redis"] },
        { label: "Инфра", items: ["Vercel", "AWS", "Docker", "GitHub Actions"] },
        { label: "ИИ", items: ["Claude", "OpenAI", "Vector DB", "LangChain"] },
      ],
    },
    contact: {
      eyebrow: "05 - Контакты",
      h1: "Есть задача?",
      h2em: "Обсудим",
      h2: "и соберем план запуска.",
      lede:
        "Коротко опишите, что нужно запустить: сайт, приложение, автоматизацию, Telegram-бота или ИИ-консультанта. Вернемся с понятными шагами, сроками и оценкой.",
      studio: "Офис",
      channels: "Каналы",
      address: ["Усть-Каменогорск, Казахстан", "Восточно-Казахстанская область", "UTC+5"],
      scope: ["Сайт / мобильное приложение", "CRM / Telegram / ИИ-интеграции"],
    },
    footer: {
      tagline:
        "IT-компания из Казахстана: разработка сайтов, мобильных приложений, автоматизация бизнеса и ИИ-интеграции.",
      sitemap: "Навигация",
      elsewhere: "Связь",
      copy: "© 2026 ТОО «Turanix». Все права защищены.",
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
      stack: "Web · mobile apps · automation · AI",
      version: "Turanix LLP / BIN 260540022744",
    },
    hero: {
      eyebrow: "Full-cycle IT company",
      kicker: "Web, mobile, automation",
      l1: "Software systems",
      l2: "for business",
      l3em: "that work.",
      lede:
        "Turanix designs and launches websites, mobile apps, CRM systems, Telegram integrations and AI consultants. We take work from idea and interface to production, support and clean handover.",
      ctaPrimary: "Discuss a project",
      ctaSecondary: "See projects",
      currently: "Focus",
      open: "Web · mobile · automation · AI",
      proofs: [
        { value: "LLP", label: "Official work", detail: "contract, invoice, documents" },
        { value: "B2B", label: "For companies", detail: "leads, processes, data" },
        { value: "2026", label: "Project intake", detail: "open for launches" },
      ],
      map: [
        { label: "Website", detail: "landing / platform" },
        { label: "Mobile", detail: "iOS / Android" },
        { label: "CRM", detail: "process / data" },
        { label: "Telegram", detail: "bots / mini apps" },
        { label: "AI", detail: "consultant / knowledge base" },
      ],
    },
    manifesto: {
      eyebrow: "03 - Approach",
      h1: "We understand the process first.",
      h2em: "Then",
      h2: "we build a system",
      h3: "people can use every day.",
      lede:
        "We do not sell a pile of screens. We connect website, app, data, integrations and support into one working loop: so requests do not get lost, teams see status, and automation removes manual work.",
      stats: [
        { label: "Entity", value: "LLP", detail: "BIN 260540022744" },
        { label: "Format", value: "Full cycle", detail: "analysis, UX, development, launch" },
        { label: "Focus", value: "B2B", detail: "web, mobile, CRM, AI" },
      ],
      principles: [
        { n: "01", title: "Discovery", detail: "goals, roles, data, constraints and expected result" },
        { n: "02", title: "Prototype and architecture", detail: "interface logic and the future system scheme" },
        { n: "03", title: "Development and integrations", detail: "code, APIs, payments, Telegram, CRM and AI layer" },
        { n: "04", title: "Launch and support", detail: "domain, hosting, analytics, scenario checks and post-release care" },
      ],
    },
    work: {
      eyebrow: "02 - Work",
      title1: "Projects",
      titleEm: "already",
      title2: "launched.",
      count: (n: number) => `${n} projects · websites · platforms · products`,
      visit: "Open",
      live: "Live",
    },
    services: {
      eyebrow: "01 - Services",
      title1: "What we",
      titleEm: "build",
      title2: "for companies.",
      lede:
        "We cover the full digital loop: a public website, mobile product, internal system, sales channel integrations and an AI layer for consulting or data workflows.",
      list: [
        {
          n: "01",
          title: "Websites and platforms",
          points: ["Company sites and landing pages", "SaaS, accounts and admin panels", "Payments, maps, forms and analytics"],
        },
        {
          n: "02",
          title: "Mobile apps",
          points: ["iOS and Android", "React Native and Expo", "Release publishing and support"],
        },
        {
          n: "03",
          title: "Business automation",
          points: ["CRM and operating systems", "Requests, warehouse, finance, reports", "Service and database integrations"],
        },
        {
          n: "04",
          title: "Telegram integrations",
          points: ["Bots and mini apps", "Notifications, payments, requests", "CRM and website connection"],
        },
        {
          n: "05",
          title: "AI consultants",
          points: ["Knowledge-base chatbots", "RAG, document search, workflows", "Website and Telegram integration"],
        },
      ],
    },
    stack: {
      eyebrow: "04 - Stack",
      title1: "Technology",
      titleEm: "for",
      title2: "the business task.",
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
      eyebrow: "05 - Contact",
      h1: "Have a task?",
      h2em: "Let's discuss",
      h2: "and build a launch plan.",
      lede:
        "Briefly describe what you want to launch: a website, app, automation layer, Telegram bot or AI consultant. We'll reply with clear next steps, timing and an estimate.",
      studio: "Office",
      channels: "Channels",
      address: ["Ust-Kamenogorsk, Kazakhstan", "East Kazakhstan Region", "UTC+5"],
      scope: ["Website / mobile app", "CRM / Telegram / AI integrations"],
    },
    footer: {
      tagline:
        "An IT company from Kazakhstan: websites, mobile apps, business automation and AI integrations.",
      sitemap: "Sitemap",
      elsewhere: "Contacts",
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
