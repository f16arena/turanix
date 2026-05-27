"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../../../_lib/supabase/server";
import { requireCurrentOrgId } from "../../../_lib/org";

export async function addStaffing(formData: FormData) {
  const supabase = await createClient();
  const organization_id = await requireCurrentOrgId();

  const department_id = String(formData.get("department_id") ?? "").trim() || null;
  const position_id = String(formData.get("position_id") ?? "").trim();
  const planned_count = Number(formData.get("planned_count") ?? 1) || 1;
  const salary = Number(formData.get("salary") ?? 0) || 0;
  const note = String(formData.get("note") ?? "").trim() || null;
  if (!position_id) return;

  await supabase.from("staffing").upsert(
    {
      organization_id,
      department_id,
      position_id,
      planned_count,
      salary,
      note,
    },
    { onConflict: "organization_id,department_id,position_id" },
  );
  revalidatePath("/dashboard/hr/staffing");
}

export async function deleteStaffing(id: string) {
  const supabase = await createClient();
  await supabase.from("staffing").delete().eq("id", id);
  revalidatePath("/dashboard/hr/staffing");
}
