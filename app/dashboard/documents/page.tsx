import Link from "next/link";
import { createClient } from "../../_lib/supabase/server";
import {
  Receipt,
  FileCheck2,
  Banknote,
  Scale,
  FileSignature,
} from "lucide-react";
import { DocumentsList } from "./_list";

export type DocRow = {
  id: string;
  kind: "invoice" | "esf" | "avr" | "reconciliation" | "quote";
  number: string;
  date: string;
  counterparty_id: string | null;
  counterparty_snapshot: { name?: string } | null;
  total: number;
  currency: string;
  status: "draft" | "issued" | "paid" | "cancelled";
  note: string | null;
};

const creators = [
  { kind: "invoice", title: "Счёт на оплату", Icon: Banknote, href: "/dashboard/documents/invoice", ready: true },
  { kind: "quote", title: "Коммерческое предложение", Icon: FileSignature, href: "/dashboard/documents/quote", ready: true },
  { kind: "esf", title: "ЭСФ", Icon: Receipt, href: "/dashboard/documents/esf", ready: true },
  { kind: "avr", title: "АВР", Icon: FileCheck2, href: "/dashboard/documents/act", ready: true },
  { kind: "reconciliation", title: "Акт сверки", Icon: Scale, href: "/dashboard/documents/reconciliation", ready: true },
] as const;

export default async function DocumentsPage({
  searchParams,
}: {
  searchParams: Promise<{
    kind?: string;
    status?: string;
    counterparty?: string;
    q?: string;
  }>;
}) {
  const { kind = "all", status = "all", counterparty = "", q = "" } =
    await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("documents")
    .select(
      "id, kind, number, date, counterparty_id, counterparty_snapshot, total, currency, status, note",
    )
    .order("date", { ascending: false })
    .limit(300);

  if (
    kind === "invoice" ||
    kind === "esf" ||
    kind === "avr" ||
    kind === "reconciliation" ||
    kind === "quote"
  ) {
    query = query.eq("kind", kind);
  }
  if (status === "draft" || status === "issued" || status === "paid" || status === "cancelled") {
    query = query.eq("status", status);
  }
  if (counterparty) query = query.eq("counterparty_id", counterparty);
  if (q) query = query.ilike("number", `%${q}%`);

  const { data } = await query;
  const rows = (data ?? []) as DocRow[];

  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="mb-8">
        <div className="eyebrow mb-2">Документы</div>
        <h1 className="text-[34px] font-semibold leading-tight">
          Журнал и шаблоны
        </h1>
        <p className="mt-2 max-w-[720px] text-[15px] leading-[1.6] text-[color:var(--ink-soft)]">
          Все выпущенные документы сохраняются с привязкой к контрагенту.
          Создавайте новые из шаблонов ниже.
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {creators.map(({ kind, title, Icon, href }) => (
          <Link
            href={href}
            key={kind}
            className="surface group flex items-center gap-4 p-4 transition-transform hover:-translate-y-0.5"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[color:var(--ink)] text-white transition-colors group-hover:text-[color:var(--signal)]">
              <Icon className="h-5 w-5" strokeWidth={1.6} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[15px] font-semibold">{title}</div>
              <div className="font-mono text-[10px] uppercase text-[color:var(--accent)]">
                Создать →
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mb-3 flex items-center justify-between">
        <div className="font-mono text-[10px] uppercase text-[color:var(--ink-mute)]">
          Архив документов · {rows.length}
        </div>
      </div>
      <DocumentsList rows={rows} kind={kind} status={status} q={q} />
    </div>
  );
}
