import { Button } from "@/components/ui/button";
import { H1, H2 } from "@/components/ui/typography";
import Link from "next/link";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <H1>Settings</H1>

      <div className="space-y-4">
        <H2>Budgets</H2>
        <Button asChild>
          <Link href="/dashboard/settings/link">Link Budget</Link>
        </Button>
      </div>
    </div>
  );
}
