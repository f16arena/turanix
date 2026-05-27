import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { createClient } from "../../../_lib/supabase/server";
import { CounterpartyList } from "./_list";
import type { Counterparty } from "./_types";

export default async function CounterpartiesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; kind?: string; type?: string }>;
}) {
  const { q = "", kind = "all", type = "all" } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("counterparties")
    .select("*")
    .order("name", { ascending: true });

  if (kind === "legal" || kind === "ip" || kind === "individual") {
    query = query.eq("kind", kind);
  }
  if (type === "debtor" || type === "creditor" || type === "both") {
    query = query.eq("type", type);
  }
  if (q) {
    query = query.or(`name.ilike.%${q}%,full_name.ilike.%${q}%,bin.ilike.%${q}%`);
  }

  const { data } = await query;
  const rows = (data ?? []) as Counterparty[];

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[14px] text-[color:var(--ink-soft)]">
          <Search className="h-4 w-4" />
          Найдено: {rows.length}
        </div>
        <Link
          href="/dashboard/accounting/counterparties/new"
          className="button-primary !min-h-[40px] !text-[13px]"
        >
          <Plus className="h-4 w-4" />
          Новый контрагент
        </Link>
      </div>

      <CounterpartyList rows={rows} q={q} kind={kind} type={type} />
    </div>
  );
}
