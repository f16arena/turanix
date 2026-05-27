export type CpKind = "legal" | "individual" | "ip";
export type CpType = "debtor" | "creditor" | "both";

export type Counterparty = {
  id: string;
  kind: CpKind;
  name: string;
  short_name: string | null;
  full_name: string | null;
  bin: string | null;
  type: CpType;
  legal_address: string | null;
  actual_address: string | null;
  phone: string | null;
  email: string | null;
  contact_person: string | null;
  director: string | null;
  director_position: string | null;
  oked: string | null;
  vat_payer: boolean;
  is_resident: boolean;
  balance: number;
  note: string | null;
  created_at: string;
  updated_at: string;
};

export type CounterpartyAccount = {
  id: string;
  counterparty_id: string;
  iban: string;
  bank: string;
  bik: string | null;
  kbe: string | null;
  currency: string;
  is_primary: boolean;
  note: string | null;
};

export const KIND_LABEL: Record<CpKind, string> = {
  legal: "Юридическое лицо",
  ip: "Индивидуальный предприниматель",
  individual: "Физическое лицо",
};

export const KIND_SHORT: Record<CpKind, string> = {
  legal: "Юр.лицо",
  ip: "ИП",
  individual: "Физ.лицо",
};

export const TYPE_LABEL: Record<CpType, string> = {
  debtor: "Дебитор",
  creditor: "Кредитор",
  both: "Оба",
};
