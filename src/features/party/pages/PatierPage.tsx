import { useQuery } from '@tanstack/react-query';
import { useCallback, useRef } from 'react';

import PartyCreateDialog, { PartyCreateDialogRef } from '../components/PartyCreateDialog';
import { PartyDataColumns } from '../components/PartyDataColumns';
import { partiesHttpServiceInstance, PartieType } from '../http/PartyHttpService';

import { DataTable } from '@/components/DataTable';
import LoadingScreen from '@/components/Loading';
import { Button } from '@/components/ui/button';
import Title from '@/components/ui/title';

export default function PartiePage() {
  const dialogRef = useRef<PartyCreateDialogRef>(null);

  const {
    data: parties,
    isLoading,
    isError,
  } = useQuery<PartieType[] | undefined>({
    queryKey: ['parties', 1],
    retry: false,
    queryFn: async () => {
      const response = await partiesHttpServiceInstance.getParties();

      return response;
    },
  });

  const handleCreatePartie = useCallback(() => {
    dialogRef.current?.open();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Erro ao carregar as tags</h1>
        <p className="mt-4 text-lg">Tente novamente mais tarde.</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <div className="flex justify-between items-center mb-5">
        <Title>Parceiros</Title>
        <Button variant="default" onClick={handleCreatePartie}>
          Novo Parceiro
        </Button>

        <PartyCreateDialog ref={dialogRef} />
      </div>

      <DataTable columns={PartyDataColumns} data={parties || []} />
    </div>
  );
}
