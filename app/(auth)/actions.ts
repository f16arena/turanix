"use server";

import { redirect } from "next/navigation";
import { createClient } from "../_lib/supabase/server";

export type AuthState = { error?: string } | undefined;

export async function login(
  _: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Введите почту и пароль" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: mapAuthError(error.message) };
  }

  redirect("/dashboard");
}

export async function signup(
  _: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const company = String(formData.get("company") ?? "").trim();

  if (!email || !password) {
    return { error: "Введите почту и пароль" };
  }
  if (password.length < 8) {
    return { error: "Пароль должен быть минимум 8 символов" };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { company_name: company || null } },
  });

  if (error) {
    return { error: mapAuthError(error.message) };
  }

  if (!data.session) {
    return {
      error:
        "Регистрация почти готова. Проверьте почту и подтвердите адрес для входа.",
    };
  }

  redirect("/dashboard");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

function mapAuthError(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes("invalid login")) return "Неверная почта или пароль";
  if (m.includes("user already registered"))
    return "Такой пользователь уже зарегистрирован";
  if (m.includes("email not confirmed"))
    return "Подтвердите email — мы выслали ссылку";
  return msg;
}
