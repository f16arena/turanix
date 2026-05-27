"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "../../../_lib/supabase/server";
import { requireCurrentOrgId } from "../../../_lib/org";

type EmpInput = {
  last_name: string | null;
  first_name: string | null;
  middle_name: string | null;
  iin: string | null;
  birth_date: string | null;
  gender: "male" | "female" | null;
  citizenship: string;
  passport_series: string | null;
  passport_number: string | null;
  passport_issued_by: string | null;
  passport_issued_at: string | null;
  registration_address: string | null;
  actual_address: string | null;
  phone: string | null;
  email: string | null;
  education: string | null;
  position: string | null;
  position_id: string | null;
  department_id: string | null;
  employment_type: "full" | "part" | "combine" | "contract";
  salary: number;
  start_date: string | null;
  contract_number: string | null;
  contract_date: string | null;
  status: "active" | "dismissed" | "vacation" | "sick" | "maternity";
  is_resident: boolean;
  is_pensioner: boolean;
  is_disabled: boolean;
  has_many_children: boolean;
  payroll_iban: string | null;
  payroll_bank: string | null;
  note: string | null;
};

function parse(formData: FormData): EmpInput {
  const str = (k: string) => {
    const v = String(formData.get(k) ?? "").trim();
    return v || null;
  };
  const num = (k: string) => Number(formData.get(k) ?? 0) || 0;
  const bool = (k: string) => formData.get(k) === "on";

  const last_name = str("last_name");
  const first_name = str("first_name");
  const middle_name = str("middle_name");

  return {
    last_name,
    first_name,
    middle_name,
    iin: str("iin"),
    birth_date: str("birth_date"),
    gender: (str("gender") as "male" | "female" | null) ?? null,
    citizenship: str("citizenship") ?? "KZ",
    passport_series: str("passport_series"),
    passport_number: str("passport_number"),
    passport_issued_by: str("passport_issued_by"),
    passport_issued_at: str("passport_issued_at"),
    registration_address: str("registration_address"),
    actual_address: str("actual_address"),
    phone: str("phone"),
    email: str("email"),
    education: str("education"),
    position: str("position"),
    position_id: str("position_id"),
    department_id: str("department_id"),
    employment_type:
      (String(formData.get("employment_type") ?? "full") as EmpInput["employment_type"]),
    salary: num("salary"),
    start_date: str("start_date"),
    contract_number: str("contract_number"),
    contract_date: str("contract_date"),
    status:
      (String(formData.get("status") ?? "active") as EmpInput["status"]),
    is_resident: bool("is_resident"),
    is_pensioner: bool("is_pensioner"),
    is_disabled: bool("is_disabled"),
    has_many_children: bool("has_many_children"),
    payroll_iban: str("payroll_iban"),
    payroll_bank: str("payroll_bank"),
    note: str("note"),
  };
}

function nameFor(input: EmpInput) {
  const parts = [input.last_name, input.first_name, input.middle_name].filter(
    Boolean,
  );
  return parts.length ? parts.join(" ") : (input.iin ?? "Сотрудник");
}

export async function createEmployee(formData: FormData) {
  const supabase = await createClient();
  const organization_id = await requireCurrentOrgId();

  const input = parse(formData);
  const name = nameFor(input);

  const { data, error } = await supabase
    .from("employees")
    .insert({ organization_id, name, ...input })
    .select("id")
    .single();

  if (error || !data) return;

  await supabase.from("employee_history").insert({
    organization_id,
    employee_id: data.id,
    kind: "hire",
    date: input.start_date ?? new Date().toISOString().slice(0, 10),
    details: { salary: input.salary, position: input.position },
  });

  revalidatePath("/dashboard/hr/employees");
  redirect(`/dashboard/hr/employees/${data.id}`);
}

export async function updateEmployee(id: string, formData: FormData) {
  const supabase = await createClient();
  const input = parse(formData);
  const name = nameFor(input);

  await supabase
    .from("employees")
    .update({ name, ...input })
    .eq("id", id);

  revalidatePath("/dashboard/hr/employees");
  revalidatePath(`/dashboard/hr/employees/${id}`);
  redirect(`/dashboard/hr/employees/${id}`);
}

export async function deleteEmployee(id: string) {
  const supabase = await createClient();
  await supabase.from("employees").delete().eq("id", id);
  revalidatePath("/dashboard/hr/employees");
  redirect("/dashboard/hr/employees");
}

export async function setEmployeePhoto(id: string, photoPath: string | null) {
  const supabase = await createClient();
  await supabase
    .from("employees")
    .update({ photo_url: photoPath })
    .eq("id", id);
  revalidatePath(`/dashboard/hr/employees/${id}`);
  revalidatePath(`/dashboard/hr/employees/${id}/edit`);
}
