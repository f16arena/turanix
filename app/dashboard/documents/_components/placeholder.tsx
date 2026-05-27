import Link from "next/link";

export function DocPlaceholder({ title }: { title: string }) {
  return (
    <div className="mx-auto max-w-[800px]">
      <div className="eyebrow mb-2">Документы</div>
      <h1 className="text-[28px] font-semibold leading-tight">{title}</h1>
      <p className="mt-2 max-w-[640px] text-[15px] leading-[1.6] text-[color:var(--ink-soft)]">
        Этот шаблон в работе. Структура полей утверждена ТЗ; интерактивная
        форма с печатью будет включена в следующей итерации модуля документов.
      </p>
      <Link
        href="/dashboard/documents"
        className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] uppercase text-[color:var(--ink-mute)] hover:text-[color:var(--ink)]"
      >
        ← К списку шаблонов
      </Link>
    </div>
  );
}
