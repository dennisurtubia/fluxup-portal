import { useQuery } from '@tanstack/react-query';

import { cashEntryHttpServiceInstance, CashEntryType } from '../../http/CashEntryHttpService';
import { CashEntryColumns } from '../CashEntryColumns';

import { DataTable } from '@/components/DataTable';
import LoadingScreen from '@/components/Loading';

type CashEntryProps = {
  cashId: number;
};

export function CashEntryTable({ cashId }: CashEntryProps) {
  const {
    data: cashEntry,
    isLoading,
    isError,
  } = useQuery<CashEntryType[] | undefined>({
    queryKey: ['cash-entry', 1],
    retry: false,
    queryFn: async () => {
      const response = await cashEntryHttpServiceInstance.getCashEntries(cashId);

      return response;
    },
  });

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Erro ao carregar os caixas</h1>
        <p className="mt-4 text-lg">Tente novamente mais tarde.</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <DataTable columns={CashEntryColumns} data={cashEntry || []} />
    </div>
  );
}
