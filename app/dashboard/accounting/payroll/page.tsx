import { createClient } from "../../../_lib/supabase/server";
import { PayrollUI } from "./_ui";

export type Employee = {
  id: string;
  name: string;
  position: string | null;
  salary: number;
  start_date: string | null;
  status: "active" | "dismissed" | "vacation" | "sick" | "maternity";
  is_pensioner: boolean;
  is_disabled: boolean;
  has_many_children: boolean;
};

export default async function PayrollPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("employees")
    .select(
      "id, name, position, salary, start_date, status, is_pensioner, is_disabled, has_many_children",
    )
    .in("status", ["active", "vacation", "sick"])
    .order("name", { ascending: true });

  return <PayrollUI rows={(data ?? []) as Employee[]} />;
}
