"use client";

import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";

export type PickerCp = {
  id: string;
  name: string;
  full_name: string | null;
  bin: string | null;
  legal_address: string | null;
  director: string | null;
  director_position: string | null;
  accounts: {
    iban: string;
    bank: string;
    bik: string | null;
    kbe: string | null;
    currency: string;
    is_primary: boolean;
  }[];
};

export function CounterpartyPicker({
  options,
  value,
  onChange,
  label = "Контрагент",
}: {
  options: PickerCp[];
  value: PickerCp | null;
  onChange: (cp: PickerCp | null) => void;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  const filtered = q
    ? options.filter(
        (o) =>
          o.name.toLowerCase().includes(q.toLowerCase()) ||
          (o.full_name ?? "").toLowerCase().includes(q.toLowerCase()) ||
          (o.bin ?? "").includes(q),
      )
    : options;

  return (
    <div className="relative">
      <div className="font-mono text-[10px] uppercase text-[color:var(--ink-mute)]">
        {label}
      </div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="mt-1 flex h-10 w-full items-center justify-between rounded-md border border-[color:var(--rule)] bg-white px-3 text-[14px] outline-none hover:border-[color:var(--ink)] focus:border-[color:var(--ink)]"
      >
        <span className={value ? "" : "text-[color:var(--ink-mute)]"}>
          {value ? value.name : "Выбрать контрагента"}
        </span>
        <ChevronDown className="h-4 w-4 text-[color:var(--ink-mute)]" />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-30 mt-1 max-h-[280px] overflow-y-auto rounded-md border border-[color:var(--rule)] bg-white shadow-lg">
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Поиск..."
            className="sticky top-0 h-9 w-full border-b border-[color:var(--rule)] bg-white px-3 text-[13px] outline-none"
          />
          <ul>
            {filtered.length === 0 && (
              <li className="p-3 text-center text-[13px] text-[color:var(--ink-mute)]">
                Ничего не найдено
              </li>
            )}
            {value && (
              <li
                onClick={() => {
                  onChange(null);
                  setOpen(false);
                }}
                className="cursor-pointer border-b border-[color:var(--rule)] px-3 py-2 text-[13px] text-[color:var(--ink-mute)] hover:bg-[#f4f5ef]"
              >
                ✕ Очистить выбор
              </li>
            )}
            {filtered.map((o) => (
              <li
                key={o.id}
                onClick={() => {
                  onChange(o);
                  setOpen(false);
                  setQ("");
                }}
                className="flex cursor-pointer items-center gap-2 px-3 py-2 hover:bg-[#f4f5ef]"
              >
                {value?.id === o.id ? (
                  <Check className="h-3.5 w-3.5 text-[color:var(--accent)]" />
                ) : (
                  <span className="w-3.5" />
                )}
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[14px]">{o.name}</div>
                  <div className="truncate font-mono text-[11px] text-[color:var(--ink-mute)]">
                    {o.bin ?? "без БИН"}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
