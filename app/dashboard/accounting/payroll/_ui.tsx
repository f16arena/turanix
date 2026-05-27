"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Calculator, UserPlus, ExternalLink } from "lucide-react";
import type { Employee } from "./page";
import { calcPayroll } from "../../../_lib/tax/kz-2026";

const fmt = (n: number) =>
  new Intl.NumberFormat("ru-KZ", {
    style: "currency",
    currency: "KZT",
    maximumFractionDigits: 0,
  }).format(Math.round(n));

export function PayrollUI({ rows }: { rows: Employee[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const fot = useMemo(
    () => rows.reduce((s, r) => s + Number(r.salary), 0),
    [rows],
  );
  const totals = useMemo(() => {
    let net = 0;
    let employerCost = 0;
    let taxes = 0;
    for (const r of rows) {
      const c = calcPayroll(Number(r.salary), {
        is_pensioner: r.is_pensioner,
        is_disabled: r.is_disabled,
        has_many_children: r.has_many_children,
      });
      net += c.net;
      employerCost += c.totalCost;
      taxes += c.opv + c.osmsEmployee + c.ipn + c.so + c.sn + c.osmsEmployer;
    }
    return { net, employerCost, taxes };
  }, [rows]);

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-md border border-[color:var(--rule)] bg-white/72 p-4">
        <p className="text-[13.5px] text-[color:var(--ink-soft)]">
          Список сотрудников ведётся в модуле{" "}
          <Link
            href="/dashboard/hr/employees"
            className="font-semibold text-[color:var(--ink)] underline-offset-2 hover:underline"
          >
            Кадры
          </Link>
          . Расчёт учитывает налоговые признаки (пенсионер, инвалид, многодетный).
        </p>
        <Link
          href="/dashboard/hr/employees/new"
          className="inline-flex h-9 items-center gap-2 rounded-md border border-[color:var(--rule)] bg-white px-3 text-[12px] uppercase font-mono text-[color:var(--ink-soft)] hover:border-[color:var(--ink)] hover:text-[color:var(--ink)]"
        >
          <UserPlus className="h-3.5 w-3.5" />
          Принять сотрудника
        </Link>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-4">
        <Card label="ФОТ" value={fmt(fot)} />
        <Card label="На руки" value={fmt(totals.net)} accent />
        <Card label="Налоги" value={fmt(totals.taxes)} />
        <Card label="Итого затрат" value={fmt(totals.employerCost)} bold />
      </div>

      <div className="surface overflow-hidden">
        {rows.length === 0 ? (
          <div className="p-8 text-center text-[14px] text-[color:var(--ink-soft)]">
            Активных сотрудников нет. Добавьте их в разделе{" "}
            <Link
              href="/dashboard/hr/employees"
              className="font-semibold text-[color:var(--ink)] underline-offset-2 hover:underline"
            >
              Кадры → Сотрудники
            </Link>
            .
          </div>
        ) : (
          <ul>
            <li className="hidden grid-cols-[1.4fr_1fr_140px_140px_140px_80px_40px] gap-3 border-b border-[color:var(--rule)] px-4 py-3 font-mono text-[10px] uppercase text-[color:var(--ink-mute)] md:grid">
              <span>Сотрудник</span>
              <span>Должность</span>
              <span className="text-right">Оклад</span>
              <span className="text-right">На руки</span>
              <span className="text-right">Затраты</span>
              <span></span>
              <span></span>
            </li>
            {rows.map((row) => {
              const flags = {
                is_pensioner: row.is_pensioner,
                is_disabled: row.is_disabled,
                has_many_children: row.has_many_children,
              };
              const c = calcPayroll(Number(row.salary), flags);
              const isOpen = expanded === row.id;
              return (
                <li
                  key={row.id}
                  className="border-b border-[color:var(--rule)] last:border-b-0"
                >
                  <div className="grid grid-cols-[1.4fr_1fr_140px_140px_140px_80px_40px] items-center gap-3 px-4 py-2.5 text-[14px]">
                    <span className="flex items-center gap-2 truncate font-medium">
                      {row.name}
                      {(row.is_pensioner || row.is_disabled || row.has_many_children) && (
                        <FlagDots
                          pens={row.is_pensioner}
                          dis={row.is_disabled}
                          many={row.has_many_children}
                        />
                      )}
                    </span>
                    <span className="truncate text-[color:var(--ink-soft)]">
                      {row.position ?? "—"}
                    </span>
                    <span className="text-right font-mono">
                      {fmt(Number(row.salary))}
                    </span>
                    <span className="text-right font-mono text-[color:var(--accent)]">
                      {fmt(c.net)}
                    </span>
                    <span className="text-right font-mono">{fmt(c.totalCost)}</span>
                    <button
                      type="button"
                      onClick={() => setExpanded(isOpen ? null : row.id)}
                      className={`mx-auto inline-flex h-7 w-7 items-center justify-center rounded-md border border-[color:var(--rule)] bg-white text-[color:var(--ink-soft)] hover:border-[color:var(--ink)] hover:text-[color:var(--ink)] ${
                        isOpen
                          ? "border-[color:var(--ink)] text-[color:var(--ink)]"
                          : ""
                      }`}
                      aria-label="Расчёт"
                    >
                      <Calculator className="h-3.5 w-3.5" />
                    </button>
                    <Link
                      href={`/dashboard/hr/employees/${row.id}`}
                      className="inline-flex h-7 w-7 items-center justify-center text-[color:var(--ink-mute)] hover:text-[color:var(--ink)]"
                      aria-label="Карточка"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </div>
                  {isOpen && (
                    <div className="border-t border-[color:var(--rule)] bg-[#f4f5ef]/40 px-4 py-4">
                      <div className="grid grid-cols-1 gap-2 text-[13px] md:grid-cols-3">
                        <Detail
                          label={row.is_pensioner || row.is_disabled ? "ОПВ (освобождён)" : "ОПВ (10%)"}
                          value={fmt(c.opv)}
                        />
                        <Detail label="ИПН (10%)" value={fmt(c.ipn)} />
                        <Detail label="ВОСМС работник (2%)" value={fmt(c.osmsEmployee)} />
                        <Detail label="На руки" value={fmt(c.net)} highlight />
                        <Detail
                          label={row.is_disabled ? "СО (освобождён)" : "СО (5%)"}
                          value={fmt(c.so)}
                        />
                        <Detail label="СН (6%)" value={fmt(c.sn)} />
                        <Detail
                          label="ООСМС работодатель (3%)"
                          value={fmt(c.osmsEmployer)}
                        />
                        <Detail
                          label="Итого затрат"
                          value={fmt(c.totalCost)}
                          highlight
                        />
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

function FlagDots({
  pens,
  dis,
  many,
}: {
  pens: boolean;
  dis: boolean;
  many: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-1">
      {pens && (
        <span
          title="Пенсионер"
          className="rounded-full bg-amber-100 px-1.5 py-0.5 font-mono text-[9px] uppercase text-amber-800"
        >
          пенс
        </span>
      )}
      {dis && (
        <span
          title="Инвалид I-II гр"
          className="rounded-full bg-blue-100 px-1.5 py-0.5 font-mono text-[9px] uppercase text-blue-800"
        >
          инв
        </span>
      )}
      {many && (
        <span
          title="Многодетный"
          className="rounded-full bg-[color:var(--accent-soft)] px-1.5 py-0.5 font-mono text-[9px] uppercase text-[color:var(--accent)]"
        >
          мн
        </span>
      )}
    </span>
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

function Detail({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex items-baseline justify-between rounded-md border px-3 py-2 ${
        highlight
          ? "border-[color:var(--accent)] bg-white"
          : "border-[color:var(--rule)] bg-white/68"
      }`}
    >
      <span className="font-mono text-[10px] uppercase text-[color:var(--ink-mute)]">
        {label}
      </span>
      <span
        className={`font-mono ${
          highlight ? "font-semibold text-[color:var(--accent)]" : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}
