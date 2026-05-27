import { createClient } from "../../../_lib/supabase/server";
import { PnLChart } from "./_chart";

export default async function AccountingDashboard({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const { period = "month" } = await searchParams;
  const supabase = await createClient();

  const today = new Date();
  let from: Date;
  if (period === "year") {
    from = new Date(today.getFullYear(), 0, 1);
  } else if (period === "quarter") {
    const q = Math.floor(today.getMonth() / 3);
    from = new Date(today.getFullYear(), q * 3, 1);
  } else {
    from = new Date(today.getFullYear(), today.getMonth(), 1);
  }
  const fromIso = from.toISOString().slice(0, 10);

  const { data: rows } = await supabase
    .from("transactions")
    .select("type, date, category, amount")
    .gte("date", fromIso)
    .order("date", { ascending: true });

  const incomeRows = (rows ?? []).filter((r) => r.type === "income");
  const expenseRows = (rows ?? []).filter((r) => r.type === "expense");
  const income = incomeRows.reduce((s, r) => s + Number(r.amount), 0);
  const expense = expenseRows.reduce((s, r) => s + Number(r.amount), 0);

  const byMonth = new Map<string, { income: number; expense: number }>();
  for (const r of rows ?? []) {
    const key = r.date.slice(0, 7);
    const entry = byMonth.get(key) ?? { income: 0, expense: 0 };
    if (r.type === "income") entry.income += Number(r.amount);
    else entry.expense += Number(r.amount);
    byMonth.set(key, entry);
  }
  const series = Array.from(byMonth.entries())
    .sort()
    .map(([month, v]) => ({ month, ...v, profit: v.income - v.expense }));

  const expenseByCat = new Map<string, number>();
  for (const r of expenseRows) {
    expenseByCat.set(
      r.category,
      (expenseByCat.get(r.category) ?? 0) + Number(r.amount),
    );
  }
  const pie = Array.from(expenseByCat.entries()).map(([name, value]) => ({
    name,
    value,
  }));

  const { data: last } = await supabase
    .from("transactions")
    .select("id, type, date, category, amount, description")
    .order("created_at", { ascending: false })
    .limit(6);

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <PeriodTabs current={period} />
      </div>

      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-4">
        <Stat label="Доходы" value={fmt(income)} accent />
        <Stat label="Расходы" value={fmt(expense)} />
        <Stat label="Прибыль" value={fmt(income - expense)} />
        <Stat
          label="Маржа"
          value={income > 0 ? `${(((income - expense) / income) * 100).toFixed(1)}%` : "—"}
        />
      </div>

      <PnLChart series={series} pie={pie} />

      <div className="surface mt-5 p-5">
        <div className="mb-3 font-mono text-[10px] uppercase text-[color:var(--ink-mute)]">
          Последние операции
        </div>
        {(last ?? []).length === 0 ? (
          <div className="py-6 text-center text-[14px] text-[color:var(--ink-soft)]">
            Операций пока нет — добавьте на вкладке «Доходы/Расходы».
          </div>
        ) : (
          <ul className="grid gap-2">
            {(last ?? []).map((row) => (
              <li
                key={row.id}
                className="grid grid-cols-[100px_120px_1fr_140px] items-center gap-3 border-b border-[color:var(--rule)] py-2 text-[14px] last:border-b-0"
              >
                <span className="font-mono text-[12px] text-[color:var(--ink-soft)]">
                  {row.date}
                </span>
                <span
                  className={`inline-flex h-5 w-fit items-center rounded-full px-2 font-mono text-[10px] uppercase ${
                    row.type === "income"
                      ? "bg-[color:var(--accent-soft)] text-[color:var(--accent)]"
                      : "bg-[#f4f5ef] text-[color:var(--ink-soft)]"
                  }`}
                >
                  {row.type === "income" ? "доход" : "расход"}
                </span>
                <span className="truncate">{row.description || row.category}</span>
                <span
                  className={`text-right font-mono ${
                    row.type === "income" ? "text-[color:var(--accent)]" : ""
                  }`}
                >
                  {fmt(Number(row.amount))}
                </span>
              </li>
            ))}
          </ul>
        )}
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
    <div className="surface p-4">
      <div className="font-mono text-[10px] uppercase text-[color:var(--ink-mute)]">
        {label}
      </div>
      <div
        className={`mt-2 text-[22px] font-semibold ${
          accent ? "text-[color:var(--accent)]" : ""
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function PeriodTabs({ current }: { current: string }) {
  const opts = [
    { v: "month", l: "Месяц" },
    { v: "quarter", l: "Квартал" },
    { v: "year", l: "Год" },
  ];
  return (
    <div className="inline-flex rounded-md border border-[color:var(--rule)] bg-white p-0.5">
      {opts.map((o) => (
        <a
          key={o.v}
          href={`/dashboard/accounting/dashboard?period=${o.v}`}
          className={`rounded px-3 py-1.5 text-[12px] font-mono uppercase ${
            current === o.v
              ? "bg-[color:var(--ink)] text-white"
              : "text-[color:var(--ink-mute)]"
          }`}
        >
          {o.l}
        </a>
      ))}
    </div>
  );
}

function fmt(n: number) {
  return new Intl.NumberFormat("ru-KZ", {
    style: "currency",
    currency: "KZT",
    maximumFractionDigits: 0,
  }).format(n);
}
