import Link from "next/link";
import { notFound } from "next/navigation";
import { Pencil } from "lucide-react";
import { createClient } from "../../../../_lib/supabase/server";
import { KIND_LABEL, TYPE_LABEL } from "../_types";
import type { Counterparty, CounterpartyAccount } from "../_types";
import { AccountsBlock } from "./_accounts";
import { DangerZone } from "./_danger";

const fmt = (n: number) =>
  new Intl.NumberFormat("ru-KZ", {
    style: "currency",
    currency: "KZT",
    maximumFractionDigits: 0,
  }).format(n);

export default async function CounterpartyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: cp }, { data: accounts }, { data: docs }, { data: ops }] =
    await Promise.all([
      supabase.from("counterparties").select("*").eq("id", id).maybeSingle(),
      supabase
        .from("counterparty_accounts")
        .select("*")
        .eq("counterparty_id", id)
        .order("is_primary", { ascending: false }),
      supabase
        .from("documents")
        .select("id, kind, number, date, total, status, currency")
        .eq("counterparty_id", id)
        .order("date", { ascending: false })
        .limit(20),
      supabase
        .from("transactions")
        .select("id, type, date, category, amount, description")
        .eq("counterparty", id)
        .order("date", { ascending: false })
        .limit(20),
    ]);

  if (!cp) notFound();
  const counterparty = cp as Counterparty;
  const acc = (accounts ?? []) as CounterpartyAccount[];

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <Link
            href="/dashboard/accounting/counterparties"
            className="font-mono text-[11px] uppercase text-[color:var(--ink-mute)] hover:text-[color:var(--ink)]"
          >
            ← К списку
          </Link>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-[color:var(--rule)] bg-white px-2.5 py-1 font-mono text-[10px] uppercase text-[color:var(--ink-soft)]">
              {KIND_LABEL[counterparty.kind]}
            </span>
            {counterparty.vat_payer && (
              <span className="rounded-full bg-[color:var(--accent-soft)] px-2.5 py-1 font-mono text-[10px] uppercase text-[color:var(--accent)]">
                Плательщик НДС
              </span>
            )}
            {!counterparty.is_resident && (
              <span className="rounded-full border border-amber-300 bg-amber-50 px-2.5 py-1 font-mono text-[10px] uppercase text-amber-700">
                Нерезидент
              </span>
            )}
          </div>
          <h2 className="mt-2 text-[28px] font-semibold leading-tight">
            {counterparty.name}
          </h2>
          {counterparty.full_name && counterparty.full_name !== counterparty.name && (
            <div className="mt-1 text-[14px] text-[color:var(--ink-soft)]">
              {counterparty.full_name}
            </div>
          )}
        </div>
        <Link
          href={`/dashboard/accounting/counterparties/${id}/edit`}
          className="button-primary !min-h-[40px] !text-[13px]"
        >
          <Pencil className="h-4 w-4" />
          Редактировать
        </Link>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-3">
        <Stat label="Баланс" value={fmt(Number(counterparty.balance))} accent={Number(counterparty.balance) > 0} />
        <Stat label="Документов" value={String(docs?.length ?? 0)} />
        <Stat label="Тип расчётов" value={TYPE_LABEL[counterparty.type]} mono />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.2fr_1fr]">
        <section className="surface p-5">
          <div className="mb-4 font-mono text-[10px] uppercase text-[color:var(--ink-mute)]">
            Реквизиты
          </div>
          <Detail label="БИН/ИИН" value={counterparty.bin} mono />
          <Detail label="ОКЭД" value={counterparty.oked} mono />
          <Detail
            label={
              counterparty.kind === "individual"
                ? "Адрес регистрации"
                : "Юридический адрес"
            }
            value={counterparty.legal_address}
          />
          <Detail label="Фактический адрес" value={counterparty.actual_address} />
          <Detail label="Телефон" value={counterparty.phone} />
          <Detail label="Email" value={counterparty.email} />
          <Detail label="Контактное лицо" value={counterparty.contact_person} />
          {(counterparty.kind === "legal" || counterparty.kind === "ip") && (
            <>
              <Detail label="Руководитель" value={counterparty.director} />
              <Detail label="Должность" value={counterparty.director_position} />
            </>
          )}
          {counterparty.note && (
            <Detail label="Примечание" value={counterparty.note} />
          )}
        </section>

        <AccountsBlock counterpartyId={id} accounts={acc} />
      </div>

      <section className="surface mt-5 p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="font-mono text-[10px] uppercase text-[color:var(--ink-mute)]">
            Документы
          </div>
          <Link
            href={`/dashboard/documents?counterparty=${id}`}
            className="font-mono text-[10px] uppercase text-[color:var(--ink-mute)] hover:text-[color:var(--ink)]"
          >
            Все →
          </Link>
        </div>
        {(docs ?? []).length === 0 ? (
          <p className="py-4 text-center text-[14px] text-[color:var(--ink-soft)]">
            По этому контрагенту документов ещё не выпускалось.
          </p>
        ) : (
          <ul className="grid gap-1">
            {(docs ?? []).map((d) => (
              <li
                key={d.id}
                className="grid grid-cols-[110px_140px_1fr_120px_140px] items-center gap-3 border-b border-[color:var(--rule)] py-2 text-[14px] last:border-b-0"
              >
                <span className="font-mono text-[11px] uppercase text-[color:var(--ink-soft)]">
                  {kindLabel(d.kind)}
                </span>
                <span className="font-mono text-[12px]">{d.number}</span>
                <span className="font-mono text-[12px] text-[color:var(--ink-soft)]">
                  {d.date}
                </span>
                <span
                  className={`inline-flex h-5 w-fit items-center rounded-full px-2 font-mono text-[10px] uppercase ${statusClass(d.status)}`}
                >
                  {statusLabel(d.status)}
                </span>
                <span className="text-right font-mono">{fmt(Number(d.total))}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="surface mt-5 p-5">
        <div className="mb-4 font-mono text-[10px] uppercase text-[color:var(--ink-mute)]">
          Последние операции по контрагенту
        </div>
        {(ops ?? []).length === 0 ? (
          <p className="py-4 text-center text-[14px] text-[color:var(--ink-soft)]">
            Доход/расход не привязан к этому контрагенту.
          </p>
        ) : (
          <ul className="grid gap-1">
            {(ops ?? []).map((o) => (
              <li
                key={o.id}
                className="grid grid-cols-[100px_120px_1fr_140px] items-center gap-3 border-b border-[color:var(--rule)] py-2 text-[14px] last:border-b-0"
              >
                <span className="font-mono text-[12px] text-[color:var(--ink-soft)]">
                  {o.date}
                </span>
                <span
                  className={`inline-flex h-5 w-fit items-center rounded-full px-2 font-mono text-[10px] uppercase ${
                    o.type === "income"
                      ? "bg-[color:var(--accent-soft)] text-[color:var(--accent)]"
                      : "bg-[#f4f5ef] text-[color:var(--ink-soft)]"
                  }`}
                >
                  {o.type === "income" ? "доход" : "расход"}
                </span>
                <span className="truncate text-[color:var(--ink-soft)]">
                  {o.description || o.category}
                </span>
                <span className="text-right font-mono">
                  {fmt(Number(o.amount))}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <DangerZone id={id} name={counterparty.name} />
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
  mono,
}: {
  label: string;
  value: string;
  accent?: boolean;
  mono?: boolean;
}) {
  return (
    <div className="surface p-4">
      <div className="font-mono text-[10px] uppercase text-[color:var(--ink-mute)]">
        {label}
      </div>
      <div
        className={`mt-1.5 ${mono ? "font-mono text-[16px]" : "text-[20px] font-semibold"} ${
          accent ? "text-[color:var(--accent)]" : ""
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function Detail({
  label,
  value,
  mono,
}: {
  label: string;
  value: string | null;
  mono?: boolean;
}) {
  return (
    <div className="grid grid-cols-[170px_1fr] gap-3 border-b border-[color:var(--rule)] py-2.5 last:border-b-0">
      <span className="font-mono text-[10px] uppercase text-[color:var(--ink-mute)]">
        {label}
      </span>
      <span
        className={`text-[14px] ${
          value ? "text-[color:var(--ink)]" : "text-[color:var(--ink-mute)]"
        } ${mono ? "font-mono" : ""}`}
      >
        {value || "—"}
      </span>
    </div>
  );
}

function kindLabel(k: string) {
  switch (k) {
    case "invoice":
      return "Счёт";
    case "esf":
      return "ЭСФ";
    case "avr":
      return "АВР";
    case "reconciliation":
      return "Акт сверки";
    case "quote":
      return "КП";
    default:
      return k;
  }
}

function statusLabel(s: string) {
  return {
    draft: "Черновик",
    issued: "Выставлен",
    paid: "Оплачен",
    cancelled: "Аннулирован",
  }[s] ?? s;
}

function statusClass(s: string) {
  switch (s) {
    case "paid":
      return "bg-[color:var(--accent-soft)] text-[color:var(--accent)]";
    case "issued":
      return "bg-blue-50 text-blue-700";
    case "cancelled":
      return "bg-red-50 text-red-600";
    default:
      return "bg-[#f4f5ef] text-[color:var(--ink-soft)]";
  }
}
