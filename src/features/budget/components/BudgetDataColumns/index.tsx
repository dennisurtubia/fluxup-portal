import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { BudgetType } from '../../http/BudgetHttpService';

import { Button } from '@/components/ui/button';

type BudgetDataColumnsProps = {
  rowId: string;
  name: string;
  start_date: string;
  end_date: string;
};

const NavigateButton: React.FC<BudgetDataColumnsProps> = ({
  rowId,
  name,
  start_date,
  end_date,
}) => {
  const navigate = useNavigate();

  const handleNavigate = useCallback(() => {
    navigate(`/app/budgets/${rowId}`, {
      state: {
        name: name,
        initialMonth: start_date,
        lastMonth: end_date,
      },
    });
  }, [navigate, rowId, name, start_date, end_date]);

  return (
    <Button variant="outline" size="sm" onClick={handleNavigate}>
      Detalhes
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
    cell: ({ row }) => {
      const date = new Date(row.getValue('start_date'));
      return <div className="font-medium">{date.toLocaleDateString()}</div>;
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
    cell: ({ row }) => {
      const date = new Date(row.getValue('end_date'));
      return <div className="font-medium">{date.toLocaleDateString()}</div>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const myRow = row.original;

      return (
        <div className="flex justify-end">
          <NavigateButton
            rowId={myRow.id.toString()}
            name={myRow.name}
            start_date={myRow.start_date}
            end_date={myRow.end_date}
          />
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];
