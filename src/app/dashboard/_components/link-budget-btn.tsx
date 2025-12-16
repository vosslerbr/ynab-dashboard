import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LinkBudgetButton() {
  return (
    <Button asChild>
      <Link href={"/dashboard/link"}>Link Budget</Link>
    </Button>
  );
}
