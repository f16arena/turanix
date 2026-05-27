"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/dashboard/accounting/dashboard", label: "Дашборд" },
  { href: "/dashboard/accounting/transactions", label: "Доходы/Расходы" },
  { href: "/dashboard/accounting/cash", label: "Касса" },
  { href: "/dashboard/accounting/counterparties", label: "Контрагенты" },
  { href: "/dashboard/accounting/payroll", label: "Зарплата" },
];

export function AccountingTabs() {
  const pathname = usePathname();
  return (
    <nav className="-mx-1 flex flex-wrap gap-1 border-b border-[color:var(--rule)] pb-0">
      {tabs.map((t) => {
        const active = pathname.startsWith(t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`relative rounded-t-md px-4 py-2.5 text-[13.5px] transition-colors ${
              active
                ? "bg-white text-[color:var(--ink)] border border-[color:var(--rule)] border-b-white -mb-px font-semibold"
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
