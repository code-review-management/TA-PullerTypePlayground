import type { Metadata } from "next";
import { Roboto } from "next/font/google";

import "@globals/styles/globals.css";
import "@globals/styles/colors.css";
import "@globals/styles/spacers.css";
import "@globals/styles/typography.css"

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CRMT",
  description: "Code review management tool.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.variable}>{children}</body>
    </html>
  );
}
