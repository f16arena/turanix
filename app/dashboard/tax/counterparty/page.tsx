import Link from "next/link";
import {
  AlertTriangle,
  BadgeCheck,
  Building2,
  CheckCircle2,
  Landmark,
  LockKeyhole,
  Search,
  ShieldCheck,
} from "lucide-react";
import { KGD_SERVICES } from "../../../_lib/kgd/services";
import { runKgdCounterpartyCheck } from "../../../_lib/kgd/client";
import type { KgdServiceRun, KgdTaxpayerKind } from "../../../_lib/kgd/types";

export const dynamic = "force-dynamic";

const RISK_SERVICE_IDS = new Set([
  "taxDebt",
  "unreliableTaxpayers",
  "liquidation",
  "announcements",
  "bankruptcyEvents",
  "bankruptDebtors",
  "rehabTerminatedIpUl",
  "creditorClaimsRegistry",
]);

export default async function KgdCounterpartyPage({
  searchParams,
}: {
  searchParams: Promise<{ bin?: string; name?: string; type?: string }>;
}) {
  const sp = await searchParams;
  const taxpayerCode = sp.bin?.replace(/\D/g, "") ?? "";
  const name = sp.name?.trim() ?? "";
  const type = (sp.type || "UL") as KgdTaxpayerKind;
  const canCheck = /^\d{12}$/.test(taxpayerCode);
  const check = canCheck
    ? await runKgdCounterpartyCheck({ taxpayerCode, name, taxpayerType: type })
    : null;

  const runs = check?.runs ?? [];
  const successCount = runs.filter((run) => run.status === "success").length;
  const skippedCount = runs.filter((run) => run.status === "skipped").length;
  const errorCount = runs.filter((run) => run.status === "error").length;
  const riskSignals = runs.filter((run) => hasRiskSignal(run));
  const primary = getPrimaryTaxpayer(runs);
  const risk = getRiskLevel(riskSignals.length, errorCount, successCount);

  return (
    <div className="mx-auto max-w-[1180px]">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="eyebrow mb-2">КГД / проверка контрагента</div>
          <h1 className="max-w-[820px] text-[34px] font-semibold leading-tight lg:text-[48px]">
            Проверка ТОО, ИП и поставщиков перед сделкой.
          </h1>
          <p className="mt-3 max-w-[760px] text-[15px] leading-[1.6] text-[color:var(--ink-soft)]">
            Введите БИН или ИИН. Кабинет соберет сведения из КГД и покажет
            человеческую сводку: регистрация, НДС, долги, ликвидация,
            неблагонадежность и банкротные процедуры.
          </p>
        </div>
        <Link href="/dashboard/tax" className="button-secondary">
          ← Налоги
        </Link>
      </div>

      <form className="surface mb-5 grid gap-4 p-5 md:grid-cols-[160px_1fr_240px_auto]">
        <label className="grid gap-1.5">
          <span className="font-mono text-[10px] uppercase text-[color:var(--ink-mute)]">
            Тип лица
          </span>
          <select
            name="type"
            defaultValue={type}
            className="h-11 rounded-md border border-[color:var(--rule)] bg-white px-3 text-[14px] outline-none focus:border-[color:var(--ink)]"
          >
            <option value="UL">ТОО / ЮЛ</option>
            <option value="UL_NR">ЮЛ-нерезидент</option>
            <option value="IP">ИП</option>
            <option value="LZCHP">Частная практика</option>
          </select>
        </label>
        <label className="grid gap-1.5">
          <span className="font-mono text-[10px] uppercase text-[color:var(--ink-mute)]">
            БИН / ИИН
          </span>
          <input
            name="bin"
            defaultValue={taxpayerCode}
            inputMode="numeric"
            maxLength={12}
            placeholder="12 цифр"
            className="h-11 rounded-md border border-[color:var(--rule)] bg-white px-3 text-[14px] outline-none focus:border-[color:var(--ink)]"
          />
        </label>
        <label className="grid gap-1.5">
          <span className="font-mono text-[10px] uppercase text-[color:var(--ink-mute)]">
            Название
          </span>
          <input
            name="name"
            defaultValue={name}
            placeholder="Например, TURANIX"
            className="h-11 rounded-md border border-[color:var(--rule)] bg-white px-3 text-[14px] outline-none focus:border-[color:var(--ink)]"
          />
        </label>
        <button type="submit" className="button-primary self-end">
          <Search className="h-4 w-4" />
          Проверить
        </button>
      </form>

      {taxpayerCode && !canCheck && (
        <div className="surface border-amber-200 bg-amber-50 p-5 text-[14px] text-amber-900">
          БИН/ИИН должен состоять из 12 цифр.
        </div>
      )}

      {!taxpayerCode && <EmptyState />}

      {check && (
        <div className="grid gap-5">
          <section className="surface-dark overflow-hidden p-5 text-white">
            <div className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
              <div>
                <div className="font-mono text-[10px] uppercase text-white/50">
                  Итоговая сводка
                </div>
                <h2 className="mt-3 text-[30px] font-semibold leading-tight lg:text-[42px]">
                  {primary.name || name || "Контрагент"}.
                </h2>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <DarkStat label="БИН / ИИН" value={check.taxpayerCode} />
                  <DarkStat label="Тип" value={labelType(check.taxpayerType)} />
                  <DarkStat label="Проверено" value={formatDateTime(check.checkedAt)} />
                </div>
              </div>
              <div className="rounded-md border border-white/12 bg-white/6 p-5">
                <div className="font-mono text-[10px] uppercase text-white/50">
                  Риск по данным КГД
                </div>
                <div className={`mt-4 inline-flex rounded-full px-3 py-1.5 text-[12px] font-semibold ${risk.className}`}>
                  {risk.label}
                </div>
                <p className="mt-4 text-[14px] leading-[1.6] text-white/70">
                  {risk.description}
                </p>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
            <Stat label="Функций КГД" value={String(runs.length)} />
            <Stat label="Получено ответов" value={String(successCount)} accent />
            <Stat label="Требует доступа" value={String(skippedCount)} />
            <Stat label="Ошибки" value={String(errorCount)} warn={errorCount > 0} />
          </div>

          <section className="grid gap-3 lg:grid-cols-3">
            <HighlightCard
              icon={<Building2 className="h-5 w-5" />}
              title="Регистрация"
              value={primary.registration || primary.status || "Смотри ответ КГД"}
              description={primary.beginDate ? `Дата начала: ${primary.beginDate}` : "Основная запись налогоплательщика."}
            />
            <HighlightCard
              icon={<BadgeCheck className="h-5 w-5" />}
              title="НДС"
              value={summaryFor(runs, "vatPayer")}
              description="Постановка или снятие с учета по НДС."
            />
            <HighlightCard
              icon={<Landmark className="h-5 w-5" />}
              title="Налоговые долги"
              value={summaryFor(runs, "taxDebt")}
              description="По инструкции может требовать токен лицевого счета."
            />
          </section>

          {riskSignals.length > 0 && (
            <section className="surface border-red-200 bg-red-50/80 p-5">
              <div className="flex gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-700" />
                <div>
                  <h2 className="text-[20px] font-semibold text-red-950">
                    Есть сигналы риска
                  </h2>
                  <p className="mt-2 text-[14px] leading-[1.6] text-red-900">
                    КГД вернул непустые ответы по риск-проверкам. Перед оплатой
                    или договором лучше открыть первичный источник и сохранить
                    результат проверки.
                  </p>
                </div>
              </div>
            </section>
          )}

          <section>
            <div className="mb-3 font-mono text-[10px] uppercase text-[color:var(--ink-mute)]">
              Результаты проверок
            </div>
            <div className="grid gap-3">
              {runs.map((run, index) => (
                <RunCard key={run.serviceId} run={run} index={index + 1} />
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="surface-dark p-6 text-white">
        <ShieldCheck className="h-8 w-8 text-[color:var(--signal)]" />
        <h2 className="mt-6 text-[30px] font-semibold leading-tight">
          Одна проверка перед договором.
        </h2>
        <p className="mt-4 text-[14px] leading-[1.7] text-white/68">
          Страница создана для B2B-проверки: клиент, подрядчик, поставщик,
          арендодатель или партнер. На экране не показываются технические
          адреса API, только понятные статусы.
        </p>
      </section>

      <section className="surface overflow-hidden">
        <header className="border-b border-[color:var(--rule)] p-5">
          <div className="font-mono text-[10px] uppercase text-[color:var(--ink-mute)]">
            Что проверяем
          </div>
          <h2 className="mt-1 text-[22px] font-semibold">
            Все 15 функций КГД подключены в структуре.
          </h2>
        </header>
        <div className="grid gap-0 sm:grid-cols-2">
          {KGD_SERVICES.map((service, index) => (
            <div
              key={service.id}
              className="border-b border-[color:var(--rule)] p-4"
            >
              <div className="flex items-start gap-3">
                <span className="font-mono text-[11px] text-[color:var(--ink-mute)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <div className="text-[14px] font-semibold">{service.title}</div>
                  <p className="mt-1 text-[12px] leading-[1.5] text-[color:var(--ink-soft)]">
                    {humanServiceNote(service.counterpartyUse)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function RunCard({ run, index }: { run: KgdServiceRun; index: number }) {
  const state = runState(run);
  const Icon = state.icon;

  return (
    <section className="surface p-4">
      <div className="grid gap-3 md:grid-cols-[42px_1fr_auto]">
        <div className="font-mono text-[11px] text-[color:var(--ink-mute)]">
          {String(index).padStart(2, "0")}
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Icon className={`h-4 w-4 ${state.iconClass}`} />
            <h2 className="text-[15px] font-semibold">{run.title}</h2>
          </div>
          <p className="mt-2 text-[13px] leading-[1.6] text-[color:var(--ink-soft)]">
            {summaryForRun(run)}
          </p>
        </div>
        <div className={`self-start rounded-full px-3 py-1.5 text-[11px] font-semibold ${state.badgeClass}`}>
          {state.label}
        </div>
      </div>
    </section>
  );
}

function HighlightCard({
  icon,
  title,
  value,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="surface p-5">
      <div className="flex items-center gap-3 text-[color:var(--accent)]">
        {icon}
        <div className="font-mono text-[10px] uppercase text-[color:var(--ink-mute)]">
          {title}
        </div>
      </div>
      <div className="mt-4 text-[21px] font-semibold leading-tight">{value}</div>
      <p className="mt-2 text-[13px] leading-[1.6] text-[color:var(--ink-soft)]">
        {description}
      </p>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
  warn,
}: {
  label: string;
  value: string;
  accent?: boolean;
  warn?: boolean;
}) {
  return (
    <div className="surface p-5">
      <div className="font-mono text-[10px] uppercase text-[color:var(--ink-mute)]">
        {label}
      </div>
      <div
        className={`mt-2 text-[28px] font-semibold ${
          accent
            ? "text-[color:var(--accent)]"
            : warn
              ? "text-red-700"
              : "text-[color:var(--ink)]"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function DarkStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-white/12 bg-white/6 p-4">
      <div className="font-mono text-[10px] uppercase text-white/46">
        {label}
      </div>
      <div className="mt-2 text-[14px] font-semibold text-white">{value}</div>
    </div>
  );
}

function runState(run: KgdServiceRun) {
  if (run.status === "success") {
    const risky = hasRiskSignal(run);
    return {
      icon: risky ? AlertTriangle : CheckCircle2,
      label: risky ? "Есть данные" : "Проверено",
      iconClass: risky ? "text-amber-700" : "text-[color:var(--accent)]",
      badgeClass: risky
        ? "bg-amber-100 text-amber-900"
        : "bg-[color:var(--accent-soft)] text-[color:var(--accent)]",
    };
  }
  if (run.status === "skipped") {
    return {
      icon: LockKeyhole,
      label: "Нужен доступ",
      iconClass: "text-[color:var(--ink-mute)]",
      badgeClass: "bg-[#ecebe4] text-[color:var(--ink-soft)]",
    };
  }
  return {
    icon: AlertTriangle,
    label: "Не получено",
    iconClass: "text-red-700",
    badgeClass: "bg-red-100 text-red-900",
  };
}

function getRiskLevel(riskSignals: number, errors: number, successes: number) {
  if (riskSignals > 0) {
    return {
      label: "Повышенный риск",
      className: "bg-amber-100 text-amber-950",
      description:
        "Есть найденные записи в риск-проверках: ликвидация, неблагонадежность, объявления или банкротные события.",
    };
  }
  if (errors > 0 || successes === 0) {
    return {
      label: "Проверка неполная",
      className: "bg-white/12 text-white",
      description:
        "Часть сервисов не ответила или не настроен доступ КГД. Итог нельзя считать финальным.",
    };
  }
  return {
    label: "Критичных сигналов нет",
    className: "bg-[color:var(--signal)] text-[#111]",
    description:
      "По доступным сервисам не найдено явных красных флагов. Для договора все равно сохраняйте дату проверки.",
  };
}

function getPrimaryTaxpayer(runs: KgdServiceRun[]) {
  const run = runs.find((item) => item.serviceId === "taxpayerSearch");
  const data = asRecord(run?.data);
  const list = asArray(data?.taxpayerPortalSearchResponses);
  const first = asRecord(list[0]);
  return {
    name: stringValue(first?.name) || fullName(first?.fullName),
    status: stringValue(first?.messageResult),
    registration: localeRu(first?.registrationType),
    beginDate: stringValue(first?.beginDate),
  };
}

function summaryFor(runs: KgdServiceRun[], serviceId: string) {
  const run = runs.find((item) => item.serviceId === serviceId);
  if (!run) return "Нет данных";
  return shortSummary(run);
}

function summaryForRun(run: KgdServiceRun) {
  if (run.status === "skipped") return run.reason ?? "Для этой проверки нужен отдельный доступ.";
  if (run.status === "error") return run.error ?? "КГД не вернул успешный ответ.";
  return detailedSummary(run);
}

function shortSummary(run: KgdServiceRun) {
  if (run.status === "skipped") return "Нужен доступ";
  if (run.status === "error") return "Не получено";
  const count = countRecords(run.data);
  if (count > 0) return `Есть сведения: ${count}`;
  return "Ответ получен";
}

function detailedSummary(run: KgdServiceRun) {
  const count = countRecords(run.data);
  if (run.serviceId === "taxpayerSearch") {
    const primary = getPrimaryTaxpayer([run]);
    return primary.name
      ? `Найден налогоплательщик: ${primary.name}.`
      : "КГД вернул ответ по налогоплательщику.";
  }
  if (run.serviceId === "vatPayer") {
    return count > 0
      ? "Найдены сведения по постановке или снятию с учета НДС."
      : "Ответ по НДС получен, явных записей для показа нет.";
  }
  if (RISK_SERVICE_IDS.has(run.serviceId)) {
    return count > 0
      ? `Найдены записи в риск-реестре: ${count}.`
      : "Ответ получен, записей риска в краткой сводке не видно.";
  }
  return count > 0 ? `Получено записей: ${count}.` : "Ответ КГД получен.";
}

function hasRiskSignal(run: KgdServiceRun) {
  if (run.status !== "success" || !RISK_SERVICE_IDS.has(run.serviceId)) return false;
  return countRecords(run.data) > 0 || hasPositiveArrear(run.data);
}

function hasPositiveArrear(data: unknown) {
  const record = asRecord(data);
  const values = [
    record?.totalArrear,
    record?.totalTaxArrear,
    record?.pensionContributionArrear,
    record?.socialContributionArrear,
    record?.socialHealthInsuranceArrear,
  ];
  return values.some((value) => Number(value) > 0);
}

function countRecords(data: unknown): number {
  if (Array.isArray(data)) return data.length;
  const record = asRecord(data);
  if (!record) return 0;

  const directArrays = [
    record.taxpayerPortalSearchResponses,
    record.response,
    record.items,
    record.taxOrgInfos,
  ];
  for (const value of directArrays) {
    if (Array.isArray(value)) return value.length;
  }

  const response = asRecord(record.response);
  if (Array.isArray(response?.content)) return response.content.length;

  const taxpayers = asRecord(record.taxpayers);
  if (Array.isArray(taxpayers?.content)) return taxpayers.content.length;

  return Object.keys(record).length > 0 ? 1 : 0;
}

function humanServiceNote(kind: string) {
  switch (kind) {
    case "primary":
      return "Базовая карточка налогоплательщика.";
    case "risk":
      return "Влияет на риск перед оплатой или договором.";
    case "registry":
      return "Реестровая проверка банкротства и реабилитации.";
    case "own-account":
      return "Нужен доступ к лицевому счету или ЭЦП.";
    case "individual-only":
      return "Относится к физическим лицам.";
    default:
      return "Сервис КГД.";
  }
}

function labelType(type: KgdTaxpayerKind) {
  const labels: Record<KgdTaxpayerKind, string> = {
    UL: "Юридическое лицо",
    UL_NR: "ЮЛ-нерезидент",
    IP: "Индивидуальный предприниматель",
    LZCHP: "Частная практика",
  };
  return labels[type] ?? type;
}

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("ru-KZ", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function stringValue(value: unknown) {
  return typeof value === "string" ? value : "";
}

function localeRu(value: unknown) {
  const record = asRecord(value);
  return stringValue(record?.ru) || stringValue(record?.nameRu);
}

function fullName(value: unknown) {
  if (typeof value === "string") return value;
  const record = asRecord(value);
  if (!record) return "";
  return [record.lastName, record.firstName, record.middleName]
    .map(stringValue)
    .filter(Boolean)
    .join(" ");
}
