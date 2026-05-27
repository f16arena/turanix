"use client";

import { useMemo, useState } from "react";

type Category = "payroll" | "vat" | "kpn_advance" | "kpn_annual" | "stat";

type Deadline = {
  form: string;
  title: string;
  category: Category;
  frequency: string;
  due: Date;
  period: string;
};

const categoryLabel: Record<Category, string> = {
  payroll: "Зарплата",
  vat: "НДС",
  kpn_advance: "Аванс КПН",
  kpn_annual: "Годовые",
  stat: "Статистика",
};

export default function CalendarPage() {
  const [filter, setFilter] = useState<"all" | Category>("all");
  const items = useMemo(() => buildDeadlines(), []);
  const filtered = filter === "all" ? items : items.filter((i) => i.category === filter);

  const today = startOfDay(new Date());

  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="mb-8">
        <div className="eyebrow mb-2">Календарь ФНО</div>
        <h1 className="text-[34px] font-semibold leading-tight">
          Ближайшие дедлайны отчётности
        </h1>
        <p className="mt-2 max-w-[720px] text-[15px] leading-[1.6] text-[color:var(--ink-soft)]">
          Все ключевые сроки для ТОО на ОУР. Если дата выпадает на выходной,
          срок переносится на ближайший рабочий день.
        </p>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        <FilterChip
          active={filter === "all"}
          onClick={() => setFilter("all")}
          label="Все"
          count={items.length}
        />
        {(Object.keys(categoryLabel) as Category[]).map((c) => (
          <FilterChip
            key={c}
            active={filter === c}
            onClick={() => setFilter(c)}
            label={categoryLabel[c]}
            count={items.filter((i) => i.category === c).length}
          />
        ))}
      </div>

      <ul className="grid gap-3">
        {filtered.map((item, i) => {
          const days = daysUntil(item.due, today);
          const overdue = days < 0;
          const urgent = days >= 0 && days <= 7;
          const warning = days > 7 && days <= 14;

          return (
            <li
              key={`${item.form}-${i}`}
              className={`surface flex flex-wrap items-center justify-between gap-4 p-5 ${
                overdue ? "opacity-55" : ""
              }`}
            >
              <div className="flex-1 min-w-[240px]">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[11px] uppercase text-[color:var(--ink-mute)]">
                    {item.form}
                  </span>
                  <span className="rounded-full border border-[color:var(--rule)] bg-white px-2 py-0.5 font-mono text-[10px] uppercase text-[color:var(--ink-soft)]">
                    {categoryLabel[item.category]}
                  </span>
                  {warning && (
                    <span className="font-mono text-[10px] uppercase text-amber-600">
                      ⚠ менее 14 дней
                    </span>
                  )}
                </div>
                <div className="mt-1 text-[18px] font-semibold">
                  {item.title}
                </div>
                <div className="mt-1 text-[13px] text-[color:var(--ink-soft)]">
                  {item.period} · {item.frequency}
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-[11px] uppercase text-[color:var(--ink-mute)]">
                  Срок
                </div>
                <div className="text-[18px] font-semibold">
                  {formatDate(item.due)}
                </div>
                <div
                  className={`mt-1 inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-mono text-[11px] uppercase ${
                    overdue
                      ? "bg-red-100 text-red-700"
                      : urgent
                        ? "bg-amber-100 text-amber-800"
                        : "bg-[color:var(--accent-soft)] text-[color:var(--accent)]"
                  }`}
                >
                  {overdue
                    ? `просрочено на ${-days} дн.`
                    : days === 0
                      ? "сегодня"
                      : `через ${days} дн.`}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[13px] transition-colors ${
        active
          ? "border-[color:var(--ink)] bg-[color:var(--ink)] text-white"
          : "border-[color:var(--rule)] bg-white text-[color:var(--ink-soft)] hover:border-[color:var(--ink)]"
      }`}
    >
      {label}
      <span className="font-mono text-[10px] opacity-70">{count}</span>
    </button>
  );
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function daysUntil(due: Date, today: Date) {
  const ms = due.getTime() - today.getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("ru-KZ", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(d);
}

function buildDeadlines(): Deadline[] {
  const today = new Date();
  const year = today.getFullYear();
  const out: Deadline[] = [];

  const quarters = [
    { q: 1, label: "I квартал", monthsEnd: 3 },
    { q: 2, label: "II квартал", monthsEnd: 6 },
    { q: 3, label: "III квартал", monthsEnd: 9 },
    { q: 4, label: "IV квартал", monthsEnd: 12 },
  ];

  for (const yOffset of [-1, 0, 1]) {
    const y = year + yOffset;

    for (const q of quarters) {
      const dueDate = new Date(y, q.monthsEnd, 15);
      out.push({
        form: "ФНО 200.00",
        title: "Зарплатная отчётность",
        category: "payroll",
        frequency: "Ежеквартально",
        due: dueDate,
        period: `${q.label} ${y}`,
      });
      out.push({
        form: "ФНО 300.00",
        title: "Декларация по НДС",
        category: "vat",
        frequency: "Ежеквартально",
        due: dueDate,
        period: `${q.label} ${y}`,
      });
    }

    out.push({
      form: "ФНО 101.02",
      title: "Авансовый КПН (I полугодие)",
      category: "kpn_advance",
      frequency: "Полугодие",
      due: new Date(y, 1, 20),
      period: `${y}`,
    });
    out.push({
      form: "ФНО 101.02",
      title: "Авансовый КПН (II полугодие)",
      category: "kpn_advance",
      frequency: "Полугодие",
      due: new Date(y, 7, 20),
      period: `${y}`,
    });

    out.push({
      form: "ФНО 100.00",
      title: "Декларация КПН",
      category: "kpn_annual",
      frequency: "Ежегодно",
      due: new Date(y, 2, 31),
      period: `${y - 1}`,
    });

    out.push({
      form: "Статотчётность",
      title: "Финансовая отчётность",
      category: "stat",
      frequency: "Ежегодно",
      due: new Date(y, 1, 15),
      period: `${y - 1}`,
    });
  }

  const todayStart = startOfDay(today);
  return out
    .filter((d) => daysUntil(d.due, todayStart) >= -30)
    .sort((a, b) => a.due.getTime() - b.due.getTime())
    .slice(0, 24);
}
