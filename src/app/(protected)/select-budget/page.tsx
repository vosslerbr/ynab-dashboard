import { PageTitle } from "@/app/_components/page-title";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemTitle,
} from "@/components/ui/item";
import { api } from "@/trpc/server";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default async function SelectBudgetPage() {
  const budgets = await api.budget.getUserBudgets();

  return (
    <div className="space-y-8">
      <PageTitle
        title="Select a Budget"
        subtitle="Choose which budget you want to view"
      />

      <div className="flex flex-col gap-4">
        {budgets.map((budget) => (
          <Item asChild key={budget.id} variant="outline">
            <Link href={`/${budget.id}`}>
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
    </div>
  );
}
