import { PageTitle } from "@/app/_components/page-title";
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";
import CategoryLinkForm from "./_components/category-link-form";

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

  const ynabCategories = await api.budget.getYnabCategories({ budgetId });
  const trackedCategories = await api.budget.getTrackedCategories({ budgetId });
  const trackedCategoryIds = trackedCategories.map((cat) => cat.ynabId);

  return (
    <>
      <PageTitle
        title="Manage Categories"
        subtitle={`Select which categories to track for ${budget.name}`}
      />
      <CategoryLinkForm
        budgetId={budgetId}
        ynabCategories={ynabCategories}
        trackedCategoryIds={trackedCategoryIds}
      />
    </>
  );
}
