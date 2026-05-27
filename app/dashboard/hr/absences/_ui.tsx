"use client";

import { useTransition } from "react";
import { Plus, Trash2 } from "lucide-react";
import { addAbsence, deleteAbsence } from "./actions";
import type { Absence } from "./page";

const KIND_LABEL: Record<string, string> = {
  vacation: "Отпуск",
  sick: "Больничный",
  business_trip: "Командировка",
  unpaid: "Без оплаты",
  maternity: "Декрет",
  study: "Учебный",
};

export function AbsencesUI({
  rows,
  employees,
}: {
  rows: Absence[];
  employees: { id: string; name: string }[];
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div>
      <form
        id="abs-form"
        action={(fd) =>
          startTransition(async () => {
            await addAbsence(fd);
            (document.getElementById("abs-form") as HTMLFormElement)?.reset();
          })
        }
        className="surface mb-5 grid grid-cols-1 gap-3 p-5 lg:grid-cols-[1fr_180px_140px_140px_100px_140px]"
      >
        <Select
          label="Сотрудник"
          name="employee_id"
          options={employees.map((e) => [e.id, e.name])}
          required
        />
        <Select
          label="Тип"
          name="kind"
          options={Object.entries(KIND_LABEL).map(([v, l]) => [v, l])}
        />
        <Field label="С" name="from_date" type="date" required />
        <Field label="По" name="to_date" type="date" required />
        <label className="inline-flex items-center gap-2 pt-5 text-[13px]">
          <input
            type="checkbox"
            name="paid"
            defaultChecked
            className="h-4 w-4 accent-[color:var(--ink)]"
          />
          Оплачивается
        </label>
        <button type="submit" disabled={pending} className="button-primary !min-h-[40px] self-end">
          <Plus className="h-4 w-4" />
          Добавить
        </button>
      </form>

      <div className="surface overflow-hidden">
        {rows.length === 0 ? (
          <div className="p-8 text-center text-[14px] text-[color:var(--ink-soft)]">
            Записей нет.
          </div>
        ) : (
          <ul>
            <li className="hidden grid-cols-[1fr_140px_120px_120px_80px_100px_40px] gap-3 border-b border-[color:var(--rule)] px-4 py-3 font-mono text-[10px] uppercase text-[color:var(--ink-mute)] md:grid">
              <span>Сотрудник</span>
              <span>Тип</span>
              <span>С</span>
              <span>По</span>
              <span className="text-right">Дней</span>
              <span className="text-right">Оплата</span>
              <span></span>
            </li>
            {rows.map((r) => (
              <li
                key={r.id}
                className="grid grid-cols-1 gap-2 border-b border-[color:var(--rule)] px-4 py-2.5 last:border-b-0 md:grid-cols-[1fr_140px_120px_120px_80px_100px_40px] md:items-center"
              >
                <span className="text-[14px]">
                  {employees.find((e) => e.id === r.employee_id)?.name ?? "—"}
                </span>
                <span className="font-mono text-[11px] uppercase">
                  {KIND_LABEL[r.kind] ?? r.kind}
                </span>
                <span className="font-mono text-[12px]">{r.from_date}</span>
                <span className="font-mono text-[12px]">{r.to_date}</span>
                <span className="text-right font-mono">{r.days}</span>
                <span
                  className={`text-right font-mono text-[11px] uppercase ${
                    r.paid ? "text-[color:var(--accent)]" : "text-[color:var(--ink-mute)]"
                  }`}
                >
                  {r.paid ? "оплач." : "—"}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Удалить запись?"))
                      startTransition(() => deleteAbsence(r.id));
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
  required,
}: {
  label: string;
  name: string;
  type?: string;
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
        required={required}
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
        defaultValue={required ? "" : options[0]?.[0]}
        className="h-10 rounded-md border border-[color:var(--rule)] bg-white px-2 text-[14px] outline-none focus:border-[color:var(--ink)]"
      >
        {required && <option value="" disabled>—</option>}
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </label>
  );
}
