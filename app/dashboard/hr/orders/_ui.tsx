"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2 } from "lucide-react";
import { createOrder, deleteOrder } from "./actions";
import type { Order, OrderEmp } from "./page";

const KIND_LABEL: Record<string, string> = {
  hire: "Приём",
  dismiss: "Увольнение",
  transfer: "Перевод",
  promotion: "Повышение",
  salary_change: "Изменение оклада",
  vacation: "Отпуск",
  sick: "Больничный",
  reprimand: "Замечание",
  award: "Награда",
};

export function OrdersUI({
  orders,
  employees,
  departments,
}: {
  orders: Order[];
  employees: OrderEmp[];
  departments: { id: string; name: string }[];
}) {
  const [pending, startTransition] = useTransition();
  const [kind, setKind] = useState<string>("salary_change");

  const needsSalary = kind === "salary_change" || kind === "promotion";
  const needsPosition = kind === "transfer" || kind === "promotion";
  const needsDepartment = kind === "transfer";

  return (
    <div>
      <form
        id="ord-form"
        action={(fd) => {
          fd.set("kind", kind);
          startTransition(async () => {
            await createOrder(fd);
            (document.getElementById("ord-form") as HTMLFormElement)?.reset();
          });
        }}
        className="surface mb-5 grid grid-cols-1 gap-3 p-5 lg:grid-cols-3"
      >
        <label className="grid gap-1.5">
          <Label>Тип приказа</Label>
          <select
            value={kind}
            onChange={(e) => setKind(e.target.value)}
            className="h-10 rounded-md border border-[color:var(--rule)] bg-white px-2 text-[14px]"
          >
            {Object.entries(KIND_LABEL).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </label>

        <Select
          label="Сотрудник"
          name="employee_id"
          options={employees.map((e) => [e.id, e.name])}
          required
        />

        <Field label="Дата приказа" name="date" type="date" defaultValue={new Date().toISOString().slice(0, 10)} required />
        <Field label="Дата вступления в силу" name="effective_date" type="date" />

        {needsSalary && (
          <Field label="Новый оклад ₸" name="new_salary" type="number" />
        )}
        {needsPosition && (
          <Field label="Новая должность" name="new_position" />
        )}
        {needsDepartment && (
          <Select
            label="Новый отдел"
            name="new_department_id"
            options={departments.map((d) => [d.id, d.name])}
          />
        )}

        <Field label="Основание / примечание" name="note" full />

        <button
          type="submit"
          disabled={pending}
          className="button-primary !min-h-[40px] lg:col-start-3"
        >
          <Plus className="h-4 w-4" />
          Создать приказ
        </button>
      </form>

      <div className="surface overflow-hidden">
        {orders.length === 0 ? (
          <div className="p-8 text-center text-[14px] text-[color:var(--ink-soft)]">
            Приказов ещё нет.
          </div>
        ) : (
          <ul>
            <li className="hidden grid-cols-[120px_140px_1fr_140px_1.4fr_40px] gap-3 border-b border-[color:var(--rule)] px-4 py-3 font-mono text-[10px] uppercase text-[color:var(--ink-mute)] md:grid">
              <span>Дата</span>
              <span>Номер</span>
              <span>Сотрудник</span>
              <span>Тип</span>
              <span>Детали</span>
              <span></span>
            </li>
            {orders.map((o) => (
              <li
                key={o.id}
                className="grid grid-cols-1 gap-2 border-b border-[color:var(--rule)] px-4 py-2.5 last:border-b-0 md:grid-cols-[120px_140px_1fr_140px_1.4fr_40px] md:items-center"
              >
                <span className="font-mono text-[12px] text-[color:var(--ink-soft)]">
                  {o.date}
                </span>
                <span className="font-mono text-[12px]">{o.number}</span>
                <span className="text-[14px] font-medium">
                  {employees.find((e) => e.id === o.employee_id)?.name ?? "—"}
                </span>
                <span className="font-mono text-[11px] uppercase">
                  {KIND_LABEL[o.kind] ?? o.kind}
                </span>
                <span className="truncate text-[13px] text-[color:var(--ink-soft)]">
                  {detailsLine(o.payload)} {o.note ? `· ${o.note}` : ""}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Удалить приказ ${o.number}?`))
                      startTransition(() => deleteOrder(o.id));
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

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[10px] uppercase text-[color:var(--ink-mute)]">
      {children}
    </span>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  full,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  full?: boolean;
  defaultValue?: string;
}) {
  return (
    <label className={`grid gap-1.5 ${full ? "lg:col-span-3" : ""}`}>
      <Label>{label}</Label>
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
      <Label>{label}</Label>
      <select
        name={name}
        required={required}
        defaultValue=""
        className="h-10 rounded-md border border-[color:var(--rule)] bg-white px-2 text-[14px] outline-none focus:border-[color:var(--ink)]"
      >
        <option value="" disabled={required}>
          —
        </option>
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </label>
  );
}

function detailsLine(p: Record<string, unknown>) {
  if (!p) return "";
  const out: string[] = [];
  if (p.new_salary) out.push(`оклад: ${Number(p.new_salary).toLocaleString("ru-KZ")} ₸`);
  if (p.new_position) out.push(`должность: ${p.new_position}`);
  return out.join(" · ");
}
