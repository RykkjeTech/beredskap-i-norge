import "./page.css";
import { getSession } from "@/app/supabase-server";
import AuthUI from "./AuthUI";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function SignIn() {
  return redirect("/");

  const session = await getSession();

  if (session) {
    return redirect("/account");
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen w-full px-2">
      <div className="flex flex-col space-y-4 max-w-lg w-full">
        <div className="flex flex-col space-y-4">
          <h1 className="text-4xl font-bold text-center">Beredskap i Norge</h1>
          <p className="text-center">
            Logg inn for å se kart over beredskap i Norge.
          </p>
        </div>
        <AuthUI />
      </div>
      <div className="absolute top-0 right-0 flex justify-center items-center p-4">
        <Link href="/">Gå til kart</Link>
      </div>
    </div>
  );
}
