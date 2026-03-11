import type { Metadata } from "next";
import { Roboto, Roboto_Mono } from "next/font/google";

import Providers from "./providers";
import ToastMessage from "@components/ToastMessage/ToastMessage";

import "@globals/styles/globals.css";
import "@globals/styles/colors.css";
import "@globals/styles/spacers.css";
import "@globals/styles/typography.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
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
      <Providers>
        <body className={`${roboto.variable} ${robotoMono.variable}`}>
          {children}
          <ToastMessage />
        </body>
      </Providers>
    </html>
  );
}
