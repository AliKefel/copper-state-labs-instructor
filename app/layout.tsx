import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Copper State Labs",
  description: "Copper State Labs base repo for CIS 591",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
