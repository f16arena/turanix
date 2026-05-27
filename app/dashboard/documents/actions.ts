"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "../../_lib/supabase/server";
import { requireCurrentOrgId } from "../../_lib/org";

export type DocKind = "invoice" | "esf" | "avr" | "reconciliation" | "quote";
export type DocStatus = "draft" | "issued" | "paid" | "cancelled";

export async function saveDocument(input: {
  id?: string;
  kind: DocKind;
  number: string;
  date: string;
  counterparty_id: string | null;
  counterparty_snapshot: Record<string, unknown> | null;
  payload: Record<string, unknown>;
  total: number;
  currency?: string;
  status?: DocStatus;
  note?: string | null;
}) {
  const supabase = await createClient();
  const organization_id = await requireCurrentOrgId();

  const row = {
    organization_id,
    kind: input.kind,
    number: input.number,
    date: input.date,
    counterparty_id: input.counterparty_id,
    counterparty_snapshot: input.counterparty_snapshot,
    payload: input.payload,
    total: input.total,
    currency: input.currency ?? "KZT",
    status: input.status ?? "issued",
    note: input.note ?? null,
  };

  if (input.id) {
    const { error } = await supabase
      .from("documents")
      .update(row)
      .eq("id", input.id);
    if (error) throw error;
    revalidatePath("/dashboard/documents");
    return { id: input.id };
  }

  const { data, error } = await supabase
    .from("documents")
    .insert(row)
    .select("id")
    .single();
  if (error || !data) throw error ?? new Error("insert failed");
  revalidatePath("/dashboard/documents");
  return { id: data.id };
}

export async function setDocumentStatus(id: string, status: DocStatus) {
  const supabase = await createClient();
  await supabase.from("documents").update({ status }).eq("id", id);
  revalidatePath("/dashboard/documents");
}

export async function deleteDocument(id: string) {
  const supabase = await createClient();
  await supabase.from("documents").delete().eq("id", id);
  revalidatePath("/dashboard/documents");
  redirect("/dashboard/documents");
}

