"use client";

import { ChartContainer } from "@/components/ui/chart";
import { Cell, Pie, PieChart } from "recharts";

interface CategoryDonutChartProps {
  budgeted: bigint;
  balance: bigint;
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
  budgeted,
  balance,
  currency,
}: CategoryDonutChartProps) {
  // Calculate spent amount (budgeted - balance = spent)
  const spent = budgeted - balance;

  // Calculate percentages
  const total = budgeted > 0 ? budgeted : BigInt(1); // Avoid division by zero
  const rawSpentPercent = Number((spent * BigInt(100)) / total);

  console.log(rawSpentPercent);

  // Cap at 100% for display (when over budget)
  const spentPercent = Math.min(rawSpentPercent, 100);
  const remainingPercent = 100 - spentPercent;

  // Determine color based on spending level
  // Green when <= 50% spent, Yellow when 50-80% spent, Red when >= 80% spent
  const getSpentColor = () => {
    if (spentPercent <= 50) return "hsl(142, 76%, 36%)"; // Green
    if (spentPercent < 80) return "hsl(48, 96%, 53%)"; // Yellow
    return "hsl(0, 84%, 60%)"; // Red
  };

  const data = [
    { name: "Spent", value: spentPercent, color: getSpentColor() },
    {
      name: "Remaining",
      value: remainingPercent,
      color: "hsl(var(--muted))",
    },
  ];

  const chartConfig = {
    spent: { label: "Spent", color: getSpentColor() },
    remaining: { label: "Remaining", color: "hsl(var(--muted))" },
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-32 w-32">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={35}
              outerRadius={50}
              paddingAngle={2}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        {/* Center text showing percentage remaining */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-semibold">{remainingPercent}%</span>
        </div>
      </div>
      <div className="text-muted-foreground mt-2 text-center text-xs">
        <div>{formatCurrency(balance, currency)} remaining</div>
        <div>of {formatCurrency(budgeted, currency)}</div>
      </div>
    </div>
  );
}
