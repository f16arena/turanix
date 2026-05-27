"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/dashboard/hr/employees", label: "Сотрудники" },
  { href: "/dashboard/hr/departments", label: "Отделы" },
  { href: "/dashboard/hr/positions", label: "Должности" },
  { href: "/dashboard/hr/orders", label: "Приказы" },
  { href: "/dashboard/hr/absences", label: "Отпуска" },
  { href: "/dashboard/hr/staffing", label: "Штатка" },
];

export function HrTabs() {
  const pathname = usePathname();
  return (
    <nav className="-mx-1 flex flex-wrap gap-1 border-b border-[color:var(--rule)]">
      {tabs.map((t) => {
        const active = pathname.startsWith(t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`relative rounded-t-md px-4 py-2.5 text-[13.5px] transition-colors ${
              active
                ? "-mb-px border border-[color:var(--rule)] border-b-white bg-white font-semibold text-[color:var(--ink)]"
                : "text-[color:var(--ink-mute)] hover:text-[color:var(--ink)]"
            }`}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
