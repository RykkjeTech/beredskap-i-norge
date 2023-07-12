import "./globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Beredskap i Norge",
  description: "Beredskap i Norge",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nb">
      <body>
        <div>{children}</div>
      </body>
    </html>
  );
}
