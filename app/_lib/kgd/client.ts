import "server-only";
import { randomUUID } from "node:crypto";
import { TURANIX_LEGAL_ENTITY } from "../legal-entity";
import { KGD_SERVICE_BY_ID } from "./services";
import type {
  KgdCounterpartyCheck,
  KgdCounterpartyInput,
  KgdResult,
  KgdSearchResult,
  KgdServiceRun,
  KgdTaxpayerData,
  KgdTaxpayerKind,
  KgdTaxpayerSearchInput,
} from "./types";

type Json = Record<string, unknown>;

type KgdRequestOptions = {
  query?: Record<string, string | number | boolean | undefined | null>;
  body?: Json;
};

function normalizeHost(raw: string) {
  const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  return new URL(withScheme);
}

function getKgdConfig():
  | { ok: true; host: URL; token: string; sender: string }
  | { ok: false; result: KgdResult } {
  const host = process.env.KGD_PORTAL_HOST?.trim();
  const token = process.env.KGD_PORTAL_TOKEN?.trim();
  const sender = process.env.KGD_SENDER?.trim() || "turanix";

  if (!host || !token) {
    const missing = [
      !host ? "KGD_PORTAL_HOST" : null,
      !token ? "KGD_PORTAL_TOKEN" : null,
    ].filter(Boolean) as string[];

    return {
      ok: false,
      result: {
        ok: false,
        code: "missing_config",
        message: "Не заполнены настройки подключения к порталу КГД.",
        missing,
      },
    };
  }

  try {
    return { ok: true, host: normalizeHost(host), token, sender };
  } catch {
    return {
      ok: false,
      result: {
        ok: false,
        code: "invalid_config",
        message: "KGD_PORTAL_HOST должен быть корректным host или URL.",
      },
    };
  }
}

function buildUrl(
  host: URL,
  path: string,
  query?: KgdRequestOptions["query"],
) {
  const url = new URL(path, host);
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }
  return url;
}

function header(sender = "turanix") {
  return {
    messageId: randomUUID(),
    sender,
  };
}

async function kgdRequest<T = unknown>(
  method: "GET" | "POST",
  path: string,
  options: KgdRequestOptions = {},
): Promise<KgdResult<T>> {
  const config = getKgdConfig();
  if (!config.ok) return config.result as KgdResult<T>;

  const url = buildUrl(config.host, path, options.query);

  try {
    const response = await fetch(url, {
      method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Portal-Token": config.token,
      },
      body: method === "POST" ? JSON.stringify(options.body ?? {}) : undefined,
      cache: "no-store",
    });
    const body = await response.text();

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        code: "kgd_error",
        message: "КГД не принял запрос.",
        details: body.slice(0, 1200),
      };
    }

    try {
      return {
        ok: true,
        status: response.status,
        data: JSON.parse(body) as T,
      };
    } catch {
      return {
        ok: false,
        status: response.status,
        code: "bad_response",
        message: "КГД вернул ответ не в формате JSON.",
        details: body.slice(0, 1200),
      };
    }
  } catch (error) {
    return {
      ok: false,
      code: "network_error",
      message: "Не удалось подключиться к порталу КГД.",
      details: error instanceof Error ? error.message : String(error),
    };
  }
}

export function searchKgdTaxpayer(
  input: KgdTaxpayerSearchInput,
): Promise<KgdSearchResult> {
  const service = KGD_SERVICE_BY_ID.taxpayerSearch;
  const query: Record<string, string | boolean> = {
    taxpayerCode: input.taxpayerCode,
    taxpayerType: input.taxpayerType,
    print: input.print ?? false,
  };

  if (input.taxpayerType === "LZCHP") {
    query.firstName = input.firstName;
    query.lastName = input.lastName;
  } else {
    query.name = input.name;
  }

  return kgdRequest<KgdTaxpayerData>(service.method, service.path, { query });
}

export function searchKgdVatPayer(taxpayerCode: string) {
  const service = KGD_SERVICE_BY_ID.vatPayer;
  return kgdRequest(service.method, service.path, {
    query: { taxpayerCode },
  });
}

export function checkKgdVatCertificate(input: {
  taxpayerCode: string;
  number: string;
  series: string;
}) {
  return kgdRequest(
    "POST",
    "/services/isnaportalsync/public/check-certificate-number-and-series-for-compliance",
    { body: input },
  );
}

export function getKgdTaxDebt(input: {
  taxpayerCode: string;
  personalAccountToken: string;
}) {
  const service = KGD_SERVICE_BY_ID.taxDebt;
  return kgdRequest(service.method, service.path, { query: input });
}

