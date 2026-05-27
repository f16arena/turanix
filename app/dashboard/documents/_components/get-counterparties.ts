import "server-only";
import { createClient } from "../../../_lib/supabase/server";
import type { PickerCp } from "./counterparty-picker";

export async function getCounterparties(): Promise<PickerCp[]> {
  const supabase = await createClient();
  const { data: cps } = await supabase
    .from("counterparties")
    .select("id, name, full_name, bin, legal_address, director, director_position")
    .order("name");
  const { data: accs } = await supabase
    .from("counterparty_accounts")
    .select("counterparty_id, iban, bank, bik, kbe, currency, is_primary");

  const accMap = new Map<string, PickerCp["accounts"]>();
  for (const a of accs ?? []) {
    const arr = accMap.get(a.counterparty_id) ?? [];
    arr.push({
      iban: a.iban,
      bank: a.bank,
      bik: a.bik,
      kbe: a.kbe,
      currency: a.currency,
      is_primary: a.is_primary,
    });
    accMap.set(a.counterparty_id, arr);
  }

  return (cps ?? []).map((c) => ({
    id: c.id,
    name: c.name,
    full_name: c.full_name,
    bin: c.bin,
    legal_address: c.legal_address,
    director: c.director,
    director_position: c.director_position,
    accounts: (accMap.get(c.id) ?? []).sort(
      (a, b) => Number(b.is_primary) - Number(a.is_primary),
    ),
  }));
}
