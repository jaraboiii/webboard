
import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import "./globals.css";

const prompt = Prompt({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ["latin", "thai"],
  variable: "--font-prompt",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Webboard - Healjai",
  description: "Webboard Community",
};

export default function RootLayout({
  children,
  auth,
}: Readonly<{
  children: React.ReactNode;
  auth: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body
        className={`${prompt.variable} font-sans antialiased`}
      >
        {children}
        {auth}
      </body>
    </html>
  );
}
