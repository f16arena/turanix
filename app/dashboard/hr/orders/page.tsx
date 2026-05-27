import { createClient } from "../../../_lib/supabase/server";
import { OrdersUI } from "./_ui";

export type Order = {
  id: string;
  employee_id: string;
  kind: string;
  number: string;
  date: string;
  effective_date: string | null;
  note: string | null;
  payload: Record<string, unknown>;
};

export type OrderEmp = { id: string; name: string };

export default async function OrdersPage() {
  const supabase = await createClient();
  const [{ data: orders }, { data: emps }, { data: deps }] = await Promise.all([
    supabase
      .from("hr_orders")
      .select("id, employee_id, kind, number, date, effective_date, note, payload")
      .order("date", { ascending: false })
      .limit(200),
    supabase
      .from("employees")
      .select("id, name")
      .order("name"),
    supabase.from("departments").select("id, name").order("name"),
  ]);

  return (
    <OrdersUI
      orders={(orders ?? []) as Order[]}
      employees={(emps ?? []) as OrderEmp[]}
      departments={(deps ?? []) as { id: string; name: string }[]}
    />
  );
}
