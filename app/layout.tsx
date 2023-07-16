import "./globals.css";
import { Metadata } from "next";
import SupabaseProvider from "./supabase-provider";

global.XMLHttpRequest = require("xhr2");

export const metadata: Metadata = {
  title: "Beredskap i Norge",
  description:
    "Offentlige tilfluktsrom i Norge. Tilfluktsrom er permanente beskyttelsesrom som skal verne befolkningen mot skader ved krigshandlinger. Offentlige tilfluktsrom er for befolkningen i et område og er bygget i byer og større tettsteder, samt i boligområder hvor dekningen av private tilfluktsrom ikke er tilfredsstillende.",
  authors: [
    {
      name: "Rykkje Technologies Team",
      url: "https://www.rykkje.tech",
    },
  ],
  publisher: "Rykkje Technologies AS",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nb">
      <body>
        <SupabaseProvider>
          <main>{children}</main>
        </SupabaseProvider>
      </body>
    </html>
  );
}
