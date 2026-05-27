import { createClient } from "../../../_lib/supabase/server";

type AuditRow = {
  id: string;
  user_id: string | null;
  table_name: string;
  record_id: string | null;
  action: "insert" | "update" | "delete";
  before: Record<string, unknown> | null;
  after: Record<string, unknown> | null;
  created_at: string;
};

const TABLE_LABEL: Record<string, string> = {
  employees: "Сотрудник",
  counterparties: "Контрагент",
  documents: "Документ",
  transactions: "Доход/Расход",
  hr_orders: "Кадровый приказ",
  absences: "Отсутствие",
  counterparty_accounts: "Банковский счёт",
  payroll_records: "Зарплатная ведомость",
};

const ACTION_LABEL: Record<string, string> = {
  insert: "Создание",
  update: "Изменение",
  delete: "Удаление",
};

const ACTION_CLASS: Record<string, string> = {
  insert: "bg-[color:var(--accent-soft)] text-[color:var(--accent)]",
  update: "bg-blue-50 text-blue-700",
  delete: "bg-red-50 text-red-600",
};

export default async function AuditPage({
  searchParams,
}: {
  searchParams: Promise<{ table?: string; action?: string }>;
}) {
  const { table = "all", action = "all" } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("audit_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);
  if (table !== "all") query = query.eq("table_name", table);
  if (action !== "all") query = query.eq("action", action);

  const { data } = await query;
  const rows = (data ?? []) as AuditRow[];

  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-2">
        <Pills
          name="table"
          current={table}
          options={[
            ["all", "Все таблицы"],
            ...Object.entries(TABLE_LABEL).map(
              ([v, l]) => [v, l] as [string, string],
            ),
          ]}
        />
        <Pills
          name="action"
          current={action}
          options={[
            ["all", "Все действия"],
            ["insert", "Создания"],
            ["update", "Изменения"],
            ["delete", "Удаления"],
          ]}
        />
      </div>

      <div className="surface overflow-hidden">
        {rows.length === 0 ? (
          <div className="p-8 text-center text-[14px] text-[color:var(--ink-soft)]">
            Записей нет.
          </div>
        ) : (
          <ul>
            <li className="hidden grid-cols-[160px_140px_140px_140px_1fr] gap-3 border-b border-[color:var(--rule)] px-4 py-3 font-mono text-[10px] uppercase text-[color:var(--ink-mute)] md:grid">
              <span>Время</span>
              <span>Кто</span>
              <span>Объект</span>
              <span>Действие</span>
              <span>Запись</span>
            </li>
            {rows.map((r) => (
              <li
                key={r.id}
                className="grid grid-cols-1 gap-2 border-b border-[color:var(--rule)] px-4 py-2.5 last:border-b-0 md:grid-cols-[160px_140px_140px_140px_1fr] md:items-center"
              >
                <span className="font-mono text-[12px] text-[color:var(--ink-soft)]">
                  {new Date(r.created_at).toLocaleString("ru-KZ")}
                </span>
                <span className="font-mono text-[11px] text-[color:var(--ink-soft)]">
                  {r.user_id ? r.user_id.slice(0, 8) + "…" : "система"}
                </span>
                <span className="font-mono text-[12px] text-[color:var(--ink)]">
                  {TABLE_LABEL[r.table_name] ?? r.table_name}
                </span>
                <span
                  className={`inline-flex h-5 w-fit items-center rounded-full px-2 font-mono text-[10px] uppercase ${ACTION_CLASS[r.action]}`}
                >
                  {ACTION_LABEL[r.action]}
                </span>
                <span className="truncate font-mono text-[11px] text-[color:var(--ink-soft)]">
                  {r.record_id?.slice(0, 8) ?? "—"} ·{" "}
                  {summarize(r.after ?? r.before)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Pills({
  name,
  current,
  options,
}: {
  name: string;
  current: string;
  options: [string, string][];
}) {
  return (
    <form
      method="get"
      className="inline-flex h-9 rounded-md border border-[color:var(--rule)] bg-white p-0.5"
    >
      <select
        name={name}
        defaultValue={current}
        onChange={(e) =>
          (e.target.form as HTMLFormElement | null)?.requestSubmit()
        }
        className="rounded px-2 text-[12px] font-mono uppercase outline-none"
      >
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </form>
  );
}

function summarize(d: Record<string, unknown> | null) {
  if (!d) return "—";
  const keys = ["name", "number", "title", "date"];
  for (const k of keys) {
    const v = d[k];
    if (v) return String(v).slice(0, 60);
  }
  return "—";
}
