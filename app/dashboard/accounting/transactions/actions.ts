"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../../../_lib/supabase/server";
import { requireCurrentOrgId } from "../../../_lib/org";

export async function addTransaction(formData: FormData) {
  const supabase = await createClient();
  const organization_id = await requireCurrentOrgId();

  const type = String(formData.get("type") ?? "expense") as "income" | "expense";
  const date = String(formData.get("date") ?? "");
  const category = String(formData.get("category") ?? "").trim();
  const amount = Number(formData.get("amount") ?? 0);
  const description = String(formData.get("description") ?? "").trim() || null;
  const counterparty = String(formData.get("counterparty") ?? "").trim() || null;
  const doc = String(formData.get("doc") ?? "").trim() || null;

  if (!date || !category || !amount) return;

  await supabase.from("transactions").insert({
    organization_id,
    type,
    date,
    category,
    amount,
    description,
    counterparty,
    doc,
  });
  revalidatePath("/dashboard/accounting");
}

export async function deleteTransaction(id: string) {
  const supabase = await createClient();
  await supabase.from("transactions").delete().eq("id", id);
  revalidatePath("/dashboard/accounting");
}
