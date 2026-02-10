"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { category } from "generated/prisma/client";
import { Cell, Pie, PieChart } from "recharts";

interface CategoryDonutChartProps {
  category: category;
  currency: string;
}

function formatCurrency(amount: bigint, currency: string): string {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  });
  // Convert from YNAB's milliunits (bigint) to regular currency
  return formatter.format(Number(amount) / 1000);
}

export function CategoryDonutChart({
  category,
  currency,
}: CategoryDonutChartProps) {
  const { balance, budgeted, activity } = category;

  const spentPercent = Math.round(
    ((Number(activity) * -1) / Number(budgeted)) * 100,
  );

  const remaining = budgeted + activity;
  const remainingPercent = 100 - Math.round(spentPercent);

  // Determine color based on spending level
  const getSpentColor = () => {
    if (spentPercent < 35) return "hsl(142, 76%, 36%)"; // Green
    if (spentPercent < 80) return "hsl(48, 96%, 53%)"; // Yellow
    return "hsl(0, 84%, 60%)"; // Red
  };

  const data = [
    { name: "spent", value: Number(activity) * -1, color: "var(--muted)" },
    {
      name: "remaining",
      value: Number(remaining),
      color: getSpentColor(),
    },
  ];

  const chartConfig = {
    spent: { label: "Spent" },
    remaining: { label: "Remaining" },
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-32 w-32">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              innerRadius={35}
              outerRadius={50}
              paddingAngle={0}
              dataKey="value"
              nameKey="name"
              strokeWidth={0}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        {/* Center text showing percentage remaining */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-sm font-semibold">{remainingPercent}%</span>
        </div>
      </div>
      <div className="text-muted-foreground mt-2 text-center text-xs">
        <div>{formatCurrency(remaining, currency)} remaining</div>
        <div>
          of {formatCurrency(balance > budgeted ? balance : budgeted, currency)}
        </div>
      </div>
    </div>
  );
}
