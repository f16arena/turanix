"use client";

import { useTransition } from "react";
import { switchOrg } from "../settings/actions";

export function OrgSwitcher({
  options,
  currentId,
}: {
  options: { id: string; name: string; role: string }[];
  currentId: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <label className="grid gap-1.5">
      <span className="font-mono text-[10px] uppercase text-[color:var(--ink-mute)]">
        Организация
      </span>
      <select
        value={currentId}
        disabled={pending}
        onChange={(e) => startTransition(() => switchOrg(e.target.value))}
        className="h-9 rounded-md border border-[color:var(--rule)] bg-white px-2 text-[13px] outline-none focus:border-[color:var(--ink)]"
      >
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.name}
          </option>
        ))}
      </select>
    </label>
  );
}
