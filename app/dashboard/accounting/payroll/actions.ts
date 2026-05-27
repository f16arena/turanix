"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../../../_lib/supabase/server";

// Сотрудники теперь ведутся в /dashboard/hr/employees.
// Здесь оставлен только delete как fallback на случай старых ссылок.

export async function deleteEmployee(id: string) {
  const supabase = await createClient();
  await supabase.from("employees").delete().eq("id", id);
  revalidatePath("/dashboard/accounting/payroll");
  revalidatePath("/dashboard/hr/employees");
}
