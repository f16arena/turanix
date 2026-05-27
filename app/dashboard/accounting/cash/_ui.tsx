"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { addCash, deleteCash } from "./actions";
import type { CashRow } from "./page";

const fmt = (n: number) =>
  new Intl.NumberFormat("ru-KZ", {
    style: "currency",
    currency: "KZT",
    maximumFractionDigits: 0,
  }).format(n);

export function CashUI({ rows }: { rows: CashRow[] }) {
  const [pending, startTransition] = useTransition();
  const [type, setType] = useState<"in" | "out">("in");

  const totalIn = rows.filter((r) => r.type === "in").reduce((s, r) => s + Number(r.amount), 0);
  const totalOut = rows.filter((r) => r.type === "out").reduce((s, r) => s + Number(r.amount), 0);
  const balance = totalIn - totalOut;

  return (
    <div>
      <form
        id="cash-form"
        action={(fd) => {
          fd.set("type", type);
          startTransition(async () => {
            await addCash(fd);
            (document.getElementById("cash-form") as HTMLFormElement)?.reset();
          });
        }}
        className="surface mb-6 grid grid-cols-2 gap-3 p-5 lg:grid-cols-[120px_140px_140px_1fr_120px]"
      >
        <div className="grid gap-1.5">
          <span className="font-mono text-[10px] uppercase text-[color:var(--ink-mute)]">
            Тип
          </span>
          <div className="inline-flex h-10 rounded-md border border-[color:var(--rule)] bg-white p-0.5">
            {(["in", "out"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`flex-1 rounded text-[12px] uppercase font-mono ${
                  type === t
                    ? "bg-[color:var(--ink)] text-white"
                    : "text-[color:var(--ink-mute)]"
                }`}
              >
                {t === "in" ? "Приход" : "Расход"}
              </button>
            ))}
          </div>
        </div>
        <Field label="Дата" name="date" type="date" defaultValue={new Date().toISOString().slice(0, 10)} />
        <Field label="Сумма ₸" name="amount" type="number" required />
        <Field label="Описание" name="description" />
        <button type="submit" disabled={pending} className="button-primary self-end">
          {pending ? "…" : "Добавить"}
        </button>
      </form>

      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Card label="Приход" value={fmt(totalIn)} accent />
        <Card label="Расход" value={fmt(totalOut)} />
        <Card label="Остаток" value={fmt(balance)} bold />
      </div>

      <div className="surface overflow-hidden">
        {rows.length === 0 ? (
          <div className="p-8 text-center text-[14px] text-[color:var(--ink-soft)]">
            Кассовых операций ещё нет.
          </div>
        ) : (
          <ul>
            {rows.map((row) => (
              <li
                key={row.id}
                className="grid grid-cols-[100px_120px_1fr_140px_40px] items-center gap-3 border-b border-[color:var(--rule)] px-4 py-2.5 text-[14px] last:border-b-0"
              >
                <span className="font-mono text-[12px] text-[color:var(--ink-soft)]">
                  {row.date}
                </span>
                <span
                  className={`inline-flex h-5 w-fit items-center rounded-full px-2 font-mono text-[10px] uppercase ${
                    row.type === "in"
                      ? "bg-[color:var(--accent-soft)] text-[color:var(--accent)]"
                      : "bg-[#f4f5ef] text-[color:var(--ink-soft)]"
                  }`}
                >
                  {row.type === "in" ? "приход" : "расход"}
                </span>
                <span className="truncate text-[color:var(--ink-soft)]">
                  {row.description ?? row.category ?? "—"}
                </span>
                <span
                  className={`text-right font-mono ${
                    row.type === "in" ? "text-[color:var(--accent)]" : ""
                  }`}
                >
                  {fmt(Number(row.amount))}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Удалить операцию?"))
                      startTransition(() => deleteCash(row.id));
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
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  defaultValue,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="font-mono text-[10px] uppercase text-[color:var(--ink-mute)]">
        {label}
      </span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        className="h-10 rounded-md border border-[color:var(--rule)] bg-white px-3 text-[14px] outline-none focus:border-[color:var(--ink)]"
      />
    </label>
  );
}

function Card({
  label,
  value,
  accent,
  bold,
}: {
  label: string;
  value: string;
  accent?: boolean;
  bold?: boolean;
}) {
  return (
    <div className={`surface p-4 ${bold ? "bg-[color:var(--ink)] text-white" : ""}`}>
      <div
        className={`font-mono text-[10px] uppercase ${
          bold ? "text-white/64" : "text-[color:var(--ink-mute)]"
        }`}
      >
        {label}
      </div>
      <div
        className={`mt-1.5 text-[20px] font-semibold ${
          accent ? "text-[color:var(--accent)]" : ""
        }`}
      >
        {value}
      </div>
    </div>
  );
}
