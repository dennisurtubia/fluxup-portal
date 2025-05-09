import { useQuery } from '@tanstack/react-query';

import { budgetEntryHttpServiceInstance, BudgetEntryType } from '../../http/BudgetEntryHttpService';
import { BudgetEntriesIncomeColumns } from '../BudgetEntriesColumns';

import { DataTable } from '@/components/DataTable';
import LoadingScreen from '@/components/Loading';

type BudgetEntriesIncomeProps = {
  budgetId: number;
};

export function BudgetEntriesIncome({ budgetId }: BudgetEntriesIncomeProps) {
  const {
    data: budgetsEntryIncome,
    isLoading,
    isError,
  } = useQuery<BudgetEntryType[] | undefined>({
    queryKey: ['budgetsEntryIncome', 1],
    retry: false,
    queryFn: async () => {
      const response = await budgetEntryHttpServiceInstance.getBudgetEntries(budgetId, 'income');

      return response;
    },
  });

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Erro ao carregar receitas</h1>
        <p className="mt-4 text-lg">Tente novamente mais tarde.</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <DataTable columns={BudgetEntriesIncomeColumns} data={budgetsEntryIncome || []} />
    </div>
  );
}
