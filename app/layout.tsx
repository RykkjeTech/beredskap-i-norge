import "./globals.css";

export const metadata = {
  title: "User Management",
  description: "Generated by create next app",
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
