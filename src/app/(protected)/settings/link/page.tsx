import { PageTitle } from "@/app/_components/page-title";
import { api } from "@/trpc/server";
import BudgetLinkForm from "./_components/form";

export default async function Page() {
  const ynabBudgets = await api.budget.getUserYnabBudgets();
  const dbBudgets = await api.budget.getUserBudgets();

  const existingBudgetYnabIds = dbBudgets.map((b) => b.ynabId);

  return (
    <>
      <PageTitle
        title="Link Your YNAB Budgets"
        subtitle="Select which budgets you want to track"
      />
      <BudgetLinkForm
        ynabBudgets={ynabBudgets}
        existingYnabBudgetIds={existingBudgetYnabIds}
      />
    </>
  );
}
