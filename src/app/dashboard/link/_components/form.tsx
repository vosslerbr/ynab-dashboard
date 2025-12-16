"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import type { BudgetSummary } from "ynab";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const formSchema = z.object({
  selectedBudgetIds: z.array(z.string()),
});

export default function BudgetLinkForm({
  ynabBudgets,
  existingYnabBudgetIds,
}: {
  ynabBudgets: BudgetSummary[];
  existingYnabBudgetIds: string[];
}) {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      selectedBudgetIds: existingYnabBudgetIds,
    },
  });

  const mutation = api.budget.linkBudgets.useMutation({
    onSuccess: () => {
      toast.success("Budgets linked!");
      router.back();
    },
    onError: (e) => {
      toast.error("Failed to link budgets");
      console.error(e);
    },
  });

  function onSubmit({ selectedBudgetIds }: z.infer<typeof formSchema>) {
    mutation.mutate(selectedBudgetIds);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="selectedBudgetIds"
          render={({ field }) => (
            <FormItem>
              <div className="space-y-3 rounded-lg border p-4">
                {ynabBudgets.map((ynabBudget) => (
                  <FormItem
                    key={ynabBudget.id}
                    className="flex flex-row items-start space-y-0 space-x-3"
                  >
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(ynabBudget.id)}
                        onCheckedChange={(checked) => {
                          return checked
                            ? field.onChange([...field.value, ynabBudget.id])
                            : field.onChange(
                                field.value?.filter(
                                  (value) => value !== ynabBudget.id,
                                ),
                              );
                        }}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="cursor-pointer font-normal">
                        {ynabBudget.name}
                      </FormLabel>
                    </div>
                  </FormItem>
                ))}
              </div>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Save</Button>
      </form>
    </Form>
  );
}
