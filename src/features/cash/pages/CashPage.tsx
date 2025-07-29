import { useQuery } from '@tanstack/react-query';
import { useCallback, useRef } from 'react';

import CashCreateDialog, { CashCreateDialogRef } from '../components/CashCreateDialog';
import { CashDataColumns } from '../components/CashDataColumns';
import { cashHttpServiceInstance, CashType } from '../http/CashHttpService';

import { DataTable } from '@/components/DataTable';
import LoadingScreen from '@/components/Loading';
import { Button } from '@/components/ui/button';
import Title from '@/components/ui/title';

export default function CashPage() {
  const dialogRef = useRef<CashCreateDialogRef>(null);

  const {
    data: cash,
    isLoading,
    isError,
  } = useQuery<CashType[] | undefined>({
    queryKey: ['cash', 1],
    retry: false,
    queryFn: async () => {
      const response = await cashHttpServiceInstance.getCashEntries();

      return response;
    },
  });

  const handleCreateCash = useCallback(() => {
    dialogRef.current?.open();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Erro ao carregar os Caixas</h1>
        <p className="mt-4 text-lg">Tente novamente mais tarde.</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <div className="flex justify-between items-center mb-5">
        <Title>Caixa</Title>
        <Button variant="default" onClick={handleCreateCash}>
          Criar Caixa
        </Button>

        <CashCreateDialog ref={dialogRef} />
      </div>

      <DataTable columns={CashDataColumns} data={cash || []} />
    </div>
  );
}
