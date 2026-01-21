import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Check, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';

import {
  CashEntryType,
  PaymentType,
  cashEntryHttpServiceInstance,
} from '../../http/CashEntryHttpService';
import { paymentTypeLabel } from '../CashEntryCreateDialog/utils/payment_type-utils';
import { EntryItemsCell } from '../EntryItemsCell';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CategoryType } from '@/features/categories/http/CategoryHttpService';
import { PartyType } from '@/features/party/http/PartyHttpService';
import { formatCurrency } from '@/utils/mask/formatCurrency';

const statusLabel: Record<
  string,
  {
    label: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
    className?: string;
  }
> = {
  PENDING_APPROVAL: { label: 'Aguardando Aprovação', variant: 'default' },
  APPROVED: { label: 'Aprovado', variant: 'secondary' },
  PENDING_PAYMENT: { label: 'Aguardando Pagamento', variant: 'default' },
  PAID: {
    label: 'Pago',
    variant: 'secondary',
    className: 'bg-green-500 text-white hover:bg-green-600',
  },
  OVERDUE_PAYMENT: { label: 'Pagamento Atrasado', variant: 'destructive' },
};

type CashEntryColumnsProps = {
  cashFlowId: number;
};

function ActionsCell({ entry, cashFlowId }: { entry: CashEntryType; cashFlowId: number }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (status: 'PAID' | 'APPROVED') => {
      await cashEntryHttpServiceInstance.updateCashEntryStatus(cashFlowId, entry.id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cash-entry'] });
      toast.success('Status atualizado com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao atualizar status. Tente novamente.');
    },
  });

  const canApprove = entry.type === 'expense' && entry.status === 'PENDING_APPROVAL';

  const canMarkAsPaid =
    entry.type === 'income' &&
    (entry.status === 'PENDING_PAYMENT' || entry.status === 'OVERDUE_PAYMENT');

  if (!canApprove && !canMarkAsPaid) {
    return <div className="text-center text-muted-foreground">-</div>;
  }

  return (
    <div className="flex justify-center">
      {canApprove && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => mutation.mutate('APPROVED')}
          disabled={mutation.isPending}
          className="gap-2"
        >
          <Check className="h-4 w-4" />
          Aprovar
        </Button>
      )}
      {canMarkAsPaid && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => mutation.mutate('PAID')}
          disabled={mutation.isPending}
          className="gap-2 bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800"
        >
          <CheckCircle className="h-4 w-4" />
          Marcar como Paga
        </Button>
      )}
    </div>
  );
}

export const getCashEntryColumns = ({
  cashFlowId,
}: CashEntryColumnsProps): ColumnDef<CashEntryType>[] => [
  {
    accessorKey: 'description',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Descrição
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue('description')}</div>,
  },
  {
    accessorKey: 'category',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Categoria
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const category = row.getValue('category') as CategoryType;
      return <div className="font-medium">{category.name}</div>;
    },
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Valor (R$)
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = row.getValue('amount') as number;
      return <div className="font-medium">{formatCurrency(amount)}</div>;
    },
  },
  {
    accessorKey: 'transaction_date',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Data da transação
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue('transaction_date'));
      return <div className="font-medium">{date.toLocaleDateString()}</div>;
    },
  },
  {
    accessorKey: 'payment_type',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Forma de pagamento
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const paymentTypeKey = row.getValue('payment_type') as PaymentType;
      const paymentType = paymentTypeLabel[paymentTypeKey as keyof typeof paymentTypeLabel];
      return <div className="font-medium">{paymentType}</div>;
    },
  },
  {
    accessorKey: 'party',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Parceiro
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const party = row.getValue('party') as PartyType;
      return <div className="font-medium">{party.name}</div>;
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const statusInfo = statusLabel[status as keyof typeof statusLabel];
      return (
        <Badge variant={statusInfo?.variant || 'outline'} className={statusInfo?.className}>
          {statusInfo?.label || status}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'items',
    header: () => <div className="text-center">Itens</div>,
    cell: ({ row }) => {
      const entry = row.original;
      return <EntryItemsCell items={entry.items} />;
    },
  },
  {
    id: 'actions',
    header: () => <div className="text-center">Ações</div>,
    cell: ({ row }) => <ActionsCell entry={row.original} cashFlowId={cashFlowId} />,
  },
];
