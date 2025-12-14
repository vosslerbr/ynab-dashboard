import { H1 } from "@/components/ui/typography";
import { api } from "@/trpc/server";

export default async function Page() {
  const budgets = await api.budget.getUserYnabBudgets();

  // TODO this should be a form
  // with checkboxes for each budget option
  // on submit, send array of budget ids to new tRPC proc
  // proc should fetch budgets from YNAB and
  // ADD any in array but not in DB,
  // UPDATE any in array and in DB,
  // DELETE any in DB that are not in the array
  // then, redirect user to /dashboard

  return (
    <>
      <H1>Link Your YNAB Budgets</H1>
      {budgets.map((budget) => (
        <p key={budget.id}>{budget.name}</p>
      ))}
    </>
  );
}
