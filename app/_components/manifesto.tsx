"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { useT } from "../_lib/i18n";

export function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-14%" });
  const t = useT();

  return (
    <section
      id="studio"
      ref={ref}
      className="section border-white/10 bg-[color:var(--dark)] text-white"
    >
      <div className="container-wide">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.88fr_1.12fr]">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-5 font-mono text-[11px] uppercase text-[color:var(--signal)]">
              {t.manifesto.eyebrow}
            </div>
            <h2
              aria-label={`${t.manifesto.h1} ${t.manifesto.h2em} ${t.manifesto.h2} ${t.manifesto.h3}`}
              className="display max-w-[760px] text-[38px] min-[380px]:text-[44px] sm:text-[58px] md:text-[72px]"
            >
              {t.manifesto.h1}{" "}
              <span className="text-[color:var(--signal)]">
                {t.manifesto.h2em}
              </span>{" "}
              {t.manifesto.h2} {t.manifesto.h3}
            </h2>
            <p className="mt-8 max-w-[640px] text-[16px] leading-[1.75] text-white/64">
              {t.manifesto.lede}
            </p>
          </motion.div>

          <div className="grid gap-4">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.75, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="grid auto-rows-fr grid-cols-1 gap-4 md:grid-cols-3"
            >
              {t.manifesto.stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="min-h-[178px] rounded-lg border border-white/12 bg-white/[0.055] p-5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] uppercase text-white/48">
                      {stat.label}
                    </span>
                    <span className="font-mono text-[10px] text-white/36">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="mt-10 text-[30px] font-semibold leading-[1.05]">
                    {stat.value}
                  </div>
                  <div className="mt-3 text-[13px] leading-[1.5] text-white/56">
                    {stat.detail}
                  </div>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.75, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-lg border border-white/12 bg-white/[0.035]"
            >
              {t.manifesto.principles.map((item, index) => (
                <div
                  key={item.n}
                  className={`grid grid-cols-1 gap-3 p-5 md:grid-cols-[84px_1fr] ${
                    index > 0 ? "border-t border-white/10" : ""
                  }`}
                >
                  <span className="font-mono text-[11px] uppercase text-[color:var(--signal)]">
                    {item.n}
                  </span>
                  <div>
                    <h3 className="text-[21px] font-semibold">{item.title}</h3>
                    <p className="mt-2 text-[14px] leading-[1.6] text-white/54">
                      {item.detail}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
