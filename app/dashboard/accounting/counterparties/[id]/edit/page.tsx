import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "../../../../../_lib/supabase/server";
import { CounterpartyForm } from "../../_form";
import type { Counterparty } from "../../_types";

export default async function EditCounterpartyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("counterparties")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();

  return (
    <div>
      <div className="mb-6">
        <Link
          href={`/dashboard/accounting/counterparties/${id}`}
          className="font-mono text-[11px] uppercase text-[color:var(--ink-mute)] hover:text-[color:var(--ink)]"
        >
          ← К карточке
        </Link>
        <h2 className="mt-3 text-[26px] font-semibold leading-tight">
          Редактирование контрагента
        </h2>
      </div>
      <CounterpartyForm mode="edit" initial={data as Counterparty} />
    </div>
  );
}
