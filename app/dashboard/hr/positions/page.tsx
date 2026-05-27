import { createClient } from "../../../_lib/supabase/server";
import { PositionsUI } from "./_ui";

export type Pos = {
  id: string;
  name: string;
  department_id: string | null;
  salary_min: number;
  salary_max: number;
  note: string | null;
};

export default async function PositionsPage() {
  const supabase = await createClient();
  const [{ data: pos }, { data: deps }] = await Promise.all([
    supabase
      .from("positions")
      .select("id, name, department_id, salary_min, salary_max, note")
      .order("name"),
    supabase.from("departments").select("id, name").order("name"),
  ]);
  return (
    <PositionsUI
      rows={(pos ?? []) as Pos[]}
      departments={(deps ?? []) as { id: string; name: string }[]}
    />
  );
}
