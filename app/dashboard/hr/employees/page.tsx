import Link from "next/link";
import { Plus, UserPlus } from "lucide-react";
import { createClient } from "../../../_lib/supabase/server";
import type { Employee, Department } from "./_types";
import { EmployeesList } from "./_list";

export default async function EmployeesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; dept?: string }>;
}) {
  const { q = "", status = "active", dept = "" } = await searchParams;
  const supabase = await createClient();

  let query = supabase.from("employees").select("*").order("name");
  if (status === "active" || status === "dismissed" || status === "vacation" || status === "sick") {
    query = query.eq("status", status);
  } else if (status === "all") {
    // no filter
  }
  if (dept) query = query.eq("department_id", dept);
  if (q) query = query.or(`name.ilike.%${q}%,iin.ilike.%${q}%,position.ilike.%${q}%`);

  const [{ data: emps }, { data: depts }] = await Promise.all([
    query,
    supabase.from("departments").select("id, name, parent_id").order("name"),
  ]);

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="font-mono text-[10px] uppercase text-[color:var(--ink-mute)]">
          Найдено: {emps?.length ?? 0}
        </div>
        <Link
          href="/dashboard/hr/employees/new"
          className="button-primary !min-h-[40px] !text-[13px]"
        >
          <UserPlus className="h-4 w-4" />
          Принять сотрудника
        </Link>
      </div>

      <EmployeesList
        rows={(emps ?? []) as Employee[]}
        departments={(depts ?? []) as Department[]}
        q={q}
        status={status}
        dept={dept}
      />
    </div>
  );
}
