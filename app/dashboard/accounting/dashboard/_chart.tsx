"use client";

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = ["#087c68", "#355cff", "#d7ff4f", "#f6c34a", "#ff6b5f", "#16a765", "#8a929a"];

const fmt = (n: number) =>
  new Intl.NumberFormat("ru-KZ", { maximumFractionDigits: 0 }).format(n);

export function PnLChart({
  series,
  pie,
}: {
  series: { month: string; income: number; expense: number; profit: number }[];
  pie: { name: string; value: number }[];
}) {
  if (series.length === 0) {
    return (
      <div className="surface p-8 text-center text-[14px] text-[color:var(--ink-soft)]">
        Данных за выбранный период ещё нет. Добавьте операции, чтобы увидеть
        график.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_1fr]">
      <div className="surface p-5">
        <div className="mb-3 font-mono text-[10px] uppercase text-[color:var(--ink-mute)]">
          P&L по месяцам
        </div>
        <div className="h-[280px] w-full">
          <ResponsiveContainer>
            <BarChart data={series} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(8,11,15,0.08)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={fmt} />
              <Tooltip formatter={(v) => `${fmt(Number(v))} ₸`} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="income" name="Доходы" fill="#087c68" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" name="Расходы" fill="#ff6b5f" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="surface p-5">
        <div className="mb-3 font-mono text-[10px] uppercase text-[color:var(--ink-mute)]">
          Структура расходов
        </div>
        {pie.length === 0 ? (
          <div className="flex h-[280px] items-center justify-center text-center text-[13px] text-[color:var(--ink-soft)]">
            Нет расходов в периоде
          </div>
        ) : (
          <div className="h-[280px] w-full">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pie}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={2}
                >
                  {pie.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `${fmt(Number(v))} ₸`} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
