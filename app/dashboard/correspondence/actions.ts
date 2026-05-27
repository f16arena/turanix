"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../../_lib/supabase/server";
import { requireCurrentOrgId } from "../../_lib/org";

export async function addCorrespondence(formData: FormData) {
  const supabase = await createClient();
  const organization_id = await requireCurrentOrgId();

  const direction = String(formData.get("direction") ?? "incoming") as
    | "incoming"
    | "outgoing";
  const date = String(formData.get("date") ?? "");
  const party = String(formData.get("party") ?? "").trim();
  const subject = String(formData.get("subject") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim() || null;
  const note = String(formData.get("note") ?? "").trim() || null;

  if (!date || !party || !subject) return;

  const year = new Date(date).getFullYear();
  const prefix = direction === "incoming" ? "В" : "И";

  const { count } = await supabase
    .from("correspondence")
    .select("*", { count: "exact", head: true })
    .eq("direction", direction)
    .gte("date", `${year}-01-01`)
    .lte("date", `${year}-12-31`);

  const seq = String((count ?? 0) + 1).padStart(3, "0");
  const number = `${prefix}-${year}-${seq}`;

  await supabase.from("correspondence").insert({
    organization_id,
    direction,
    date,
    number,
    party,
    subject,
    status,
    note,
  });

  revalidatePath("/dashboard/correspondence");
}

export async function deleteCorrespondence(id: string) {
  const supabase = await createClient();
  await supabase.from("correspondence").delete().eq("id", id);
  revalidatePath("/dashboard/correspondence");
}