export function searchKgdUnreliableTaxpayers(input: {
  taxPayerCode?: string;
  language?: string;
  rnn?: string;
  taxPayerOrgName?: string;
  directorIin?: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
}) {
  const service = KGD_SERVICE_BY_ID.unreliableTaxpayers;
  return kgdRequest(service.method, service.path, {
    body: { language: "ru", ...input },
  });
}

export function getKgdRehabTerminatedIpUl() {
  const service = KGD_SERVICE_BY_ID.rehabTerminatedIpUl;
  const config = getKgdConfig();
  const sender = config.ok ? config.sender : "turanix";
  return kgdRequest(service.method, service.path, {
    body: { header: header(sender) },
  });
}

export function submitKgdExcessTaxRefundApplication(input: {
  personalAccountToken: string;
  kbk: string;
  taxOrgCode: string;
  taxpayerCode: string;
  signedRequest: string;
}) {
  const service = KGD_SERVICE_BY_ID.excessTaxRefund;
  return kgdRequest(service.method, service.path, { body: input });
}

export function searchKgdAnnouncements(input: {
  taxpayerCode?: string;
  type?: string;
}) {
  const service = KGD_SERVICE_BY_ID.announcements;
  const config = getKgdConfig();
  const sender = config.ok ? config.sender : "turanix";
  return kgdRequest(service.method, service.path, {
    body: { header: header(sender), ...input },
  });
}

export function findKgdLiquidatedTaxpayer(input: {
  taxpayerCode?: string;
  name?: string;
  fio?: string;
  date?: string;
  page?: number;
  pageSize?: number;
}) {
  const service = KGD_SERVICE_BY_ID.liquidation;
  return kgdRequest(service.method, service.path, {
    query: {
      page: 0,
      pageSize: 20,
      ...input,
    },
  });
}

export function getKgdPropertyCharges(input:
  | {
      personalAccountToken: string;
      bin: string;
      rnn?: string;
    }
  | {
      personalAccountToken: string;
      inn: string;
      signedRequest: string;
    }) {
  const service = KGD_SERVICE_BY_ID.propertyCharges;
  return kgdRequest(service.method, service.path, { body: input });
}

export function getKgdCreditorClaimsRegistry() {
  const service = KGD_SERVICE_BY_ID.creditorClaimsRegistry;
  const config = getKgdConfig();
  const sender = config.ok ? config.sender : "turanix";
  return kgdRequest(service.method, service.path, {
    body: { header: header(sender) },
  });
}

export function getKgdBankruptDebtors(procedureType: string) {
  const service = KGD_SERVICE_BY_ID.bankruptDebtors;
  const config = getKgdConfig();
  const sender = config.ok ? config.sender : "turanix";
  return kgdRequest(service.method, service.path, {
    body: { header: header(sender), procedureType },
  });
}

export function getKgdBankruptcyEvents(iinBin: string) {
  const service = KGD_SERVICE_BY_ID.bankruptcyEvents;
  return kgdRequest(service.method, service.path, {
    body: { iin_bin: iinBin },
  });
}

export function getKgdPaidAmounts(input: {
  personalAccountToken: string;
  kbk: string;
  taxOrgCode: string;
  taxpayerCode: string;
  signedRequest: string;
}) {
  const service = KGD_SERVICE_BY_ID.paidAmounts;
  return kgdRequest(service.method, service.path, { body: input });
}

export function getKgdCitizensJudicialBankruptcy(input: {
  page?: number;
  size?: number;
} = {}) {
  const service = KGD_SERVICE_BY_ID.citizensJudicialBankruptcy;
  const config = getKgdConfig();
  const sender = config.ok ? config.sender : "turanix";
  return kgdRequest(service.method, service.path, {
    query: { page: input.page ?? 0, size: input.size ?? 100 },
    body: { header: header(sender) },
  });
}

export function getKgdCitizensNonJudicialBankruptcy(input: {
  page?: number;
  size?: number;
} = {}) {
  const service = KGD_SERVICE_BY_ID.citizensNonJudicialBankruptcy;
  const config = getKgdConfig();
  const sender = config.ok ? config.sender : "turanix";
  return kgdRequest(service.method, service.path, {
    query: { page: input.page ?? 0, size: input.size ?? 100 },
    body: { header: header(sender) },
  });
}

export function getTuranixTaxpayerData() {
  return searchKgdTaxpayer({
    taxpayerCode: TURANIX_LEGAL_ENTITY.bin,
    taxpayerType: "UL",
    name: "TURANIX",
    print: false,
  });
}

