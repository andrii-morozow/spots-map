import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "../styles/global.css";

export const metadata: Metadata = {
  title: "Spots Map",
  description: "Admin spot management app",
};

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${inter.className} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ClerkProvider>{children}</ClerkProvider>
      </body>
    </html>
  );
}
