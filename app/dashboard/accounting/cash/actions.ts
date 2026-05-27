"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../../../_lib/supabase/server";
import { requireCurrentOrgId } from "../../../_lib/org";

export async function addCash(formData: FormData) {
  const supabase = await createClient();
  const organization_id = await requireCurrentOrgId();

  const type = String(formData.get("type") ?? "in") as "in" | "out";
  const date = String(formData.get("date") ?? "");
  const amount = Number(formData.get("amount") ?? 0);
  const category = String(formData.get("category") ?? "").trim() || null;
  const description = String(formData.get("description") ?? "").trim() || null;

  if (!date || !amount) return;
  await supabase
    .from("cash_operations")
    .insert({ organization_id, type, date, amount, category, description });
  revalidatePath("/dashboard/accounting/cash");
}

export async function deleteCash(id: string) {
  const supabase = await createClient();
  await supabase.from("cash_operations").delete().eq("id", id);
  revalidatePath("/dashboard/accounting/cash");
}
