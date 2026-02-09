import { PageTitle } from "@/app/_components/page-title";
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ "budget-id": string; "category-id": string }>;
}) {
  const { "budget-id": budgetId, "category-id": categoryId } = await params;

  // Verify budget exists and belongs to user
  const budget = await api.budget.getBudgetById({ id: budgetId });
  if (!budget) {
    notFound();
  }

  // Get the category
  const categories = await api.budget.getTrackedCategories({ budgetId });
  const category = categories.find((c) => c.id === categoryId);

  if (!category) {
    notFound();
  }

  return (
    <>
      <PageTitle
        title={category.name}
        subtitle={`${budget.name} > ${category.groupName ?? "Uncategorized"}`}
      />
    </>
  );
}
