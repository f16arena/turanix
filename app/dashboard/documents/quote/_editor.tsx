"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import {
  CounterpartyPicker,
  type PickerCp,
} from "../_components/counterparty-picker";

type Item = { name: string; unit: string; qty: number; price: number };

export function QuoteEditor({
  counterparties,
}: {
  counterparties: PickerCp[];
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const [number, setNumber] = useState("КП-2026-001");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [intro, setIntro] = useState(
    "Благодарим за интерес к нашим услугам. Направляем коммерческое предложение по вашему запросу.",
  );
  const [outro, setOutro] = useState(
    "Готовы обсудить детали и адаптировать предложение под ваши задачи.",
  );

  const [sender, setSender] = useState({
    name: "ТОО «Turanix»",
    bin: "260540022744",
    phone: "+7 701 107 02 60",
    email: "info@turanix.kz",
    address: "Усть-Каменогорск, Казахстан",
  });
  const [buyer, setBuyer] = useState<PickerCp | null>(null);
  const [contactPerson, setContactPerson] = useState("");
  const [terms, setTerms] = useState({
    validity: "30 дней",
    delivery: "По согласованию",
    payment: "100% предоплата",
    extra: "Цены указаны в тенге с учётом НДС.",
  });

  const [items, setItems] = useState<Item[]>([
    { name: "Разработка сайта", unit: "услуга", qty: 1, price: 1500000 },
  ]);

  useEffect(() => {
    fetch("/api/next-doc-number?kind=quote&date=" + date)
      .then((r) => r.json())
      .then((d) => d.number && setNumber(d.number))
      .catch(() => {});
  }, [date]);

  async function onDownload() {
    setPending(true);
    setError(null);
    setDone(false);
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          number,
          date,
          intro,
          outro,
          sender,
          receiver: {
            company: buyer?.full_name ?? buyer?.name ?? "",
            person: contactPerson,
            bin: buyer?.bin ?? null,
          },
          counterparty_id: buyer?.id ?? null,
          counterparty_snapshot: buyer
            ? {
                name: buyer.name,
                full_name: buyer.full_name,
                bin: buyer.bin,
                legal_address: buyer.legal_address,
              }
            : null,
          terms,
          items,
        }),
      });
      if (!res.ok) throw new Error("Ошибка генерации");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `КП_${number}.docx`;
      a.click();
      URL.revokeObjectURL(url);
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось");
    } finally {
      setPending(false);
    }
  }

  const total = items.reduce((s, i) => s + i.qty * i.price, 0);

  return (
    <div className="mx-auto max-w-[1000px]">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="eyebrow mb-2">Документы / Коммерческое предложение</div>
          <h1 className="text-[28px] font-semibold leading-tight">
            Сгенерировать КП в .docx
          </h1>
          <p className="mt-2 text-[14px] text-[color:var(--ink-soft)]">
            При скачивании файл сохраняется в архив документов.
          </p>
        </div>
        <button
          onClick={onDownload}
          disabled={pending}
          className="button-primary !min-h-[42px]"
        >
          <Download className="h-4 w-4" />
          {pending ? "Генерируем…" : done ? "Скачать ещё раз" : "Скачать .docx"}
        </button>
      </div>

      {error && (
        <p className="mb-4 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-[13px] text-red-700">
          {error}
        </p>
      )}

      <div className="mb-4">
        <CounterpartyPicker
          options={counterparties}
          value={buyer}
          onChange={setBuyer}
          label="Получатель"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card title="Реквизиты КП">
          <Field label="Номер" value={number} onChange={setNumber} />
          <Field label="Дата" value={date} type="date" onChange={setDate} />
          <Field
            label="Контактное лицо"
            value={contactPerson}
            onChange={setContactPerson}
          />
        </Card>

        <Card title="Отправитель">
          <Field label="Компания" value={sender.name} onChange={(v) => setSender({ ...sender, name: v })} />
          <Field label="БИН" value={sender.bin} onChange={(v) => setSender({ ...sender, bin: v })} />
          <Field label="Телефон" value={sender.phone} onChange={(v) => setSender({ ...sender, phone: v })} />
          <Field label="Email" value={sender.email} onChange={(v) => setSender({ ...sender, email: v })} />
          <Field label="Адрес" value={sender.address} onChange={(v) => setSender({ ...sender, address: v })} />
        </Card>

        <Card title="Условия">
          <Field label="Срок действия" value={terms.validity} onChange={(v) => setTerms({ ...terms, validity: v })} />
          <Field label="Срок поставки" value={terms.delivery} onChange={(v) => setTerms({ ...terms, delivery: v })} />
          <Field label="Условия оплаты" value={terms.payment} onChange={(v) => setTerms({ ...terms, payment: v })} />
          <Field label="Доп. условия" value={terms.extra} onChange={(v) => setTerms({ ...terms, extra: v })} />
        </Card>

        <Card title="Тексты">
          <textarea
            value={intro}
            onChange={(e) => setIntro(e.target.value)}
            rows={4}
            placeholder="Вступление"
            className="w-full rounded-md border border-[color:var(--rule)] bg-white p-3 text-[14px] outline-none focus:border-[color:var(--ink)]"
          />
          <textarea
            value={outro}
            onChange={(e) => setOutro(e.target.value)}
            rows={3}
            placeholder="Заключение"
            className="w-full rounded-md border border-[color:var(--rule)] bg-white p-3 text-[14px] outline-none focus:border-[color:var(--ink)]"
          />
        </Card>
      </div>

      <div className="surface mt-4 p-5">
        <div className="font-mono text-[10px] uppercase text-[color:var(--ink-mute)]">
          Позиции
        </div>
        <table className="mt-3 w-full text-[14px]">
          <thead className="font-mono text-[10px] uppercase text-[color:var(--ink-mute)]">
            <tr className="border-b border-[color:var(--rule)]">
              <th className="py-2 text-left">Наименование</th>
              <th className="w-20 py-2 text-left">Ед.</th>
              <th className="w-20 py-2 text-right">Кол-во</th>
              <th className="w-32 py-2 text-right">Цена</th>
              <th className="w-32 py-2 text-right">Сумма</th>
              <th className="w-8"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((it, i) => (
              <tr key={i} className="border-b border-[color:var(--rule)]">
                <td className="py-2 pr-2">
                  <Inline value={it.name} onChange={(v) => patch(setItems, i, { name: v })} />
                </td>
                <td className="py-2 pr-2">
                  <Inline value={it.unit} onChange={(v) => patch(setItems, i, { unit: v })} />
                </td>
                <td className="py-2 pr-2">
                  <Inline
                    type="number"
                    value={String(it.qty)}
                    onChange={(v) => patch(setItems, i, { qty: Number(v) || 0 })}
                    align="right"
                  />
                </td>
                <td className="py-2 pr-2">
                  <Inline
                    type="number"
                    value={String(it.price)}
                    onChange={(v) => patch(setItems, i, { price: Number(v) || 0 })}
                    align="right"
                  />
                </td>
                <td className="py-2 pr-2 text-right font-mono">
                  {(it.qty * it.price).toLocaleString("ru-KZ")} ₸
                </td>
                <td>
                  <button
                    type="button"
                    onClick={() => setItems(items.filter((_, x) => x !== i))}
                    className="text-[color:var(--ink-mute)] hover:text-red-600"
                  >
                    ×
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={4} className="pt-3 text-right font-semibold">
                Итого
              </td>
              <td className="pt-3 text-right font-mono font-semibold">
                {total.toLocaleString("ru-KZ")} ₸
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
        <button
          type="button"
          onClick={() =>
            setItems((arr) => [...arr, { name: "", unit: "шт", qty: 1, price: 0 }])
          }
          className="mt-3 rounded-md border border-[color:var(--rule)] bg-white px-3 py-1.5 text-[12px] text-[color:var(--ink-soft)] hover:border-[color:var(--ink)] hover:text-[color:var(--ink)]"
        >
          + позиция
        </button>
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="surface p-5">
      <div className="mb-3 font-mono text-[10px] uppercase text-[color:var(--ink-mute)]">
        {title}
      </div>
      <div className="grid gap-2.5">{children}</div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="grid grid-cols-[140px_1fr] items-center gap-3">
      <span className="font-mono text-[10px] uppercase text-[color:var(--ink-mute)]">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 rounded-md border border-[color:var(--rule)] bg-white px-2.5 text-[14px] outline-none focus:border-[color:var(--ink)]"
      />
    </label>
  );
}

function Inline({
  value,
  onChange,
  type = "text",
  align,
}: {
  value: string;
  onChange: (v: string) => void;
  type?: string;
  align?: "right";
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full border-b border-dashed border-[color:var(--rule)] bg-transparent py-1 text-[14px] outline-none focus:border-[color:var(--ink)] ${
        align === "right" ? "text-right font-mono" : ""
      }`}
    />
  );
}

function patch<T>(
  set: React.Dispatch<React.SetStateAction<T[]>>,
  index: number,
  p: Partial<T>,
) {
  set((arr) => arr.map((it, i) => (i === index ? { ...it, ...p } : it)));
}
