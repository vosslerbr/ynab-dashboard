import { PageTitle } from "@/app/_components/page-title";
import BudgetSelect from "./_components/budget-select";

export default function Page() {
  return (
    <>
      <PageTitle title="Dashboard" />
      <BudgetSelect />
    </>
  );
}
