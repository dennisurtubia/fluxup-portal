import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

import { CashEntryType } from '../../http/CashEntryHttpService';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CategoryType } from '@/features/categories/http/CategoryHttpService';
import { TagType } from '@/features/tag/http/TagHttpService';
import { getMonthName } from '@/utils/getMonthName';

export const CashEntriesIncomeColumns: ColumnDef<CashEntryType>[] = [
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
      const formattedAmount = amount.toLocaleString('pt-BR', {
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
    accessorKey: 'month',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Mês
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const monthNumber = Number(row.getValue('month'));
      const monthName = getMonthName(monthNumber);
      return <div className="font-medium">{monthName}</div>;
    },
  },
  {
    accessorKey: 'tags',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Agrupadores
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
