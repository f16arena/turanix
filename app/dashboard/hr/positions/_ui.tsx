"use client";

import { useTransition } from "react";
import { Plus, Trash2 } from "lucide-react";
import { addPosition, deletePosition } from "./actions";
import type { Pos } from "./page";

const fmt = (n: number) =>
  new Intl.NumberFormat("ru-KZ", {
    style: "currency",
    currency: "KZT",
    maximumFractionDigits: 0,
  }).format(n);

export function PositionsUI({
  rows,
  departments,
}: {
  rows: Pos[];
  departments: { id: string; name: string }[];
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div>
      <form
        id="pos-form"
        action={(fd) =>
          startTransition(async () => {
            await addPosition(fd);
            (document.getElementById("pos-form") as HTMLFormElement)?.reset();
          })
        }
        className="surface mb-5 grid grid-cols-1 gap-3 p-5 lg:grid-cols-[1.4fr_1fr_120px_120px_1.2fr_120px]"
      >
        <Field label="Должность" name="name" required />
        <Select
          label="Отдел"
          name="department_id"
          options={departments.map((d) => [d.id, d.name])}
        />
        <Field label="Оклад мин" name="salary_min" type="number" />
        <Field label="Оклад макс" name="salary_max" type="number" />
        <Field label="Примечание" name="note" />
        <button type="submit" disabled={pending} className="button-primary self-end !min-h-[40px]">
          <Plus className="h-4 w-4" />
          Добавить
        </button>
      </form>

      <div className="surface overflow-hidden">
        {rows.length === 0 ? (
          <div className="p-8 text-center text-[14px] text-[color:var(--ink-soft)]">
            Должностей ещё нет.
          </div>
        ) : (
          <ul>
            <li className="hidden grid-cols-[1.4fr_1fr_140px_140px_1fr_40px] gap-3 border-b border-[color:var(--rule)] px-4 py-3 font-mono text-[10px] uppercase text-[color:var(--ink-mute)] md:grid">
              <span>Должность</span>
              <span>Отдел</span>
              <span className="text-right">Оклад мин</span>
              <span className="text-right">Оклад макс</span>
              <span>Примечание</span>
              <span></span>
            </li>
            {rows.map((r) => {
              const dept = departments.find((d) => d.id === r.department_id);
              return (
                <li
                  key={r.id}
                  className="grid grid-cols-1 gap-2 border-b border-[color:var(--rule)] px-4 py-2.5 last:border-b-0 md:grid-cols-[1.4fr_1fr_140px_140px_1fr_40px] md:items-center"
                >
                  <span className="text-[14px] font-medium">{r.name}</span>
                  <span className="text-[13px] text-[color:var(--ink-soft)]">
                    {dept?.name ?? "—"}
                  </span>
                  <span className="text-right font-mono text-[13px]">
                    {fmt(Number(r.salary_min))}
                  </span>
                  <span className="text-right font-mono text-[13px]">
                    {fmt(Number(r.salary_max))}
                  </span>
                  <span className="text-[13px] text-[color:var(--ink-soft)]">
                    {r.note ?? "—"}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Удалить должность «${r.name}»?`))
                        startTransition(() => deletePosition(r.id));
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
}: {
  label: string;
  name: string;
  options: [string, string][];
}) {
  return (
    <label className="grid gap-1.5">
      <span className="font-mono text-[10px] uppercase text-[color:var(--ink-mute)]">
        {label}
      </span>
      <select
        name={name}
        className="h-10 rounded-md border border-[color:var(--rule)] bg-white px-2 text-[14px] outline-none focus:border-[color:var(--ink)]"
      >
        <option value="">—</option>
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </label>
  );
}
