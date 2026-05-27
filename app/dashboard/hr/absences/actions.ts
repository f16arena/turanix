"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../../../_lib/supabase/server";
import { requireCurrentOrgId } from "../../../_lib/org";

export async function addAbsence(formData: FormData) {
  const supabase = await createClient();
  const organization_id = await requireCurrentOrgId();

  const employee_id = String(formData.get("employee_id") ?? "");
  const kind = String(formData.get("kind") ?? "vacation");
  const from_date = String(formData.get("from_date") ?? "");
  const to_date = String(formData.get("to_date") ?? "");
  const paid = formData.get("paid") === "on";
  const note = String(formData.get("note") ?? "").trim() || null;
  if (!employee_id || !from_date || !to_date) return;

  const days =
    Math.floor(
      (new Date(to_date).getTime() - new Date(from_date).getTime()) /
        (1000 * 60 * 60 * 24),
    ) + 1;

  await supabase.from("absences").insert({
    organization_id,
    employee_id,
    kind,
    from_date,
    to_date,
    days: Math.max(1, days),
    paid,
    note,
  });
  revalidatePath("/dashboard/hr/absences");
}

export async function deleteAbsence(id: string) {
  const supabase = await createClient();
  await supabase.from("absences").delete().eq("id", id);
  revalidatePath("/dashboard/hr/absences");
}