function skippedRun(serviceId: keyof typeof KGD_SERVICE_BY_ID, reason: string) {
  const service = KGD_SERVICE_BY_ID[serviceId];
  return {
    serviceId: service.id,
    title: service.title,
    method: service.method,
    path: service.path,
    status: "skipped",
    reason,
  } satisfies KgdServiceRun;
}

async function runService(
  serviceId: keyof typeof KGD_SERVICE_BY_ID,
  call: () => Promise<KgdResult>,
): Promise<KgdServiceRun> {
  const service = KGD_SERVICE_BY_ID[serviceId];
  const result = await call();

  if (result.ok) {
    return {
      serviceId: service.id,
      title: service.title,
      method: service.method,
      path: service.path,
      status: "success",
      httpStatus: result.status,
      data: result.data,
    };
  }

  return {
    serviceId: service.id,
    title: service.title,
    method: service.method,
    path: service.path,
    status: "error",
    httpStatus: result.status,
    error: result.message,
    details: result.details,
  };
}

export async function runKgdCounterpartyCheck(
  input: KgdCounterpartyInput,
): Promise<KgdCounterpartyCheck> {
  const taxpayerCode = input.taxpayerCode.replace(/\D/g, "");
  const taxpayerType: KgdTaxpayerKind = input.taxpayerType ?? "UL";
  const name = input.name?.trim() || "";
  const personalAccountToken = process.env.KGD_PERSONAL_ACCOUNT_TOKEN?.trim();

  const runs = await Promise.all([
    runService("taxpayerSearch", () =>
      taxpayerType === "LZCHP"
        ? searchKgdTaxpayer({
            taxpayerCode,
            taxpayerType,
            firstName: name || "First",
            lastName: "Last",
            print: false,
          })
        : searchKgdTaxpayer({
            taxpayerCode,
            taxpayerType,
            name: name || taxpayerCode,
            print: false,
          }),
    ),
    personalAccountToken
      ? runService("taxDebt", () =>
          getKgdTaxDebt({ taxpayerCode, personalAccountToken }),
        )
      : Promise.resolve(
          skippedRun(
            "taxDebt",
            "По инструкции нужен personalAccountToken лицевого счета.",
          ),
        ),
    runService("unreliableTaxpayers", () =>
      searchKgdUnreliableTaxpayers({
        taxPayerCode: taxpayerCode,
        taxPayerOrgName: name || undefined,
      }),
    ),
    Promise.resolve(
      skippedRun(
        "rehabTerminatedIpUl",
        "Реестровый список без фильтра по БИН в PDF; лучше вызывать вручную/по расписанию.",
      ),
    ),
    runService("vatPayer", () => searchKgdVatPayer(taxpayerCode)),
    Promise.resolve(
      skippedRun(
        "excessTaxRefund",
        "Это сервис подачи заявления; нужен personalAccountToken и signedRequest ЭЦП.",
      ),
    ),
    runService("announcements", () =>
      searchKgdAnnouncements({ taxpayerCode }),
    ),
    runService("liquidation", () =>
      findKgdLiquidatedTaxpayer({
        taxpayerCode,
        name: name || undefined,
        page: 0,
        pageSize: 20,
      }),
    ),
    Promise.resolve(
      skippedRun(
        "propertyCharges",
        "Для своего лицевого счета; нужен personalAccountToken.",
      ),
    ),
    Promise.resolve(
      skippedRun(
        "creditorClaimsRegistry",
        "Реестровый список без фильтра по БИН в PDF; лучше вызывать вручную/по расписанию.",
      ),
    ),
    Promise.resolve(
      skippedRun(
        "bankruptDebtors",
        "Сервис требует procedureType; для быстрой проверки используем event-data по БИН.",
      ),
    ),
    runService("bankruptcyEvents", () => getKgdBankruptcyEvents(taxpayerCode)),
    Promise.resolve(
      skippedRun(
        "paidAmounts",
        "Нужен personalAccountToken, КБК, код ОГД и signedRequest ЭЦП.",
      ),
    ),
    Promise.resolve(
      skippedRun(
        "citizensJudicialBankruptcy",
        "Сервис по физлицам, не по ТОО.",
      ),
    ),
    Promise.resolve(
      skippedRun(
        "citizensNonJudicialBankruptcy",
        "Сервис по физлицам, не по ТОО.",
      ),
    ),
  ]);

  return {
    taxpayerCode,
    taxpayerType,
    name,
    checkedAt: new Date().toISOString(),
    runs,
  };
}
