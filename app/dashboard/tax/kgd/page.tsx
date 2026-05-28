import type { ReactNode } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  BadgeCheck,
  Building2,
  Landmark,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { TURANIX_LEGAL_ENTITY } from "../../../_lib/legal-entity";
import { getTuranixTaxpayerData } from "../../../_lib/kgd/client";
import type { KgdPersonName, KgdTaxpayerResponse } from "../../../_lib/kgd/types";

export const dynamic = "force-dynamic";

type OwnDataResult = Awaited<ReturnType<typeof getTuranixTaxpayerData>>;
type OwnDataError = Extract<OwnDataResult, { ok: false }>;

export default async function KgdOwnDataPage() {
  const result = await getTuranixTaxpayerData();
  const rows = result.ok ? result.data.taxpayerPortalSearchResponses ?? [] : [];
  const primary = rows[0];
  const active = rows.some((row) => !row.endDate);

  return (
    <div className="mx-auto max-w-[1120px]">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="eyebrow mb-2">КГД / свои сведения</div>
          <h1 className="max-w-[820px] text-[34px] font-semibold leading-tight lg:text-[46px]">
            Сведения Turanix из налогового портала.
          </h1>
          <p className="mt-3 max-w-[760px] text-[15px] leading-[1.6] text-[color:var(--ink-soft)]">
            Сверка регистрационных данных ТОО по БИН {TURANIX_LEGAL_ENTITY.bin}:
            статус записи, дата регистрации, налоговый орган и дополнительные
            сведения из КГД.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard/tax" className="button-secondary">
            ← Налоги
          </Link>
          <Link href="/dashboard/tax/kgd" className="button-primary">
            <RefreshCw className="h-4 w-4" />
            Обновить
          </Link>
        </div>
      </div>

      {!result.ok ? (
        <ErrorState result={result} />
      ) : (
        <div className="grid gap-5">
          <section className="surface-dark overflow-hidden p-6 text-white">
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <div className="font-mono text-[10px] uppercase text-white/50">
                  Основная запись
                </div>
                <h2 className="mt-3 text-[30px] font-semibold leading-tight lg:text-[42px]">
                  {primary ? displayName(primary) : TURANIX_LEGAL_ENTITY.legalName}
                </h2>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <DarkStat label="БИН" value={primary?.code ?? TURANIX_LEGAL_ENTITY.bin} />
                  <DarkStat label="Тип" value={labelTaxpayerType(primary?.taxpayerType)} />
                  <DarkStat label="Записей" value={String(rows.length)} />
                </div>
              </div>
              <div className="rounded-md border border-white/12 bg-white/6 p-5">
                <div className="font-mono text-[10px] uppercase text-white/50">
                  Статус
                </div>
                <div
                  className={`mt-4 inline-flex rounded-full px-3 py-1.5 text-[12px] font-semibold ${
                    active
                      ? "bg-[color:var(--signal)] text-[#111]"
                      : "bg-white/12 text-white"
                  }`}
                >
                  {active ? "Активная запись найдена" : "Нужна ручная сверка"}
                </div>
                <p className="mt-4 text-[14px] leading-[1.6] text-white/70">
                  {active
                    ? "КГД вернул действующую запись без даты окончания."
                    : "В ответе нет активной записи или сведения требуют повторной проверки."}
                </p>
              </div>
            </div>
          </section>

          <section className="grid gap-3 lg:grid-cols-3">
            <HighlightCard
              icon={<Building2 className="h-5 w-5" />}
              title="Регистрация"
              value={primary?.registrationType?.ru ?? "Нет сведений"}
              description={primary?.beginDate ? `Дата начала: ${formatKgdDate(primary.beginDate)}` : "Дата начала не указана."}
            />
            <HighlightCard
              icon={<Landmark className="h-5 w-5" />}
              title="Налоговый орган"
              value={primary?.taxOrg ?? "Нет сведений"}
              description="Орган КГД, который вернул основную запись."
            />
            <HighlightCard
              icon={<BadgeCheck className="h-5 w-5" />}
              title="Результат"
              value={primary?.messageResult ?? "Ответ получен"}
              description={primary?.errorMessage ? "Есть сообщение КГД, проверьте ниже." : "Критичного сообщения КГД не показал."}
            />
          </section>

          <section className="surface overflow-hidden">
            <header className="flex items-center gap-3 border-b border-[color:var(--rule)] p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[color:var(--accent-soft)] text-[color:var(--accent)]">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <div>
                <div className="font-mono text-[10px] uppercase text-[color:var(--ink-mute)]">
                  Карточка ТОО
                </div>
                <h2 className="text-[21px] font-semibold">
                  Обработанные сведения без технического ответа
                </h2>
              </div>
            </header>

            {primary ? (
              <div className="grid gap-0 sm:grid-cols-2">
                <Detail label="БИН" value={primary.code ?? TURANIX_LEGAL_ENTITY.bin} mono />
                <Detail label="Тип налогоплательщика" value={labelTaxpayerType(primary.taxpayerType)} />
                <Detail label="Дата начала" value={formatKgdDate(primary.beginDate)} mono />
                <Detail label="Дата окончания" value={formatKgdDate(primary.endDate) || "Не указана"} mono />
                <Detail
                  label="Причина окончания"
                  value={primary.endReason?.ru ?? primary.endReasonCode ?? "Не указана"}
                />
                <Detail label="Налоговый орган" value={primary.taxOrg ?? "Не указан"} />
                <Detail label="Дополнительно" value={primary.additionalInfo ?? "Нет дополнительных сведений"} full />
                <Detail label="Сообщение КГД" value={primary.errorMessage ?? "Нет сообщений"} full />
              </div>
            ) : (
              <div className="p-5 text-[14px] text-[color:var(--ink-soft)]">
                КГД ответил, но не передал карточку налогоплательщика.
              </div>
            )}
          </section>

          {rows.length > 1 && (
            <section className="surface overflow-hidden">
              <header className="border-b border-[color:var(--rule)] p-5">
                <div className="font-mono text-[10px] uppercase text-[color:var(--ink-mute)]">
                  Дополнительные записи
                </div>
                <h2 className="text-[18px] font-semibold">
                  КГД вернул несколько совпадений
                </h2>
              </header>
              <div className="grid gap-0">
                {rows.slice(1).map((row, index) => (
                  <div
                    key={`${row.code ?? "row"}-${index}`}
                    className="grid gap-3 border-b border-[color:var(--rule)] p-4 sm:grid-cols-[42px_1fr_180px]"
                  >
                    <div className="font-mono text-[11px] text-[color:var(--ink-mute)]">
                      {String(index + 2).padStart(2, "0")}
                    </div>
                    <div>
                      <div className="font-semibold">{displayName(row)}</div>
                      <p className="mt-1 text-[13px] text-[color:var(--ink-soft)]">
                        {row.registrationType?.ru ?? "Тип регистрации не указан"}
                      </p>
                    </div>
                    <div className="font-mono text-[12px] text-[color:var(--ink-mute)]">
                      {formatKgdDate(row.beginDate) || "Дата не указана"}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

function ErrorState({ result }: { result: OwnDataError }) {
  return (
    <section className="surface border-amber-200 bg-amber-50/70 p-5">
      <div className="flex gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
        <div>
          <h2 className="text-[20px] font-semibold text-amber-950">
            Сведения пока не загрузились
          </h2>
          <p className="mt-2 max-w-[760px] text-[14px] leading-[1.6] text-amber-900">
            {humanError(result)}
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <HintCard title="Токен" text="Проверьте доступ КГД на сервере." />
            <HintCard title="Портал" text="Проверьте адрес налогового портала." />
            <HintCard title="Повтор" text="После правки обновите страницу." />
          </div>
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
  icon: ReactNode;
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
      <div className="mt-4 text-[20px] font-semibold leading-tight">{value}</div>
      <p className="mt-2 text-[13px] leading-[1.6] text-[color:var(--ink-soft)]">
        {description}
      </p>
    </div>
  );
}

function HintCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-md border border-amber-200 bg-white/70 p-4">
      <div className="font-mono text-[10px] uppercase text-amber-800">
        {title}
      </div>
      <div className="mt-2 text-[13px] leading-[1.5] text-amber-950">
        {text}
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

function Detail({
  label,
  value,
  mono,
  full,
}: {
  label: string;
  value: string;
  mono?: boolean;
  full?: boolean;
}) {
  return (
    <div
      className={`border-b border-[color:var(--rule)] p-5 ${
        full ? "sm:col-span-2" : ""
      }`}
    >
      <div className="font-mono text-[10px] uppercase text-[color:var(--ink-mute)]">
        {label}
      </div>
      <div
        className={`mt-2 text-[15px] leading-[1.55] text-[color:var(--ink)] ${
          mono ? "font-mono" : ""
        }`}
      >
        {value || "—"}
      </div>
    </div>
  );
}

function humanError(result: OwnDataError) {
  if (result.code === "missing_config") {
    return "На сервере не заполнены настройки подключения к КГД.";
  }
  if (result.code === "invalid_config") {
    return "Адрес портала КГД указан некорректно.";
  }
  if (result.status === 401 || result.status === 403) {
    return "КГД не принял токен доступа. Нужно обновить или проверить токен.";
  }
  if (result.status === 405) {
    return "КГД не принял формат запроса. Проверьте актуальную инструкцию сервиса.";
  }
  if (result.status && result.status >= 500) {
    return "Портал КГД временно недоступен. Повторите запрос позже.";
  }
  return result.message || "Не удалось получить сведения из КГД.";
}

function displayName(row: KgdTaxpayerResponse) {
  if (row.name) return row.name;
  if (typeof row.fullName === "string") return row.fullName;
  if (row.fullName && typeof row.fullName === "object") {
    return formatPersonName(row.fullName);
  }
  return TURANIX_LEGAL_ENTITY.legalName;
}

function formatPersonName(name: KgdPersonName) {
  return [name.lastName, name.firstName, name.middleName].filter(Boolean).join(" ");
}

function labelTaxpayerType(type?: string | null) {
  if (type === "UL") return "Юридическое лицо";
  if (type === "UL_NR") return "ЮЛ-нерезидент";
  if (type === "IP") return "Индивидуальный предприниматель";
  if (type === "LZCHP") return "Частная практика";
  return type || "Не указан";
}

function formatKgdDate(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("ru-KZ", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}
