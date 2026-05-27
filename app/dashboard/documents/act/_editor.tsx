"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Printer, Save, Check } from "lucide-react";
import {
  CounterpartyPicker,
  type PickerCp,
} from "../_components/counterparty-picker";
import { saveDocument } from "../actions";

type Work = {
  id: string;
  name: string;
  unit: string;
  qty: number;
  price: number;
};

const blank = (): Work => ({
  id: crypto.randomUUID(),
  name: "",
  unit: "услуга",
  qty: 1,
  price: 0,
});

const fmt = (n: number) =>
  new Intl.NumberFormat("ru-KZ", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);

export function ActEditor({ counterparties }: { counterparties: PickerCp[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const [number, setNumber] = useState("АВР-2026-001");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [contractNumber, setContractNumber] = useState("");
  const [contractDate, setContractDate] = useState("");
  const [client, setClient] = useState<PickerCp | null>(null);
  const [vatRate, setVatRate] = useState(12);

  const [works, setWorks] = useState<Work[]>([
    {
      id: crypto.randomUUID(),
      name: "Разработка / услуги по договору",
      unit: "услуга",
      qty: 1,
      price: 500000,
    },
  ]);

  useEffect(() => {
    fetch(`/api/next-doc-number?kind=avr&date=${date}`)
      .then((r) => r.json())
      .then((d) => d.number && setNumber(d.number))
      .catch(() => {});
  }, [date]);

  const totals = useMemo(() => {
    const net = works.reduce((s, w) => s + w.qty * w.price, 0);
    const vat = net * (vatRate / 100);
    return { net, vat, total: net + vat };
  }, [works, vatRate]);

  function onSave() {
    if (!client) {
      alert("Выберите заказчика");
      return;
    }
    startTransition(async () => {
      await saveDocument({
        kind: "avr",
        number,
        date,
        counterparty_id: client.id,
        counterparty_snapshot: {
          name: client.name,
          full_name: client.full_name,
          bin: client.bin,
          legal_address: client.legal_address,
        },
        payload: { works, contractNumber, contractDate, vatRate, client },
        total: totals.total,
        status: "issued",
      });
      setSaved(true);
      setTimeout(() => router.push("/dashboard/documents"), 700);
    });
  }

  return (
    <div className="mx-auto max-w-[920px]">
      <Toolbar
        title="АВР — Акт выполненных работ"
        onPrint={() => window.print()}
        onSave={onSave}
        pending={pending}
        saved={saved}
      />

      <div className="mb-4 print:hidden">
        <CounterpartyPicker
          options={counterparties}
          value={client}
          onChange={setClient}
          label="Заказчик"
        />
      </div>

      <article className="surface bg-white p-7 print:border-0 print:p-0 print:shadow-none">
        <header className="mb-6 border-b border-[color:var(--rule)] pb-5">
          <h2 className="text-center text-[24px] font-semibold">
            Акт выполненных работ № {number}
          </h2>
          <p className="mt-1 text-center text-[13px] text-[color:var(--ink-soft)]">
            от{" "}
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="font-mono"
            />
          </p>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 print:grid-cols-2">
            <div className="text-[13px]">
              <span className="font-mono text-[10px] uppercase text-[color:var(--ink-mute)]">
                Договор №
              </span>
              <input
                value={contractNumber}
                onChange={(e) => setContractNumber(e.target.value)}
                placeholder="ДГ-001"
                className="ml-2 border-b border-dashed border-[color:var(--rule)] bg-transparent px-1 outline-none focus:border-[color:var(--ink)]"
              />
            </div>
            <div className="text-[13px]">
              <span className="font-mono text-[10px] uppercase text-[color:var(--ink-mute)]">
                от
              </span>
              <input
                type="date"
                value={contractDate}
                onChange={(e) => setContractDate(e.target.value)}
                className="ml-2 font-mono"
              />
            </div>
          </div>
        </header>

        <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-2 print:grid-cols-2">
          <PartyBlock title="Исполнитель">
            <p className="font-semibold">ТОО «Turanix»</p>
            <p className="font-mono text-[12px]">БИН 260540022744</p>
            <p>пр. Илияса Есенберлина 20-272, Усть-Каменогорск</p>
          </PartyBlock>
          <PartyBlock title="Заказчик">
            {client ? (
              <>
                <p className="font-semibold">{client.full_name ?? client.name}</p>
                <p className="font-mono text-[12px]">
                  БИН/ИИН {client.bin ?? "—"}
                </p>
                <p>{client.legal_address ?? "—"}</p>
              </>
            ) : (
              <p className="text-[color:var(--ink-mute)]">Не выбран</p>
            )}
          </PartyBlock>
        </div>

        <table className="mb-4 w-full border-collapse text-[13.5px]">
          <thead>
            <tr className="border-y border-[color:var(--ink)] bg-[#f4f5ef] font-mono text-[10px] uppercase">
              <th className="w-10 p-2 text-left">№</th>
              <th className="p-2 text-left">Наименование работ / услуг</th>
              <th className="w-16 p-2 text-left">Ед.</th>
              <th className="w-16 p-2 text-right">Кол-во</th>
              <th className="w-28 p-2 text-right">Цена</th>
              <th className="w-32 p-2 text-right">Сумма</th>
              <th className="w-10 p-2 print:hidden"></th>
            </tr>
          </thead>
          <tbody>
            {works.map((w, i) => (
              <tr key={w.id} className="border-b border-[color:var(--rule)]">
                <td className="p-2 align-top text-[color:var(--ink-soft)]">{i + 1}</td>
                <td className="p-2 align-top">
                  <textarea
                    value={w.name}
                    rows={1}
                    onChange={(e) =>
                      patch(setWorks, w.id, { name: e.target.value })
                    }
                    className="w-full resize-none border-b border-dashed border-[color:var(--rule)] bg-transparent py-0.5 outline-none focus:border-[color:var(--ink)]"
                  />
                </td>
                <td className="p-2 align-top">
                  <input
                    value={w.unit}
                    onChange={(e) => patch(setWorks, w.id, { unit: e.target.value })}
                    className="w-full border-b border-dashed border-[color:var(--rule)] bg-transparent py-0.5 outline-none focus:border-[color:var(--ink)]"
                  />
                </td>
                <td className="p-2 text-right align-top">
                  <Num value={w.qty} onChange={(n) => patch(setWorks, w.id, { qty: n })} />
                </td>
                <td className="p-2 text-right align-top">
                  <Num value={w.price} onChange={(n) => patch(setWorks, w.id, { price: n })} />
                </td>
                <td className="p-2 text-right align-top font-mono">
                  {fmt(w.qty * w.price)}
                </td>
                <td className="p-2 text-right align-top print:hidden">
                  <button
                    type="button"
                    onClick={() => setWorks((arr) => arr.filter((x) => x.id !== w.id))}
                    className="text-[12px] text-[color:var(--ink-mute)] hover:text-red-600"
                  >
                    ×
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={4} className="pt-2"></td>
              <td className="pt-2 text-right text-[color:var(--ink-soft)]">
                Без НДС
              </td>
              <td className="pt-2 text-right font-mono">{fmt(totals.net)} ₸</td>
              <td className="print:hidden"></td>
            </tr>
            <tr>
              <td colSpan={4}></td>
              <td className="text-right text-[color:var(--ink-soft)]">
                НДС{" "}
                <input
                  type="number"
                  value={vatRate}
                  onChange={(e) => setVatRate(Number(e.target.value) || 0)}
                  className="w-12 border-b border-dashed border-[color:var(--rule)] bg-transparent text-center"
                />
                %
              </td>
              <td className="text-right font-mono">{fmt(totals.vat)} ₸</td>
              <td className="print:hidden"></td>
            </tr>
            <tr>
              <td colSpan={4} className="pt-2"></td>
              <td className="pt-2 text-right text-[15px] font-semibold">Итого</td>
              <td className="pt-2 text-right font-mono text-[15px] font-semibold">
                {fmt(totals.total)} ₸
              </td>
              <td className="print:hidden"></td>
            </tr>
          </tfoot>
        </table>

        <div className="mb-6 print:hidden">
          <button
            type="button"
            onClick={() => setWorks((a) => [...a, blank()])}
            className="rounded-md border border-[color:var(--rule)] bg-white px-3 py-2 text-[13px] text-[color:var(--ink-soft)] hover:border-[color:var(--ink)] hover:text-[color:var(--ink)]"
          >
            + добавить работу
          </button>
        </div>

        <p className="my-6 text-[13.5px] leading-[1.6] text-[color:var(--ink-soft)]">
          Работы / услуги выполнены в полном объёме, в установленные сроки и с
          надлежащим качеством. Стороны взаимных претензий друг к другу не имеют.
        </p>

        <div className="mt-12 grid grid-cols-2 gap-10 text-[13px] print:grid-cols-2">
          <Signature label="Исполнитель" />
          <Signature label="Заказчик" />
        </div>
      </article>

      <style jsx global>{`
        @media print { body { background: white; } aside, header { display: none !important; } main { padding: 0 !important; } }
      `}</style>
    </div>
  );
}

function Toolbar({
  title,
  onPrint,
  onSave,
  pending,
  saved,
}: {
  title: string;
  onPrint: () => void;
  onSave: () => void;
  pending: boolean;
  saved: boolean;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3 print:hidden">
      <div className="font-mono text-[11px] uppercase text-[color:var(--ink-mute)]">
        {title}
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onPrint}
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

function patch<T extends { id: string }>(
  set: React.Dispatch<React.SetStateAction<T[]>>,
  id: string,
  p: Partial<T>,
) {
  set((arr) => arr.map((it) => (it.id === id ? { ...it, ...p } : it)));
}
