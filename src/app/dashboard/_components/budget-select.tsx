"use client";

import {
  Item,
  ItemActions,
  ItemContent,
  ItemTitle,
} from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";
import { H4 } from "@/components/ui/typography";
import { api } from "@/trpc/react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
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
      <div className="flex flex-col gap-8">
        <LinkBudgetButton />

        {data.map((budget) => (
          <Item asChild key={budget.id} variant="outline">
            <Link href={`/dashboard/${budget.id}`}>
              <ItemContent>
                <ItemTitle>{budget.name}</ItemTitle>
              </ItemContent>
              <ItemActions>
                <ChevronRight className="size-4" />
              </ItemActions>
            </Link>
          </Item>
        ))}
      </div>
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
