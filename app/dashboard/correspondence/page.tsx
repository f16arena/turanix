import { createClient } from "../../_lib/supabase/server";
import { AddForm, DeleteButton, SearchBar } from "./_ui";

type Row = {
  id: string;
  direction: "incoming" | "outgoing";
  date: string;
  number: string;
  party: string;
  subject: string;
  status: string | null;
  note: string | null;
};

export default async function CorrespondencePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string }>;
}) {
  const { q = "", type = "all" } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("correspondence")
    .select("*")
    .order("date", { ascending: false })
    .limit(200);

  if (type === "incoming" || type === "outgoing") {
    query = query.eq("direction", type);
  }
  if (q) {
    query = query.or(
      `party.ilike.%${q}%,subject.ilike.%${q}%,number.ilike.%${q}%`,
    );
  }

  const { data } = await query;
  const rows = (data ?? []) as Row[];

  const totals = {
    all: rows.length,
    incoming: rows.filter((r) => r.direction === "incoming").length,
    outgoing: rows.filter((r) => r.direction === "outgoing").length,
  };

  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="eyebrow mb-2">Корреспонденция</div>
          <h1 className="text-[34px] font-semibold leading-tight">
            Журнал входящих и исходящих
          </h1>
          <p className="mt-2 max-w-[640px] text-[15px] leading-[1.6] text-[color:var(--ink-soft)]">
            Регистрация, поиск и фильтры. Номер документа присваивается
            автоматически по году и направлению.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <Stat label="Всего" value={totals.all} />
          <Stat label="Входящих" value={totals.incoming} />
          <Stat label="Исходящих" value={totals.outgoing} />
        </div>
      </div>

      <AddForm />

      <div className="my-6">
        <SearchBar defaultQ={q} type={type} />
      </div>

      <div className="surface overflow-hidden">
        <div className="hidden grid-cols-[120px_140px_1fr_1.6fr_120px_60px] border-b border-[color:var(--rule)] px-4 py-3 font-mono text-[10px] uppercase text-[color:var(--ink-mute)] md:grid">
          <span>Тип</span>
          <span>Номер</span>
          <span>От кого / Кому</span>
          <span>Тема</span>
          <span>Дата</span>
          <span></span>
        </div>

        {rows.length === 0 ? (
          <div className="p-8 text-center text-[14px] text-[color:var(--ink-soft)]">
            Записей пока нет. Добавьте первую через форму выше.
          </div>
        ) : (
          <ul>
            {rows.map((row) => (
              <li
                key={row.id}
                className="grid grid-cols-1 gap-1 border-b border-[color:var(--rule)] px-4 py-3 last:border-b-0 md:grid-cols-[120px_140px_1fr_1.6fr_120px_60px] md:items-center md:gap-2"
              >
                <span
                  className={`inline-flex h-6 w-fit items-center gap-1.5 rounded-full border px-2 font-mono text-[10px] uppercase ${
                    row.direction === "incoming"
                      ? "border-[color:var(--accent)] bg-[color:var(--accent-soft)] text-[color:var(--accent)]"
                      : "border-[color:var(--rule)] bg-[#f4f5ef] text-[color:var(--ink-soft)]"
                  }`}
                >
                  {row.direction === "incoming" ? "Входящее" : "Исходящее"}
                </span>
                <span className="font-mono text-[12px] text-[color:var(--ink)]">
                  {row.number}
                </span>
                <span className="text-[14px] font-medium">{row.party}</span>
                <span className="text-[14px] text-[color:var(--ink-soft)]">
                  {row.subject}
                </span>
                <span className="font-mono text-[12px] text-[color:var(--ink-soft)]">
                  {row.date}
                </span>
                <DeleteButton id={row.id} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-[color:var(--rule)] bg-white/72 px-3 py-2">
      <div className="font-mono text-[10px] uppercase text-[color:var(--ink-mute)]">
        {label}
      </div>
      <div className="text-[18px] font-semibold">{value}</div>
    </div>
  );
}
