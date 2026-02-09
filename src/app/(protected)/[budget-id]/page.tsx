import { PageTitle } from "@/app/_components/page-title";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/server";
import Link from "next/link";
import { notFound } from "next/navigation";

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

  return (
    <>
      <PageTitle title={budget.name} subtitle="Budget Overview">
        <Button asChild>
          <Link href={`/${budgetId}/categories`}>Manage Categories</Link>
        </Button>
      </PageTitle>
      <div className="space-y-4">
        <p className="text-muted-foreground">
          This is a placeholder page for the budget details.
        </p>
      </div>
    </>
  );
}
