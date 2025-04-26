import { useQuery } from '@tanstack/react-query';
import { useCallback, useRef } from 'react';

import CategoryCreateDialog, { CategoryCreateDialogRef } from '../components/CategoryCreateDialog';
import { CategoryDataColumns } from '../components/CategoryDataColumns';
import { CategoryHttpServiceInstance, CategoryType } from '../http/CategoryHttpService';

import { DataTable } from '@/components/DataTable';
import LoadingScreen from '@/components/Loading';
import { Button } from '@/components/ui/button';
import Title from '@/components/ui/title';

export default function CategoryPage() {
  const dialogRef = useRef<CategoryCreateDialogRef>(null);

  const {
    data: categories,
    isLoading,
    isError,
  } = useQuery<CategoryType[] | undefined>({
    queryKey: ['categories', 1],
    retry: false,
    queryFn: async () => {
      const response = await CategoryHttpServiceInstance.getCategories();

      return response;
    },
  });

  const handleCreateCategories = useCallback(() => {
    dialogRef.current?.open();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Erro ao carregar as categorias</h1>
        <p className="mt-4 text-lg">Tente novamente mais tarde.</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <div className="flex justify-between items-center mb-5">
        <Title>Categorias</Title>
        <Button variant="default" onClick={handleCreateCategories}>
          Criar categoria
        </Button>

        <CategoryCreateDialog ref={dialogRef} />
      </div>

      <DataTable columns={CategoryDataColumns} data={categories || []} />
    </div>
  );
}
