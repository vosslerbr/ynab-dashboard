"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { api } from "@/trpc/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export function BudgetDropdown() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: budgets, isLoading } = api.budget.getUserBudgets.useQuery();

  if (isLoading || !budgets) {
    return <Spinner className="size-4" />;
  }

  if (budgets.length === 0) {
    return (
      <Link
        href="/settings/link"
        className="text-sm font-medium hover:underline"
      >
        Link Budget
      </Link>
    );
  }

  // Extract current budget ID from pathname
  const currentBudgetId = pathname?.split("/")[1];
  const currentBudget = budgets.find((b) => b.id === currentBudgetId);

  return (
    <Select
      value={currentBudgetId}
      onValueChange={(value) => {
        router.push(`/${value}`);
      }}
    >
      <SelectTrigger className="w-[200px] border-white/20 bg-white text-slate-900 hover:bg-slate-100">
        <SelectValue placeholder="Select budget">
          {currentBudget?.name ?? "Select budget"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {budgets.map((budget) => (
          <SelectItem key={budget.id} value={budget.id}>
            {budget.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
