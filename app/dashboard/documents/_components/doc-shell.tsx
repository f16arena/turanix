"use client";

import { Printer } from "lucide-react";

export function PrintToolbar({ title }: { title: string }) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3 print:hidden">
      <div className="font-mono text-[11px] uppercase text-[color:var(--ink-mute)]">
        {title}
      </div>
      <button
        type="button"
        onClick={() => window.print()}
        className="button-primary !min-h-[40px] !text-[13px]"
      >
        <Printer className="h-4 w-4" />
        Печать / PDF
      </button>
    </div>
  );
}
