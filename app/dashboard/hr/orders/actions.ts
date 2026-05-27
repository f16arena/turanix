"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../../../_lib/supabase/server";
import { requireCurrentOrgId } from "../../../_lib/org";

type OrderKind =
  | "hire"
  | "dismiss"
  | "transfer"
  | "promotion"
  | "salary_change"
  | "vacation"
  | "sick"
  | "reprimand"
  | "award";

export async function createOrder(formData: FormData) {
  const supabase = await createClient();
  const organization_id = await requireCurrentOrgId();

  const employee_id = String(formData.get("employee_id") ?? "");
  const kind = String(formData.get("kind") ?? "hire") as OrderKind;
  const date = String(formData.get("date") ?? new Date().toISOString().slice(0, 10));
  const effective_date = String(formData.get("effective_date") ?? "") || null;
  const note = String(formData.get("note") ?? "").trim() || null;
  const newSalary = Number(formData.get("new_salary") ?? 0) || 0;
  const newPosition = String(formData.get("new_position") ?? "").trim() || null;
  const newDepartment = String(formData.get("new_department_id") ?? "").trim() || null;

  if (!employee_id) return;

  const year = new Date(date).getFullYear();
  const { count } = await supabase
    .from("hr_orders")
    .select("*", { count: "exact", head: true })
    .gte("date", `${year}-01-01`)
    .lte("date", `${year}-12-31`);
  const seq = String((count ?? 0) + 1).padStart(3, "0");
  const number = `${prefixForKind(kind)}-${year}-${seq}`;

  const payload: Record<string, unknown> = {};
  if (newSalary) payload.new_salary = newSalary;
  if (newPosition) payload.new_position = newPosition;
  if (newDepartment) payload.new_department = newDepartment;

  const { data: ord } = await supabase
    .from("hr_orders")
    .insert({
      organization_id,
      employee_id,
      kind,
      number,
      date,
      effective_date,
      payload,
      note,
    })
    .select("id")
    .single();

  // Применяем изменения к сотруднику и пишем историю
  const empPatch: Record<string, unknown> = {};
  if (kind === "dismiss") {
    empPatch.status = "dismissed";
    empPatch.dismissal_date = effective_date ?? date;
    empPatch.dismissal_reason = note;
  } else if (kind === "salary_change" && newSalary) {
    empPatch.salary = newSalary;
  } else if (kind === "promotion") {
    if (newSalary) empPatch.salary = newSalary;
    if (newPosition) empPatch.position = newPosition;
  } else if (kind === "transfer") {
    if (newPosition) empPatch.position = newPosition;
    if (newDepartment) empPatch.department_id = newDepartment;
  } else if (kind === "vacation") {
    empPatch.status = "vacation";
  } else if (kind === "sick") {
    empPatch.status = "sick";
  }

  if (Object.keys(empPatch).length > 0) {
    await supabase.from("employees").update(empPatch).eq("id", employee_id);
  }

  await supabase.from("employee_history").insert({
    organization_id,
    employee_id,
    kind,
    date: effective_date ?? date,
    details: payload,
    order_id: ord?.id ?? null,
  });

  revalidatePath("/dashboard/hr/orders");
  revalidatePath(`/dashboard/hr/employees/${employee_id}`);
  revalidatePath("/dashboard/hr/employees");
}

export async function deleteOrder(id: string) {
  const supabase = await createClient();
  await supabase.from("hr_orders").delete().eq("id", id);
  revalidatePath("/dashboard/hr/orders");
}

function prefixForKind(k: OrderKind) {
  return ({
    hire: "ПР",
    dismiss: "УВ",
    transfer: "ПЕР",
    promotion: "ПОВ",
    salary_change: "ОКЛ",
    vacation: "ОТП",
    sick: "БЛ",
    reprimand: "ЗАМ",
    award: "НАГ",
  } as Record<OrderKind, string>)[k];
}
