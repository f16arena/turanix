import { createClient } from "../../../_lib/supabase/server";
import { DepartmentsUI } from "./_ui";

export type Dept = {
  id: string;
  name: string;
  parent_id: string | null;
  note: string | null;
};

export default async function DepartmentsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("departments")
    .select("id, name, parent_id, note")
    .order("name");
  return <DepartmentsUI rows={(data ?? []) as Dept[]} />;
}
