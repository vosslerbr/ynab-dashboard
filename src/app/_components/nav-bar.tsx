import { H1 } from "@/components/ui/typography";
import { getSession } from "@/server/better-auth/server";
import Link from "next/link";
import SignInOutButton from "./sign-in-out-btn";

export default async function NavBar() {
  const session = await getSession();

  return (
    <div className="bg-primary text-primary-foreground">
      <div className="m-auto flex max-w-7xl items-center justify-between p-4">
        <Link href={session ? "/dashboard" : "/"}>
          <H1>YNAB Dashboard</H1>
        </Link>
        <nav>
          <ul className="flex flex-row items-center gap-8">
            {session && (
              <>
                <li>
                  <Link href="/dashboard">Dashboard</Link>
                </li>
                <li>
                  <Link href="/dashboard/settings">Settings</Link>
                </li>
              </>
            )}

            <li>
              <SignInOutButton />
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
