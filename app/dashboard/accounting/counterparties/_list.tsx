"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { Counterparty } from "./_types";
import { KIND_SHORT, TYPE_LABEL } from "./_types";

const fmt = (n: number) =>
  new Intl.NumberFormat("ru-KZ", {
    style: "currency",
    currency: "KZT",
    maximumFractionDigits: 0,
  }).format(n);

export function CounterpartyList({
  rows,
  q,
  kind,
  type,
}: {
  rows: Counterparty[];
  q: string;
  kind: string;
  type: string;
}) {
  const router = useRouter();
  const params = useSearchParams();

  function update(key: string, value: string) {
    const sp = new URLSearchParams(params.toString());
    if (value && value !== "all") sp.set(key, value);
    else sp.delete(key);
    router.replace(`/dashboard/accounting/counterparties?${sp.toString()}`);
  }

  const debtors = rows
    .filter((r) => Number(r.balance) > 0)
    .reduce((s, r) => s + Number(r.balance), 0);
  const creditors = rows
    .filter((r) => Number(r.balance) < 0)
    .reduce((s, r) => s + Math.abs(Number(r.balance)), 0);

  return (
    <>
      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Card label="Нам должны (дебиторка)" value={fmt(debtors)} accent />
        <Card label="Мы должны (кредиторка)" value={fmt(creditors)} />
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <input
          type="search"
          defaultValue={q}
          placeholder="Поиск по наименованию или БИН/ИИН"
          onChange={(e) => update("q", e.target.value)}
          className="h-10 min-w-[260px] flex-1 rounded-md border border-[color:var(--rule)] bg-white px-3 text-[14px] outline-none focus:border-[color:var(--ink)]"
        />
        <Pills
          value={kind}
          onChange={(v) => update("kind", v)}
          options={[
            ["all", "Все типы"],
            ["legal", "Юр.лица"],
            ["ip", "ИП"],
            ["individual", "Физ.лица"],
          ]}
        />
        <Pills
          value={type}
          onChange={(v) => update("type", v)}
          options={[
            ["all", "Все"],
            ["debtor", "Дебиторы"],
            ["creditor", "Кредиторы"],
          ]}
        />
      </div>

      <div className="surface overflow-hidden">
        {rows.length === 0 ? (
          <div className="p-8 text-center text-[14px] text-[color:var(--ink-soft)]">
            Контрагентов по фильтрам нет.{" "}
            <Link
              href="/dashboard/accounting/counterparties/new"
              className="font-semibold text-[color:var(--ink)] underline-offset-2 hover:underline"
            >
              Добавить нового
            </Link>
            .
          </div>
        ) : (
          <ul>
            <li className="hidden grid-cols-[100px_1.6fr_140px_120px_1fr_140px] gap-3 border-b border-[color:var(--rule)] px-4 py-3 font-mono text-[10px] uppercase text-[color:var(--ink-mute)] md:grid">
              <span>Тип</span>
              <span>Наименование</span>
              <span>БИН/ИИН</span>
              <span>Расчёты</span>
              <span>Контакты</span>
              <span className="text-right">Баланс</span>
            </li>
            {rows.map((r) => (
              <li
                key={r.id}
                className="grid grid-cols-1 gap-2 border-b border-[color:var(--rule)] px-4 py-3 last:border-b-0 md:grid-cols-[100px_1.6fr_140px_120px_1fr_140px] md:items-center"
              >
                <Link
                  href={`/dashboard/accounting/counterparties/${r.id}`}
                  className="contents"
                >
                  <span className="inline-flex h-5 w-fit items-center rounded-full border border-[color:var(--rule)] bg-[#f4f5ef] px-2 font-mono text-[10px] uppercase text-[color:var(--ink-soft)]">
                    {KIND_SHORT[r.kind]}
                  </span>
                  <span className="truncate text-[14px] font-medium hover:text-[color:var(--accent)]">
                    {r.name}
                    {r.full_name && r.full_name !== r.name ? (
                      <span className="ml-2 text-[12px] font-normal text-[color:var(--ink-mute)]">
                        {r.full_name}
                      </span>
                    ) : null}
                  </span>
                  <span className="font-mono text-[12px] text-[color:var(--ink-soft)]">
                    {r.bin ?? "—"}
                  </span>
                  <span className="font-mono text-[11px] uppercase text-[color:var(--ink-soft)]">
                    {TYPE_LABEL[r.type]}
                  </span>
                  <span className="truncate text-[13px] text-[color:var(--ink-soft)]">
                    {r.phone ?? r.email ?? r.contact_person ?? "—"}
                  </span>
                  <span
                    className={`text-right font-mono text-[14px] ${
                      Number(r.balance) > 0
                        ? "text-[color:var(--accent)]"
                        : Number(r.balance) < 0
                          ? "text-red-600"
                          : ""
                    }`}
                  >
                    {fmt(Number(r.balance))}
                  </span>
                </Link>
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
        className={`mt-1.5 text-[22px] font-semibold ${
          accent ? "text-[color:var(--accent)]" : ""
        }`}
      >
        {value}
      </div>
    </div>
  );
}
