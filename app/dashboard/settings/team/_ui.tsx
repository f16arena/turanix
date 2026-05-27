"use client";

import { useState, useTransition } from "react";
import { UserPlus, Trash2 } from "lucide-react";
import {
  changeRole,
  inviteMember,
  removeMember,
} from "../actions";
import type { Member } from "./page";

const ROLES: { v: Member["role"]; l: string }[] = [
  { v: "owner", l: "Владелец" },
  { v: "admin", l: "Администратор" },
  { v: "accountant", l: "Бухгалтер" },
  { v: "hr", l: "HR" },
  { v: "manager", l: "Менеджер" },
  { v: "viewer", l: "Наблюдатель" },
];

const PERMISSIONS: { role: Member["role"]; access: string }[] = [
  { role: "owner", access: "Полный доступ + биллинг + удаление организации" },
  { role: "admin", access: "Полный доступ кроме биллинга" },
  { role: "accountant", access: "Финансы, документы, контрагенты" },
  { role: "hr", access: "Кадры, сотрудники, отпуска, приказы" },
  { role: "manager", access: "Контрагенты, выпуск документов" },
  { role: "viewer", access: "Только чтение" },
];

export function TeamUI({
  rows,
  currentRole,
}: {
  rows: Member[];
  currentRole: Member["role"];
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const canManage = currentRole === "owner" || currentRole === "admin";

  return (
    <div>
      {canManage && (
        <form
          id="invite-form"
          action={(fd) =>
            startTransition(async () => {
              setError(null);
              const r = await inviteMember(fd);
              if (r?.error) setError(r.error);
              else
                (document.getElementById("invite-form") as HTMLFormElement)?.reset();
            })
          }
          className="surface mb-6 grid grid-cols-1 gap-3 p-5 lg:grid-cols-[1.4fr_180px_140px]"
        >
          <label className="grid gap-1.5">
            <span className="font-mono text-[10px] uppercase text-[color:var(--ink-mute)]">
              Email сотрудника
            </span>
            <input
              name="email"
              type="email"
              required
              placeholder="user@example.com"
              className="h-10 rounded-md border border-[color:var(--rule)] bg-white px-3 text-[14px] outline-none focus:border-[color:var(--ink)]"
            />
          </label>
          <label className="grid gap-1.5">
            <span className="font-mono text-[10px] uppercase text-[color:var(--ink-mute)]">
              Роль
            </span>
            <select
              name="role"
              defaultValue="manager"
              className="h-10 rounded-md border border-[color:var(--rule)] bg-white px-2 text-[14px] outline-none focus:border-[color:var(--ink)]"
            >
              {ROLES.filter((r) => r.v !== "owner").map((r) => (
                <option key={r.v} value={r.v}>
                  {r.l}
                </option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            disabled={pending}
            className="button-primary self-end !min-h-[40px]"
          >
            <UserPlus className="h-4 w-4" />
            {pending ? "…" : "Пригласить"}
          </button>
          {error && (
            <p className="lg:col-span-3 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-[13px] text-amber-800">
              {error}
            </p>
          )}
        </form>
      )}

      <div className="surface mb-6 overflow-hidden">
        <div className="hidden grid-cols-[1.4fr_180px_120px_180px_40px] gap-3 border-b border-[color:var(--rule)] px-4 py-3 font-mono text-[10px] uppercase text-[color:var(--ink-mute)] md:grid">
          <span>Пользователь</span>
          <span>Роль</span>
          <span>Email-приглашение</span>
          <span>Добавлен</span>
          <span></span>
        </div>
        <ul>
          {rows.map((m) => (
            <li
              key={m.id}
              className="grid grid-cols-1 gap-2 border-b border-[color:var(--rule)] px-4 py-3 last:border-b-0 md:grid-cols-[1.4fr_180px_120px_180px_40px] md:items-center"
            >
              <span className="font-mono text-[12px] text-[color:var(--ink-soft)]">
                {m.user_id.slice(0, 8)}…
              </span>
              {canManage && m.role !== "owner" ? (
                <select
                  defaultValue={m.role}
                  onChange={(e) =>
                    startTransition(() => changeRole(m.id, e.target.value))
                  }
                  className="h-9 rounded-md border border-[color:var(--rule)] bg-white px-2 text-[13px]"
                >
                  {ROLES.map((r) => (
                    <option key={r.v} value={r.v}>
                      {r.l}
                    </option>
                  ))}
                </select>
              ) : (
                <span className="font-mono text-[11px] uppercase text-[color:var(--ink-soft)]">
                  {ROLES.find((r) => r.v === m.role)?.l}
                </span>
              )}
              <span className="text-[13px] text-[color:var(--ink-soft)]">
                {m.invited_email ?? "—"}
              </span>
              <span className="font-mono text-[12px] text-[color:var(--ink-soft)]">
                {new Date(m.created_at).toLocaleDateString("ru-KZ")}
              </span>
              {canManage && m.role !== "owner" ? (
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Удалить участника?"))
                      startTransition(() => removeMember(m.id));
                  }}
                  className="text-[color:var(--ink-mute)] hover:text-red-600"
                  aria-label="Удалить"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              ) : (
                <span />
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="surface p-5">
        <div className="mb-3 font-mono text-[10px] uppercase text-[color:var(--ink-mute)]">
          Что может каждая роль
        </div>
        <ul className="grid gap-2 text-[13px]">
          {PERMISSIONS.map((p) => (
            <li key={p.role} className="grid grid-cols-[140px_1fr] gap-3">
              <span className="font-mono text-[11px] uppercase text-[color:var(--ink)]">
                {ROLES.find((r) => r.v === p.role)?.l}
              </span>
              <span className="text-[color:var(--ink-soft)]">{p.access}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
