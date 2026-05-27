"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type {
  Employee,
  Department,
  Position,
  EmploymentType,
  EmployeeStatus,
} from "./_types";
import { EMPLOYMENT_LABEL, STATUS_LABEL } from "./_types";
import { createEmployee, updateEmployee } from "./actions";

const SECTIONS = [
  { id: "personal", label: "Личные данные" },
  { id: "job", label: "Трудовые" },
  { id: "tax", label: "Налоговые" },
  { id: "bank", label: "Банк" },
  { id: "other", label: "Прочее" },
] as const;

type Section = (typeof SECTIONS)[number]["id"];

export function EmployeeForm({
  initial,
  mode,
  departments,
  positions,
}: {
  initial?: Employee;
  mode: "create" | "edit";
  departments: Department[];
  positions: Position[];
}) {
  const router = useRouter();
  const [section, setSection] = useState<Section>("personal");
  const [pending, startTransition] = useTransition();

  function submit(fd: FormData) {
    startTransition(() => {
      if (mode === "edit" && initial) updateEmployee(initial.id, fd);
      else createEmployee(fd);
    });
  }

  return (
    <form action={submit}>
      <div className="mb-5 flex flex-wrap gap-1 border-b border-[color:var(--rule)]">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setSection(s.id)}
            className={`relative rounded-t-md px-4 py-2 text-[13px] transition-colors ${
              section === s.id
                ? "-mb-px border border-[color:var(--rule)] border-b-white bg-white font-semibold text-[color:var(--ink)]"
                : "text-[color:var(--ink-mute)] hover:text-[color:var(--ink)]"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className={section === "personal" ? "" : "hidden"}>
        <Personal initial={initial} />
      </div>
      <div className={section === "job" ? "" : "hidden"}>
        <Job initial={initial} departments={departments} positions={positions} />
      </div>
      <div className={section === "tax" ? "" : "hidden"}>
        <Tax initial={initial} />
      </div>
      <div className={section === "bank" ? "" : "hidden"}>
        <Bank initial={initial} />
      </div>
      <div className={section === "other" ? "" : "hidden"}>
        <Other initial={initial} />
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[color:var(--rule)] pt-5">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-md border border-[color:var(--rule)] bg-white px-4 py-2 text-[13px] text-[color:var(--ink-soft)] hover:border-[color:var(--ink)] hover:text-[color:var(--ink)]"
        >
          Отмена
        </button>
        <button type="submit" disabled={pending} className="button-primary">
          {pending ? "Сохраняем…" : mode === "create" ? "Создать" : "Сохранить"}
        </button>
      </div>
    </form>
  );
}

function Personal({ initial }: { initial?: Employee }) {
  return (
    <Grid>
      <Field label="Фамилия" name="last_name" defaultValue={initial?.last_name ?? ""} required />
      <Field label="Имя" name="first_name" defaultValue={initial?.first_name ?? ""} required />
      <Field label="Отчество" name="middle_name" defaultValue={initial?.middle_name ?? ""} />
      <Field label="ИИН" name="iin" defaultValue={initial?.iin ?? ""} placeholder="12 цифр" />
      <Field label="Дата рождения" name="birth_date" type="date" defaultValue={initial?.birth_date ?? ""} />
      <Select
        label="Пол"
        name="gender"
        defaultValue={initial?.gender ?? ""}
        options={[
          ["", "—"],
          ["male", "Мужской"],
          ["female", "Женский"],
        ]}
      />
      <Field label="Гражданство" name="citizenship" defaultValue={initial?.citizenship ?? "KZ"} />
      <Field label="Телефон" name="phone" defaultValue={initial?.phone ?? ""} />
      <Field label="Email" name="email" type="email" defaultValue={initial?.email ?? ""} />
      <Field label="Образование" name="education" defaultValue={initial?.education ?? ""} full />
      <Field label="Адрес прописки" name="registration_address" defaultValue={initial?.registration_address ?? ""} full />
      <Field label="Адрес фактический" name="actual_address" defaultValue={initial?.actual_address ?? ""} full />
      <Subhead>Документ, удостоверяющий личность</Subhead>
      <Field label="Серия паспорта/удостоверения" name="passport_series" defaultValue={initial?.passport_series ?? ""} />
      <Field label="Номер" name="passport_number" defaultValue={initial?.passport_number ?? ""} />
      <Field label="Кем выдан" name="passport_issued_by" defaultValue={initial?.passport_issued_by ?? ""} full />
      <Field label="Дата выдачи" name="passport_issued_at" type="date" defaultValue={initial?.passport_issued_at ?? ""} />
    </Grid>
  );
}

function Job({
  initial,
  departments,
  positions,
}: {
  initial?: Employee;
  departments: Department[];
  positions: Position[];
}) {
  return (
    <Grid>
      <Select
        label="Отдел"
        name="department_id"
        defaultValue={initial?.department_id ?? ""}
        options={[["", "—"], ...departments.map((d) => [d.id, d.name] as [string, string])]}
      />
      <Select
        label="Должность (справочник)"
        name="position_id"
        defaultValue={initial?.position_id ?? ""}
        options={[["", "—"], ...positions.map((p) => [p.id, p.name] as [string, string])]}
      />
      <Field
        label="Должность (текст)"
        name="position"
        defaultValue={initial?.position ?? ""}
        placeholder="если нет в справочнике"
      />
      <Select
        label="Тип занятости"
        name="employment_type"
        defaultValue={initial?.employment_type ?? "full"}
        options={(Object.keys(EMPLOYMENT_LABEL) as EmploymentType[]).map(
          (k) => [k, EMPLOYMENT_LABEL[k]] as [string, string],
        )}
      />
      <Field
        label="Оклад ₸"
        name="salary"
        type="number"
        defaultValue={String(initial?.salary ?? 0)}
        required
      />
      <Field label="Дата приёма" name="start_date" type="date" defaultValue={initial?.start_date ?? ""} />
      <Field label="№ трудового договора" name="contract_number" defaultValue={initial?.contract_number ?? ""} />
      <Field label="Дата договора" name="contract_date" type="date" defaultValue={initial?.contract_date ?? ""} />
      <Select
        label="Статус"
        name="status"
        defaultValue={initial?.status ?? "active"}
        options={(Object.keys(STATUS_LABEL) as EmployeeStatus[]).map(
          (k) => [k, STATUS_LABEL[k]] as [string, string],
        )}
      />
    </Grid>
  );
}

function Tax({ initial }: { initial?: Employee }) {
  return (
    <div className="grid gap-4">
      <Notice>
        Налоговые признаки влияют на расчёт ОПВ, СО и ИПН. Изменения применятся
        к зарплатной ведомости автоматически.
      </Notice>
      <Grid>
        <Checkbox name="is_resident" label="Резидент РК" defaultChecked={initial?.is_resident ?? true} />
        <Checkbox
          name="is_pensioner"
          label="Пенсионер — освобождён от ОПВ"
          defaultChecked={initial?.is_pensioner ?? false}
        />
        <Checkbox
          name="is_disabled"
          label="Инвалид I-II гр. — освобождение от ОПВ/СО, +вычет 882 МРП/год"
          defaultChecked={initial?.is_disabled ?? false}
        />
        <Checkbox
          name="has_many_children"
          label="Многодетный — доп. вычет 23 МЗП/год"
          defaultChecked={initial?.has_many_children ?? false}
        />
      </Grid>
    </div>
  );
}

function Bank({ initial }: { initial?: Employee }) {
  return (
    <Grid>
      <Field
        label="IBAN для зарплаты"
        name="payroll_iban"
        defaultValue={initial?.payroll_iban ?? ""}
      />
      <Field
        label="Банк"
        name="payroll_bank"
        defaultValue={initial?.payroll_bank ?? ""}
      />
    </Grid>
  );
}

function Other({ initial }: { initial?: Employee }) {
  return (
    <Grid>
      <Field label="Примечание" name="note" defaultValue={initial?.note ?? ""} full />
    </Grid>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return (
    <div className="surface grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
      {children}
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  defaultValue,
  placeholder,
  required,
  full,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  full?: boolean;
}) {
  return (
    <label className={`grid gap-1.5 ${full ? "sm:col-span-2 lg:col-span-3" : ""}`}>
      <span className="font-mono text-[10px] uppercase text-[color:var(--ink-mute)]">
        {label}
      </span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className="h-10 rounded-md border border-[color:var(--rule)] bg-white px-3 text-[14px] outline-none focus:border-[color:var(--ink)]"
      />
    </label>
  );
}

function Select({
  label,
  name,
  defaultValue,
  options,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  options: [string, string][];
}) {
  return (
    <label className="grid gap-1.5">
      <span className="font-mono text-[10px] uppercase text-[color:var(--ink-mute)]">
        {label}
      </span>
      <select
        name={name}
        defaultValue={defaultValue}
        className="h-10 rounded-md border border-[color:var(--rule)] bg-white px-2 text-[14px] outline-none focus:border-[color:var(--ink)]"
      >
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </label>
  );
}

function Checkbox({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="inline-flex items-center gap-2.5 self-end pb-1.5 text-[14px]">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="h-4 w-4 accent-[color:var(--ink)]"
      />
      {label}
    </label>
  );
}

function Subhead({ children }: { children: React.ReactNode }) {
  return (
    <div className="col-span-full mt-2 border-b border-dashed border-[color:var(--rule)] pb-1 font-mono text-[10px] uppercase text-[color:var(--ink-mute)]">
      {children}
    </div>
  );
}

function Notice({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-md border border-[color:var(--rule)] bg-[#f4f5ef]/60 p-3 text-[13px] leading-[1.5] text-[color:var(--ink-soft)]">
      {children}
    </div>
  );
}
