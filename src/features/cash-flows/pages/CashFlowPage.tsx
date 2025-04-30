import { useQuery } from '@tanstack/react-query';
import { useCallback, useRef } from 'react';

import CashFlowCreateDialog, { CashFlowCreateDialogRef } from '../components/CashFlowCreateDialog';
import { CashFlowDataColumns } from '../components/CashFlowDataColumns';
import { cashFlowsHttpServiceInstance, CashFlowType } from '../http/CashFlowHttpService';

import { DataTable } from '@/components/DataTable';
import LoadingScreen from '@/components/Loading';
import { Button } from '@/components/ui/button';
import Title from '@/components/ui/title';

export default function CashFlowPage() {
  const dialogRef = useRef<CashFlowCreateDialogRef>(null);

  const {
    data: cashFlows,
    isLoading,
    isError,
  } = useQuery<CashFlowType[] | undefined>({
    queryKey: ['cash-flows', 1],
    retry: false,
    queryFn: async () => {
      const response = await cashFlowsHttpServiceInstance.getCashFlowEntries();

      return response;
    },
  });

  const handleCreateCashFlow = useCallback(() => {
    dialogRef.current?.open();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Erro ao carregar os fluxos de caixa</h1>
        <p className="mt-4 text-lg">Tente novamente mais tarde.</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <div className="flex justify-between items-center mb-5">
        <Title>Fluxos de caixa</Title>
        <Button variant="default" onClick={handleCreateCashFlow}>
          Criar Fluxo de Caixa
        </Button>

        <CashFlowCreateDialog ref={dialogRef} />
      </div>

      <DataTable columns={CashFlowDataColumns} data={cashFlows || []} />
    </div>
  );
}
