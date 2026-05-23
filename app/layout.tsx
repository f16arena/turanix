import type { Metadata } from "next";
import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "./_components/smooth-scroll";
import { LanguageProvider } from "./_lib/i18n";

const display = Inter({
  variable: "--font-display",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const serif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Turanix — IT-разработка, автоматизация и AI-интеграции",
    template: "%s · Turanix",
  },
  description:
    "ТОО «Turanix» разрабатывает сайты, мобильные приложения, бизнес-автоматизацию, Telegram-интеграции и AI-консультантов для компаний в Казахстане.",
  metadataBase: new URL("https://turanix.kz"),
  alternates: {
    canonical: "/",
  },
  keywords: [
    "Turanix",
    "разработка сайтов Казахстан",
    "мобильные приложения",
    "автоматизация бизнеса",
    "Telegram бот",
    "AI консультант",
    "Усть-Каменогорск",
  ],
  openGraph: {
    title: "Turanix — IT-продукты для бизнеса",
    description:
      "Сайты, мобильные приложения, автоматизация бизнеса, Telegram-интеграции и AI-консультанты.",
    url: "https://turanix.kz",
    siteName: "Turanix",
    locale: "ru_KZ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Turanix — IT-продукты для бизнеса",
    description:
      "Разработка сайтов, мобильных приложений, автоматизации, Telegram и AI-интеграций.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${display.variable} ${serif.variable} ${mono.variable} h-full`}
    >
      <body className="relative flex min-h-full flex-col">
        <LanguageProvider>
          <SmoothScroll />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
