import { api } from "@/trpc/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const budgets = await api.budget.getUserBudgets();

  if (budgets.length === 0) {
    redirect("/settings/link");
  }

  if (budgets.length === 1) {
    redirect(`/${budgets[0]!.id}`);
  }

  // Multiple budgets - show budget selector
  redirect("/select-budget");
}
