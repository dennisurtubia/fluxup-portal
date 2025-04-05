import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

import { BudgetEntryType } from '../../http/BudgetEntryHttpService';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TagType } from '@/features/tag/http/TagHttpService';
export const BudgetEntriesIncomeColumns: ColumnDef<BudgetEntryType>[] = [
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
    accessorKey: 'amount_micro',
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
      const amount = row.getValue('amount_micro') as number;
      const formattedAmount = (amount / 100).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      });
      return <div className="font-medium">{formattedAmount}</div>;
    },
  },
  {
    accessorKey: 'type',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Tipo
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const type = row.getValue('type') as string;
      const displayType = type === 'income' ? 'Receita' : 'Despesa';
      return <div className="font-medium">{displayType}</div>;
    },
  },
  {
    accessorKey: 'tags',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Tags
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const tags = (row.getValue('tags') as TagType[]) || [];
      return (
        <div className="flex gap-2">
          {tags.map((tag) => (
            <Badge variant="outline" key={tag.id}>
              {tag.name}
            </Badge>
          ))}
        </div>
      );
    },
  },
];
