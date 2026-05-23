"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { useT } from "../_lib/i18n";

export function Stack() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12%" });
  const t = useT();

  return (
    <section id="stack" ref={ref} className="section bg-[#fbfcf8]">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 grid grid-cols-1 gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end"
        >
          <div>
            <div className="eyebrow mb-5">{t.stack.eyebrow}</div>
            <h2 className="display section-title">
              {t.stack.title1}{" "}
              <span className="text-[color:var(--accent)]">
                {t.stack.titleEm}
              </span>{" "}
              {t.stack.title2}
            </h2>
          </div>
          <p className="max-w-[660px] text-[16px] leading-[1.65] text-[color:var(--ink-soft)] lg:justify-self-end">
            {t.stack.lede}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="surface overflow-hidden"
        >
          <div className="grid grid-cols-1 md:grid-cols-5">
            {t.stack.groups.map((group, index) => (
              <div
                key={group.label}
                className="min-h-[250px] border-b border-[color:var(--rule)] p-5 md:border-b-0 md:border-r last:md:border-r-0"
              >
                <div className="flex items-center justify-between border-b border-[color:var(--rule)] pb-4">
                  <span className="font-mono text-[11px] uppercase text-[color:var(--ink)]">
                    {group.label}
                  </span>
                  <span className="font-mono text-[10px] text-[color:var(--ink-mute)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <ul className="mt-8 space-y-4">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 text-[14px] text-[color:var(--ink-soft)]"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
