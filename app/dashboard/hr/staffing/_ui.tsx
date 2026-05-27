"use client";

import { useTransition } from "react";
import { Plus, Trash2 } from "lucide-react";
import { addStaffing, deleteStaffing } from "./actions";
import type { StaffRow } from "./page";

const fmt = (n: number) =>
  new Intl.NumberFormat("ru-KZ", {
    style: "currency",
    currency: "KZT",
    maximumFractionDigits: 0,
  }).format(n);

export function StaffingUI({
  rows,
  departments,
  positions,
  employees,
}: {
  rows: StaffRow[];
  departments: { id: string; name: string }[];
  positions: { id: string; name: string }[];
  employees: {
    id: string;
    position_id: string | null;
    department_id: string | null;
    status: string;
  }[];
}) {
  const [pending, startTransition] = useTransition();

  const totalPlanned = rows.reduce((s, r) => s + Number(r.planned_count), 0);
  const totalFact = employees.length;

  return (
    <div>
      <form
        id="staff-form"
        action={(fd) =>
          startTransition(async () => {
            await addStaffing(fd);
            (document.getElementById("staff-form") as HTMLFormElement)?.reset();
          })
        }
        className="surface mb-5 grid grid-cols-1 gap-3 p-5 lg:grid-cols-[1fr_1fr_120px_140px_1fr_140px]"
      >
        <Select label="Отдел" name="department_id" options={departments.map((d) => [d.id, d.name])} />
        <Select
          label="Должность"
          name="position_id"
          options={positions.map((p) => [p.id, p.name])}
          required
        />
        <Field label="План штата" name="planned_count" type="number" defaultValue="1" required />
        <Field label="Оклад ₸" name="salary" type="number" />
        <Field label="Примечание" name="note" />
        <button type="submit" disabled={pending} className="button-primary !min-h-[40px] self-end">
          <Plus className="h-4 w-4" />
          Добавить
        </button>
      </form>

      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Card label="План штата" value={`${totalPlanned} ед.`} />
        <Card label="Фактически работают" value={`${totalFact} ед.`} accent />
        <Card
          label="Вакансий"
          value={`${Math.max(0, totalPlanned - totalFact)} ед.`}
          bold
        />
      </div>

      <div className="surface overflow-hidden">
        {rows.length === 0 ? (
          <div className="p-8 text-center text-[14px] text-[color:var(--ink-soft)]">
            Штатное расписание пустое.
          </div>
        ) : (
          <ul>
            <li className="hidden grid-cols-[1fr_1fr_100px_140px_100px_1fr_40px] gap-3 border-b border-[color:var(--rule)] px-4 py-3 font-mono text-[10px] uppercase text-[color:var(--ink-mute)] md:grid">
              <span>Отдел</span>
              <span>Должность</span>
              <span className="text-right">План</span>
              <span className="text-right">Оклад</span>
              <span className="text-right">Факт</span>
              <span>Вакансии</span>
              <span></span>
            </li>
            {rows.map((r) => {
              const dept = departments.find((d) => d.id === r.department_id);
              const pos = positions.find((p) => p.id === r.position_id);
              const fact = employees.filter(
                (e) =>
                  e.position_id === r.position_id &&
                  (!r.department_id || e.department_id === r.department_id),
              ).length;
              const vacancies = Math.max(0, Number(r.planned_count) - fact);
              return (
                <li
                  key={r.id}
                  className="grid grid-cols-1 gap-2 border-b border-[color:var(--rule)] px-4 py-2.5 last:border-b-0 md:grid-cols-[1fr_1fr_100px_140px_100px_1fr_40px] md:items-center"
                >
                  <span className="text-[14px] text-[color:var(--ink-soft)]">
                    {dept?.name ?? "—"}
                  </span>
                  <span className="text-[14px] font-medium">{pos?.name ?? "—"}</span>
                  <span className="text-right font-mono">{r.planned_count}</span>
                  <span className="text-right font-mono text-[13px]">
                    {fmt(Number(r.salary))}
                  </span>
                  <span className="text-right font-mono">{fact}</span>
                  <span
                    className={`text-[13px] ${
                      vacancies > 0 ? "text-amber-700" : "text-[color:var(--ink-soft)]"
                    }`}
                  >
                    {vacancies > 0 ? `${vacancies} вакансий` : "укомплектовано"}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm("Удалить позицию из штатки?"))
                        startTransition(() => deleteStaffing(r.id));
                    }}
                    className="text-[color:var(--ink-mute)] hover:text-red-600"
                    aria-label="Удалить"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              );
            })}
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
  required,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
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
        required={required}
        defaultValue={defaultValue}
        className="h-10 rounded-md border border-[color:var(--rule)] bg-white px-3 text-[14px] outline-none focus:border-[color:var(--ink)]"
      />
    </label>
  );
}

function Select({
  label,
  name,
  options,
  required,
}: {
  label: string;
  name: string;
  options: [string, string][];
  required?: boolean;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="font-mono text-[10px] uppercase text-[color:var(--ink-mute)]">
        {label}
      </span>
      <select
        name={name}
        required={required}
        defaultValue=""
        className="h-10 rounded-md border border-[color:var(--rule)] bg-white px-2 text-[14px] outline-none focus:border-[color:var(--ink)]"
      >
        <option value="" disabled={required}>—</option>
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
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
      <div className={`font-mono text-[10px] uppercase ${bold ? "text-white/64" : "text-[color:var(--ink-mute)]"}`}>
        {label}
      </div>
      <div className={`mt-1.5 text-[20px] font-semibold ${accent ? "text-[color:var(--accent)]" : ""}`}>
        {value}
      </div>
    </div>
  );
}
