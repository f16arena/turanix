import Link from "next/link";
import { notFound } from "next/navigation";
import { Pencil } from "lucide-react";
import { createClient } from "../../../../_lib/supabase/server";
import {
  EMPLOYMENT_LABEL,
  STATUS_CLASS,
  STATUS_LABEL,
  fullName,
  type Employee,
} from "../_types";
import { calcPayroll } from "../../../../_lib/tax/kz-2026";

const fmt = (n: number) =>
  new Intl.NumberFormat("ru-KZ", {
    style: "currency",
    currency: "KZT",
    maximumFractionDigits: 0,
  }).format(n);

export default async function EmployeePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: emp }, { data: history }, { data: orders }, { data: absences }] =
    await Promise.all([
      supabase.from("employees").select("*").eq("id", id).maybeSingle(),
      supabase
        .from("employee_history")
        .select("*")
        .eq("employee_id", id)
        .order("date", { ascending: false })
        .limit(20),
      supabase
        .from("hr_orders")
        .select("id, kind, number, date, note")
        .eq("employee_id", id)
        .order("date", { ascending: false })
        .limit(10),
      supabase
        .from("absences")
        .select("id, kind, from_date, to_date, days, paid")
        .eq("employee_id", id)
        .order("from_date", { ascending: false })
        .limit(10),
    ]);

  if (!emp) notFound();
  const e = emp as Employee;
  const payroll = calcPayroll(Number(e.salary));

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <Link
            href="/dashboard/hr/employees"
            className="font-mono text-[11px] uppercase text-[color:var(--ink-mute)] hover:text-[color:var(--ink)]"
          >
            ← К списку
          </Link>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-1 font-mono text-[10px] uppercase ${STATUS_CLASS[e.status]}`}
            >
              {STATUS_LABEL[e.status]}
            </span>
            <span className="rounded-full border border-[color:var(--rule)] bg-white px-2.5 py-1 font-mono text-[10px] uppercase text-[color:var(--ink-soft)]">
              {EMPLOYMENT_LABEL[e.employment_type]}
            </span>
            {e.is_pensioner && (
              <Tag color="amber">Пенсионер · без ОПВ</Tag>
            )}
            {e.is_disabled && <Tag color="blue">Инвалид</Tag>}
            {e.has_many_children && <Tag color="green">Многодетный</Tag>}
          </div>
          <h2 className="mt-2 text-[28px] font-semibold leading-tight">
            {fullName(e)}
          </h2>
          {e.position && (
            <div className="mt-1 text-[14px] text-[color:var(--ink-soft)]">
              {e.position}
            </div>
          )}
        </div>
        <Link
          href={`/dashboard/hr/employees/${id}/edit`}
          className="button-primary !min-h-[40px] !text-[13px]"
        >
          <Pencil className="h-4 w-4" />
          Редактировать
        </Link>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-4">
        <Stat label="Оклад" value={fmt(Number(e.salary))} />
        <Stat label="На руки" value={fmt(payroll.net)} accent />
        <Stat label="Налоги" value={fmt(payroll.taxesTotal)} />
        <Stat label="Затраты" value={fmt(payroll.totalCost)} bold />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <section className="surface p-5">
          <div className="mb-4 font-mono text-[10px] uppercase text-[color:var(--ink-mute)]">
            Личные данные
          </div>
          <Detail label="ИИН" value={e.iin} mono />
          <Detail
            label="Дата рождения"
            value={e.birth_date}
            mono
          />
          <Detail
            label="Пол"
            value={e.gender === "male" ? "Мужской" : e.gender === "female" ? "Женский" : null}
          />
          <Detail label="Гражданство" value={e.citizenship} />
          <Detail label="Образование" value={e.education} />
          <Detail label="Телефон" value={e.phone} />
          <Detail label="Email" value={e.email} />
          <Detail label="Адрес прописки" value={e.registration_address} />
          <Detail label="Адрес фактический" value={e.actual_address} />
          <Detail
            label="Удостоверение"
            value={
              e.passport_series || e.passport_number
                ? `${e.passport_series ?? ""} ${e.passport_number ?? ""}`.trim()
                : null
            }
            mono
          />
          <Detail label="Кем выдано" value={e.passport_issued_by} />
          <Detail label="Дата выдачи" value={e.passport_issued_at} mono />
        </section>

        <section className="surface p-5">
          <div className="mb-4 font-mono text-[10px] uppercase text-[color:var(--ink-mute)]">
            Трудовые данные
          </div>
          <Detail label="Дата приёма" value={e.start_date} mono />
          <Detail label="Тип занятости" value={EMPLOYMENT_LABEL[e.employment_type]} />
          <Detail label="Договор №" value={e.contract_number} mono />
          <Detail label="Дата договора" value={e.contract_date} mono />
          {e.dismissal_date && (
            <>
              <Detail label="Дата увольнения" value={e.dismissal_date} mono />
              <Detail label="Причина" value={e.dismissal_reason} />
            </>
          )}
          <Detail label="Оклад" value={fmt(Number(e.salary))} mono />

          <div className="mt-5 mb-3 font-mono text-[10px] uppercase text-[color:var(--ink-mute)]">
            Банковские реквизиты для зарплаты
          </div>
          <Detail label="IBAN" value={e.payroll_iban} mono />
          <Detail label="Банк" value={e.payroll_bank} />

          {e.note && (
            <>
              <div className="mt-5 mb-3 font-mono text-[10px] uppercase text-[color:var(--ink-mute)]">
                Примечание
              </div>
              <p className="text-[13.5px] text-[color:var(--ink-soft)]">{e.note}</p>
            </>
          )}
        </section>
      </div>

      <section className="surface mt-5 p-5">
        <div className="mb-4 font-mono text-[10px] uppercase text-[color:var(--ink-mute)]">
          История кадровых событий
        </div>
        {(history ?? []).length === 0 ? (
          <p className="py-3 text-center text-[13px] text-[color:var(--ink-soft)]">
            Событий пока нет.
          </p>
        ) : (
          <ul className="grid gap-1">
            {(history ?? []).map((h) => (
              <li
                key={h.id}
                className="grid grid-cols-[110px_140px_1fr] items-center gap-3 border-b border-[color:var(--rule)] py-2 text-[14px] last:border-b-0"
              >
                <span className="font-mono text-[12px] text-[color:var(--ink-soft)]">
                  {h.date}
                </span>
                <span className="font-mono text-[11px] uppercase text-[color:var(--ink)]">
                  {historyLabel(h.kind)}
                </span>
                <span className="truncate text-[13.5px] text-[color:var(--ink-soft)]">
                  {summarizeDetails(h.details as Record<string, unknown>)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <section className="surface p-5">
          <div className="mb-4 font-mono text-[10px] uppercase text-[color:var(--ink-mute)]">
            Приказы
          </div>
          {(orders ?? []).length === 0 ? (
            <p className="py-2 text-center text-[13px] text-[color:var(--ink-soft)]">
              Приказов нет.
            </p>
          ) : (
            <ul className="grid gap-1">
              {(orders ?? []).map((o) => (
                <li
                  key={o.id}
                  className="grid grid-cols-[110px_120px_1fr] items-center gap-3 border-b border-[color:var(--rule)] py-2 text-[13.5px] last:border-b-0"
                >
                  <span className="font-mono text-[12px] text-[color:var(--ink-soft)]">
                    {o.date}
                  </span>
                  <span className="font-mono text-[11px] uppercase">
                    {o.number}
                  </span>
                  <span className="truncate text-[color:var(--ink-soft)]">
                    {orderLabel(o.kind)}{o.note ? ` · ${o.note}` : ""}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="surface p-5">
          <div className="mb-4 font-mono text-[10px] uppercase text-[color:var(--ink-mute)]">
            Отсутствия
          </div>
          {(absences ?? []).length === 0 ? (
            <p className="py-2 text-center text-[13px] text-[color:var(--ink-soft)]">
              Записей нет.
            </p>
          ) : (
            <ul className="grid gap-1">
              {(absences ?? []).map((a) => (
                <li
                  key={a.id}
                  className="grid grid-cols-[110px_1fr_60px] items-center gap-3 border-b border-[color:var(--rule)] py-2 text-[13.5px] last:border-b-0"
                >
                  <span className="font-mono text-[11px] uppercase">
                    {absenceLabel(a.kind)}
                  </span>
                  <span className="text-[color:var(--ink-soft)]">
                    {a.from_date} → {a.to_date}
                  </span>
                  <span className="text-right font-mono">
                    {a.days} дн.
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

function Tag({ color, children }: { color: "amber" | "blue" | "green"; children: React.ReactNode }) {
  const map: Record<string, string> = {
    amber: "bg-amber-50 text-amber-700",
    blue: "bg-blue-50 text-blue-700",
    green: "bg-[color:var(--accent-soft)] text-[color:var(--accent)]",
  };
  return (
    <span className={`rounded-full px-2.5 py-1 font-mono text-[10px] uppercase ${map[color]}`}>
      {children}
    </span>
  );
}

function Stat({ label, value, accent, bold }: { label: string; value: string; accent?: boolean; bold?: boolean }) {
  return (
    <div className={`surface p-4 ${bold ? "bg-[color:var(--ink)] text-white" : ""}`}>
      <div className={`font-mono text-[10px] uppercase ${bold ? "text-white/64" : "text-[color:var(--ink-mute)]"}`}>
        {label}
      </div>
      <div className={`mt-1.5 text-[18px] font-semibold ${accent ? "text-[color:var(--accent)]" : ""}`}>
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
    <div className="grid grid-cols-[170px_1fr] gap-3 border-b border-[color:var(--rule)] py-2 last:border-b-0">
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

function historyLabel(k: string) {
  return ({
    hire: "Принят",
    dismiss: "Уволен",
    transfer: "Перевод",
    promotion: "Повышение",
    salary_change: "Оклад",
    vacation: "Отпуск",
    sick: "Больничный",
    reprimand: "Замечание",
    award: "Награда",
  } as Record<string, string>)[k] ?? k;
}

function orderLabel(k: string) {
  return historyLabel(k);
}

function absenceLabel(k: string) {
  return ({
    vacation: "Отпуск",
    sick: "Больничный",
    business_trip: "Командировка",
    unpaid: "Без оплаты",
    maternity: "Декрет",
    study: "Учебный",
  } as Record<string, string>)[k] ?? k;
}

function summarizeDetails(d: Record<string, unknown> | null) {
  if (!d) return "—";
  const parts: string[] = [];
  for (const [k, v] of Object.entries(d)) {
    if (v == null || v === "") continue;
    parts.push(`${k}: ${v}`);
  }
  return parts.join(", ") || "—";
}
