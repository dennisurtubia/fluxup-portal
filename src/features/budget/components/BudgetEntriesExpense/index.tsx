import { useQuery } from '@tanstack/react-query';

import { budgetEntryHttpServiceInstance, BudgetEntryType } from '../../http/BudgetEntryHttpService';
import { BudgetEntriesIncomeColumns } from '../BudgetEntriesColumns';

import { DataTable } from '@/components/DataTable';
import LoadingScreen from '@/components/Loading';

type BudgetEntriesExpenseProps = {
  budgetId: number;
};

export function BudgetEntriesExpense({ budgetId }: BudgetEntriesExpenseProps) {
  const {
    data: budgetsEntryExpense,
    isLoading,
    isError,
  } = useQuery<BudgetEntryType[] | undefined>({
    queryKey: ['budgetsEntryExpense', 1],
    retry: false,
    queryFn: async () => {
      const response = await budgetEntryHttpServiceInstance.getBudgetEntries(budgetId, 'expense');

      return response;
    },
  });

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Erro ao carregar despesas</h1>
        <p className="mt-4 text-lg">Tente novamente mais tarde.</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <DataTable columns={BudgetEntriesIncomeColumns} data={budgetsEntryExpense || []} />
    </div>
  );
}
