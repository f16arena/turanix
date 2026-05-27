"use client";

import { useTransition } from "react";
import { deleteCounterparty } from "../actions";

export function DangerZone({ id, name }: { id: string; name: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <section className="mt-8 rounded-md border border-red-200 bg-red-50/40 p-5">
      <div className="mb-2 font-mono text-[10px] uppercase text-red-700">
        Опасная зона
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[13px] text-[color:var(--ink-soft)]">
          Удаление контрагента не удаляет связанные документы, но отвязывает
          ссылки на него.
        </p>
        <button
          type="button"
          disabled={pending}
          onClick={() => {
            if (confirm(`Удалить контрагента «${name}»?`))
              startTransition(() => deleteCounterparty(id));
          }}
          className="rounded-md border border-red-300 bg-white px-3 py-2 text-[13px] text-red-700 hover:bg-red-50"
        >
          {pending ? "…" : "Удалить контрагента"}
        </button>
      </div>
    </section>
  );
}
