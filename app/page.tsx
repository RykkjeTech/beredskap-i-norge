import { Metadata } from "next";
import { MapComponent } from "./map-component";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "./database.types";

export const metadata: Metadata = {
  viewport: {
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    minimumScale: 1,
    width: "device-width",
    height: "device-height",
  },
};

export default async function Page() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();
  return <MapComponent session={session} />;
}
