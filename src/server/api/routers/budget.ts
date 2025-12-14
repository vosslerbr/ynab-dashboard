import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const budgetRouter = createTRPCRouter({
  getUserBudgets: protectedProcedure.query(async ({ ctx }) => {
    const budgets = await ctx.db.budget.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });

    return budgets;
  }),
});
