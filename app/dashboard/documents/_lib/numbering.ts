import "server-only";
import { createClient } from "../../../_lib/supabase/server";
import { getCurrentOrg } from "../../../_lib/org";

export type DocKind = "invoice" | "esf" | "avr" | "reconciliation" | "quote";

const PREFIX: Record<DocKind, string> = {
  invoice: "СЧ",
  esf: "ЭСФ",
  avr: "АВР",
  reconciliation: "АС",
  quote: "КП",
};

export async function getNextDocNumber(kind: DocKind, date: string) {
  const supabase = await createClient();
  const org = await getCurrentOrg();
  if (!org) return null;

  const year = new Date(date).getFullYear();
  const { count } = await supabase
    .from("documents")
    .select("*", { count: "exact", head: true })
    .eq("kind", kind)
    .gte("date", `${year}-01-01`)
    .lte("date", `${year}-12-31`);

  const seq = String((count ?? 0) + 1).padStart(3, "0");
  return `${PREFIX[kind]}-${year}-${seq}`;
}
