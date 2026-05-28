export type KgdServiceId =
  | "taxpayerSearch"
  | "taxDebt"
  | "unreliableTaxpayers"
  | "rehabTerminatedIpUl"
  | "vatPayer"
  | "excessTaxRefund"
  | "announcements"
  | "liquidation"
  | "propertyCharges"
  | "creditorClaimsRegistry"
  | "bankruptDebtors"
  | "bankruptcyEvents"
  | "paidAmounts"
  | "citizensJudicialBankruptcy"
  | "citizensNonJudicialBankruptcy";

export type KgdHttpMethod = "GET" | "POST";

export type KgdServiceDefinition = {
  id: KgdServiceId;
  title: string;
  method: KgdHttpMethod;
  path: string;
  counterpartyUse:
    | "primary"
    | "risk"
    | "registry"
    | "own-account"
    | "individual-only";
  note: string;
};

export const KGD_SERVICES: KgdServiceDefinition[] = [
  {
    id: "taxpayerSearch",
    title: "Поиск налогоплательщика",
    method: "GET",
    path: "/services/isnaportalsync/public/taxpayer-data",
    counterpartyUse: "primary",
    note: "Базовая идентификация ЮЛ/ИП по БИН/ИИН и наименованию.",
  },
  {
    id: "taxDebt",
    title: "Сведения об отсутствии/наличии налоговой задолженности",
    method: "GET",
    path: "/services/isnaportalsync/public/tax-debt-info",
    counterpartyUse: "risk",
    note: "По PDF требует taxpayerCode и personalAccountToken.",
  },
  {
    id: "unreliableTaxpayers",
    title: "Поиск неблагонадежных налогоплательщиков",
    method: "POST",
    path: "/services/isnaportal/public/taxpayer-data/search",
    counterpartyUse: "risk",
    note: "Проверка нахождения НП в категориях неблагонадежности.",
  },
  {
    id: "rehabTerminatedIpUl",
    title: "Список ИП и ЮЛ с прекращенной реабилитационной процедурой",
    method: "POST",
    path: "/services/isnaportal/public/bankrupt-service/debtors",
    counterpartyUse: "registry",
    note: "Реестровый сервис без явного фильтра по БИН в инструкции.",
  },
  {
    id: "vatPayer",
    title: "Поиск данных о плательщике НДС",
    method: "POST",
    path: "/services/isnaportalsync/public/search-payer-data",
    counterpartyUse: "risk",
    note: "Проверяет постановку/снятие с учета по НДС.",
  },
  {
    id: "excessTaxRefund",
    title: "Прием заявлений излишне оплаченных сумм налогов",
    method: "POST",
    path: "/services/isnaportalsync/public/excessive-paid",
    counterpartyUse: "own-account",
    note: "Операционный сервис: нужен personalAccountToken и signedRequest.",
  },
  {
    id: "announcements",
    title: "Поиск объявлений",
    method: "POST",
    path: "/services/isnaportal/public/bankrupt-service/announcements",
    counterpartyUse: "risk",
    note: "Объявления по банкротству/ликвидации, можно фильтровать по taxpayerCode.",
  },
  {
    id: "liquidation",
    title: "Поиск налогоплательщиков на стадии ликвидации",
    method: "GET",
    path: "/services/isnaportalsync/public/find-liquidated-taxpayer",
    counterpartyUse: "risk",
    note: "Проверка стадии ликвидации по БИН/ИИН, названию или дате.",
  },
  {
    id: "propertyCharges",
    title: "Начисления земля, имущество, транспорт",
    method: "POST",
    path: "/services/isnaportalsync/public/personal-account-accrual",
    counterpartyUse: "own-account",
    note: "Для своего лицевого счета: нужен personalAccountToken.",
  },
  {
    id: "creditorClaimsRegistry",
    title: "Реестр требований кредиторов",
    method: "POST",
    path: "/services/isnaportal/public/bankrupt-service/rtk",
    counterpartyUse: "registry",
    note: "Реестровый сервис без явного фильтра по БИН в инструкции.",
  },
  {
    id: "bankruptDebtors",
    title: "Список должников с решением суда о банкротстве/реабилитации",
    method: "POST",
    path: "/services/isnaportal/public/bankrupt-service/debtors/all",
    counterpartyUse: "registry",
    note: "Требует procedureType, например REHABILITATION.",
  },
  {
    id: "bankruptcyEvents",
    title: "Сведения по возбужденным процедурам банкротства и реабилитации ЮЛ",
    method: "POST",
    path: "/services/isnaportal/public/bankrupt-service/event-data",
    counterpartyUse: "risk",
    note: "События по БИН/ИИН должника.",
  },
  {
    id: "paidAmounts",
    title: "Информация об уплаченных суммах на лицевом счете НП",
    method: "POST",
    path: "/services/isnaportalsync/public/payments",
    counterpartyUse: "own-account",
    note: "Нужен personalAccountToken, КБК, код ОГД и signedRequest.",
  },
  {
    id: "citizensJudicialBankruptcy",
    title: "Список граждан с судебным банкротством",
    method: "POST",
    path: "/services/isnaportal/public/bankrupt-service/tazalau/citizens-judicial-bankruptcy",
    counterpartyUse: "individual-only",
    note: "Физлица, не проверка ТОО.",
  },
  {
    id: "citizensNonJudicialBankruptcy",
    title: "Список граждан с внесудебным банкротством",
    method: "POST",
    path: "/services/isnaportal/public/bankrupt-service/tazalau/citizens-non-judicial-bankruptcy",
    counterpartyUse: "individual-only",
    note: "Физлица, не проверка ТОО.",
  },
] as const;

export const KGD_SERVICE_BY_ID = Object.fromEntries(
  KGD_SERVICES.map((service) => [service.id, service]),
) as Record<KgdServiceId, KgdServiceDefinition>;
