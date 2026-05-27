import Link from "next/link";
import { CounterpartyForm } from "../_form";

export default function NewCounterpartyPage() {
  return (
    <div>
      <div className="mb-6">
        <Link
          href="/dashboard/accounting/counterparties"
          className="font-mono text-[11px] uppercase text-[color:var(--ink-mute)] hover:text-[color:var(--ink)]"
        >
          ← К списку
        </Link>
        <h2 className="mt-3 text-[26px] font-semibold leading-tight">
          Новый контрагент
        </h2>
      </div>
      <CounterpartyForm mode="create" />
    </div>
  );
}
