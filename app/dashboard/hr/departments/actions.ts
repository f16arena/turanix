"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../../../_lib/supabase/server";
import { requireCurrentOrgId } from "../../../_lib/org";

export async function addDepartment(formData: FormData) {
  const supabase = await createClient();
  const organization_id = await requireCurrentOrgId();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;
  const parent_id = String(formData.get("parent_id") ?? "").trim() || null;
  const note = String(formData.get("note") ?? "").trim() || null;
  await supabase
    .from("departments")
    .insert({ organization_id, name, parent_id, note });
  revalidatePath("/dashboard/hr/departments");
}

export async function renameDepartment(id: string, name: string) {
  const supabase = await createClient();
  await supabase.from("departments").update({ name }).eq("id", id);
  revalidatePath("/dashboard/hr/departments");
}

export async function deleteDepartment(id: string) {
  const supabase = await createClient();
  await supabase.from("departments").delete().eq("id", id);
  revalidatePath("/dashboard/hr/departments");
}
