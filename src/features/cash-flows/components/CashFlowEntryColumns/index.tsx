import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

import { CashFlowEntryType } from '../../http/CashFlowEntryHttpService';
import { getBankDisplayData } from '../CashFlowEntryCreateDialog/utils/bank-utils';

import { Button } from '@/components/ui/button';
import { BankAccountType } from '@/features/bank-account/http/BankAcoountHttpService';
import { CategoryType } from '@/features/categories/http/CategoryHttpService';
import { PartyType } from '@/features/party/http/PartyHttpService';

export const CashFlowEntryColumns: ColumnDef<CashFlowEntryType>[] = [
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
          Valor
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = row.getValue('amount') as number;
      return <div className="font-medium">R$ {amount.toFixed(2).replace('.', ',')}</div>;
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
    accessorKey: 'bank_account',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Conta bancária
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const bankAccount = row.getValue('bank_account') as BankAccountType;
      const { logo, label } = getBankDisplayData(bankAccount.bank);
      return (
        <div className="font-medium flex items-center">
          {logo}
          <span className="ml-2">{label}</span>
        </div>
      );
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
];
