import type { Metadata } from "next";
import "../styles/global.css";

export const metadata: Metadata = {
  title: "Spots Map",
  description: "Admin spot management app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
