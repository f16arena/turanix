import { AccountingTabs } from "./_components/tabs";

export default function AccountingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="mb-6">
        <div className="eyebrow mb-2">Бухгалтерия</div>
        <h1 className="text-[34px] font-semibold leading-tight">
          Учёт компании
        </h1>
      </div>
      <AccountingTabs />
      <div className="mt-6">{children}</div>
    </div>
  );
}
