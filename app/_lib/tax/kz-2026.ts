// Налоговые ставки и формулы по НК РК на 2026 год
// Закон РК от 8 декабря 2025 № 239-VIII «О республиканском бюджете на 2026-2028 годы»
// Новый Налоговый кодекс РК действует с 1 января 2026 года.

export const MRP_2026 = 4325;
export const MZP_2026 = 85000;

// Базовый налоговый вычет ИПН (раньше — стандартный вычет 14 МРП, до 2023 — 1 МРП)
export const IPN_DEDUCTION_MRP = 30;

// Прогрессивная шкала ИПН: 15% применяется к части годового дохода свыше 8 500 МРП
export const IPN_PROGRESSIVE_THRESHOLD_MRP = 8500;

export const RATES = {
  opv: 0.10,
  osmsEmployee: 0.02,
  osmsEmployer: 0.03,
  so: 0.05, // повышена с 3.5% до 5% в 2025
  sn: 0.06, // понижена с 11% до 6% в 2026
  ipn: 0.10,
  ipnHigh: 0.15,
  vat: 0.16, // повышен с 12% до 16% с 01.01.2026
  kpn: 0.20,
} as const;

// Лимиты по базам — в МЗП
export const LIMITS_MZP = {
  opv: 50,
  osmsEmployee: 20,
  osmsEmployer: 40,
} as const;

// Минимальная база СН — 14 МРП
export const SN_MIN_BASE_MRP = 14;

// Порог обязательной регистрации по НДС (оборот за год)
export const VAT_REGISTRATION_THRESHOLD = 40_000_000;

export type TaxFlags = {
  is_pensioner?: boolean;
  is_disabled?: boolean;
  has_many_children?: boolean;
};

// Дополнительные годовые вычеты по льготным категориям
export const ADDITIONAL_DEDUCTIONS_MRP = {
  disabled: 882,          // инвалиды I-II гр: 882 МРП в год
  manyChildren_MZP: 23,   // многодетные матери: 23 МЗП в год
} as const;

export type PayrollBreakdown = {
  salary: number;
  opv: number;
  osmsEmployee: number;
  ipnBase: number;
  ipn: number;
  net: number;
  so: number;
  sn: number;
  osmsEmployer: number;
  totalCost: number;
  taxesTotal: number;
};

/**
 * Расчёт зарплатных налогов по НК РК 2026 (ТОО на ОУР).
 *
 * Удержания с работника:
 *   - ОПВ 10% от оклада (база ≤ 50 МЗП)
 *   - ВОСМС 2% от оклада (база ≤ 20 МЗП)
 *   - ИПН 10% × (оклад − ОПВ − ВОСМС − 30 МРП); 15% применяется к годовой части свыше 8 500 МРП
 *
 * Платит работодатель сверх оклада:
 *   - СО 5% от (оклад − ОПВ); база ≤ 50 МЗП
 *   - СН 6% от (оклад − ОПВ − ВОСМС); минимальная база — 14 МРП
 *   - ООСМС 3% от оклада (база ≤ 40 МЗП)
 *
 * Зачёт СН − СО отменён с 2026.
 */
export function calcPayroll(
  salary: number,
  flags: TaxFlags = {},
): PayrollBreakdown {
  // ОПВ: пенсионеры и инвалиды I-II гр освобождены
  const opv =
    flags.is_pensioner || flags.is_disabled
      ? 0
      : capBase(salary, LIMITS_MZP.opv * MZP_2026) * RATES.opv;

  const osmsEmployee =
    capBase(salary, LIMITS_MZP.osmsEmployee * MZP_2026) * RATES.osmsEmployee;

  // Дополнительные месячные вычеты ИПН
  let extraDeduction = 0;
  if (flags.is_disabled)
    extraDeduction += (ADDITIONAL_DEDUCTIONS_MRP.disabled * MRP_2026) / 12;
  if (flags.has_many_children)
    extraDeduction +=
      (ADDITIONAL_DEDUCTIONS_MRP.manyChildren_MZP * MZP_2026) / 12;

  const ipnBase = Math.max(
    0,
    salary - opv - osmsEmployee - IPN_DEDUCTION_MRP * MRP_2026 - extraDeduction,
  );
  const ipn = calcIpnMonthly(ipnBase);

  const net = salary - opv - osmsEmployee - ipn;

  // СО: инвалиды I-II гр освобождены
  const soBase = flags.is_disabled
    ? 0
    : Math.max(0, capBase(salary, LIMITS_MZP.opv * MZP_2026) - opv);
  const so = soBase * RATES.so;

  // СН: 6% от (оклад − ОПВ − ВОСМС), минимум — 14 МРП база
  const snObject = Math.max(
    salary - opv - osmsEmployee,
    SN_MIN_BASE_MRP * MRP_2026,
  );
  const sn = snObject * RATES.sn;

  const osmsEmployer =
    capBase(salary, LIMITS_MZP.osmsEmployer * MZP_2026) * RATES.osmsEmployer;

  const totalCost = salary + so + sn + osmsEmployer;
  const taxesTotal = opv + osmsEmployee + ipn + so + sn + osmsEmployer;

  return {
    salary,
    opv,
    osmsEmployee,
    ipnBase,
    ipn,
    net,
    so,
    sn,
    osmsEmployer,
    totalCost,
    taxesTotal,
  };
}

/**
 * Месячный ИПН с учётом прогрессивной шкалы.
 * Годовая граница 8 500 МРП пересчитана в месячный эквивалент для калькулятора.
 */
function calcIpnMonthly(baseMonthly: number): number {
  const monthlyThreshold = (IPN_PROGRESSIVE_THRESHOLD_MRP * MRP_2026) / 12;
  if (baseMonthly <= monthlyThreshold) {
    return baseMonthly * RATES.ipn;
  }
  const lowPart = monthlyThreshold * RATES.ipn;
  const highPart = (baseMonthly - monthlyThreshold) * RATES.ipnHigh;
  return lowPart + highPart;
}

function capBase(amount: number, cap: number) {
  return Math.min(amount, cap);
}

/**
 * Расчёт КПН/НДС за период.
 */
export function calcCorpTaxes(
  income: number,
  expense: number,
  vatPayer: boolean,
) {
  const taxable = Math.max(0, income - expense);
  const kpn = taxable * RATES.kpn;
  const vat = vatPayer ? income * RATES.vat : 0;
  return {
    taxable,
    kpn,
    vat,
    net: income - expense - kpn - vat,
  };
}
