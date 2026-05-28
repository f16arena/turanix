"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  MRP_2026,
  MZP_2026,
  IPN_DEDUCTION_MRP,
  IPN_PROGRESSIVE_THRESHOLD_MRP,
  SN_MIN_BASE_MRP,
  LIMITS_MZP,
  RATES,
  VAT_REGISTRATION_THRESHOLD,
  calcPayroll,
  calcCorpTaxes,
} from "../../_lib/tax/kz-2026";

const fmt = (n: number) =>
  new Intl.NumberFormat("ru-KZ", {
    style: "currency",
    currency: "KZT",
    maximumFractionDigits: 0,
  }).format(Math.round(n));

const pct = (n: number) =>
  new Intl.NumberFormat("ru-KZ", {
    style: "percent",
    maximumFractionDigits: 1,
  }).format(n);

export default function TaxPage() {
  const [hasEmployees, setHasEmployees] = useState(true);
  const [salary, setSalary] = useState(300000);

  const [vatPayer, setVatPayer] = useState(true);
  const [income, setIncome] = useState(5000000);
  const [expense, setExpense] = useState(3200000);

  const payroll = useMemo(() => calcPayroll(salary), [salary]);
  const corp = useMemo(
    () => calcCorpTaxes(income, expense, vatPayer),
    [income, expense, vatPayer],
  );

  const monthlyProgressiveThreshold =
    (IPN_PROGRESSIVE_THRESHOLD_MRP * MRP_2026) / 12;

  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="mb-8">
        <div className="eyebrow mb-2">Налоговый калькулятор</div>
        <h1 className="text-[34px] font-semibold leading-tight">
          ИПН / ОПВ / ВОСМС / СО / СН и КПН / НДС
        </h1>
        <p className="mt-2 max-w-[720px] text-[15px] leading-[1.6] text-[color:var(--ink-soft)]">
          Расчёт для ТОО на ОУР. Ставки и базы — по Налоговому кодексу РК 2026
          (закон от 8 декабря 2025 года № 239-VIII).
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-md border border-[color:var(--rule)] bg-white/72 px-4 py-2.5 font-mono text-[11px] text-[color:var(--ink-soft)]">
          <span>МРП 2026: {fmt(MRP_2026)}</span>
          <span className="text-[color:var(--ink-mute)]">·</span>
          <span>МЗП 2026: {fmt(MZP_2026)}</span>
          <span className="text-[color:var(--ink-mute)]">·</span>
          <span>Вычет ИПН: {IPN_DEDUCTION_MRP} МРП = {fmt(IPN_DEDUCTION_MRP * MRP_2026)}</span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/dashboard/tax/kgd" className="button-primary">
            Мои данные из КГД
          </Link>
          <Link href="/dashboard/tax/counterparty" className="button-secondary">
            Проверить контрагента
          </Link>
        </div>
      </div>

      <section className="surface mb-6 overflow-hidden">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[color:var(--rule)] p-5">
          <div>
            <div className="font-mono text-[10px] uppercase text-[color:var(--ink-mute)]">
              01 — Зарплата
            </div>
            <h2 className="mt-1 text-[22px] font-semibold">
              Расчёт налогов с оклада
            </h2>
          </div>
          <Toggle
            label="Есть сотрудники"
            checked={hasEmployees}
            onChange={setHasEmployees}
          />
        </header>

        {hasEmployees ? (
          <div className="grid gap-6 p-5 lg:grid-cols-[320px_1fr]">
            <div>
              <NumberField
                label="Оклад сотрудника"
                value={salary}
                onChange={setSalary}
                suffix="₸"
                step={10000}
              />
              {salary < MZP_2026 && (
                <p className="mt-2 text-[12px] text-amber-700">
                  Внимание: оклад ниже МЗП ({fmt(MZP_2026)}).
                </p>
              )}
              {salary > monthlyProgressiveThreshold && (
                <p className="mt-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-[12px] text-amber-800">
                  Часть дохода свыше {fmt(monthlyProgressiveThreshold)} в месяц
                  ({IPN_PROGRESSIVE_THRESHOLD_MRP} МРП в год) облагается ИПН по
                  ставке 15%.
                </p>
              )}
              <Notes>
                <p>
                  ОПВ — лимит базы {LIMITS_MZP.opv} МЗП ={" "}
                  {fmt(LIMITS_MZP.opv * MZP_2026)}.
                </p>
                <p>
                  ВОСМС работника — лимит {LIMITS_MZP.osmsEmployee} МЗП.
                  ВОСМС работодателя — {LIMITS_MZP.osmsEmployer} МЗП.
                </p>
                <p>
                  СН — минимальная база {SN_MIN_BASE_MRP} МРП ={" "}
                  {fmt(SN_MIN_BASE_MRP * MRP_2026)}. Зачёт СН − СО отменён с
                  2026 года.
                </p>
              </Notes>
            </div>
            <PayrollTable breakdown={payroll} />
          </div>
        ) : (
          <div className="p-5 text-[14px] text-[color:var(--ink-soft)]">
            Сотрудников нет — модуль зарплатной отчётности (ФНО 200.00) не
            подаётся.
          </div>
        )}
      </section>

      <section className="surface overflow-hidden">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[color:var(--rule)] p-5">
          <div>
            <div className="font-mono text-[10px] uppercase text-[color:var(--ink-mute)]">
              02 — КПН и НДС
            </div>
            <h2 className="mt-1 text-[22px] font-semibold">
              Налоги по доходам/расходам
            </h2>
          </div>
          <Toggle
            label="Плательщик НДС"
            checked={vatPayer}
            onChange={setVatPayer}
          />
        </header>

        <div className="grid gap-6 p-5 lg:grid-cols-[320px_1fr]">
          <div className="grid gap-4">
            <NumberField
              label="Доходы за период"
              value={income}
              onChange={setIncome}
              suffix="₸"
              step={50000}
            />
            <NumberField
              label="Расходы за период"
              value={expense}
              onChange={setExpense}
              suffix="₸"
              step={50000}
            />
            <Notes>
              <p>
                КПН на ОУР: {pct(RATES.kpn)}. Для отдельных отраслей действуют
                специальные ставки (банки — 25%, сельхозпроизводители — 3%,
                социальная сфера — 5%).
              </p>
              <p>
                НДС с 1 января 2026 года: {pct(RATES.vat)}. Порог обязательной
                регистрации — оборот {fmt(VAT_REGISTRATION_THRESHOLD)} в год.
              </p>
            </Notes>
          </div>
          <CorpTable data={corp} vatPayer={vatPayer} />
        </div>
      </section>

      <p className="mt-6 text-[12px] text-[color:var(--ink-mute)]">
        Расчёты ориентировочные. Окончательные суммы — после сверки с
        первичными документами, расчёта нарастающим итогом и подачи ФНО.
      </p>
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  suffix,
  step,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  suffix?: string;
  step?: number;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="font-mono text-[11px] uppercase text-[color:var(--ink-mute)]">
        {label}
      </span>
      <div className="relative">
        <input
          type="number"
          inputMode="numeric"
          step={step ?? 1}
          min={0}
          value={value}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          className="h-11 w-full rounded-md border border-[color:var(--rule)] bg-white px-3 pr-9 text-[15px] outline-none transition-colors focus:border-[color:var(--ink)]"
        />
        {suffix && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[12px] text-[color:var(--ink-mute)]">
            {suffix}
          </span>
        )}
      </div>
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (b: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
      className={`inline-flex items-center gap-3 rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase transition-colors ${
        checked
          ? "border-[color:var(--ink)] bg-[color:var(--ink)] text-white"
          : "border-[color:var(--rule)] bg-white text-[color:var(--ink-soft)]"
      }`}
    >
      <span
        className={`inline-block h-2.5 w-2.5 rounded-full ${
          checked ? "bg-[color:var(--signal)]" : "bg-[color:var(--ink-mute)]"
        }`}
      />
      {label}
    </button>
  );
}

