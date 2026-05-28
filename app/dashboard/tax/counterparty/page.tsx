import Link from "next/link";
import { AlertTriangle, CheckCircle2, CircleDashed, Search } from "lucide-react";
import { KGD_SERVICES } from "../../../_lib/kgd/services";
import { runKgdCounterpartyCheck } from "../../../_lib/kgd/client";
import type { KgdServiceRun, KgdTaxpayerKind } from "../../../_lib/kgd/types";

export const dynamic = "force-dynamic";

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

  const successCount = check?.runs.filter((run) => run.status === "success").length ?? 0;
  const skippedCount = check?.runs.filter((run) => run.status === "skipped").length ?? 0;
  const errorCount = check?.runs.filter((run) => run.status === "error").length ?? 0;

  return (
    <div className="mx-auto max-w-[1180px]">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="eyebrow mb-2">КГД / проверка контрагента</div>
          <h1 className="text-[34px] font-semibold leading-tight">
            15 сервисов КГД по БИН/ИИН
          </h1>
          <p className="mt-2 max-w-[760px] text-[15px] leading-[1.6] text-[color:var(--ink-soft)]">
            Введите БИН ТОО или ИИН/БИН ИП. Кабинет запускает доступные
            проверки КГД, а сервисы с ЛС/ЭЦП или физлицами показывает отдельно,
            чтобы было видно все 15 функций.
          </p>
        </div>
        <Link href="/dashboard/tax" className="button-secondary">
          ← Калькулятор
        </Link>
      </div>

      <form className="surface mb-5 grid gap-4 p-5 md:grid-cols-[180px_1fr_220px_auto]">
        <label className="grid gap-1.5">
          <span className="font-mono text-[10px] uppercase text-[color:var(--ink-mute)]">
            Тип
          </span>
          <select
            name="type"
            defaultValue={type}
            className="h-11 rounded-md border border-[color:var(--rule)] bg-white px-3 text-[14px]"
          >
            <option value="UL">ЮЛ</option>
            <option value="UL_NR">ЮЛ-нерезидент</option>
            <option value="IP">ИП</option>
            <option value="LZCHP">ЛЗЧП</option>
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
            placeholder="12 цифр"
            className="h-11 rounded-md border border-[color:var(--rule)] bg-white px-3 text-[14px]"
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
            className="h-11 rounded-md border border-[color:var(--rule)] bg-white px-3 text-[14px]"
          />
        </label>
        <button type="submit" className="button-primary self-end">
          <Search className="h-4 w-4" />
          Проверить
        </button>
      </form>

      {!taxpayerCode && <ServiceCatalog />}
      {taxpayerCode && !canCheck && (
        <div className="surface border-amber-200 bg-amber-50 p-5 text-[14px] text-amber-900">
          БИН/ИИН должен состоять из 12 цифр.
        </div>
      )}
      {check && (
        <>
          <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-4">
            <Stat label="Всего функций" value={String(check.runs.length)} />
            <Stat label="Выполнено" value={String(successCount)} accent />
            <Stat label="Пропущено" value={String(skippedCount)} />
            <Stat label="Ошибки" value={String(errorCount)} warn={errorCount > 0} />
          </div>
          <div className="grid gap-3">
            {check.runs.map((run, index) => (
              <RunCard key={run.serviceId} run={run} index={index + 1} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ServiceCatalog() {
  return (
    <section className="surface overflow-hidden">
      <header className="border-b border-[color:var(--rule)] p-5">
        <div className="font-mono text-[10px] uppercase text-[color:var(--ink-mute)]">
          Реестр функций
        </div>
        <h2 className="mt-1 text-[22px] font-semibold">
          Все 15 endpoint&apos;ов из инструкций КГД
        </h2>
      </header>
      <div className="grid divide-y divide-[color:var(--rule)]">
        {KGD_SERVICES.map((service, index) => (
          <div
            key={service.id}
            className="grid gap-3 p-4 md:grid-cols-[42px_1fr_90px_1.5fr]"
          >
            <div className="font-mono text-[11px] text-[color:var(--ink-mute)]">
              {String(index + 1).padStart(2, "0")}
            </div>
            <div>
              <div className="font-semibold">{service.title}</div>
              <div className="mt-1 font-mono text-[11px] text-[color:var(--ink-mute)]">
                {service.id}
              </div>
            </div>
            <div className="font-mono text-[11px] text-[color:var(--accent)]">
              {service.method}
            </div>
            <div className="min-w-0">
              <div className="break-all font-mono text-[11px] text-[color:var(--ink)]">
                {service.path}
              </div>
              <p className="mt-1 text-[12px] leading-[1.5] text-[color:var(--ink-soft)]">
                {service.note}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function RunCard({ run, index }: { run: KgdServiceRun; index: number }) {
  const Icon =
    run.status === "success"
      ? CheckCircle2
      : run.status === "skipped"
        ? CircleDashed
        : AlertTriangle;

  return (
    <section className="surface overflow-hidden">
      <div className="grid gap-3 p-4 md:grid-cols-[42px_1fr_100px]">
        <div className="font-mono text-[11px] text-[color:var(--ink-mute)]">
          {String(index).padStart(2, "0")}
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Icon
              className={`h-4 w-4 ${
                run.status === "success"
                  ? "text-[color:var(--accent)]"
                  : run.status === "error"
                    ? "text-red-600"
                    : "text-[color:var(--ink-mute)]"
              }`}
            />
            <h2 className="font-semibold">{run.title}</h2>
          </div>
          <div className="mt-2 break-all font-mono text-[11px] text-[color:var(--ink-mute)]">
            {run.method} {run.path}
          </div>
          {run.reason && (
            <p className="mt-2 text-[13px] text-[color:var(--ink-soft)]">
              {run.reason}
            </p>
          )}
          {run.error && (
            <p className="mt-2 text-[13px] text-red-700">{run.error}</p>
          )}
        </div>
        <div className="font-mono text-[10px] uppercase text-[color:var(--ink-mute)]">
          {run.status}
          {run.httpStatus ? ` / ${run.httpStatus}` : ""}
        </div>
      </div>
      {run.data !== undefined && (
        <pre className="max-h-[260px] overflow-auto bg-[#101316] p-4 text-[11px] leading-[1.55] text-white/84">
          {JSON.stringify(run.data, null, 2)}
        </pre>
      )}
      {run.details && (
        <pre className="max-h-[180px] overflow-auto bg-red-950/90 p-4 text-[11px] leading-[1.55] text-white/84">
          {run.details}
        </pre>
      )}
    </section>
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
