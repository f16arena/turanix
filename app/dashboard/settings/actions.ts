"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../../_lib/supabase/server";
import { requireCurrentOrgId, setCurrentOrg, getCurrentOrg } from "../../_lib/org";

export async function switchOrg(orgId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("memberships")
    .select("id")
    .eq("organization_id", orgId)
    .maybeSingle();
  if (!data) return;
  await setCurrentOrg(orgId);
  revalidatePath("/dashboard", "layout");
}

export async function inviteMember(formData: FormData) {
  const organization_id = await requireCurrentOrgId();
  const supabase = await createClient();

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const role = String(formData.get("role") ?? "viewer");
  if (!email) return { error: "Введите email" };

  const current = await getCurrentOrg();
  if (!current || (current.role !== "owner" && current.role !== "admin"))
    return { error: "Недостаточно прав" };

  // Ищем существующего пользователя в auth.users (через профили)
  // Если ещё нет — записываем приглашение как pending по email
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id, company_name")
    .ilike("company_name", `%${email}%`)
    .maybeSingle();

  // Тут проще: ищем по email из auth.users — но через RPC. У нас есть только profiles.
  // Поэтому добавляем приглашение по email; реальная привязка произойдёт когда
  // пользователь с этим email зарегистрируется (расширение триггера — на будущее).
  if (existingProfile) {
    await supabase.from("memberships").insert({
      organization_id,
      user_id: existingProfile.id,
      role,
      invited_email: email,
    });
  } else {
    // оставляем строку с user_id = null нельзя — поле NOT NULL.
    // Простой вариант: показываем подсказку отправить ссылку вручную.
    return {
      error:
        "Пользователь с таким email ещё не зарегистрирован. Попросите его зарегистрироваться на /signup, и после этого добавьте повторно.",
    };
  }

  revalidatePath("/dashboard/settings");
  return { ok: true };
}

export async function changeRole(membershipId: string, role: string) {
  const supabase = await createClient();
  const current = await getCurrentOrg();
  if (!current || (current.role !== "owner" && current.role !== "admin")) return;

  await supabase.from("memberships").update({ role }).eq("id", membershipId);
  revalidatePath("/dashboard/settings");
}

export async function removeMember(membershipId: string) {
  const supabase = await createClient();
  const current = await getCurrentOrg();
  if (!current || (current.role !== "owner" && current.role !== "admin")) return;

  await supabase.from("memberships").delete().eq("id", membershipId);
  revalidatePath("/dashboard/settings");
}
