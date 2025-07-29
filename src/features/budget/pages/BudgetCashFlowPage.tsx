import { ArrowLeft } from 'lucide-react';
import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { BudgetCashFlowTable } from '../components/BudgetCashFlowTable';

import { Button } from '@/components/ui/button';
import Title from '@/components/ui/title';

export default function BudgetCashFlowPage() {
  const params = useParams();
  const navigation = useNavigate();

  const { id } = params;

  const handleGoBack = useCallback(() => {
    navigation(-1);
  }, [navigation]);

  return (
    <div className="h-full w-full">
      <div className="flex items-center mb-5">
        <Button variant="ghost" className="p-3 mr-3" onClick={handleGoBack}>
          <ArrowLeft className="size-5 mt-1" />
        </Button>
        <Title>Fluxo de caixa</Title>
      </div>

      <BudgetCashFlowTable budgetId={Number(id)} />
    </div>
  );
}
