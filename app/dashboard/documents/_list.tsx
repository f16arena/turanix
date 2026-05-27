"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteDocument, setDocumentStatus } from "./actions";
import type { DocRow } from "./page";

const fmt = (n: number, c: string) =>
  new Intl.NumberFormat("ru-KZ", {
    style: "currency",
    currency: c || "KZT",
    maximumFractionDigits: 0,
  }).format(n);

const KIND_LABEL: Record<DocRow["kind"], string> = {
  invoice: "Счёт",
  esf: "ЭСФ",
  avr: "АВР",
  reconciliation: "Акт сверки",
  quote: "КП",
};

const STATUSES: Array<{ v: DocRow["status"]; l: string; cls: string }> = [
  { v: "draft", l: "Черновик", cls: "bg-[#f4f5ef] text-[color:var(--ink-soft)]" },
  { v: "issued", l: "Выставлен", cls: "bg-blue-50 text-blue-700" },
  { v: "paid", l: "Оплачен", cls: "bg-[color:var(--accent-soft)] text-[color:var(--accent)]" },
  { v: "cancelled", l: "Аннулирован", cls: "bg-red-50 text-red-600" },
];

export function DocumentsList({
  rows,
  kind,
  status,
  q,
}: {
  rows: DocRow[];
  kind: string;
  status: string;
  q: string;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();

  function update(key: string, value: string) {
    const sp = new URLSearchParams(params.toString());
    if (value && value !== "all") sp.set(key, value);
    else sp.delete(key);
    router.replace(`/dashboard/documents?${sp.toString()}`);
  }

  return (
    <>
      <div className="mb-4 flex flex-wrap gap-2">
        <input
          type="search"
          defaultValue={q}
          placeholder="Поиск по номеру"
          onChange={(e) => update("q", e.target.value)}
          className="h-10 min-w-[220px] flex-1 rounded-md border border-[color:var(--rule)] bg-white px-3 text-[14px] outline-none focus:border-[color:var(--ink)]"
        />
        <Pills
          value={kind}
          onChange={(v) => update("kind", v)}
          options={[
            ["all", "Все типы"],
            ["invoice", "Счёт"],
            ["quote", "КП"],
            ["esf", "ЭСФ"],
            ["avr", "АВР"],
            ["reconciliation", "Акт сверки"],
          ]}
        />
        <Pills
          value={status}
          onChange={(v) => update("status", v)}
          options={[
            ["all", "Все статусы"],
            ["draft", "Черновик"],
            ["issued", "Выставлен"],
            ["paid", "Оплачен"],
            ["cancelled", "Аннулирован"],
          ]}
        />
      </div>

      <div className="surface overflow-hidden">
        {rows.length === 0 ? (
          <div className="p-8 text-center text-[14px] text-[color:var(--ink-soft)]">
            Документов по фильтрам нет.
          </div>
        ) : (
          <ul>
            <li className="hidden grid-cols-[110px_140px_120px_1fr_140px_140px_40px] gap-3 border-b border-[color:var(--rule)] px-4 py-3 font-mono text-[10px] uppercase text-[color:var(--ink-mute)] md:grid">
              <span>Тип</span>
              <span>Номер</span>
              <span>Дата</span>
              <span>Контрагент</span>
              <span>Статус</span>
              <span className="text-right">Сумма</span>
              <span></span>
            </li>
            {rows.map((r) => (
              <li
                key={r.id}
                className="grid grid-cols-1 gap-2 border-b border-[color:var(--rule)] px-4 py-3 last:border-b-0 md:grid-cols-[110px_140px_120px_1fr_140px_140px_40px] md:items-center"
              >
                <span className="font-mono text-[11px] uppercase text-[color:var(--ink-soft)]">
                  {KIND_LABEL[r.kind]}
                </span>
                <span className="font-mono text-[12px] text-[color:var(--ink)]">
                  {r.number}
                </span>
                <span className="font-mono text-[12px] text-[color:var(--ink-soft)]">
                  {r.date}
                </span>
                <span className="truncate text-[14px]">
                  {r.counterparty_snapshot?.name ?? "—"}
                </span>
                <select
                  value={r.status}
                  onChange={(e) =>
                    startTransition(() =>
                      setDocumentStatus(r.id, e.target.value as DocRow["status"]),
                    )
                  }
                  className={`h-7 w-fit rounded-full border-0 px-2 font-mono text-[10px] uppercase ${statusClass(r.status)}`}
                >
                  {STATUSES.map((s) => (
                    <option key={s.v} value={s.v}>
                      {s.l}
                    </option>
                  ))}
                </select>
                <span className="text-right font-mono text-[14px]">
                  {fmt(Number(r.total), r.currency)}
                </span>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => {
                    if (confirm(`Удалить документ ${r.number}?`))
                      startTransition(() => deleteDocument(r.id));
                  }}
                  className="text-[color:var(--ink-mute)] hover:text-red-600"
                  aria-label="Удалить"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

function Pills({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: [string, string][];
}) {
  return (
    <div className="inline-flex h-10 rounded-md border border-[color:var(--rule)] bg-white p-0.5">
      {options.map(([v, l]) => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          className={`rounded px-3 text-[12px] font-mono uppercase ${
            (value || "all") === v
              ? "bg-[color:var(--ink)] text-white"
              : "text-[color:var(--ink-mute)]"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

function statusClass(s: DocRow["status"]) {
  return STATUSES.find((x) => x.v === s)?.cls ?? "";
}
