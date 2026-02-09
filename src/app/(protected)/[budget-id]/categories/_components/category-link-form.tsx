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
import { H3 } from "@/components/ui/typography";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  selectedCategoryIds: z.array(z.string()),
});

interface CategoryLinkFormProps {
  budgetId: string;
  ynabCategories: Array<{
    id: string;
    name: string;
    groupName?: string | null;
    budgeted: number;
    activity: number;
    balance: number;
  }>;
  trackedCategoryIds: string[];
}

export default function CategoryLinkForm({
  budgetId,
  ynabCategories,
  trackedCategoryIds,
}: CategoryLinkFormProps) {
  const router = useRouter();
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Group categories by group name
  const groupedCategories = ynabCategories.reduce(
    (acc, cat) => {
      const groupName = cat.groupName ?? "Uncategorized";
      acc[groupName] ??= [];
      acc[groupName].push(cat);
      return acc;
    },
    {} as Record<string, typeof ynabCategories>,
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      selectedCategoryIds: trackedCategoryIds,
    },
  });

  const mutation = api.budget.linkCategories.useMutation({
    onSuccess: () => {
      toast.success("Categories updated!");
      router.push(`/${budgetId}`);
    },
    onError: (e) => {
      toast.error("Failed to update categories");
      console.error(e);
    },
  });

  const allCategoryIds = ynabCategories.map((cat) => cat.id);

  function selectAll() {
    form.setValue("selectedCategoryIds", allCategoryIds);
  }

  function deselectAll() {
    form.setValue("selectedCategoryIds", []);
  }

  function onSubmit() {
    setShowConfirmation(true);
  }

  function handleConfirmAction() {
    mutation.mutate({
      budgetId,
      categoryIds: form.getValues("selectedCategoryIds"),
    });
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={selectAll}>
              Select All
            </Button>
            <Button type="button" variant="outline" onClick={deselectAll}>
              Deselect All
            </Button>
          </div>
          {Object.entries(groupedCategories).map(([groupName, categories]) => (
            <div key={groupName} className="space-y-3">
              <H3>{groupName}</H3>
              <div className="space-y-3 rounded-lg border p-4">
                <FormField
                  control={form.control}
                  name="selectedCategoryIds"
                  render={({ field }) => (
                    <FormItem>
                      {categories.map((category) => (
                        <FormItem
                          key={category.id}
                          className="flex flex-row items-start space-y-0 space-x-3"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(category.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([
                                      ...field.value,
                                      category.id,
                                    ])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== category.id,
                                      ),
                                    );
                              }}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="cursor-pointer font-normal">
                              {category.name}
                            </FormLabel>
                          </div>
                        </FormItem>
                      ))}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}
          <Button type="submit">Save</Button>
        </form>
      </Form>
      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Any categories you deselected will be removed from tracking in
              this application.
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
