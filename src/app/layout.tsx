import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "@/components/shared/QueryProvider";

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
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
