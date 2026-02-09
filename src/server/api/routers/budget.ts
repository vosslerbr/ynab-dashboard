import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import type { BudgetSummary } from "ynab";
import { z } from "zod";

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
  getBudgetById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const budget = await ctx.db.budget.findFirst({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
      });

      return budget;
    }),
  linkBudgets: protectedProcedure
    .input(z.array(z.string()))
    .mutation(async ({ ctx, input: selectedYnabBudgetIds }) => {
      // TODO this should all probably be in a tranasction...

      await ctx.db.budget.deleteMany({
        where: {
          userId: ctx.session.user.id,
          ynabId: { notIn: selectedYnabBudgetIds },
        },
      });

      const { data: ynabBudgets } = await ctx.ynabClient.budgets.getBudgets();
      const ynabBudgetsById = ynabBudgets.budgets.reduce(
        (acc, curr) => {
          acc[curr.id] = curr;
          return acc;
        },
        {} as Record<string, BudgetSummary>,
      );

      for (const selectedId of selectedYnabBudgetIds) {
        const ynabBudget = ynabBudgetsById[selectedId];

        // TODO handle no ynab budget found (unlikely)
        if (!ynabBudget) continue;

        await ctx.db.budget.upsert({
          where: {
            userId: ctx.session.user.id,
            ynabId: selectedId,
          },
          create: {
            name: ynabBudget.name,
            serverKnowledge: 0,
            ynabId: selectedId,
            userId: ctx.session.user.id,
            currency: ynabBudget.currency_format?.iso_code,
            dateFormat: ynabBudget.date_format?.format,
          },
          update: {
            name: ynabBudget.name,
            currency: ynabBudget.currency_format?.iso_code,
            dateFormat: ynabBudget.date_format?.format,
          },
        });
      }
    }),
});
