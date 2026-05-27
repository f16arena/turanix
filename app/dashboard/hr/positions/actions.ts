"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../../../_lib/supabase/server";
import { requireCurrentOrgId } from "../../../_lib/org";

export async function addPosition(formData: FormData) {
  const supabase = await createClient();
  const organization_id = await requireCurrentOrgId();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;
  const department_id = String(formData.get("department_id") ?? "").trim() || null;
  const salary_min = Number(formData.get("salary_min") ?? 0) || 0;
  const salary_max = Number(formData.get("salary_max") ?? 0) || 0;
  const note = String(formData.get("note") ?? "").trim() || null;
  await supabase
    .from("positions")
    .insert({ organization_id, name, department_id, salary_min, salary_max, note });
  revalidatePath("/dashboard/hr/positions");
}

export async function deletePosition(id: string) {
  const supabase = await createClient();
  await supabase.from("positions").delete().eq("id", id);
  revalidatePath("/dashboard/hr/positions");
}
