import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "../../../../../_lib/supabase/server";
import { getCurrentOrg } from "../../../../../_lib/org";
import { EmployeeForm } from "../../_form";
import type { Department, Employee, Position } from "../../_types";
import { AvatarUpload } from "./_avatar";

export default async function EditEmployeePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const org = await getCurrentOrg();

  const [{ data }, { data: deps }, { data: positions }] = await Promise.all([
    supabase.from("employees").select("*").eq("id", id).maybeSingle(),
    supabase.from("departments").select("id, name, parent_id").order("name"),
    supabase
      .from("positions")
      .select("id, name, department_id, salary_min, salary_max")
      .order("name"),
  ]);

  if (!data) notFound();

  let signedUrl: string | null = null;
  if (data.photo_url) {
    const { data: signed } = await supabase.storage
      .from("avatars")
      .createSignedUrl(data.photo_url, 60 * 60);
    signedUrl = signed?.signedUrl ?? null;
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href={`/dashboard/hr/employees/${id}`}
          className="font-mono text-[11px] uppercase text-[color:var(--ink-mute)] hover:text-[color:var(--ink)]"
        >
          ← К карточке
        </Link>
        <h2 className="mt-3 text-[26px] font-semibold leading-tight">
          Редактирование сотрудника
        </h2>
      </div>
      {org && (
        <div className="mb-5">
          <AvatarUpload
            orgId={org.id}
            employeeId={id}
            initialUrl={signedUrl}
          />
        </div>
      )}
      <EmployeeForm
        mode="edit"
        initial={data as Employee}
        departments={(deps ?? []) as Department[]}
        positions={(positions ?? []) as Position[]}
      />
    </div>
  );
}
