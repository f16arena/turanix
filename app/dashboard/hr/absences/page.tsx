import { createClient } from "../../../_lib/supabase/server";
import { AbsencesUI } from "./_ui";

export type Absence = {
  id: string;
  employee_id: string;
  kind: string;
  from_date: string;
  to_date: string;
  days: number;
  paid: boolean;
  note: string | null;
};

export default async function AbsencesPage() {
  const supabase = await createClient();
  const [{ data: rows }, { data: emps }] = await Promise.all([
    supabase
      .from("absences")
      .select("id, employee_id, kind, from_date, to_date, days, paid, note")
      .order("from_date", { ascending: false })
      .limit(200),
    supabase.from("employees").select("id, name").order("name"),
  ]);

  return (
    <AbsencesUI
      rows={(rows ?? []) as Absence[]}
      employees={(emps ?? []) as { id: string; name: string }[]}
    />
  );
}
