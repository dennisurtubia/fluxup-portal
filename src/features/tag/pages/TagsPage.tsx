import { useQuery } from '@tanstack/react-query';
import { useCallback, useRef } from 'react';

import TagCreateDialog, { TagCreateDialogRef } from '../components/TagCreateDialog';
import { TagDataColumns } from '../components/TagDataColumns';
import { tagHttpServiceInstance, TagType } from '../http/TagHttpService';

import { DataTable } from '@/components/DataTable';
import LoadingScreen from '@/components/Loading';
import { Button } from '@/components/ui/button';
import Title from '@/components/ui/title';

export default function TagPage() {
  const dialogRef = useRef<TagCreateDialogRef>(null);

  const {
    data: tags,
    isLoading,
    isError,
  } = useQuery<TagType[] | undefined>({
    queryKey: ['tags', 1],
    retry: false,
    queryFn: async () => {
      const response = await tagHttpServiceInstance.getTags();

      return response;
    },
  });

  const handleCreateTags = useCallback(() => {
    dialogRef.current?.open();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Erro ao carregar os agrupadores</h1>
        <p className="mt-4 text-lg">Tente novamente mais tarde.</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <div className="flex justify-between items-center mb-5">
        <Title>Agrupadores</Title>
        <Button variant="default" onClick={handleCreateTags}>
          Criar agrupador
        </Button>

        <TagCreateDialog ref={dialogRef} />
      </div>

      <DataTable columns={TagDataColumns} data={tags || []} />
    </div>
  );
}
