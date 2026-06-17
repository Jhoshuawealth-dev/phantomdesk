import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PhantomDesk",
  description: "The Private Agent Hiring Marketplace",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
