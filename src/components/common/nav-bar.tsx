import { H1 } from "@/components/ui/typography";
import Link from "next/link";
import SignInOutButton from "./sign-in-out-btn";

export default function NavBar() {
  return (
    <div className="bg-primary text-primary-foreground">
      <div className="m-auto flex max-w-7xl items-center justify-between p-4">
        <H1>YNAB Dashboard</H1>
        <nav>
          <ul className="flex flex-row items-center gap-8">
            <li>
              <Link href="/">Settings</Link>
            </li>
            <li>
              <SignInOutButton />
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
