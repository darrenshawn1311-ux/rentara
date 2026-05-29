import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "@/components/shared/QueryProvider";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { IntentProvider } from "@/lib/IntentContext";

export const metadata: Metadata = {
  title: "Rentara — Jakarta Rental Market. Finally Fixed.",
  description:
    "Verified listings. Real agents. Zero scams. Find your perfect Jakarta rental with Rentara.",
  keywords: [
    "Jakarta rental",
    "apartment Jakarta",
    "rumah sewa Jakarta",
    "verified listings",
    "SCBD",
    "Kemang",
    "Menteng",
  ],
  openGraph: {
    title: "Rentara — Jakarta Rental Market. Finally Fixed.",
    description: "Verified listings. Real agents. Zero scams.",
    type: "website",
    locale: "en_ID",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <IntentProvider>
            <QueryProvider>{children}</QueryProvider>
          </IntentProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
