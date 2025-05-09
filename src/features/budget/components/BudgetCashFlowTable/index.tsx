import { useQuery } from '@tanstack/react-query';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

import { budgetEntryHttpServiceInstance } from '../../http/BudgetEntryHttpService';
import { budgetHttpServiceInstance } from '../../http/BudgetHttpService';

import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency } from '@/utils/mask/formatCurrency';

interface BudgetTableProps {
  budgetId: number;
}

const months = [
  { name: 'Janeiro', number: 1 },
  { name: 'Fevereiro', number: 2 },
  { name: 'Março', number: 3 },
  { name: 'Abril', number: 4 },
  { name: 'Maio', number: 5 },
  { name: 'Junho', number: 6 },
  { name: 'Julho', number: 7 },
  { name: 'Agosto', number: 8 },
  { name: 'Setembro', number: 9 },
  { name: 'Outubro', number: 10 },
  { name: 'Novembro', number: 11 },
  { name: 'Dezembro', number: 12 },
];

export function BudgetCashFlowTable({ budgetId }: BudgetTableProps) {
  const [expandedMonths, setExpandedMonths] = useState<number[]>([]);

  const toggleMonth = (month: number) => {
    setExpandedMonths((prev) =>
      prev.includes(month) ? prev.filter((m) => m !== month) : [...prev, month],
    );
  };

  const { data: budgetCashFlow } = useQuery({
    queryKey: ['budgetCashFlow', budgetId],
    queryFn: () => budgetHttpServiceInstance.getBudgetCashFlow(budgetId),
  });

  const { data: entriesByMonth } = useQuery({
    queryKey: ['entriesByMonth', budgetId, ...expandedMonths],
    queryFn: async () => {
      const results = await Promise.all(
        expandedMonths.map((month) =>
          budgetEntryHttpServiceInstance.getEntriesByMonth(budgetId, month),
        ),
      );

      return Object.fromEntries(expandedMonths.map((m, i) => [m, results[i]]));
    },
    enabled: expandedMonths.length > 0,
  });

  const getCashFlow = (month: number) =>
    budgetCashFlow?.find((entry) => entry.month === month) || {
      total_incomes: 0,
      total_expenses: 0,
      balance: 0,
    };

  const getMonthEntries = (month: number) => entriesByMonth?.[month] || [];

  return (
    <div className="rounded-md border overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="pl-5 w-[200px]">Mês</TableHead>
            <TableHead className="text-right">Receitas</TableHead>
            <TableHead className="text-right">Despesas</TableHead>
            <TableHead className="pr-5 text-right">Saldo</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {months.map(({ name, number }) => {
            const isExpanded = expandedMonths.includes(number);
            const cashFlow = getCashFlow(number);
            const entries = getMonthEntries(number);

            return (
              <>
                <TableRow
                  className="hover:bg-muted/50 cursor-pointer"
                  onClick={() => toggleMonth(number)}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 mr-2" />
                      ) : (
                        <ChevronRight className="h-4 w-4 mr-2" />
                      )}
                      {name}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium text-green-600 dark:text-green-200">
                    {formatCurrency(cashFlow.total_incomes)}
                  </TableCell>
                  <TableCell className="text-right font-medium text-red-600 dark:text-red-200">
                    {formatCurrency(cashFlow.total_expenses)}
                  </TableCell>
                  <TableCell
                    className={`text-right font-medium ${
                      cashFlow.balance >= 0
                        ? 'text-green-600 dark:text-green-200'
                        : 'text-red-600 dark:text-red-200'
                    }`}
                  >
                    {formatCurrency(cashFlow.balance)}
                  </TableCell>
                </TableRow>

                {isExpanded && entries.length > 0 && (
                  <TableRow className="bg-muted/30">
                    <TableCell colSpan={4} className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-b border-muted">
                            <TableHead className="w-[200px]">Category</TableHead>
                            <TableHead className="pl-5">Descrição</TableHead>
                            <TableHead className="w-[100px] text-center">Tipo</TableHead>
                            <TableHead className="pr-5 text-right">Valor</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {entries.map((entry) => (
                            <TableRow
                              key={entry.id}
                              className="border-b border-muted last:border-0"
                            >
                              <TableCell className="font-medium">{entry.category.name}</TableCell>
                              <TableCell>{entry.description}</TableCell>
                              <TableCell>
                                <Badge
                                  variant={entry.type === 'income' ? 'success' : 'destructive'}
                                >
                                  {entry.type === 'income' ? 'Receita' : 'Despesa'}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                {formatCurrency(entry.amount)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableCell>
                  </TableRow>
                )}

                {isExpanded && entries.length === 0 && (
                  <TableRow className="bg-muted/30">
                    <TableCell
                      colSpan={4}
                      className="text-center text-sm text-muted-foreground py-2"
                    >
                      Sem entradas para esse mês
                    </TableCell>
                  </TableRow>
                )}
              </>
            );
          })}

          {/* Year total row */}
          <TableRow className="bg-muted/50 font-bold">
            <TableCell>Total Anual</TableCell>
            <TableCell className="text-right text-green-600 dark:text-green-200">
              {formatCurrency(budgetCashFlow?.reduce((acc, c) => acc + c.total_incomes, 0) || 0)}
            </TableCell>
            <TableCell className="text-right text-red-600 dark:text-red-200">
              {formatCurrency(budgetCashFlow?.reduce((acc, c) => acc + c.total_expenses, 0) || 0)}
            </TableCell>
            <TableCell className="text-right">
              {formatCurrency(budgetCashFlow?.reduce((acc, c) => acc + c.balance, 0) || 0)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
