import Link from "next/link";
import { createClient } from "../../../../_lib/supabase/server";
import { EmployeeForm } from "../_form";
import type { Department, Position } from "../_types";

export default async function NewEmployeePage() {
  const supabase = await createClient();
  const [{ data: deps }, { data: positions }] = await Promise.all([
    supabase.from("departments").select("id, name, parent_id").order("name"),
    supabase
      .from("positions")
      .select("id, name, department_id, salary_min, salary_max")
      .order("name"),
  ]);

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/dashboard/hr/employees"
          className="font-mono text-[11px] uppercase text-[color:var(--ink-mute)] hover:text-[color:var(--ink)]"
        >
          ← К списку
        </Link>
        <h2 className="mt-3 text-[26px] font-semibold leading-tight">
          Приём сотрудника
        </h2>
      </div>
      <EmployeeForm
        mode="create"
        departments={(deps ?? []) as Department[]}
        positions={(positions ?? []) as Position[]}
      />
    </div>
  );
}
