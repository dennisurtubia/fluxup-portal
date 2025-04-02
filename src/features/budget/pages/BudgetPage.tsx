import { useQuery } from '@tanstack/react-query';

import { BudgetDataColumns } from '../components/BudgetDataColumns';
import { budgetHttpServiceInstance, BudgetType } from '../http/BudgetHttpService';

import { DataTable } from '@/components/DataTable';
import LoadingScreen from '@/components/Loading';
import { Button } from '@/components/ui/button';
import Title from '@/components/ui/title';

export default function BudgetPage() {
  const {
    data: budgets,
    isLoading,
    isError,
  } = useQuery<BudgetType[] | undefined>({
    queryKey: ['budgets', 1],
    queryFn: async () => {
      const response = await budgetHttpServiceInstance.getBudgets();

      return response;
    },
  });

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Erro ao carregar os orçamentos</h1>
        <p className="mt-4 text-lg">Tente novamente mais tarde.</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <div className="flex justify-between items-center mb-5">
        <Title>Orçamentos</Title>
        <Button variant="default">Criar Orçamento</Button>
      </div>

      <DataTable columns={BudgetDataColumns} data={budgets || []} />
    </div>
  );
}
