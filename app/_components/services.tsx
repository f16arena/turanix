"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { useLang, useT } from "../_lib/i18n";

export function Services() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12%" });
  const t = useT();
  const { lang } = useLang();
  const copy =
    lang === "ru"
      ? {
          include: "Что входит",
          result: "Результат",
          results: [
            "Понятная точка входа для заявок и продаж",
            "Продукт в телефоне клиента или команды",
            "Меньше ручной работы и потерянных задач",
            "Заявки и уведомления внутри Telegram",
            "Консультации и поиск по базе знаний",
          ],
        }
      : {
          include: "Included",
          result: "Outcome",
          results: [
            "A clear entry point for leads and sales",
            "A product in the customer's or team's phone",
            "Less manual work and fewer lost tasks",
            "Requests and notifications inside Telegram",
            "Consulting and search over a knowledge base",
          ],
        };

  return (
    <section id="services" ref={ref} className="section bg-[#fbfcf8]">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 grid grid-cols-1 gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-end"
        >
          <div>
            <div className="eyebrow mb-5">{t.services.eyebrow}</div>
            <h2 className="display section-title">
              {t.services.title1}{" "}
              <span className="text-[color:var(--accent)]">
                {t.services.titleEm}
              </span>{" "}
              {t.services.title2}
            </h2>
          </div>
          <p className="max-w-[720px] text-[16px] leading-[1.7] text-[color:var(--ink-soft)] lg:justify-self-end">
            {t.services.lede}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="surface overflow-hidden"
        >
          <div className="hidden grid-cols-[90px_1fr_1.25fr_0.9fr] border-b border-[color:var(--rule)] px-5 py-4 font-mono text-[10px] uppercase text-[color:var(--ink-mute)] lg:grid">
            <span>№</span>
            <span>{lang === "ru" ? "Направление" : "Service"}</span>
            <span>{copy.include}</span>
            <span>{copy.result}</span>
          </div>

          <ul className="grid">
            {t.services.list.map((service, index) => (
              <ServiceRow
                key={service.title}
                n={service.n}
                title={service.title}
                points={service.points}
                result={copy.results[index]}
                index={index}
              />
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}

function ServiceRow({
  n,
  title,
  points,
  result,
  index,
}: {
  n: string;
  title: string;
  points: readonly string[];
  result: string;
  index: number;
}) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{
        duration: 0.65,
        delay: index * 0.04,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="grid min-h-[156px] grid-cols-1 gap-5 border-b border-[color:var(--rule)] p-5 last:border-b-0 lg:grid-cols-[90px_1fr_1.25fr_0.9fr] lg:items-center"
    >
      <span className="font-mono text-[12px] uppercase text-[color:var(--accent)]">
        {n}
      </span>
      <h3 className="max-w-[360px] text-[26px] font-semibold leading-[1.08]">
        {title}
      </h3>
      <ul className="grid gap-2 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
        {points.map((point) => (
          <li
            key={point}
            className="rounded-full border border-[color:var(--rule)] bg-white px-3 py-2 text-[13px] leading-[1.35] text-[color:var(--ink-soft)]"
          >
            {point}
          </li>
        ))}
      </ul>
      <p className="max-w-[320px] text-[14px] leading-[1.6] text-[color:var(--ink-soft)]">
        {result}
      </p>
    </motion.li>
  );
}
