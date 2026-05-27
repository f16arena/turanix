"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "../../../_lib/supabase/server";
import { requireCurrentOrgId } from "../../../_lib/org";

type CpInput = {
  kind: "legal" | "individual" | "ip";
  name: string;
  full_name: string | null;
  bin: string | null;
  type: "debtor" | "creditor" | "both";
  legal_address: string | null;
  actual_address: string | null;
  phone: string | null;
  email: string | null;
  contact_person: string | null;
  director: string | null;
  director_position: string | null;
  oked: string | null;
  vat_payer: boolean;
  is_resident: boolean;
  balance: number;
  note: string | null;
};

function parseForm(formData: FormData): CpInput {
  const str = (k: string) => {
    const v = String(formData.get(k) ?? "").trim();
    return v || null;
  };
  return {
    kind: (String(formData.get("kind") ?? "legal") as CpInput["kind"]),
    name: String(formData.get("name") ?? "").trim(),
    full_name: str("full_name"),
    bin: str("bin"),
    type: (String(formData.get("type") ?? "debtor") as CpInput["type"]),
    legal_address: str("legal_address"),
    actual_address: str("actual_address"),
    phone: str("phone"),
    email: str("email"),
    contact_person: str("contact_person"),
    director: str("director"),
    director_position: str("director_position"),
    oked: str("oked"),
    vat_payer: formData.get("vat_payer") === "on",
    is_resident: formData.get("is_resident") !== null
      ? formData.get("is_resident") === "on"
      : true,
    balance: Number(formData.get("balance") ?? 0),
    note: str("note"),
  };
}

export async function createCounterparty(formData: FormData) {
  const supabase = await createClient();
  const organization_id = await requireCurrentOrgId();

  const input = parseForm(formData);
  if (!input.name) return;

  const { data, error } = await supabase
    .from("counterparties")
    .insert({ organization_id, ...input })
    .select("id")
    .single();

  if (error || !data) return;

  revalidatePath("/dashboard/accounting/counterparties");
  redirect(`/dashboard/accounting/counterparties/${data.id}`);
}

export async function updateCounterparty(id: string, formData: FormData) {
  const supabase = await createClient();
  const input = parseForm(formData);
  if (!input.name) return;

  await supabase.from("counterparties").update(input).eq("id", id);
  revalidatePath("/dashboard/accounting/counterparties");
  revalidatePath(`/dashboard/accounting/counterparties/${id}`);
  redirect(`/dashboard/accounting/counterparties/${id}`);
}

export async function deleteCounterparty(id: string) {
  const supabase = await createClient();
  await supabase.from("counterparties").delete().eq("id", id);
  revalidatePath("/dashboard/accounting/counterparties");
  redirect("/dashboard/accounting/counterparties");
}

export async function addAccount(counterpartyId: string, formData: FormData) {
  const supabase = await createClient();
  const organization_id = await requireCurrentOrgId();

  const iban = String(formData.get("iban") ?? "").trim();
  const bank = String(formData.get("bank") ?? "").trim();
  if (!iban || !bank) return;

  const bik = String(formData.get("bik") ?? "").trim() || null;
  const kbe = String(formData.get("kbe") ?? "").trim() || null;
  const currency = String(formData.get("currency") ?? "KZT").trim() || "KZT";
  const is_primary = formData.get("is_primary") === "on";
  const note = String(formData.get("note") ?? "").trim() || null;

  if (is_primary) {
    await supabase
      .from("counterparty_accounts")
      .update({ is_primary: false })
      .eq("counterparty_id", counterpartyId);
  }

  await supabase.from("counterparty_accounts").insert({
    organization_id,
    counterparty_id: counterpartyId,
    iban,
    bank,
    bik,
    kbe,
    currency,
    is_primary,
    note,
  });

  revalidatePath(`/dashboard/accounting/counterparties/${counterpartyId}`);
}

export async function deleteAccount(id: string, counterpartyId: string) {
  const supabase = await createClient();
  await supabase.from("counterparty_accounts").delete().eq("id", id);
  revalidatePath(`/dashboard/accounting/counterparties/${counterpartyId}`);
}

export async function setPrimaryAccount(id: string, counterpartyId: string) {
  const supabase = await createClient();
  await supabase
    .from("counterparty_accounts")
    .update({ is_primary: false })
    .eq("counterparty_id", counterpartyId);
  await supabase
    .from("counterparty_accounts")
    .update({ is_primary: true })
    .eq("id", id);
  revalidatePath(`/dashboard/accounting/counterparties/${counterpartyId}`);
}
