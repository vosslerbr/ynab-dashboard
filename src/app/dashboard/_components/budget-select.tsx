"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { H4 } from "@/components/ui/typography";
import { api } from "@/trpc/react";
import LinkBudgetButton from "./link-budget-btn";

export default function BudgetSelect() {
  const { data, error, isLoading } = api.budget.getUserBudgets.useQuery();

  if (error) {
    return "ERROR LOADING BUDGETS";
  }

  if (isLoading || !data) {
    return <Spinner />;
  }

  if (data.length > 0) {
    return (
      <>
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
        <LinkBudgetButton />
      </>
    );
  }

  // TODO use this: https://ui.shadcn.com/docs/components/empty
  return (
    <>
      <H4>
        You have no linked budgets. To get started, link one or more of your
        YNAB budgets.
      </H4>
      <LinkBudgetButton />
    </>
  );
}
