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

export default function BudgetSelect() {
  const { data, error, isLoading } = api.budget.getUserBudgets.useQuery();

  if (error) {
    return "ERROR LOADING BUDGETS";
  }

  if (isLoading || !data) {
    return <Spinner />;
  }

  return (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a budget" />
      </SelectTrigger>
      <SelectContent>
        {data.map((budget) => (
          <SelectItem value={budget.id} key={budget.id}>
            {budget.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
