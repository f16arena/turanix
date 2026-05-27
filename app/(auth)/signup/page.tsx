"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signup, type AuthState } from "../actions";

export default function SignupPage() {
  const [state, action, pending] = useActionState<AuthState, FormData>(
    signup,
    undefined,
  );

  return (
    <>
      <div className="mb-6">
        <div className="eyebrow mb-2">Регистрация</div>
        <h1 className="text-[28px] font-semibold leading-tight">
          Создать аккаунт
        </h1>
        <p className="mt-2 text-[14px] text-[color:var(--ink-soft)]">
          Один кабинет на ТОО — налоги, документы, бухгалтерия.
        </p>
      </div>

      <form action={action} className="grid gap-4">
        <Field label="Компания" name="company" type="text" />
        <Field label="Почта" name="email" type="email" autoComplete="email" />
        <Field
          label="Пароль (мин. 8 символов)"
          name="password"
          type="password"
          autoComplete="new-password"
        />

        {state?.error && (
          <p className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-[13px] text-amber-800">
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="button-primary mt-2"
        >
          {pending ? "Регистрируем…" : "Создать аккаунт"}
        </button>
      </form>

      <p className="mt-6 text-center text-[13px] text-[color:var(--ink-soft)]">
        Уже есть аккаунт?{" "}
        <Link
          href="/login"
          className="font-semibold text-[color:var(--ink)] underline-offset-2 hover:underline"
        >
          Войти
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
        required={name !== "company"}
        className="h-11 rounded-md border border-[color:var(--rule)] bg-white px-3 text-[14px] outline-none transition-colors focus:border-[color:var(--ink)]"
      />
    </label>
  );
}
