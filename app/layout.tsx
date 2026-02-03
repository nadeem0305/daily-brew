import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Brew Daily",
  description: "track your daily mood!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-stone-50 text-stone-900 antialiased">{children}</body>
    </html>
  );
}
