import { useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import { BudgetCashFlowTable } from '../components/BudgetCashFlowTable';
import BudgetEntryCreateDialog, {
  BudgetEntryCreateDialogRef,
} from '../components/BudgetEntryCreateDialog';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Title from '@/components/ui/title';

export default function BudgetEntriesPage() {
  const params = useParams();

  const { id } = params;

  const location = useLocation();
  const { name, initialMonth, lastMonth } = location.state || {};

  const dialogRef = useRef<BudgetEntryCreateDialogRef>(null);

  const handleCreateBudgetEntry = useCallback(() => {
    dialogRef.current?.setBudgetId(Number(id));
    dialogRef.current?.open();
    dialogRef.current?.setInitialMonth(initialMonth);
    dialogRef.current?.setLastMonth(lastMonth);
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

      <Card>
        <CardHeader>
          <CardTitle>Fluxo de Caixa</CardTitle>
          <CardDescription>Visualize e gerencie seu fluxo de caixa.</CardDescription>
        </CardHeader>
        <CardContent>
          <BudgetCashFlowTable budgetId={Number(id)} />
        </CardContent>
      </Card>
    </div>
  );
}
