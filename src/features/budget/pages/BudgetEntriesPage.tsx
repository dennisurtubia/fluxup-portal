import { useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import { BudgetEntriesExpense } from '../components/BudgetEntriesExpense';
import { BudgetEntriesIncome } from '../components/BudgetEntriesIncome';
import BudgetEntryCreateDialog, {
  BudgetEntryCreateDialogRef,
} from '../components/BudgetEntryCreateDialog';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Title from '@/components/ui/title';

export default function BudgetEntriesPage() {
  const params = useParams();

  const { id } = params;

  const location = useLocation();
  const { name, initialMonth, lastMonth } = location.state || {};

  const dialogRef = useRef<BudgetEntryCreateDialogRef>(null);

  const handleCreateBudgetEntry = useCallback(() => {
    if (!id || !initialMonth || !lastMonth) return;

    dialogRef.current?.setBudgetId(Number(id));
    dialogRef.current?.setInitialMonth(initialMonth);
    dialogRef.current?.setLastMonth(lastMonth);
    dialogRef.current?.open();
  }, [id, initialMonth, lastMonth]);

  return (
    <div className="h-full w-full">
      <div className="flex justify-between items-center mb-5">
        <Title>{name}</Title>
        <Button variant="default" onClick={handleCreateBudgetEntry}>
          Nova Entrada
        </Button>

        <BudgetEntryCreateDialog ref={dialogRef} />
      </div>

      <Tabs defaultValue="income" className="space-y-4">
        <TabsList>
          <TabsTrigger value="income">Receitas</TabsTrigger>
          <TabsTrigger value="expense">Despesas</TabsTrigger>
        </TabsList>

        <TabsContent value="income" className="space-y-4">
          <BudgetEntriesIncome budgetId={Number(id)} />
        </TabsContent>
        <TabsContent value="expense" className="space-y-4">
          <BudgetEntriesExpense budgetId={Number(id)} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
