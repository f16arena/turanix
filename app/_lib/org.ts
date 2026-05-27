import "server-only";
import { cookies } from "next/headers";
import { createClient } from "./supabase/server";

const ORG_COOKIE = "turanix:org";

export type CurrentOrg = {
  id: string;
  name: string;
  role:
    | "owner"
    | "admin"
    | "accountant"
    | "hr"
    | "manager"
    | "viewer";
};

/**
 * Возвращает текущую активную организацию пользователя. Если у пользователя
 * несколько организаций, можно переключаться через cookie `turanix:org`.
 * По умолчанию — первая по дате создания (обычно — owned).
 */
export async function getCurrentOrg(): Promise<CurrentOrg | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: memberships } = await supabase
    .from("memberships")
    .select("organization_id, role, organizations(name, created_at)")
    .order("created_at", { foreignTable: "organizations", ascending: true });

  if (!memberships || memberships.length === 0) return null;

  const cookieStore = await cookies();
  const preferred = cookieStore.get(ORG_COOKIE)?.value;
  const found =
    memberships.find((m) => m.organization_id === preferred) ?? memberships[0];

  type OrgRel = { name: string; created_at: string };
  const orgRel = (found.organizations as unknown) as OrgRel | OrgRel[] | null;
  const org = Array.isArray(orgRel) ? orgRel[0] : orgRel;
  return {
    id: found.organization_id,
    name: org?.name ?? "—",
    role: found.role as CurrentOrg["role"],
  };
}

/**
 * Требует наличие текущей организации; иначе бросает, чтобы не записать
 * данные «в никуда». Используется в server actions.
 */
export async function requireCurrentOrgId(): Promise<string> {
  const org = await getCurrentOrg();
  if (!org) throw new Error("Нет активной организации");
  return org.id;
}

export async function setCurrentOrg(orgId: string) {
  const cookieStore = await cookies();
  cookieStore.set(ORG_COOKIE, orgId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}
