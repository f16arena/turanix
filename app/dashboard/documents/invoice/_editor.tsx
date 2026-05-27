"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { Printer, Save, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  CounterpartyPicker,
  type PickerCp,
} from "../_components/counterparty-picker";
import { saveDocument } from "../actions";

type Line = {
  id: string;
  name: string;
  unit: string;
  qty: number;
  price: number;
  vatRate: number;
};

const blank = (): Line => ({
  id: crypto.randomUUID(),
  name: "",
  unit: "шт",
  qty: 1,
  price: 0,
  vatRate: 12,
});

const fmt = (n: number) =>
  new Intl.NumberFormat("ru-KZ", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);

type DocKindParam = "invoice" | "esf";

const HEADINGS: Record<DocKindParam, { eyebrow: string; title: string; defaultNumber: string }> = {
  invoice: {
    eyebrow: "Счёт на оплату",
    title: "Счёт на оплату",
    defaultNumber: "СЧ-2026-001",
  },
  esf: {
    eyebrow: "ЭСФ — Электронный счёт-фактура",
    title: "Электронный счёт-фактура",
    defaultNumber: "ЭСФ-2026-001",
  },
};

export function InvoiceEditor({
  counterparties,
  kind = "invoice",
}: {
  counterparties: PickerCp[];
  kind?: DocKindParam;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const heading = HEADINGS[kind];

  const [number, setNumber] = useState(heading.defaultNumber);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [validity, setValidity] = useState(3);

  const [supplier] = useState({
    name: "ТОО «Turanix»",
    bin: "260540022744",
    address: "пр. Илияса Есенберлина 20-272, Усть-Каменогорск, 070000, KZ",
    iban: "",
    bank: "",
    bik: "",
  });

  const [buyer, setBuyer] = useState<PickerCp | null>(null);

  const [lines, setLines] = useState<Line[]>([
    {
      id: crypto.randomUUID(),
      name: "Услуги по разработке",
      unit: "услуга",
      qty: 1,
      price: 500000,
      vatRate: 12,
    },
  ]);

  useEffect(() => {
    fetch(`/api/next-doc-number?kind=${kind}&date=${date}`)
      .then((r) => r.json())
      .then((d) => d.number && setNumber(d.number))
      .catch(() => {});
  }, [date, kind]);

  const totals = useMemo(() => {
    let net = 0;
    let vat = 0;
    for (const l of lines) {
      const n = l.qty * l.price;
      net += n;
      vat += n * (l.vatRate / 100);
    }
    return { net, vat, total: net + vat };
  }, [lines]);

  function onSave() {
    if (!buyer) {
      alert("Выберите контрагента из списка");
      return;
    }
    startTransition(async () => {
      await saveDocument({
        kind,
        number,
        date,
        counterparty_id: buyer.id,
        counterparty_snapshot: {
          name: buyer.name,
          full_name: buyer.full_name,
          bin: buyer.bin,
          legal_address: buyer.legal_address,
        },
        payload: { lines, supplier, buyer, validity },
        total: totals.total,
        status: "issued",
      });
      setSaved(true);
      setTimeout(() => router.push("/dashboard/documents"), 700);
    });
  }

  return (
    <div className="mx-auto max-w-[920px]">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div className="font-mono text-[11px] uppercase text-[color:var(--ink-mute)]">
          {heading.eyebrow}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex h-10 items-center gap-2 rounded-md border border-[color:var(--rule)] bg-white px-3 text-[13px] hover:border-[color:var(--ink)]"
          >
            <Printer className="h-4 w-4" />
            Печать
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={pending || saved}
            className="button-primary !min-h-[40px] !text-[13px]"
          >
            {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            {saved ? "Сохранено" : pending ? "Сохраняем…" : "Сохранить в архив"}
          </button>
        </div>
      </div>

      <div className="mb-4 print:hidden">
        <CounterpartyPicker
          options={counterparties}
          value={buyer}
          onChange={setBuyer}
          label="Покупатель"
        />
      </div>

      <article className="surface bg-white p-7 print:border-0 print:p-0 print:shadow-none">
        <header className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-[color:var(--rule)] pb-5">
          <div>
            <div className="font-mono text-[11px] uppercase text-[color:var(--ink-mute)]">
              {heading.title}
            </div>
            <h2 className="mt-2 text-[26px] font-semibold">
              №{" "}
              <input
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                className="border-b border-dashed border-[color:var(--rule)] bg-transparent py-0.5 outline-none focus:border-[color:var(--ink)]"
                style={{ width: 160 }}
              />
            </h2>
            <div className="mt-1 text-[13px] text-[color:var(--ink-soft)]">
              от{" "}
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="font-mono"
              />
            </div>
          </div>
          <div className="text-right text-[13px]">
            <div className="font-mono text-[11px] uppercase text-[color:var(--ink-mute)]">
              Срок действия
            </div>
            <div className="mt-1">
              <input
                type="number"
                min={1}
                value={validity}
                onChange={(e) => setValidity(Number(e.target.value) || 1)}
                className="w-14 rounded border border-[color:var(--rule)] px-2 py-0.5 text-right"
              />{" "}
              банк. дн.
            </div>
          </div>
        </header>

        <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-2">
          <PartyBlock title="Поставщик">
            <p className="font-semibold">{supplier.name}</p>
            <p className="font-mono text-[12px]">БИН {supplier.bin}</p>
            <p>{supplier.address}</p>
          </PartyBlock>
          <PartyBlock title="Покупатель">
            {buyer ? (
              <>
                <p className="font-semibold">
                  {buyer.full_name ?? buyer.name}
                </p>
                <p className="font-mono text-[12px]">
                  БИН/ИИН {buyer.bin ?? "—"}
                </p>
                <p>{buyer.legal_address ?? "—"}</p>
                {buyer.accounts[0] && (
                  <p className="mt-1 font-mono text-[11px] text-[color:var(--ink-soft)]">
                    {buyer.accounts[0].bank} · {buyer.accounts[0].iban}
                  </p>
                )}
              </>
            ) : (
              <p className="text-[color:var(--ink-mute)]">Не выбран</p>
            )}
          </PartyBlock>
        </div>

        <table className="mb-6 w-full border-collapse text-[13.5px]">
          <thead>
            <tr className="border-y border-[color:var(--ink)] bg-[#f4f5ef] font-mono text-[10px] uppercase">
              <th className="w-10 p-2 text-left">№</th>
              <th className="p-2 text-left">Наименование</th>
              <th className="w-16 p-2 text-left">Ед.</th>
              <th className="w-16 p-2 text-right">Кол-во</th>
              <th className="w-28 p-2 text-right">Цена</th>
              <th className="w-16 p-2 text-right">НДС %</th>
              <th className="w-28 p-2 text-right">Без НДС</th>
              <th className="w-24 p-2 text-right">НДС</th>
              <th className="w-32 p-2 text-right">Итого</th>
              <th className="w-10 p-2 print:hidden"></th>
            </tr>
          </thead>
          <tbody>
            {lines.map((line, i) => {
              const net = line.qty * line.price;
              const vat = net * (line.vatRate / 100);
              return (
                <tr key={line.id} className="border-b border-[color:var(--rule)]">
                  <td className="p-2 align-top text-[color:var(--ink-soft)]">
                    {i + 1}
                  </td>
                  <td className="p-2 align-top">
                    <textarea
                      value={line.name}
                      rows={1}
                      onChange={(e) =>
                        update(setLines, line.id, { name: e.target.value })
                      }
                      className="w-full resize-none border-b border-dashed border-[color:var(--rule)] bg-transparent py-0.5 outline-none focus:border-[color:var(--ink)]"
                    />
                  </td>
                  <td className="p-2 align-top">
                    <input
                      value={line.unit}
                      onChange={(e) =>
                        update(setLines, line.id, { unit: e.target.value })
                      }
                      className="w-full border-b border-dashed border-[color:var(--rule)] bg-transparent py-0.5 outline-none focus:border-[color:var(--ink)]"
                    />
                  </td>
                  <td className="p-2 text-right align-top">
                    <Num
                      value={line.qty}
                      onChange={(n) => update(setLines, line.id, { qty: n })}
                    />
                  </td>
                  <td className="p-2 text-right align-top">
                    <Num
                      value={line.price}
                      onChange={(n) => update(setLines, line.id, { price: n })}
                    />
                  </td>
                  <td className="p-2 text-right align-top">
                    <Num
                      value={line.vatRate}
                      onChange={(n) =>
                        update(setLines, line.id, { vatRate: n })
                      }
                    />
                  </td>
                  <td className="p-2 text-right align-top font-mono">
                    {fmt(net)}
                  </td>
                  <td className="p-2 text-right align-top font-mono">
                    {fmt(vat)}
                  </td>
                  <td className="p-2 text-right align-top font-mono font-semibold">
                    {fmt(net + vat)}
                  </td>
                  <td className="p-2 text-right align-top print:hidden">
                    <button
                      type="button"
                      onClick={() =>
                        setLines((arr) => arr.filter((x) => x.id !== line.id))
                      }
                      className="text-[12px] text-[color:var(--ink-mute)] hover:text-red-600"
                    >
                      ×
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={6} className="pt-3 text-right text-[color:var(--ink-soft)]">
                Сумма без НДС
              </td>
              <td className="pt-3 text-right font-mono" colSpan={3}>
                {fmt(totals.net)} ₸
              </td>
              <td className="print:hidden"></td>
            </tr>
            <tr>
              <td colSpan={6} className="text-right text-[color:var(--ink-soft)]">
                НДС
              </td>
              <td className="text-right font-mono" colSpan={3}>
                {fmt(totals.vat)} ₸
              </td>
              <td className="print:hidden"></td>
            </tr>
            <tr>
              <td colSpan={6} className="pt-2 text-right text-[15px] font-semibold">
                Итого к оплате
              </td>
              <td
                className="pt-2 text-right font-mono text-[15px] font-semibold"
                colSpan={3}
              >
                {fmt(totals.total)} ₸
              </td>
              <td className="print:hidden"></td>
            </tr>
          </tfoot>
        </table>

        <div className="mb-6 print:hidden">
          <button
            type="button"
            onClick={() => setLines((arr) => [...arr, blank()])}
            className="rounded-md border border-[color:var(--rule)] bg-white px-3 py-2 text-[13px] text-[color:var(--ink-soft)] hover:border-[color:var(--ink)] hover:text-[color:var(--ink)]"
          >
            + добавить позицию
          </button>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-10 text-[13px]">
          <Signature label="Руководитель" />
          <Signature label="Бухгалтер" />
        </div>
      </article>

      <style jsx global>{`
        @media print {
          body { background: white; }
          aside, header { display: none !important; }
          main { padding: 0 !important; }
        }
      `}</style>
    </div>
  );
}

function PartyBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-md border border-[color:var(--rule)] bg-white p-4">
      <div className="font-mono text-[10px] uppercase text-[color:var(--ink-mute)]">
        {title}
      </div>
      <div className="mt-2 grid gap-1 text-[13.5px]">{children}</div>
    </div>
  );
}

function Signature({ label }: { label: string }) {
  return (
    <div>
      <div className="font-mono text-[11px] uppercase text-[color:var(--ink-mute)]">
        {label}
      </div>
      <div className="mt-12 border-t border-[color:var(--ink)] pt-1 text-[color:var(--ink-soft)]">
        подпись, ФИО / М.П.
      </div>
    </div>
  );
}

function Num({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <input
      type="number"
      value={value}
      step={value < 100 ? 1 : 1000}
      onChange={(e) => onChange(Number(e.target.value) || 0)}
      className="w-full border-b border-dashed border-[color:var(--rule)] bg-transparent py-0.5 text-right font-mono outline-none focus:border-[color:var(--ink)]"
    />
  );
}

function update<T extends { id: string }>(
  set: React.Dispatch<React.SetStateAction<T[]>>,
  id: string,
  patch: Partial<T>,
) {
  set((arr) => arr.map((it) => (it.id === id ? { ...it, ...patch } : it)));
}
