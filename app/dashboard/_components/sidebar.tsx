"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calculator,
  CalendarDays,
  Mailbox,
  FileText,
  BookOpenText,
  Users,
  Settings,
} from "lucide-react";

const items = [
  { href: "/dashboard", label: "Главная", Icon: LayoutDashboard, exact: true },
  { href: "/dashboard/tax", label: "Налоги", Icon: Calculator },
  { href: "/dashboard/calendar", label: "Календарь ФНО", Icon: CalendarDays },
  { href: "/dashboard/correspondence", label: "Корреспонденция", Icon: Mailbox },
  { href: "/dashboard/documents", label: "Документы", Icon: FileText },
  { href: "/dashboard/hr", label: "Кадры", Icon: Users },
  { href: "/dashboard/accounting", label: "Бухгалтерия", Icon: BookOpenText },
  { href: "/dashboard/settings", label: "Настройки", Icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 overflow-y-auto px-3 py-4">
      <div className="px-2 pb-2 font-mono text-[10px] uppercase text-[color:var(--ink-mute)]">
        Разделы
      </div>
      <ul className="grid gap-1">
        {items.map(({ href, label, Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-[14px] transition-colors ${
                  active
                    ? "bg-[color:var(--ink)] text-white"
                    : "text-[color:var(--ink-soft)] hover:bg-[color:var(--rule)] hover:text-[color:var(--ink)]"
                }`}
              >
                <Icon className="h-[17px] w-[17px]" strokeWidth={1.6} />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
