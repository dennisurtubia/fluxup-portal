import { useQuery } from '@tanstack/react-query';
import { useCallback, useRef } from 'react';

import PartieCreateDialog, { PartieCreateDialogRef } from '../components/PartieCreateDialog';
import { PartieDataColumns } from '../components/PartieDataColumns';
import { partieHttpServiceInstance, PartieType } from '../http/PartieHttpService';

import { DataTable } from '@/components/DataTable';
import LoadingScreen from '@/components/Loading';
import { Button } from '@/components/ui/button';
import Title from '@/components/ui/title';

export default function PartiePage() {
  const dialogRef = useRef<PartieCreateDialogRef>(null);

  const {
    data: tags,
    isLoading,
    isError,
  } = useQuery<PartieType[] | undefined>({
    queryKey: ['partie', 1],
    retry: false,
    queryFn: async () => {
      const response = await partieHttpServiceInstance.getParties();

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

        <PartieCreateDialog ref={dialogRef} />
      </div>

      <DataTable columns={PartieDataColumns} data={tags || []} />
    </div>
  );
}
