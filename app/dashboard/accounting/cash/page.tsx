import { createClient } from "../../../_lib/supabase/server";
import { CashUI } from "./_ui";

export type CashRow = {
  id: string;
  type: "in" | "out";
  date: string;
  amount: number;
  category: string | null;
  description: string | null;
};

export default async function CashPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("cash_operations")
    .select("*")
    .order("date", { ascending: false })
    .limit(300);
  return <CashUI rows={(data ?? []) as CashRow[]} />;
}
