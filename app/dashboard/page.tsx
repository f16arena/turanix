import Link from "next/link";
import { createClient } from "../_lib/supabase/server";
import {
  Calculator,
  CalendarDays,
  Mailbox,
  FileText,
  BookOpenText,
} from "lucide-react";

export default async function DashboardHome() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const today = new Date();
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
    .toISOString()
    .slice(0, 10);

  const [{ data: tx }, { data: cash }, { count: corrCount }] =
    await Promise.all([
      supabase
        .from("transactions")
        .select("type, amount")
        .gte("date", monthStart),
      supabase.from("cash_operations").select("type, amount"),
      supabase
        .from("correspondence")
        .select("*", { count: "exact", head: true }),
    ]);

  const income = (tx ?? [])
    .filter((r) => r.type === "income")
    .reduce((s, r) => s + Number(r.amount), 0);
  const expense = (tx ?? [])
    .filter((r) => r.type === "expense")
    .reduce((s, r) => s + Number(r.amount), 0);
  const cashIn = (cash ?? [])
    .filter((r) => r.type === "in")
    .reduce((s, r) => s + Number(r.amount), 0);
  const cashOut = (cash ?? [])
    .filter((r) => r.type === "out")
    .reduce((s, r) => s + Number(r.amount), 0);
  const cashBalance = cashIn - cashOut;
  const corrTotal = corrCount ?? 0;

  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="mb-8">
        <div className="eyebrow mb-2">Главная</div>
        <h1 className="text-[34px] font-semibold leading-tight">
          Добрый день, {user?.email?.split("@")[0]} 👋
        </h1>
        <p className="mt-2 max-w-[640px] text-[15px] leading-[1.6] text-[color:var(--ink-soft)]">
          Сводка по компании за текущий месяц. Налоги, документы и бухгалтерия —
          в одном кабинете.
        </p>
      </div>

      <div className="mb-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Доходы (месяц)" value={fmt(income)} accent />
        <Stat label="Расходы (месяц)" value={fmt(expense)} />
        <Stat label="Прибыль" value={fmt(income - expense)} />
        <Stat label="Касса (остаток)" value={fmt(cashBalance)} />
      </div>

      <div className="mb-4 font-mono text-[10px] uppercase text-[color:var(--ink-mute)]">
        Модули
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        <ModuleCard
          href="/dashboard/tax"
          Icon={Calculator}
          title="Налоговый калькулятор"
          desc="ИПН, ОПВ, ОСМС, СО, СН, КПН и НДС. Мгновенный расчёт по зарплате и периоду."
        />
        <ModuleCard
          href="/dashboard/calendar"
          Icon={CalendarDays}
          title="Календарь ФНО"
          desc="Дедлайны ФНО 100/200/300/101 и статотчётности с обратным отсчётом."
        />
        <ModuleCard
          href="/dashboard/correspondence"
          Icon={Mailbox}
          title="Корреспонденция"
          desc={`Журнал входящих и исходящих документов. Сейчас: ${corrTotal} запис${pluralRu(corrTotal)}.`}
        />
        <ModuleCard
          href="/dashboard/documents"
          Icon={FileText}
          title="Шаблоны документов"
          desc="ЭСФ, АВР, Счёт на оплату, Акт сверки и Коммерческое предложение."
        />
        <ModuleCard
          href="/dashboard/accounting"
          Icon={BookOpenText}
          title="Бухгалтерия"
          desc="Дашборд, доходы/расходы, касса, контрагенты и зарплатная ведомость."
        />
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="surface p-5">
      <div className="font-mono text-[10px] uppercase text-[color:var(--ink-mute)]">
        {label}
      </div>
      <div
        className={`mt-3 text-[24px] font-semibold ${
          accent ? "text-[color:var(--accent)]" : "text-[color:var(--ink)]"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function ModuleCard({
  href,
  Icon,
  title,
  desc,
}: {
  href: string;
  Icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="surface group flex flex-col gap-3 p-5 transition-transform hover:-translate-y-0.5"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[color:var(--ink)] text-white transition-colors group-hover:text-[color:var(--signal)]">
        <Icon className="h-5 w-5" strokeWidth={1.6} />
      </div>
      <div>
        <h3 className="text-[18px] font-semibold">{title}</h3>
        <p className="mt-1 text-[13.5px] leading-[1.55] text-[color:var(--ink-soft)]">
          {desc}
        </p>
      </div>
      <div className="mt-auto pt-3 font-mono text-[10px] uppercase text-[color:var(--accent)]">
        Открыть →
      </div>
    </Link>
  );
}

function fmt(n: number) {
  return new Intl.NumberFormat("ru-KZ", {
    style: "currency",
    currency: "KZT",
    maximumFractionDigits: 0,
  }).format(n);
}

function pluralRu(n: number) {
  const m100 = n % 100;
  const m10 = n % 10;
  if (m100 >= 11 && m100 <= 14) return "ей";
  if (m10 === 1) return "ь";
  if (m10 >= 2 && m10 <= 4) return "и";
  return "ей";
}
