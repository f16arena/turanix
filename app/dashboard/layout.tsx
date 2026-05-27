import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "../_lib/supabase/server";
import { getCurrentOrg } from "../_lib/org";
import { Sidebar } from "./_components/sidebar";
import { OrgSwitcher } from "./_components/org-switcher";
import { logout } from "../(auth)/actions";

const ROLE_LABEL: Record<string, string> = {
  owner: "Владелец",
  admin: "Администратор",
  accountant: "Бухгалтер",
  hr: "HR",
  manager: "Менеджер",
  viewer: "Наблюдатель",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const currentOrg = await getCurrentOrg();
  const { data: memberships } = await supabase
    .from("memberships")
    .select("organization_id, role, organizations(name)")
    .order("created_at", { foreignTable: "organizations", ascending: true });

  type OrgOpt = { id: string; name: string; role: string };
  const orgs: OrgOpt[] = (memberships ?? []).map((m) => {
    const rel = m.organizations as unknown as { name?: string } | { name?: string }[] | null;
    const item = Array.isArray(rel) ? rel[0] : rel;
    return {
      id: m.organization_id,
      name: item?.name ?? "—",
      role: m.role,
    };
  });

  return (
    <div className="flex min-h-screen bg-[#f4f5ef]">
      <aside className="hidden w-[268px] shrink-0 border-r border-[color:var(--rule)] bg-white/72 lg:flex lg:flex-col">
        <div className="flex h-[70px] items-center gap-3 border-b border-[color:var(--rule)] px-5">
          <Link href="/" className="flex items-center">
            <Image
              src="/brand/turanix-logo-full.png"
              alt="Turanix"
              width={310}
              height={65}
              className="h-7 w-auto max-w-[150px]"
            />
          </Link>
        </div>
        <Sidebar />
        <div className="mt-auto border-t border-[color:var(--rule)] p-4">
          <div className="font-mono text-[10px] uppercase text-[color:var(--ink-mute)]">
            {ROLE_LABEL[currentOrg?.role ?? "viewer"]}
          </div>
          <div className="mt-1.5 truncate text-[13px] font-semibold text-[color:var(--ink)]">
            {currentOrg?.name ?? "Без организации"}
          </div>
          <div className="mt-0.5 truncate text-[11px] text-[color:var(--ink-soft)]">
            {user.email}
          </div>
          {orgs.length > 1 && currentOrg && (
            <div className="mt-3">
              <OrgSwitcher options={orgs} currentId={currentOrg.id} />
            </div>
          )}
          <form action={logout} className="mt-3">
            <button
              type="submit"
              className="w-full rounded-md border border-[color:var(--rule)] bg-white px-3 py-2 text-[12px] text-[color:var(--ink-soft)] transition-colors hover:border-[color:var(--ink)] hover:text-[color:var(--ink)]"
            >
              Выйти
            </button>
          </form>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-[64px] items-center justify-between border-b border-[color:var(--rule)] bg-white/72 px-5 lg:px-8">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="lg:hidden"
              aria-label="На главную кабинета"
            >
              <Image
                src="/brand/turanix-mark.png"
                alt="Turanix"
                width={32}
                height={32}
                className="h-8 w-auto"
              />
            </Link>
            <span className="font-mono text-[10px] uppercase text-[color:var(--ink-mute)]">
              Бизнес-помощник / ТОО ОУР
            </span>
          </div>
          <Link
            href="/"
            className="font-mono text-[10px] uppercase text-[color:var(--ink-mute)] hover:text-[color:var(--ink)]"
          >
            ← Сайт
          </Link>
        </header>
        <main className="flex-1 px-5 py-7 lg:px-8 lg:py-9">{children}</main>
      </div>
    </div>
  );
}
