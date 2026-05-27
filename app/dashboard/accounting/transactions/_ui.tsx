"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Trash2 } from "lucide-react";
import { addTransaction, deleteTransaction } from "./actions";
import type { TxRow } from "./page";

const INCOME_CATS = [
  "Реализация товаров",
  "Реализация услуг",
  "Аренда",
  "Прочие доходы",
];
const EXPENSE_CATS = [
  "Зарплата",
  "Налоги и отчисления",
  "Аренда помещения",
  "Закуп товаров",
  "Коммунальные",
  "Транспорт",
  "Реклама",
  "Банковские услуги",
  "Прочие расходы",
];

const fmt = (n: number) =>
  new Intl.NumberFormat("ru-KZ", {
    style: "currency",
    currency: "KZT",
    maximumFractionDigits: 0,
  }).format(n);

export function TransactionsUI({
  rows,
  type,
  month,
  q,
}: {
  rows: TxRow[];
  type: string;
  month: string;
  q: string;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [txType, setTxType] = useState<"income" | "expense">("expense");
  const [pending, startTransition] = useTransition();

  const income = rows.filter((r) => r.type === "income").reduce((s, r) => s + Number(r.amount), 0);
  const expense = rows.filter((r) => r.type === "expense").reduce((s, r) => s + Number(r.amount), 0);

  function update(key: string, value: string) {
    const sp = new URLSearchParams(params.toString());
    if (value) sp.set(key, value);
    else sp.delete(key);
    router.replace(`/dashboard/accounting/transactions?${sp.toString()}`);
  }

  return (
    <div>
      <form
        id="tx-form"
        action={(fd) => {
          fd.set("type", txType);
          startTransition(async () => {
            await addTransaction(fd);
            (document.getElementById("tx-form") as HTMLFormElement)?.reset();
          });
        }}
        className="surface mb-6 grid grid-cols-2 gap-3 p-5 lg:grid-cols-[120px_140px_180px_140px_1fr_120px]"
      >
        <Toggle type={txType} setType={setTxType} />
        <Field label="Дата" name="date" type="date" defaultValue={new Date().toISOString().slice(0, 10)} />
        <Select
          label="Категория"
          name="category"
          options={txType === "income" ? INCOME_CATS : EXPENSE_CATS}
        />
        <Field label="Сумма ₸" name="amount" type="number" />
        <Field label="Описание / контрагент" name="description" />
        <button type="submit" disabled={pending} className="button-primary self-end">
          {pending ? "…" : "Добавить"}
        </button>
      </form>

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Card label="Доходы" value={fmt(income)} accent />
        <Card label="Расходы" value={fmt(expense)} />
        <Card label="Баланс" value={fmt(income - expense)} />
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <input
          type="search"
          defaultValue={q}
          placeholder="Поиск"
          onChange={(e) => update("q", e.target.value)}
          className="h-9 min-w-[200px] flex-1 rounded-md border border-[color:var(--rule)] bg-white px-3 text-[14px] outline-none focus:border-[color:var(--ink)]"
        />
        <input
          type="month"
          defaultValue={month}
          onChange={(e) => update("month", e.target.value)}
          className="h-9 rounded-md border border-[color:var(--rule)] bg-white px-3 text-[13px] font-mono outline-none focus:border-[color:var(--ink)]"
        />
        <div className="inline-flex h-9 rounded-md border border-[color:var(--rule)] bg-white p-0.5">
          {[
            { v: "all", l: "Все" },
            { v: "income", l: "Доходы" },
            { v: "expense", l: "Расходы" },
          ].map((o) => (
            <button
              key={o.v}
              type="button"
              onClick={() => update("type", o.v === "all" ? "" : o.v)}
              className={`rounded px-3 text-[12px] font-mono uppercase ${
                (type || "all") === o.v
                  ? "bg-[color:var(--ink)] text-white"
                  : "text-[color:var(--ink-mute)]"
              }`}
            >
              {o.l}
            </button>
          ))}
        </div>
      </div>

      <div className="surface overflow-hidden">
        {rows.length === 0 ? (
          <div className="p-8 text-center text-[14px] text-[color:var(--ink-soft)]">
            Операций по выбранным фильтрам нет.
          </div>
        ) : (
          <ul>
            {rows.map((row) => (
              <li
                key={row.id}
                className="grid grid-cols-[100px_120px_160px_1fr_140px_40px] items-center gap-3 border-b border-[color:var(--rule)] px-4 py-2.5 text-[14px] last:border-b-0"
              >
                <span className="font-mono text-[12px] text-[color:var(--ink-soft)]">
                  {row.date}
                </span>
                <span
                  className={`inline-flex h-5 w-fit items-center rounded-full px-2 font-mono text-[10px] uppercase ${
                    row.type === "income"
                      ? "bg-[color:var(--accent-soft)] text-[color:var(--accent)]"
                      : "bg-[#f4f5ef] text-[color:var(--ink-soft)]"
                  }`}
                >
                  {row.type === "income" ? "доход" : "расход"}
                </span>
                <span className="truncate text-[13.5px]">{row.category}</span>
                <span className="truncate text-[color:var(--ink-soft)]">
                  {row.description ?? row.counterparty ?? "—"}
                </span>
                <span
                  className={`text-right font-mono ${
                    row.type === "income" ? "text-[color:var(--accent)]" : ""
                  }`}
                >
                  {fmt(Number(row.amount))}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Удалить операцию?"))
                      startTransition(() => deleteTransaction(row.id));
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

function Toggle({
  type,
  setType,
}: {
  type: "income" | "expense";
  setType: (t: "income" | "expense") => void;
}) {
  return (
    <div className="grid gap-1.5">
      <span className="font-mono text-[10px] uppercase text-[color:var(--ink-mute)]">
        Тип
      </span>
      <div className="inline-flex h-10 rounded-md border border-[color:var(--rule)] bg-white p-0.5">
        {(["expense", "income"] as const).map((t) => (
          <button
            type="button"
            key={t}
            onClick={() => setType(t)}
            className={`flex-1 rounded text-[12px] uppercase font-mono ${
              type === t
                ? "bg-[color:var(--ink)] text-white"
                : "text-[color:var(--ink-mute)]"
            }`}
          >
            {t === "income" ? "Доход" : "Расход"}
          </button>
        ))}
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
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
        required={name === "date" || name === "amount"}
        className="h-10 rounded-md border border-[color:var(--rule)] bg-white px-3 text-[14px] outline-none focus:border-[color:var(--ink)]"
      />
    </label>
  );
}

function Select({
  label,
  name,
  options,
}: {
  label: string;
  name: string;
  options: string[];
}) {
  return (
    <label className="grid gap-1.5">
      <span className="font-mono text-[10px] uppercase text-[color:var(--ink-mute)]">
        {label}
      </span>
      <select
        name={name}
        required
        className="h-10 rounded-md border border-[color:var(--rule)] bg-white px-2 text-[14px] outline-none focus:border-[color:var(--ink)]"
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}

function Card({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="surface p-4">
      <div className="font-mono text-[10px] uppercase text-[color:var(--ink-mute)]">
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
