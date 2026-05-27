import { HrTabs } from "./_components/tabs";

export default function HrLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="mb-6">
        <div className="eyebrow mb-2">Кадры</div>
        <h1 className="text-[34px] font-semibold leading-tight">
          HR-учёт компании
        </h1>
      </div>
      <HrTabs />
      <div className="mt-6">{children}</div>
    </div>
  );
}
