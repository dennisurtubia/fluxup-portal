import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { BudgetType } from '../../http/BudgetHttpService';

import { Button } from '@/components/ui/button';

const NavigateButton: React.FC<{ rowId: string }> = ({ rowId }) => {
  const navigate = useNavigate();

  const handleNavigate = useCallback(() => {
    navigate(`/app/budgets/${rowId}`);
  }, [navigate, rowId]);

  return (
    <Button variant="outline" size="sm" onClick={handleNavigate}>
      Ver detalhes
    </Button>
  );
};

export const BudgetDataColumns: ColumnDef<BudgetType>[] = [
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
    accessorKey: 'start_date',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Data de Início
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'end_date',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Data de Fim
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: 'actions',
    header: () => <div className="text-center">Ações</div>,
    cell: ({ row }) => {
      const myRow = row.original;

      return (
        <div className="flex justify-center">
          <NavigateButton rowId={myRow.id.toString()} />
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];
