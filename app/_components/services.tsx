"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { useT } from "../_lib/i18n";

export function Services() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12%" });
  const t = useT();

  return (
    <section id="services" ref={ref} className="section bg-[color:var(--bg)]">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 grid grid-cols-1 gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end"
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
          <p className="max-w-[680px] text-[16px] leading-[1.65] text-[color:var(--ink-soft)] lg:justify-self-end">
            {t.services.lede}
          </p>
        </motion.div>

        <ul className="grid auto-rows-fr grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
          {t.services.list.map((service, index) => (
            <ServiceCard
              key={service.title}
              {...service}
              index={index}
              inView={inView}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}

function ServiceCard({
  n,
  title,
  points,
  index,
  inView,
}: {
  n: string;
  title: string;
  points: readonly string[];
  index: number;
  inView: boolean;
}) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.7,
        delay: index * 0.05,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="surface flex min-h-[330px] flex-col p-5"
    >
      <div className="flex items-center justify-between border-b border-[color:var(--rule)] pb-4">
        <span className="font-mono text-[11px] uppercase text-[color:var(--accent)]">
          {n}
        </span>
        <span className="h-2 w-2 rounded-full bg-[color:var(--accent)]" />
      </div>

      <h3 className="mt-8 text-[22px] font-semibold leading-[1.12]">
        {title}
      </h3>

      <ul className="mt-auto space-y-3 pt-10">
        {points.map((point) => (
          <li
            key={point}
            className="grid grid-cols-[12px_1fr] gap-3 text-[14px] leading-[1.45] text-[color:var(--ink-soft)]"
          >
            <span className="mt-[0.5em] h-1.5 w-1.5 rounded-full bg-[color:var(--ink)]/35" />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </motion.li>
  );
}
