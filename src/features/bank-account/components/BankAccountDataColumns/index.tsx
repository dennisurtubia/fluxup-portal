import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

import BancoDoBrasilLogo from '../../../../assets/bb-logo.svg';
import CresolLogo from '../../../../assets/cresol-logo.svg';
import { BankAccountType } from '../../http/BankAcoountHttpService';

import { Button } from '@/components/ui/button';

const bankAccountNameMap = {
  BANCO_DO_BRASIL: 'Banco do Brasil',
  CRESOL: 'Cresol',
};

export const BankAccountDataColumns: ColumnDef<BankAccountType>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Nome
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'number',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Nº da Conta
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue('number')}</div>,
  },
  {
    accessorKey: 'branch_code',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Nº da Agência
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue('branch_code')}</div>,
  },
  {
    accessorKey: 'bank',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Banco
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="font-medium">
        {bankAccountNameMap[row.getValue('bank') as BankAccountType['bank']] === 'Cresol' ? (
          <div className="flex items-center gap-2">
            <img src={CresolLogo} alt="Cresol" className="w-6 h-6" />
            {bankAccountNameMap[row.getValue('bank') as BankAccountType['bank']]}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <img src={BancoDoBrasilLogo} alt="Banco do Brasil" className="w-6 h-6" />
            {bankAccountNameMap[row.getValue('bank') as BankAccountType['bank']]}
          </div>
        )}
      </div>
    ),
  },
];
