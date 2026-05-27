"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { addCorrespondence, deleteCorrespondence } from "./actions";

export function AddForm() {
  const [pending, startTransition] = useTransition();
  const [direction, setDirection] = useState<"incoming" | "outgoing">(
    "incoming",
  );

  return (
    <form
      action={(fd) => {
        fd.set("direction", direction);
        startTransition(async () => {
          await addCorrespondence(fd);
          (document.getElementById("corr-form") as HTMLFormElement)?.reset();
        });
      }}
      id="corr-form"
      className="surface grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 lg:grid-cols-[140px_140px_1fr_1.6fr_120px]"
    >
      <div className="grid gap-1.5">
        <span className="font-mono text-[10px] uppercase text-[color:var(--ink-mute)]">
          Тип
        </span>
        <div className="inline-flex h-10 rounded-md border border-[color:var(--rule)] bg-white p-0.5">
          {(["incoming", "outgoing"] as const).map((d) => (
            <button
              type="button"
              key={d}
              onClick={() => setDirection(d)}
              className={`flex-1 rounded text-[12px] uppercase font-mono transition-colors ${
                direction === d
                  ? "bg-[color:var(--ink)] text-white"
                  : "text-[color:var(--ink-mute)]"
              }`}
            >
              {d === "incoming" ? "Вх" : "Исх"}
            </button>
          ))}
        </div>
      </div>

      <Field
        label="Дата"
        name="date"
        type="date"
        defaultValue={new Date().toISOString().slice(0, 10)}
      />
      <Field label="От кого / Кому" name="party" placeholder="Контрагент" />
      <Field label="Тема" name="subject" placeholder="Содержание" />

      <button
        type="submit"
        disabled={pending}
        className="button-primary self-end"
      >
        {pending ? "…" : "Добавить"}
      </button>
    </form>
  );
}

export function SearchBar({
  defaultQ,
  type,
}: {
  defaultQ: string;
  type: string;
}) {
  const router = useRouter();
  const params = useSearchParams();

  function update(key: string, value: string) {
    const sp = new URLSearchParams(params.toString());
    if (value) sp.set(key, value);
    else sp.delete(key);
    router.replace(`/dashboard/correspondence?${sp.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-2">
      <input
        type="search"
        placeholder="Поиск по номеру, контрагенту или теме"
        defaultValue={defaultQ}
        onChange={(e) => update("q", e.target.value)}
        className="h-10 flex-1 min-w-[260px] rounded-md border border-[color:var(--rule)] bg-white px-3 text-[14px] outline-none focus:border-[color:var(--ink)]"
      />
      <div className="inline-flex h-10 rounded-md border border-[color:var(--rule)] bg-white p-0.5">
        {[
          { v: "all", l: "Все" },
          { v: "incoming", l: "Входящие" },
          { v: "outgoing", l: "Исходящие" },
        ].map((opt) => (
          <button
            key={opt.v}
            type="button"
            onClick={() => update("type", opt.v === "all" ? "" : opt.v)}
            className={`px-3 rounded text-[12px] font-mono uppercase transition-colors ${
              (type || "all") === opt.v
                ? "bg-[color:var(--ink)] text-white"
                : "text-[color:var(--ink-mute)]"
            }`}
          >
            {opt.l}
          </button>
        ))}
      </div>
    </div>
  );
}

export function DeleteButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      onClick={() => {
        if (!confirm("Удалить запись?")) return;
        startTransition(() => deleteCorrespondence(id));
      }}
      disabled={pending}
      aria-label="Удалить"
      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[color:var(--ink-mute)] transition-colors hover:bg-red-50 hover:text-red-600"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}

function Field({
  label,
  name,
  type = "text",
  defaultValue,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  placeholder?: string;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="font-mono text-[10px] uppercase text-[color:var(--ink-mute)]">
        {label}
      </span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required
        className="h-10 rounded-md border border-[color:var(--rule)] bg-white px-3 text-[14px] outline-none focus:border-[color:var(--ink)]"
      />
    </label>
  );
}
