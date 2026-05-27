export type EmploymentType = "full" | "part" | "combine" | "contract";
export type EmployeeStatus =
  | "active"
  | "dismissed"
  | "vacation"
  | "sick"
  | "maternity";

export type Employee = {
  id: string;
  name: string;
  last_name: string | null;
  first_name: string | null;
  middle_name: string | null;
  iin: string | null;
  birth_date: string | null;
  gender: "male" | "female" | null;
  citizenship: string | null;
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
  employment_type: EmploymentType;
  salary: number;
  start_date: string | null;
  contract_number: string | null;
  contract_date: string | null;
  dismissal_date: string | null;
  dismissal_reason: string | null;
  status: EmployeeStatus;
  is_resident: boolean;
  is_pensioner: boolean;
  is_disabled: boolean;
  has_many_children: boolean;
  payroll_iban: string | null;
  payroll_bank: string | null;
  photo_url: string | null;
  note: string | null;
};

export type Department = {
  id: string;
  name: string;
  parent_id: string | null;
};

export type Position = {
  id: string;
  name: string;
  department_id: string | null;
  salary_min: number;
  salary_max: number;
};

export const STATUS_LABEL: Record<EmployeeStatus, string> = {
  active: "Работает",
  dismissed: "Уволен",
  vacation: "Отпуск",
  sick: "Больничный",
  maternity: "Декрет",
};

export const STATUS_CLASS: Record<EmployeeStatus, string> = {
  active: "bg-[color:var(--accent-soft)] text-[color:var(--accent)]",
  dismissed: "bg-red-50 text-red-600",
  vacation: "bg-blue-50 text-blue-700",
  sick: "bg-amber-50 text-amber-700",
  maternity: "bg-purple-50 text-purple-700",
};

export const EMPLOYMENT_LABEL: Record<EmploymentType, string> = {
  full: "Основная",
  part: "Совместительство",
  combine: "Совмещение",
  contract: "ГПХ",
};

export function fullName(e: Pick<Employee, "last_name" | "first_name" | "middle_name" | "name">) {
  const parts = [e.last_name, e.first_name, e.middle_name].filter(Boolean);
  return parts.length ? parts.join(" ") : e.name;
}
