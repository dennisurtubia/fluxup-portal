import { useQuery } from '@tanstack/react-query';
import { useCallback, useRef } from 'react';

import TagsCreateDialog, { TagsCreateDialogRef } from '../components/TagsCreateDialog';
import { TagsDataColumns } from '../components/TagsDataColumns';
import { TagsHttpServiceInstance, TagsType } from '../http/TagsHttpService';

import { DataTable } from '@/components/DataTable';
import LoadingScreen from '@/components/Loading';
import { Button } from '@/components/ui/button';
import Title from '@/components/ui/title';

export default function TagsPage() {
  const dialogRef = useRef<TagsCreateDialogRef>(null);

  const {
    data: tags,
    isLoading,
    isError,
  } = useQuery<TagsType[] | undefined>({
    queryKey: ['tags', 1],
    retry: false,
    queryFn: async () => {
      const response = await TagsHttpServiceInstance.getTags();

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
        <h1 className="text-2xl font-bold">Erro ao carregar as tags</h1>
        <p className="mt-4 text-lg">Tente novamente mais tarde.</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <div className="flex justify-between items-center mb-5">
        <Title>Tags</Title>
        <Button variant="default" onClick={handleCreateTags}>
          Criar Tags
        </Button>

        <TagsCreateDialog ref={dialogRef} />
      </div>

      <DataTable columns={TagsDataColumns} data={tags || []} />
    </div>
  );
}
