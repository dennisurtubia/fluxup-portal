import { useQuery } from '@tanstack/react-query';

import { budgetEntryHttpServiceInstance, BudgetEntryType } from '../../http/BudgetEntryHttpService';
import { BudgetEntriesIncomeColumns } from '../BudgetEntriesIncomeColumns';

import { DataTable } from '@/components/DataTable';
import LoadingScreen from '@/components/Loading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type BudgetEntriesIncomeProps = {
  id: number;
};

export function BudgetEntriesIncome({ id }: BudgetEntriesIncomeProps) {
  const {
    data: budgetsEntryIncome,
    isLoading,
    isError,
  } = useQuery<BudgetEntryType[] | undefined>({
    queryKey: ['budgetsEntryIncome', 1],
    retry: false,
    queryFn: async () => {
      const response = await budgetEntryHttpServiceInstance.getBudgetEntries(id, 'income');

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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-5">
        <Card className="gap-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Orçamento Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 15.000,00</div>
            <p className="text-xs text-muted-foreground">Planejado para o mês atual</p>
          </CardContent>
        </Card>
        <Card className="gap-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilizado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 8.234,45</div>
            <p className="text-xs text-muted-foreground">54.9% do orçamento total</p>
          </CardContent>
        </Card>
        <Card className="gap-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Restante</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 6.765,55</div>
            <p className="text-xs text-muted-foreground">45.1% do orçamento total</p>
          </CardContent>
        </Card>
      </div>
      <DataTable columns={BudgetEntriesIncomeColumns} data={budgetsEntryIncome || []} />
    </div>
  );
}
