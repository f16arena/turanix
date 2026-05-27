import Link from "next/link";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-[color:var(--rule)]">
        <div className="container-wide flex h-[70px] items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/brand/turanix-logo-full.png"
              alt="Turanix"
              width={310}
              height={65}
              priority
              className="h-8 w-auto max-w-[150px] sm:max-w-[188px]"
            />
          </Link>
          <Link
            href="/"
            className="font-mono text-[11px] uppercase text-[color:var(--ink-mute)] hover:text-[color:var(--ink)]"
          >
            На главную
          </Link>
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center px-5 py-12">
        <div className="surface w-full max-w-[440px] p-7 sm:p-9">{children}</div>
      </main>
    </div>
  );
}
