import { PageTitle } from "@/app/_components/page-title";
import { Button } from "@/components/ui/button";
import { H2 } from "@/components/ui/typography";
import Link from "next/link";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <PageTitle title="Settings" />

      <div className="space-y-4">
        <H2>Budgets</H2>
        <Button asChild>
          <Link href="/settings/link">Update Linked Budgets</Link>
        </Button>
      </div>
    </div>
  );
}
