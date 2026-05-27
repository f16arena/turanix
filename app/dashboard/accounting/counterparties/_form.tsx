"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Counterparty, CpKind, CpType } from "./_types";
import { KIND_LABEL, TYPE_LABEL } from "./_types";
import { createCounterparty, updateCounterparty } from "./actions";

type FormProps = {
  initial?: Counterparty;
  mode: "create" | "edit";
};

export function CounterpartyForm({ initial, mode }: FormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [kind, setKind] = useState<CpKind>(initial?.kind ?? "legal");
  const [type, setType] = useState<CpType>(initial?.type ?? "debtor");

  function submit(fd: FormData) {
    fd.set("kind", kind);
    fd.set("type", type);
    startTransition(() => {
      if (mode === "edit" && initial) updateCounterparty(initial.id, fd);
      else createCounterparty(fd);
    });
  }

  const isLegalOrIp = kind === "legal" || kind === "ip";

  return (
    <form action={submit} className="grid gap-5">
      <Section title="Тип и баланс">
        <div className="grid gap-1.5">
          <Label>Тип контрагента</Label>
          <div className="inline-flex h-10 rounded-md border border-[color:var(--rule)] bg-white p-0.5">
            {(Object.keys(KIND_LABEL) as CpKind[]).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setKind(k)}
                className={`rounded px-3 text-[12px] font-mono uppercase transition-colors ${
                  kind === k
                    ? "bg-[color:var(--ink)] text-white"
                    : "text-[color:var(--ink-mute)]"
                }`}
              >
                {KIND_LABEL[k]}
              </button>
            ))}
          </div>
        </div>
        <div className="grid gap-1.5">
          <Label>Расчёты</Label>
          <div className="inline-flex h-10 rounded-md border border-[color:var(--rule)] bg-white p-0.5">
            {(Object.keys(TYPE_LABEL) as CpType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`rounded px-3 text-[12px] font-mono uppercase ${
                  type === t
                    ? "bg-[color:var(--ink)] text-white"
                    : "text-[color:var(--ink-mute)]"
                }`}
              >
                {TYPE_LABEL[t]}
              </button>
            ))}
          </div>
        </div>
        <Field
          label="Начальный баланс ₸"
          name="balance"
          type="number"
          defaultValue={String(initial?.balance ?? 0)}
        />
      </Section>

      <Section title={kind === "individual" ? "ФИО" : "Наименование"}>
        <Field
          label={kind === "individual" ? "Краткое (ФИО)" : "Краткое наименование"}
          name="name"
          defaultValue={initial?.name}
          required
        />
        <Field
          label={kind === "individual" ? "Полное ФИО" : "Полное наименование"}
          name="full_name"
          defaultValue={initial?.full_name ?? ""}
          placeholder={
            kind === "legal"
              ? "ТОО «Название» / АО «Название»"
              : kind === "ip"
                ? "ИП Фамилия Имя Отчество"
                : "Фамилия Имя Отчество"
          }
        />
        <Field
          label={kind === "individual" ? "ИИН" : "БИН / ИИН"}
          name="bin"
          defaultValue={initial?.bin ?? ""}
          placeholder="12 цифр"
        />
        {isLegalOrIp && (
          <Field
            label="ОКЭД"
            name="oked"
            defaultValue={initial?.oked ?? ""}
            placeholder="код вида деятельности"
          />
        )}
      </Section>

      <Section title="Адреса">
        <Field
          label={kind === "individual" ? "Адрес регистрации" : "Юридический адрес"}
          name="legal_address"
          defaultValue={initial?.legal_address ?? ""}
          full
        />
        <Field
          label="Фактический адрес"
          name="actual_address"
          defaultValue={initial?.actual_address ?? ""}
          placeholder="Если совпадает с юридическим — оставьте пустым"
          full
        />
      </Section>

      <Section title="Контакты">
        <Field label="Телефон" name="phone" defaultValue={initial?.phone ?? ""} />
        <Field label="Email" name="email" type="email" defaultValue={initial?.email ?? ""} />
        <Field
          label="Контактное лицо"
          name="contact_person"
          defaultValue={initial?.contact_person ?? ""}
          placeholder="ФИО, должность"
        />
      </Section>

      {isLegalOrIp && (
        <Section title="Подписант">
          <Field
            label="Руководитель / ФИО подписанта"
            name="director"
            defaultValue={initial?.director ?? ""}
          />
          <Field
            label="Должность"
            name="director_position"
            defaultValue={initial?.director_position ?? ""}
            placeholder="Директор / Учредитель"
          />
        </Section>
      )}

      <Section title="Признаки">
        <Checkbox
          name="vat_payer"
          label="Плательщик НДС"
          defaultChecked={initial?.vat_payer}
        />
        <Checkbox
          name="is_resident"
          label="Резидент РК"
          defaultChecked={initial?.is_resident ?? true}
        />
      </Section>

      <Section title="Примечание">
        <Field
          label="Заметка"
          name="note"
          defaultValue={initial?.note ?? ""}
          full
        />
      </Section>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[color:var(--rule)] pt-5">
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

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="surface p-5">
      <legend className="px-2 font-mono text-[10px] uppercase text-[color:var(--ink-mute)]">
        {title}
      </legend>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {children}
      </div>
    </fieldset>
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
      <Label>{label}</Label>
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
    <label className="inline-flex cursor-pointer items-center gap-2.5 self-end pb-1.5 text-[14px]">
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
