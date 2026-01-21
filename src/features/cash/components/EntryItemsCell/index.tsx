import { useQuery } from '@tanstack/react-query';
import { Info } from 'lucide-react';

import { CashEntryItemType } from '../../http/CashEntryHttpService';

import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  bankAccountHttpServiceInstance,
  BankAccountType,
} from '@/features/bank-account/http/BankAcoountHttpService';
import { formatCurrency } from '@/utils/mask/formatCurrency';

type EntryItemsCellProps = {
  items: CashEntryItemType[];
};

export function EntryItemsCell({ items }: EntryItemsCellProps) {
  const { data: bankAccounts } = useQuery<BankAccountType[] | undefined>({
    queryKey: ['bank-accounts', 1],
    retry: false,
    queryFn: async () => {
      const response = await bankAccountHttpServiceInstance.getBankAccounts();
      return response;
    },
  });

  const getBankAccountName = (bankAccountId: number) => {
    const account = bankAccounts?.find((acc) => acc.id === bankAccountId);
    return account?.name || 'Conta não encontrada';
  };

  if (!items || items.length === 0) {
    return <div className="text-center text-muted-foreground">-</div>;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Badge variant="outline" className="cursor-pointer">
            {items.length} {items.length === 1 ? 'item' : 'itens'}
          </Badge>
          <Info className="h-4 w-4 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Itens da Entrada</h4>
          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={index} className="border-b pb-3 last:border-b-0 last:pb-0">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-sm font-medium">Item {index + 1}</span>
                  <span className="text-sm font-semibold">{formatCurrency(item.amount)}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  <strong>Conta:</strong> {getBankAccountName(item.bank_account_id)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
