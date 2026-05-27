"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login, type AuthState } from "../actions";

export default function LoginPage() {
  const [state, action, pending] = useActionState<AuthState, FormData>(
    login,
    undefined,
  );

  return (
    <>
      <div className="mb-6">
        <div className="eyebrow mb-2">Кабинет</div>
        <h1 className="text-[28px] font-semibold leading-tight">
          Вход в Turanix
        </h1>
        <p className="mt-2 text-[14px] text-[color:var(--ink-soft)]">
          Налоги, документы и бухгалтерия для ТОО на ОУР.
        </p>
      </div>

      <form action={action} className="grid gap-4">
        <Field label="Почта" name="email" type="email" autoComplete="email" />
        <Field
          label="Пароль"
          name="password"
          type="password"
          autoComplete="current-password"
        />

        {state?.error && (
          <p className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-[13px] text-red-700">
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="button-primary mt-2"
        >
          {pending ? "Входим…" : "Войти"}
        </button>
      </form>

      <p className="mt-6 text-center text-[13px] text-[color:var(--ink-soft)]">
        Нет аккаунта?{" "}
        <Link
          href="/signup"
          className="font-semibold text-[color:var(--ink)] underline-offset-2 hover:underline"
        >
          Создать
        </Link>
      </p>
    </>
  );
}

function Field({
  label,
  name,
  type,
  autoComplete,
}: {
  label: string;
  name: string;
  type: string;
  autoComplete?: string;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="font-mono text-[11px] uppercase text-[color:var(--ink-mute)]">
        {label}
      </span>
      <input
        name={name}
        type={type}
        autoComplete={autoComplete}
        required
        className="h-11 rounded-md border border-[color:var(--rule)] bg-white px-3 text-[14px] outline-none transition-colors focus:border-[color:var(--ink)]"
      />
    </label>
  );
}
