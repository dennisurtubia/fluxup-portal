import { useQuery } from '@tanstack/react-query';
import { useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import { BudgetEntriesExpense } from '../components/BudgetEntriesExpense';
import { BudgetEntriesIncome } from '../components/BudgetEntriesIncome';
import BudgetEntryCreateDialog, {
  BudgetEntryCreateDialogRef,
} from '../components/BudgetEntryCreateDialog';

import { DataTable } from '@/components/DataTable';
import HeaderNavigation from '@/components/HeaderNavigation';
import LoadingScreen from '@/components/Loading';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BankAccountDataColumns } from '@/features/bank-account/components/BankAccountDataColumns';
import {
  bankAccountHttpServiceInstance,
  BankAccountType,
} from '@/features/bank-account/http/BankAcoountHttpService';

export default function BudgetEntriesPage() {
  const params = useParams();
  const navigation = useNavigate();

  const { id } = params;

  const location = useLocation();
  const { name, initialMonth, lastMonth } = location.state || {};

  const dialogRef = useRef<BudgetEntryCreateDialogRef>(null);

  const {
    data: bankAccounts,
    isLoading,
    isError,
  } = useQuery<BankAccountType[] | undefined>({
    queryKey: ['bankAccounts', 1],
    retry: false,
    queryFn: async () => {
      const response = await bankAccountHttpServiceInstance.getBankAccounts();

      return response;
    },
  });

  const handleCreateBudgetEntry = useCallback(() => {
    if (!id || !initialMonth || !lastMonth) return;

    dialogRef.current?.setBudgetId(Number(id));
    dialogRef.current?.setInitialMonth(initialMonth);
    dialogRef.current?.setLastMonth(lastMonth);
    dialogRef.current?.open();
  }, [id, initialMonth, lastMonth]);

  const handleShowCashFlow = useCallback(() => {
    if (!id) return;

    navigation(`/app/budgets/${id}/cash-flow`);
  }, [id, navigation]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="h-full w-full">
      <div className="flex justify-between items-center mb-5">
        <HeaderNavigation title={name} />
        <div className="flex items-center space-x-2">
          <Button variant="default" onClick={handleCreateBudgetEntry}>
            Nova Entrada
          </Button>
          <Button variant="default" onClick={handleShowCashFlow}>
            Exibir fluxo de caixa
          </Button>
        </div>
        <BudgetEntryCreateDialog ref={dialogRef} />
      </div>

      {isError ? (
        <div className="flex h-full w-full flex-col items-center justify-center">
          <h1 className="text-2xl font-bold">Erro ao carregar as contas bancárias</h1>
          <p className="mt-4 text-lg">Tente novamente mais tarde.</p>
        </div>
      ) : (
        <Card className="p-4">
          <DataTable columns={BankAccountDataColumns} data={bankAccounts || []} hideFilter />
        </Card>
      )}

      <Card className="mt-5 p-4">
        <Tabs defaultValue="income">
          <TabsList className="w-full justify-between h-12">
            <TabsTrigger value="income">Receitas</TabsTrigger>
            <TabsTrigger value="expense">Despesas</TabsTrigger>
          </TabsList>

          <TabsContent value="income">
            <BudgetEntriesIncome budgetId={Number(id)} />
          </TabsContent>
          <TabsContent value="expense">
            <BudgetEntriesExpense budgetId={Number(id)} />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
