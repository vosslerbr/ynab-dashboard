import { PageTitle } from "@/app/_components/page-title";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CategoryGrid } from "./_components/category-grid";

export default async function Page({
  params,
}: {
  params: Promise<{ "budget-id": string }>;
}) {
  const { "budget-id": budgetId } = await params;
  const budget = await api.budget.getBudgetById({ id: budgetId });

  if (!budget) {
    notFound();
  }

  const categories = await api.budget.getTrackedCategories({ budgetId });

  return (
    <>
      <PageTitle title={budget.name} subtitle="Budget Overview">
        <Button asChild>
          <Link href={`/${budgetId}/categories`}>Manage Categories</Link>
        </Button>
      </PageTitle>
      <CategoryGrid
        categories={categories}
        budgetId={budgetId}
        currency={budget.currency}
      />
    </>
  );
}
