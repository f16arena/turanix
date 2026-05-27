import { createClient } from "../../../_lib/supabase/server";
import { getCurrentOrg } from "../../../_lib/org";
import { TeamUI } from "./_ui";

export type Member = {
  id: string;
  user_id: string;
  role: "owner" | "admin" | "accountant" | "hr" | "manager" | "viewer";
  invited_email: string | null;
  created_at: string;
};

export default async function TeamPage() {
  const supabase = await createClient();
  const org = await getCurrentOrg();

  if (!org) {
    return (
      <p className="py-8 text-center text-[14px] text-[color:var(--ink-soft)]">
        Нет активной организации.
      </p>
    );
  }

  const { data } = await supabase
    .from("memberships")
    .select("id, user_id, role, invited_email, created_at")
    .eq("organization_id", org.id)
    .order("created_at", { ascending: true });

  return (
    <TeamUI
      currentRole={org.role}
      rows={(data ?? []) as Member[]}
    />
  );
}
