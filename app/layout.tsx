import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nexo — Peer-to-peer learning",
  description: "Connect with mentors and learners across a structured skill catalog.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
