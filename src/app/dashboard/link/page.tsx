import { H1 } from "@/components/ui/typography";
import { api } from "@/trpc/server";
import BudgetLinkForm from "./_components/form";

export default async function Page() {
  const ynabBudgets = await api.budget.getUserYnabBudgets();
  const dbBudgets = await api.budget.getUserBudgets();

  const existingBudgetYnabIds = dbBudgets.map((b) => b.ynabId);

  return (
    <>
      <H1>Link Your YNAB Budgets</H1>
      <BudgetLinkForm
        ynabBudgets={ynabBudgets}
        existingYnabBudgetIds={existingBudgetYnabIds}
      />
    </>
  );
}