function Notes({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-md border border-[color:var(--rule)] bg-[#f4f5ef]/50 p-3 text-[12px] leading-[1.6] text-[color:var(--ink-soft)] [&_p+p]:mt-1.5">
      {children}
    </div>
  );
}

function PayrollTable({
  breakdown,
}: {
  breakdown: ReturnType<typeof calcPayroll>;
}) {
  const rows = [
    { name: "ОПВ (пенсионные)", rate: RATES.opv, base: "Оклад (лимит 50 МЗП)", amount: breakdown.opv, side: "employee" as const },
    { name: "ИПН", rate: RATES.ipn, base: `Оклад − ОПВ − ВОСМС − ${IPN_DEDUCTION_MRP} МРП`, amount: breakdown.ipn, side: "employee" as const },
    { name: "ВОСМС работника", rate: RATES.osmsEmployee, base: "Оклад (лимит 20 МЗП)", amount: breakdown.osmsEmployee, side: "employee" as const },
    { name: "На руки", rate: null, base: "Оклад − ОПВ − ВОСМС − ИПН", amount: breakdown.net, side: "net" as const },
    { name: "СО (соцотчисления)", rate: RATES.so, base: "Оклад − ОПВ (лимит 50 МЗП)", amount: breakdown.so, side: "employer" as const },
    { name: "СН (социальный налог)", rate: RATES.sn, base: `Оклад − ОПВ − ВОСМС, мин. ${SN_MIN_BASE_MRP} МРП`, amount: breakdown.sn, side: "employer" as const },
    { name: "ВОСМС работодателя", rate: RATES.osmsEmployer, base: "Оклад (лимит 40 МЗП)", amount: breakdown.osmsEmployer, side: "employer" as const },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-[14px]">
        <thead className="font-mono text-[10px] uppercase text-[color:var(--ink-mute)]">
          <tr className="border-b border-[color:var(--rule)]">
            <th className="py-2.5 text-left">Показатель</th>
            <th className="py-2.5 text-left">Ставка</th>
            <th className="py-2.5 text-left">База</th>
            <th className="py-2.5 text-right">Сумма</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.name}
              className={`border-b border-[color:var(--rule)] ${
                row.side === "net"
                  ? "bg-[color:var(--accent-soft)]"
                  : row.side === "employer"
                    ? "bg-[#f4f5ef]"
                    : ""
              }`}
            >
              <td className="py-2.5 font-medium">{row.name}</td>
              <td className="py-2.5 text-[color:var(--ink-soft)]">
                {row.rate != null ? pct(row.rate) : "—"}
              </td>
              <td className="py-2.5 text-[color:var(--ink-soft)]">{row.base}</td>
              <td
                className={`py-2.5 text-right font-mono ${
                  row.side === "net"
                    ? "font-semibold text-[color:var(--accent)]"
                    : ""
                }`}
              >
                {fmt(row.amount)}
              </td>
            </tr>
          ))}
          <tr className="bg-[color:var(--ink)] text-white">
            <td className="py-3 font-semibold">Итого затрат компании</td>
            <td colSpan={2} className="py-3 text-white/64">
              Оклад + СО + СН + ВОСМС работодателя
            </td>
            <td className="py-3 text-right font-mono font-semibold">
              {fmt(breakdown.totalCost)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function CorpTable({
  data,
  vatPayer,
}: {
  data: ReturnType<typeof calcCorpTaxes>;
  vatPayer: boolean;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-[14px]">
        <tbody>
          <tr className="border-b border-[color:var(--rule)]">
            <td className="py-2.5 font-medium">Налогооблагаемый доход</td>
            <td className="py-2.5 text-[color:var(--ink-soft)]">
              Доходы − Расходы
            </td>
            <td className="py-2.5 text-right font-mono">{fmt(data.taxable)}</td>
          </tr>
          <tr className="border-b border-[color:var(--rule)] bg-[#f4f5ef]">
            <td className="py-2.5 font-medium">КПН ({pct(RATES.kpn)})</td>
            <td className="py-2.5 text-[color:var(--ink-soft)]">
              {data.taxable === 0
                ? "Нет налогооблагаемого дохода — КПН = 0"
                : "20% от налогооблагаемого дохода (ОУР)"}
            </td>
            <td className="py-2.5 text-right font-mono">{fmt(data.kpn)}</td>
          </tr>
          <tr className="border-b border-[color:var(--rule)] bg-[#f4f5ef]">
            <td className="py-2.5 font-medium">НДС ({pct(RATES.vat)})</td>
            <td className="py-2.5 text-[color:var(--ink-soft)]">
              {vatPayer ? "16% от доходов (с 01.01.2026)" : "Не плательщик — 0"}
            </td>
            <td className="py-2.5 text-right font-mono">{fmt(data.vat)}</td>
          </tr>
          <tr className="bg-[color:var(--ink)] text-white">
            <td className="py-3 font-semibold">Чистая прибыль (грубая)</td>
            <td className="py-3 text-white/64">Доход − Расход − КПН − НДС</td>
            <td className="py-3 text-right font-mono font-semibold">
              {fmt(data.net)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
