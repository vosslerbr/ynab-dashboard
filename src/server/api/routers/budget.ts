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
  getYnabCategories: protectedProcedure
    .input(z.object({ budgetId: z.string() }))
    .query(async ({ ctx, input }) => {
      const budget = await ctx.db.budget.findFirst({
        where: {
          id: input.budgetId,
          userId: ctx.session.user.id,
        },
      });

      if (!budget) {
        throw new Error("Budget not found");
      }

      const { data } = await ctx.ynabClient.categories.getCategories(
        budget.ynabId,
      );

      // Filter out hidden categories and categories in hidden groups
      const visibleCategoryGroups =
        data.category_groups?.filter(
          (group) => !group.hidden && !group.deleted,
        ) ?? [];

      const visibleCategories = visibleCategoryGroups.flatMap(
        (group) =>
          group.categories
            ?.filter((cat) => !cat.hidden && !cat.deleted)
            .map((cat) => ({
              ...cat,
              groupName: group.name,
            })) ?? [],
      );

      return visibleCategories;
    }),
  getTrackedCategories: protectedProcedure
    .input(z.object({ budgetId: z.string() }))
    .query(async ({ ctx, input }) => {
      const budget = await ctx.db.budget.findFirst({
        where: {
          id: input.budgetId,
          userId: ctx.session.user.id,
        },
      });

      if (!budget) {
        throw new Error("Budget not found");
      }

      const categories = await ctx.db.category.findMany({
        where: {
          budgetId: input.budgetId,
        },
      });

      return categories;
    }),
  linkCategories: protectedProcedure
    .input(
      z.object({
        budgetId: z.string(),
        categoryIds: z.array(z.string()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const budget = await ctx.db.budget.findFirst({
        where: {
          id: input.budgetId,
          userId: ctx.session.user.id,
        },
      });

      if (!budget) {
        throw new Error("Budget not found");
      }

      // Delete categories that are no longer selected
      await ctx.db.category.deleteMany({
        where: {
          budgetId: input.budgetId,
          ynabId: { notIn: input.categoryIds },
        },
      });

      // Fetch current category data from YNAB
      const { data } = await ctx.ynabClient.categories.getCategories(
        budget.ynabId,
      );
      const ynabCategories =
        data.category_groups?.flatMap(
          (group) =>
            group.categories?.map((cat) => ({
              ...cat,
              groupName: group.name,
            })) ?? [],
        ) ?? [];

      const ynabCategoriesById = ynabCategories.reduce(
        (acc, cat) => {
          acc[cat.id] = cat;
          return acc;
        },
        {} as Record<string, (typeof ynabCategories)[number]>,
      );

      // Upsert selected categories
      for (const categoryId of input.categoryIds) {
        const ynabCategory = ynabCategoriesById[categoryId];
        if (!ynabCategory) continue;

        await ctx.db.category.upsert({
          where: {
            budgetId_ynabId: {
              budgetId: input.budgetId,
              ynabId: categoryId,
            },
          },
          create: {
            ynabId: categoryId,
            name: ynabCategory.name,
            groupName: ynabCategory.groupName,
            budgeted: ynabCategory.budgeted ?? 0,
            activity: ynabCategory.activity ?? 0,
            balance: ynabCategory.balance ?? 0,
            budgetId: input.budgetId,
          },
          update: {
            name: ynabCategory.name,
            groupName: ynabCategory.groupName,
            budgeted: ynabCategory.budgeted ?? 0,
            activity: ynabCategory.activity ?? 0,
            balance: ynabCategory.balance ?? 0,
          },
        });
      }
    }),
});
