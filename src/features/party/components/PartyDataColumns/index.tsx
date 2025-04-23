import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

import { PartyType } from '../../http/PartyHttpService';

import { Button } from '@/components/ui/button';
import { formatDocument } from '@/utils/mask/formaDocument';
import { formatPhone } from '@/utils/mask/formatPhone';

export const PartyDataColumns: ColumnDef<PartyType>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Nome
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'document',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        CPF/CNPJ
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const doc = row.getValue('document') as string;
      return <div className="font-medium">{formatDocument(doc)}</div>;
    },
  },
  {
    accessorKey: 'phone_number',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Telefone
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const phone = row.getValue('phone_number') as string;
      return <div className="font-medium">{formatPhone(phone)}</div>;
    },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Email
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="font-medium">{row.getValue('email')}</div>,
  },
];
