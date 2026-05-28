import Link from "next/link";
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  Database,
  RefreshCw,
} from "lucide-react";
import { TURANIX_LEGAL_ENTITY } from "../../../_lib/legal-entity";
import { getTuranixTaxpayerData } from "../../../_lib/kgd/client";
import type { KgdPersonName, KgdTaxpayerResponse } from "../../../_lib/kgd/types";

export const dynamic = "force-dynamic";

export default async function KgdOwnDataPage() {
  const result = await getTuranixTaxpayerData();
  const rows = result.ok ? result.data.taxpayerPortalSearchResponses ?? [] : [];
  const primary = rows[0];

  return (
    <div className="mx-auto max-w-[1120px]">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="eyebrow mb-2">КГД / мои сведения</div>
          <h1 className="text-[34px] font-semibold leading-tight">
            Данные Turanix из налогового портала
          </h1>
          <p className="mt-2 max-w-[720px] text-[15px] leading-[1.6] text-[color:var(--ink-soft)]">
            Сервер запрашивает сведения по БИН {TURANIX_LEGAL_ENTITY.bin} через
            токен КГД. Токен хранится только в переменных окружения и не уходит
            в браузер.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard/tax" className="button-secondary">
            ← Калькулятор
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
        <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
          <section className="surface overflow-hidden">
            <header className="flex items-center gap-3 border-b border-[color:var(--rule)] p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[color:var(--accent-soft)] text-[color:var(--accent)]">
                <Building2 className="h-5 w-5" />
              </span>
              <div>
                <div className="font-mono text-[10px] uppercase text-[color:var(--ink-mute)]">
                  Основная запись
                </div>
                <h2 className="text-[21px] font-semibold">
                  {primary ? displayName(primary) : TURANIX_LEGAL_ENTITY.legalName}
                </h2>
              </div>
            </header>

            {primary ? (
              <div className="grid gap-0 sm:grid-cols-2">
                <Detail label="БИН" value={primary.code ?? TURANIX_LEGAL_ENTITY.bin} mono />
                <Detail label="Тип" value={primary.taxpayerType ?? "UL"} mono />
                <Detail label="Результат" value={primary.messageResult ?? "—"} />
                <Detail label="Регистрация" value={primary.registrationType?.ru ?? "—"} />
                <Detail label="Дата начала" value={primary.beginDate ?? "—"} mono />
                <Detail label="Дата окончания" value={primary.endDate ?? "Не указана"} mono />
                <Detail
                  label="Причина окончания"
                  value={primary.endReason?.ru ?? primary.endReasonCode ?? "Не указана"}
                />
                <Detail label="Налоговый орган" value={primary.taxOrg ?? "—"} />
                <Detail label="Дополнительно" value={primary.additionalInfo ?? "—"} full />
                <Detail label="Ошибка КГД" value={primary.errorMessage ?? "Нет"} full />
              </div>
            ) : (
              <div className="p-5 text-[14px] text-[color:var(--ink-soft)]">
                КГД вернул успешный ответ, но массив сведений пустой.
              </div>
            )}
          </section>

          <aside className="grid content-start gap-4">
            <StatusCard rows={rows} />
            <section className="surface p-5">
              <div className="font-mono text-[10px] uppercase text-[color:var(--ink-mute)]">
                Запрашиваем как
              </div>
              <div className="mt-4 grid gap-3 text-[14px]">
                <MiniRow label="taxpayerCode" value={TURANIX_LEGAL_ENTITY.bin} />
                <MiniRow label="taxpayerType" value="UL" />
                <MiniRow label="name" value="TURANIX" />
                <MiniRow label="print" value="false" />
              </div>
            </section>
          </aside>

          <section className="surface overflow-hidden lg:col-span-2">
            <header className="flex items-center gap-3 border-b border-[color:var(--rule)] p-5">
              <Database className="h-5 w-5 text-[color:var(--ink-mute)]" />
              <div>
                <div className="font-mono text-[10px] uppercase text-[color:var(--ink-mute)]">
                  Raw JSON
                </div>
                <h2 className="text-[18px] font-semibold">
                  Полный ответ КГД
                </h2>
              </div>
            </header>
            <pre className="max-h-[460px] overflow-auto bg-[#101316] p-5 text-[12px] leading-[1.6] text-white/86">
              {JSON.stringify(result.data, null, 2)}
            </pre>
          </section>
        </div>
      )}
    </div>
  );
}

function ErrorState({
  result,
}: {
  result: Exclude<Awaited<ReturnType<typeof getTuranixTaxpayerData>>, { ok: true }>;
}) {
  return (
    <section className="surface border-amber-200 bg-amber-50/70 p-5">
      <div className="flex gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
        <div>
          <h2 className="text-[20px] font-semibold text-amber-950">
            Данные пока не загружаются
          </h2>
          <p className="mt-2 max-w-[760px] text-[14px] leading-[1.6] text-amber-900">
            {result.message}
          </p>
          {result.missing && result.missing.length > 0 && (
            <div className="mt-4 rounded-md border border-amber-200 bg-white/70 p-4">
              <div className="font-mono text-[10px] uppercase text-amber-800">
                Нужно добавить в .env.local и Vercel
              </div>
              <pre className="mt-3 overflow-auto text-[13px] text-amber-950">
                {result.missing.map((name) => `${name}=`).join("\n")}
              </pre>
            </div>
          )}
          {result.details && (
            <pre className="mt-4 max-h-[220px] overflow-auto rounded-md bg-white/70 p-4 text-[12px] text-amber-950">
              {result.details}
            </pre>
          )}
        </div>
      </div>
    </section>
  );
}

function StatusCard({ rows }: { rows: KgdTaxpayerResponse[] }) {
  const hasActive = rows.some((row) => !row.endDate);

  return (
    <section className="surface p-5">
      <div className="flex items-start gap-3">
        <CheckCircle2
          className={`mt-0.5 h-5 w-5 ${
            hasActive ? "text-[color:var(--accent)]" : "text-[color:var(--ink-mute)]"
          }`}
        />
        <div>
          <div className="font-mono text-[10px] uppercase text-[color:var(--ink-mute)]">
            Статус
          </div>
          <div className="mt-2 text-[22px] font-semibold">
            {hasActive ? "Есть активная запись" : "Нужно проверить вручную"}
          </div>
          <p className="mt-2 text-[13px] leading-[1.55] text-[color:var(--ink-soft)]">
            Найдено записей: {rows.length}. Если КГД вернул несколько записей,
            смотри полный JSON ниже.
          </p>
        </div>
      </div>
    </section>
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

function MiniRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-[color:var(--rule)] pb-2 last:border-0 last:pb-0">
      <span className="font-mono text-[11px] text-[color:var(--ink-mute)]">
        {label}
      </span>
      <span className="font-mono text-[12px] text-[color:var(--ink)]">
        {value}
      </span>
    </div>
  );
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
