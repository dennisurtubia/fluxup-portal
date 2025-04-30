import { useQuery } from '@tanstack/react-query';

import {
  cashFlowEntryHttpServiceInstance,
  CashFlowEntryType,
} from '../../http/CashFlowEntryHttpService';
import { CashFlowEntryColumns } from '../CashFlowEntryColumns';

import { DataTable } from '@/components/DataTable';
import LoadingScreen from '@/components/Loading';

type CashFlowEntryProps = {
  cashFlowId: number;
};

export function CashFlowEntryTable({ cashFlowId }: CashFlowEntryProps) {
  const {
    data: cashFlowEntry,
    isLoading,
    isError,
  } = useQuery<CashFlowEntryType[] | undefined>({
    queryKey: ['cash-flow-entry', 1],
    retry: false,
    queryFn: async () => {
      const response = await cashFlowEntryHttpServiceInstance.getCashFlowEntries(cashFlowId);

      return response;
    },
  });

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
      <DataTable columns={CashFlowEntryColumns} data={cashFlowEntry || []} />
    </div>
  );
}
