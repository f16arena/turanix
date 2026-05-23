import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";

type LegalSection = {
  title: string;
  body: ReactNode;
};

export function LegalDocument({
  eyebrow,
  title,
  description,
  updated,
  sections,
}: {
  eyebrow: string;
  title: string;
  description: string;
  updated: string;
  sections: LegalSection[];
}) {
  return (
    <main className="min-h-screen bg-[color:var(--bg)] py-8">
      <div className="container-wide">
        <header className="mb-6 flex items-center justify-between gap-3 rounded-lg border border-[color:var(--rule)] bg-[color:var(--paper)] px-4 py-3">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <Image
              src="/brand/turanix-logo-full.png"
              alt="Turanix"
              width={300}
              height={64}
              className="h-8 w-auto max-w-[120px] min-[380px]:max-w-[160px] sm:max-w-[180px]"
            />
          </Link>
          <Link
            href="/#contact"
            className="min-w-0 truncate font-mono text-[10px] uppercase text-[color:var(--ink-mute)] hover:text-[color:var(--ink)]"
          >
            hello@turanix.kz
          </Link>
        </header>

        <section className="surface-dark mb-6 p-6 md:p-10">
          <div className="mb-8 font-mono text-[11px] uppercase text-[color:var(--signal)]">
            {eyebrow}
          </div>
          <h1 className="display max-w-[980px] break-words text-[36px] sm:text-[56px] md:text-[78px]">
            {title}
          </h1>
          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-[1fr_280px]">
            <p className="max-w-[760px] text-[17px] leading-[1.65] text-white/68">
              {description}
            </p>
            <div className="border-t border-white/12 pt-4">
              <div className="mb-3 font-mono text-[11px] uppercase text-white/42">
                Редакция
              </div>
              <div className="font-mono text-[13px] text-white/66">
                {updated}
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-3 pb-16">
          {sections.map((section, index) => (
            <article
              key={section.title}
              className="surface grid grid-cols-1 gap-6 p-5 md:grid-cols-[260px_1fr] md:p-6"
            >
              <div>
                <span className="font-mono text-[10px] uppercase text-[color:var(--accent)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h2 className="mt-3 text-[22px] font-semibold leading-[1.2]">
                  {section.title}
                </h2>
              </div>
              <div className="legal-copy text-[15px] leading-[1.7] text-[color:var(--ink-soft)]">
                {section.body}
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
