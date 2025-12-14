import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const budgetRouter = createTRPCRouter({
  getUserYnabBudgets: protectedProcedure.query(async ({ ctx }) => {
    const { data } = await ctx.ynabClient.budgets.getBudgets();

    return data.budgets;
  }),
  getUserBudgets: protectedProcedure.query(async ({ ctx }) => {
    const budgets = await ctx.db.budget.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });

    return budgets;
  }),
});
