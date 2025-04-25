import { useQuery } from '@tanstack/react-query';
import { useCallback, useRef } from 'react';

import BankAccountCreateDialog, {
  BankAccountCreateDialogRef,
} from '../components/BankAccountCreateDialog';
import { BankAccountDataColumns } from '../components/BankAccountDataColumns';
import { bankAccountHttpServiceInstance, BankAccountType } from '../http/BankAcoountHttpService';

import { DataTable } from '@/components/DataTable';
import LoadingScreen from '@/components/Loading';
import { Button } from '@/components/ui/button';
import Title from '@/components/ui/title';

export default function BankAccountPage() {
  const dialogRef = useRef<BankAccountCreateDialogRef>(null);

  const {
    data: bankAccounts,
    isLoading,
    isError,
  } = useQuery<BankAccountType[] | undefined>({
    queryKey: ['bankAccounts', 1],
    retry: false,
    queryFn: async () => {
      const response = await bankAccountHttpServiceInstance.getBankAccounts();

      return response;
    },
  });

  const handleCreateBankAccount = useCallback(() => {
    dialogRef.current?.open();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Erro ao carregar as contas bancárias</h1>
        <p className="mt-4 text-lg">Tente novamente mais tarde.</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <div className="flex justify-between items-center mb-5">
        <Title>Contas bancárias</Title>
        <Button variant="default" onClick={handleCreateBankAccount}>
          Criar conta bancária
        </Button>

        <BankAccountCreateDialog ref={dialogRef} />
      </div>

      <DataTable columns={BankAccountDataColumns} data={bankAccounts || []} />
    </div>
  );
}
