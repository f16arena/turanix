import { createClient } from "../../../_lib/supabase/server";
import { TransactionsUI } from "./_ui";

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; month?: string; q?: string }>;
}) {
  const { type = "all", month = "", q = "" } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("transactions")
    .select("*")
    .order("date", { ascending: false })
    .limit(300);

  if (type === "income" || type === "expense") query = query.eq("type", type);
  if (month) {
    const [y, m] = month.split("-").map(Number);
    if (y && m) {
      const from = new Date(y, m - 1, 1).toISOString().slice(0, 10);
      const to = new Date(y, m, 0).toISOString().slice(0, 10);
      query = query.gte("date", from).lte("date", to);
    }
  }
  if (q) {
    query = query.or(
      `description.ilike.%${q}%,counterparty.ilike.%${q}%,category.ilike.%${q}%`,
    );
  }

  const { data } = await query;
  return <TransactionsUI rows={(data ?? []) as TxRow[]} type={type} month={month} q={q} />;
}

export type TxRow = {
  id: string;
  type: "income" | "expense";
  date: string;
  category: string;
  amount: number;
  description: string | null;
  counterparty: string | null;
  doc: string | null;
};
