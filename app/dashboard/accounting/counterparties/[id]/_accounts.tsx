"use client";

import { useState, useTransition } from "react";
import { Plus, Star, Trash2 } from "lucide-react";
import type { CounterpartyAccount } from "../_types";
import {
  addAccount,
  deleteAccount,
  setPrimaryAccount,
} from "../actions";

export function AccountsBlock({
  counterpartyId,
  accounts,
}: {
  counterpartyId: string;
  accounts: CounterpartyAccount[];
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <section className="surface p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="font-mono text-[10px] uppercase text-[color:var(--ink-mute)]">
          Банковские счета · {accounts.length}
        </div>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="inline-flex items-center gap-1.5 rounded-md border border-[color:var(--rule)] bg-white px-2 py-1 font-mono text-[10px] uppercase text-[color:var(--ink-soft)] hover:border-[color:var(--ink)] hover:text-[color:var(--ink)]"
        >
          <Plus className="h-3 w-3" />
          {open ? "Скрыть" : "Добавить"}
        </button>
      </div>

      {open && (
        <form
          id="acc-form"
          action={(fd) =>
            startTransition(async () => {
              await addAccount(counterpartyId, fd);
              setOpen(false);
              (document.getElementById("acc-form") as HTMLFormElement)?.reset();
            })
          }
          className="mb-4 grid grid-cols-2 gap-3 rounded-md border border-[color:var(--rule)] bg-[#f4f5ef]/50 p-4"
        >
          <Field label="IBAN" name="iban" required />
          <Field label="Банк" name="bank" required />
          <Field label="БИК" name="bik" />
          <Field label="КБе" name="kbe" placeholder="11/17 и т.д." />
          <Field label="Валюта" name="currency" defaultValue="KZT" />
          <label className="col-span-2 inline-flex items-center gap-2 pt-1 text-[13px]">
            <input
              type="checkbox"
              name="is_primary"
              className="h-4 w-4 accent-[color:var(--ink)]"
            />
            Основной счёт
          </label>
          <Field label="Примечание" name="note" full />
          <button
            type="submit"
            disabled={pending}
            className="button-primary col-span-2 !min-h-[40px] !text-[13px]"
          >
            {pending ? "…" : "Сохранить счёт"}
          </button>
        </form>
      )}

      {accounts.length === 0 ? (
        <p className="py-3 text-center text-[13px] text-[color:var(--ink-soft)]">
          Счетов ещё нет.
        </p>
      ) : (
        <ul className="grid gap-2">
          {accounts.map((a) => (
            <li
              key={a.id}
              className={`rounded-md border bg-white px-3 py-2.5 ${
                a.is_primary
                  ? "border-[color:var(--accent)]"
                  : "border-[color:var(--rule)]"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[13px]">{a.iban}</span>
                  <span className="rounded-full bg-[#f4f5ef] px-2 font-mono text-[10px] uppercase text-[color:var(--ink-soft)]">
                    {a.currency}
                  </span>
                  {a.is_primary && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[color:var(--accent-soft)] px-2 font-mono text-[10px] uppercase text-[color:var(--accent)]">
                      <Star className="h-3 w-3" />
                      основной
                    </span>
                  )}
                </div>
                <div className="flex gap-1">
                  {!a.is_primary && (
                    <button
                      type="button"
                      onClick={() =>
                        startTransition(() =>
                          setPrimaryAccount(a.id, counterpartyId),
                        )
                      }
                      className="rounded-md border border-[color:var(--rule)] bg-white px-2 py-1 font-mono text-[10px] uppercase text-[color:var(--ink-soft)] hover:border-[color:var(--ink)] hover:text-[color:var(--ink)]"
                    >
                      сделать основным
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm("Удалить счёт?"))
                        startTransition(() =>
                          deleteAccount(a.id, counterpartyId),
                        );
                    }}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[color:var(--ink-mute)] hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <div className="mt-1.5 grid grid-cols-2 gap-2 font-mono text-[11px] text-[color:var(--ink-soft)]">
                <span>{a.bank}</span>
                <span className="text-right">
                  {a.bik && `БИК ${a.bik}`}
                  {a.bik && a.kbe && " · "}
                  {a.kbe && `КБе ${a.kbe}`}
                </span>
              </div>
              {a.note && (
                <p className="mt-1 text-[12px] text-[color:var(--ink-soft)]">
                  {a.note}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function Field({
  label,
  name,
  defaultValue,
  placeholder,
  required,
  full,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  full?: boolean;
}) {
  return (
    <label className={`grid gap-1 ${full ? "col-span-2" : ""}`}>
      <span className="font-mono text-[10px] uppercase text-[color:var(--ink-mute)]">
        {label}
      </span>
      <input
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className="h-9 rounded-md border border-[color:var(--rule)] bg-white px-2.5 text-[13.5px] outline-none focus:border-[color:var(--ink)]"
      />
    </label>
  );
}
