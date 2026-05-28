export type KgdTaxpayerType = "IP" | "UL" | "UL_NR" | "LZCHP";

export type KgdLocaleValue = {
  code?: string | null;
  ru?: string | null;
  kk?: string | null;
  en?: string | null;
  qq?: string | null;
};

export type KgdPersonName = {
  lastName?: string | null;
  firstName?: string | null;
  middleName?: string | null;
};

export type KgdTaxpayerResponse = {
  responseMessageUid?: string | null;
  messageResult?: string | null;
  errorMessage?: string | null;
  code?: string | null;
  taxpayerType?: KgdTaxpayerType | string | null;
  name?: string | null;
  fullName?: string | KgdPersonName | null;
  registrationType?: KgdLocaleValue | null;
  beginDate?: string | null;
  endDate?: string | null;
  endReason?: KgdLocaleValue | null;
  endReasonCode?: string | null;
  additionalInfo?: string | null;
  taxOrg?: string | null;
};

export type KgdTaxpayerData = {
  taxpayerPortalSearchResponses?: KgdTaxpayerResponse[];
};

export type KgdTaxpayerSearchInput =
  | {
      taxpayerCode: string;
      taxpayerType: "IP" | "UL" | "UL_NR";
      name: string;
      print?: boolean;
    }
  | {
      taxpayerCode: string;
      taxpayerType: "LZCHP";
      firstName: string;
      lastName: string;
      print?: boolean;
    };

export type KgdResult<T = unknown> =
  | {
      ok: true;
      status: number;
      data: T;
    }
  | {
      ok: false;
      status?: number;
      code:
        | "missing_config"
        | "invalid_config"
        | "bad_response"
        | "kgd_error"
        | "network_error";
      message: string;
      missing?: string[];
      details?: string;
    };

export type KgdSearchResult = KgdResult<KgdTaxpayerData>;

export type KgdTaxpayerKind = "UL" | "UL_NR" | "IP" | "LZCHP";

export type KgdCounterpartyInput = {
  taxpayerCode: string;
  taxpayerType?: KgdTaxpayerKind;
  name?: string;
};

export type KgdServiceRunStatus = "success" | "error" | "skipped";

export type KgdServiceRun = {
  serviceId: string;
  title: string;
  method: string;
  path: string;
  status: KgdServiceRunStatus;
  httpStatus?: number;
  data?: unknown;
  error?: string;
  details?: string;
  reason?: string;
};

export type KgdCounterpartyCheck = {
  taxpayerCode: string;
  taxpayerType: KgdTaxpayerKind;
  name: string;
  checkedAt: string;
  runs: KgdServiceRun[];
};
