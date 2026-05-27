"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Printer, Save, Check, Plus } from "lucide-react";
import {
  CounterpartyPicker,
  type PickerCp,
} from "../_components/counterparty-picker";
import { saveDocument } from "../actions";

type Op = {
  id: string;
  date: string;
  doc: string;
  description: string;
  debit: number;
  credit: number;
};

const blank = (): Op => ({
  id: crypto.randomUUID(),
  date: new Date().toISOString().slice(0, 10),
  doc: "",
  description: "",
  debit: 0,
  credit: 0,
});

const fmt = (n: number) =>
  new Intl.NumberFormat("ru-KZ", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);

export function ReconciliationEditor({
  counterparties,
}: {
  counterparties: PickerCp[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const [number, setNumber] = useState("АС-2026-001");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const today = new Date();
  const yearStart = new Date(today.getFullYear(), 0, 1).toISOString().slice(0, 10);
  const [from, setFrom] = useState(yearStart);
  const [to, setTo] = useState(date);

  const [partyB, setPartyB] = useState<PickerCp | null>(null);
  const [openingBalance, setOpeningBalance] = useState(0);

  const [ops, setOps] = useState<Op[]>([blank()]);

  useEffect(() => {
    fetch(`/api/next-doc-number?kind=reconciliation&date=${date}`)
      .then((r) => r.json())
      .then((d) => d.number && setNumber(d.number))
      .catch(() => {});
  }, [date]);

  const totals = useMemo(() => {
    let debit = 0;
    let credit = 0;
    for (const o of ops) {
      debit += Number(o.debit);
      credit += Number(o.credit);
    }
    const closing = openingBalance + debit - credit;
    return { debit, credit, closing };
  }, [ops, openingBalance]);

  function onSave() {
    if (!partyB) {
      alert("Выберите вторую сторону");
      return;
    }
    startTransition(async () => {
      await saveDocument({
        kind: "reconciliation",
        number,
        date,
        counterparty_id: partyB.id,
        counterparty_snapshot: {
          name: partyB.name,
          full_name: partyB.full_name,
          bin: partyB.bin,
        },
        payload: { from, to, openingBalance, ops, totals, partyB },
        total: Math.abs(totals.closing),
        status: "issued",
      });
      setSaved(true);
      setTimeout(() => router.push("/dashboard/documents"), 700);
    });
  }

  return (
    <div className="mx-auto max-w-[1000px]">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div className="font-mono text-[11px] uppercase text-[color:var(--ink-mute)]">
          Акт сверки взаимных расчётов
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
          value={partyB}
          onChange={setPartyB}
          label="Вторая сторона"
        />
      </div>

      <article className="surface bg-white p-7 print:border-0 print:p-0 print:shadow-none">
        <header className="mb-6 border-b border-[color:var(--rule)] pb-5">
          <h2 className="text-center text-[22px] font-semibold">
            Акт сверки взаимных расчётов № {number}
          </h2>
          <p className="mt-1 text-center text-[13px] text-[color:var(--ink-soft)]">
            за период с{" "}
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="font-mono"
            />{" "}
            по{" "}
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="font-mono"
            />
          </p>
        </header>

        <div className="mb-6 grid grid-cols-2 gap-5 print:grid-cols-2">
          <PartyBlock title="Сторона А">
            <p className="font-semibold">ТОО «Turanix»</p>
            <p className="font-mono text-[12px]">БИН 260540022744</p>
          </PartyBlock>
          <PartyBlock title="Сторона Б">
            {partyB ? (
              <>
                <p className="font-semibold">{partyB.full_name ?? partyB.name}</p>
                <p className="font-mono text-[12px]">БИН/ИИН {partyB.bin ?? "—"}</p>
              </>
            ) : (
              <p className="text-[color:var(--ink-mute)]">Не выбрана</p>
            )}
          </PartyBlock>
        </div>

        <div className="mb-3 rounded-md border border-[color:var(--rule)] bg-[#f4f5ef]/50 px-4 py-2.5 text-[13.5px]">
          <span className="font-mono text-[11px] uppercase text-[color:var(--ink-mute)]">
            Сальдо на начало периода
          </span>{" "}
          <input
            type="number"
            value={openingBalance}
            onChange={(e) => setOpeningBalance(Number(e.target.value) || 0)}
            className="ml-2 w-32 border-b border-dashed border-[color:var(--rule)] bg-transparent text-right font-mono"
          />{" "}
          ₸
        </div>

        <table className="w-full border-collapse text-[13.5px]">
          <thead>
            <tr className="border-y border-[color:var(--ink)] bg-[#f4f5ef] font-mono text-[10px] uppercase">
              <th className="w-28 p-2 text-left">Дата</th>
              <th className="w-32 p-2 text-left">№ документа</th>
              <th className="p-2 text-left">Содержание</th>
              <th className="w-28 p-2 text-right">Дебет</th>
              <th className="w-28 p-2 text-right">Кредит</th>
              <th className="w-10 print:hidden"></th>
            </tr>
          </thead>
          <tbody>
            {ops.map((o) => (
              <tr key={o.id} className="border-b border-[color:var(--rule)]">
                <td className="p-2">
                  <input
                    type="date"
                    value={o.date}
                    onChange={(e) => patch(setOps, o.id, { date: e.target.value })}
                    className="font-mono"
                  />
                </td>
                <td className="p-2">
                  <input
                    value={o.doc}
                    onChange={(e) => patch(setOps, o.id, { doc: e.target.value })}
                    className="w-full border-b border-dashed border-[color:var(--rule)] bg-transparent outline-none focus:border-[color:var(--ink)]"
                  />
                </td>
                <td className="p-2">
                  <input
                    value={o.description}
                    onChange={(e) =>
                      patch(setOps, o.id, { description: e.target.value })
                    }
                    className="w-full border-b border-dashed border-[color:var(--rule)] bg-transparent outline-none focus:border-[color:var(--ink)]"
                  />
                </td>
                <td className="p-2">
                  <Num
                    value={o.debit}
                    onChange={(n) => patch(setOps, o.id, { debit: n })}
                  />
                </td>
                <td className="p-2">
                  <Num
                    value={o.credit}
                    onChange={(n) => patch(setOps, o.id, { credit: n })}
                  />
                </td>
                <td className="p-2 text-right print:hidden">
                  <button
                    type="button"
                    onClick={() => setOps((a) => a.filter((x) => x.id !== o.id))}
                    className="text-[color:var(--ink-mute)] hover:text-red-600"
                  >
                    ×
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="font-mono">
            <tr className="border-b border-[color:var(--rule)]">
              <td className="p-2 text-[color:var(--ink-soft)]" colSpan={3}>
                Обороты
              </td>
              <td className="p-2 text-right">{fmt(totals.debit)}</td>
              <td className="p-2 text-right">{fmt(totals.credit)}</td>
              <td className="print:hidden"></td>
            </tr>
            <tr>
              <td className="p-2 font-semibold" colSpan={4}>
                Сальдо на конец периода
              </td>
              <td className="p-2 text-right font-semibold">
                {fmt(totals.closing)} ₸
              </td>
              <td className="print:hidden"></td>
            </tr>
          </tfoot>
        </table>

        <div className="mt-3 print:hidden">
          <button
            type="button"
            onClick={() => setOps((a) => [...a, blank()])}
            className="inline-flex items-center gap-1.5 rounded-md border border-[color:var(--rule)] bg-white px-3 py-2 text-[13px] text-[color:var(--ink-soft)] hover:border-[color:var(--ink)] hover:text-[color:var(--ink)]"
          >
            <Plus className="h-3.5 w-3.5" />
            строка операции
          </button>
        </div>

        <p className="my-6 text-[12.5px] leading-[1.6] text-[color:var(--ink-soft)]">
          Настоящий акт сверки составлен в двух экземплярах, имеющих равную
          юридическую силу — по одному для каждой стороны.
        </p>

        <div className="mt-12 grid grid-cols-2 gap-10 text-[13px] print:grid-cols-2">
          <Signature label="Сторона А" />
          <Signature label="Сторона Б" />
        </div>
      </article>

      <style jsx global>{`
        @media print { body { background: white; } aside, header { display: none !important; } main { padding: 0 !important; } }
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

function patch<T extends { id: string }>(
  set: React.Dispatch<React.SetStateAction<T[]>>,
  id: string,
  p: Partial<T>,
) {
  set((arr) => arr.map((it) => (it.id === id ? { ...it, ...p } : it)));
}
