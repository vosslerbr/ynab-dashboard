"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { BudgetSummary } from "ynab";
import { z } from "zod";

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
  const [showConfirmation, setShowConfirmation] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      selectedBudgetIds: existingYnabBudgetIds,
    },
  });

  const mutation = api.budget.linkBudgets.useMutation({
    onSuccess: () => {
      toast.success("Budgets linked!");
      router.push("/settings");
    },
    onError: (e) => {
      toast.error("Failed to link budgets");
      console.error(e);
    },
  });

  function onSubmit() {
    setShowConfirmation(true);
  }

  function handleConfirmAction() {
    mutation.mutate(form.getValues("selectedBudgetIds"));
  }

  return (
    <>
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
      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Any budgets you deselected will be unlinked, and their categories
              removed from this application.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowConfirmation(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmAction}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
