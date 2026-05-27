import { SettingsTabs } from "./_tabs";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="mb-6">
        <div className="eyebrow mb-2">Настройки</div>
        <h1 className="text-[34px] font-semibold leading-tight">
          Управление организацией
        </h1>
      </div>
      <SettingsTabs />
      <div className="mt-6">{children}</div>
    </div>
  );
}
