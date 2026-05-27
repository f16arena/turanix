"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  STATUS_CLASS,
  STATUS_LABEL,
  fullName,
  type Department,
  type Employee,
} from "./_types";

const fmt = (n: number) =>
  new Intl.NumberFormat("ru-KZ", {
    style: "currency",
    currency: "KZT",
    maximumFractionDigits: 0,
  }).format(n);

export function EmployeesList({
  rows,
  departments,
  q,
  status,
  dept,
}: {
  rows: Employee[];
  departments: Department[];
  q: string;
  status: string;
  dept: string;
}) {
  const router = useRouter();
  const params = useSearchParams();

  function update(key: string, value: string) {
    const sp = new URLSearchParams(params.toString());
    if (value && value !== "all") sp.set(key, value);
    else sp.delete(key);
    router.replace(`/dashboard/hr/employees?${sp.toString()}`);
  }

  return (
    <>
      <div className="mb-4 flex flex-wrap gap-2">
        <input
          type="search"
          defaultValue={q}
          placeholder="Поиск по ФИО / ИИН / должности"
          onChange={(e) => update("q", e.target.value)}
          className="h-10 min-w-[260px] flex-1 rounded-md border border-[color:var(--rule)] bg-white px-3 text-[14px] outline-none focus:border-[color:var(--ink)]"
        />
        <Pills
          value={status || "active"}
          onChange={(v) => update("status", v)}
          options={[
            ["active", "Работают"],
            ["vacation", "Отпуск"],
            ["sick", "Больничный"],
            ["dismissed", "Уволенные"],
            ["all", "Все"],
          ]}
        />
        {departments.length > 0 && (
          <select
            value={dept}
            onChange={(e) => update("dept", e.target.value)}
            className="h-10 rounded-md border border-[color:var(--rule)] bg-white px-2 text-[13px] outline-none focus:border-[color:var(--ink)]"
          >
            <option value="">Все отделы</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="surface overflow-hidden">
        {rows.length === 0 ? (
          <div className="p-8 text-center text-[14px] text-[color:var(--ink-soft)]">
            Сотрудников по фильтрам нет.{" "}
            <Link
              href="/dashboard/hr/employees/new"
              className="font-semibold text-[color:var(--ink)] underline-offset-2 hover:underline"
            >
              Принять нового
            </Link>
            .
          </div>
        ) : (
          <ul>
            <li className="hidden grid-cols-[1.6fr_1fr_120px_120px_140px_120px] gap-3 border-b border-[color:var(--rule)] px-4 py-3 font-mono text-[10px] uppercase text-[color:var(--ink-mute)] md:grid">
              <span>ФИО</span>
              <span>Должность</span>
              <span>ИИН</span>
              <span>Дата приёма</span>
              <span className="text-right">Оклад</span>
              <span className="text-right">Статус</span>
            </li>
            {rows.map((r) => (
              <li
                key={r.id}
                className="grid grid-cols-1 gap-2 border-b border-[color:var(--rule)] px-4 py-3 last:border-b-0 md:grid-cols-[1.6fr_1fr_120px_120px_140px_120px] md:items-center"
              >
                <Link
                  href={`/dashboard/hr/employees/${r.id}`}
                  className="contents"
                >
                  <span className="truncate text-[14px] font-medium hover:text-[color:var(--accent)]">
                    {fullName(r)}
                  </span>
                  <span className="truncate text-[13.5px] text-[color:var(--ink-soft)]">
                    {r.position ?? "—"}
                  </span>
                  <span className="font-mono text-[12px] text-[color:var(--ink-soft)]">
                    {r.iin ?? "—"}
                  </span>
                  <span className="font-mono text-[12px] text-[color:var(--ink-soft)]">
                    {r.start_date ?? "—"}
                  </span>
                  <span className="text-right font-mono">
                    {fmt(Number(r.salary))}
                  </span>
                  <span
                    className={`inline-flex h-5 w-fit items-center justify-self-end rounded-full px-2 font-mono text-[10px] uppercase ${STATUS_CLASS[r.status]}`}
                  >
                    {STATUS_LABEL[r.status]}
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
            value === v
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
