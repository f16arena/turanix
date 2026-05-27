"use client";

import { useTransition } from "react";
import { Trash2, Plus } from "lucide-react";
import { addDepartment, deleteDepartment } from "./actions";
import type { Dept } from "./page";

export function DepartmentsUI({ rows }: { rows: Dept[] }) {
  const [pending, startTransition] = useTransition();

  return (
    <div>
      <form
        id="dept-form"
        action={(fd) =>
          startTransition(async () => {
            await addDepartment(fd);
            (document.getElementById("dept-form") as HTMLFormElement)?.reset();
          })
        }
        className="surface mb-5 grid grid-cols-1 gap-3 p-5 lg:grid-cols-[1.6fr_1fr_1.6fr_120px]"
      >
        <Field label="Название" name="name" required />
        <Select label="Родительский отдел" name="parent_id" options={rows.map((r) => [r.id, r.name])} />
        <Field label="Примечание" name="note" />
        <button type="submit" disabled={pending} className="button-primary self-end !min-h-[40px]">
          <Plus className="h-4 w-4" />
          Добавить
        </button>
      </form>

      <div className="surface overflow-hidden">
        {rows.length === 0 ? (
          <div className="p-8 text-center text-[14px] text-[color:var(--ink-soft)]">
            Отделов ещё нет.
          </div>
        ) : (
          <ul>
            <li className="hidden grid-cols-[1.4fr_1fr_1.6fr_40px] gap-3 border-b border-[color:var(--rule)] px-4 py-3 font-mono text-[10px] uppercase text-[color:var(--ink-mute)] md:grid">
              <span>Название</span>
              <span>Родитель</span>
              <span>Примечание</span>
              <span></span>
            </li>
            {rows.map((r) => {
              const parent = rows.find((x) => x.id === r.parent_id);
              return (
                <li
                  key={r.id}
                  className="grid grid-cols-1 gap-2 border-b border-[color:var(--rule)] px-4 py-2.5 last:border-b-0 md:grid-cols-[1.4fr_1fr_1.6fr_40px] md:items-center"
                >
                  <span className="text-[14px] font-medium">{r.name}</span>
                  <span className="text-[13px] text-[color:var(--ink-soft)]">
                    {parent?.name ?? "—"}
                  </span>
                  <span className="text-[13px] text-[color:var(--ink-soft)]">
                    {r.note ?? "—"}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Удалить отдел «${r.name}»?`))
                        startTransition(() => deleteDepartment(r.id));
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
  required,
}: {
  label: string;
  name: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="font-mono text-[10px] uppercase text-[color:var(--ink-mute)]">
        {label}
      </span>
      <input
        name={name}
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
        <option value="">— верхний уровень —</option>
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </label>
  );
}
