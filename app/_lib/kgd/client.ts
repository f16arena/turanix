import "server-only";
import { TURANIX_LEGAL_ENTITY } from "../legal-entity";
import type {
  KgdSearchResult,
  KgdTaxpayerData,
  KgdTaxpayerSearchInput,
} from "./types";

const TAXPAYER_DATA_PATH = "/services/isnaportalsync/public/taxpayer-data";

function normalizeHost(raw: string) {
  const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  return new URL(withScheme);
}

function getKgdConfig():
  | { ok: true; host: URL; token: string }
  | { ok: false; result: KgdSearchResult } {
  const host = process.env.KGD_PORTAL_HOST?.trim();
  const token = process.env.KGD_PORTAL_TOKEN?.trim();
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
    return { ok: true, host: normalizeHost(host), token };
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

function buildUrl(host: URL, input: KgdTaxpayerSearchInput) {
  const url = new URL(TAXPAYER_DATA_PATH, host);
  url.searchParams.set("taxpayerCode", input.taxpayerCode);
  url.searchParams.set("taxpayerType", input.taxpayerType);
  url.searchParams.set("print", input.print ? "true" : "false");

  if (input.taxpayerType === "LZCHP") {
    url.searchParams.set("firstName", input.firstName);
    url.searchParams.set("lastName", input.lastName);
  } else {
    url.searchParams.set("name", input.name);
  }

  return url;
}

export async function searchKgdTaxpayer(
  input: KgdTaxpayerSearchInput,
): Promise<KgdSearchResult> {
  const config = getKgdConfig();
  if (!config.ok) return config.result;

  const url = buildUrl(config.host, input);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "X-Portal-Token": config.token,
      },
      cache: "no-store",
    });
    const body = await response.text();

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        code: "kgd_error",
        message: `КГД вернул HTTP ${response.status}.`,
        details: body.slice(0, 1200),
      };
    }

    try {
      const data = JSON.parse(body) as KgdTaxpayerData;
      return { ok: true, status: response.status, data };
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

export function getTuranixTaxpayerData() {
  return searchKgdTaxpayer({
    taxpayerCode: TURANIX_LEGAL_ENTITY.bin,
    taxpayerType: "UL",
    name: "TURANIX",
    print: false,
  });
}
