"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { category } from "generated/prisma/client";
import Link from "next/link";
import { CategoryDonutChart } from "./category-donut-chart";

interface CategoryGridProps {
  categories: category[];
  budgetId: string;
  currency: string;
}

export function CategoryGrid({
  categories,
  budgetId,
  currency,
}: CategoryGridProps) {
  if (categories.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-muted-foreground">
          No categories selected. Click &quot;Manage Categories&quot; to add
          some.
        </p>
      </div>
    );
  }

  // Group categories by groupName
  const grouped = categories.reduce(
    (acc, category) => {
      const group = category.groupName ?? "Uncategorized";
      (acc[group] ??= []).push(category);
      return acc;
    },
    {} as Record<string, category[]>,
  );

  return (
    <div className="space-y-8">
      {Object.entries(grouped).map(([groupName, groupCategories]) => (
        <div key={groupName}>
          <h2 className="mb-4 text-xl font-semibold">{groupName}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {groupCategories.map((category) => (
              <Link
                key={category.id}
                href={`/${budgetId}/${category.id}`}
                className="block transition-transform hover:scale-[1.02]"
              >
                <Card className="h-full">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{category.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CategoryDonutChart
                      category={category}
                      currency={currency}
                    />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
