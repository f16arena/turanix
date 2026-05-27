import { createClient } from "../../../_lib/supabase/server";
import { StaffingUI } from "./_ui";

export type StaffRow = {
  id: string;
  department_id: string | null;
  position_id: string;
  planned_count: number;
  salary: number;
  note: string | null;
};

export default async function StaffingPage() {
  const supabase = await createClient();
  const [{ data: rows }, { data: deps }, { data: positions }, { data: emps }] =
    await Promise.all([
      supabase
        .from("staffing")
        .select("id, department_id, position_id, planned_count, salary, note"),
      supabase.from("departments").select("id, name").order("name"),
      supabase.from("positions").select("id, name").order("name"),
      supabase
        .from("employees")
        .select("id, position_id, department_id, status")
        .eq("status", "active"),
    ]);

  return (
    <StaffingUI
      rows={(rows ?? []) as StaffRow[]}
      departments={(deps ?? []) as { id: string; name: string }[]}
      positions={(positions ?? []) as { id: string; name: string }[]}
      employees={
        (emps ?? []) as {
          id: string;
          position_id: string | null;
          department_id: string | null;
          status: string;
        }[]
      }
    />
  );
}
