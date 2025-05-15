import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useMemo, forwardRef, useImperativeHandle, useCallback, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';

import {
  BudgetEntryBodyType,
  budgetEntryHttpServiceInstance,
} from '../../http/BudgetEntryHttpService';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  categoryHttpServiceInstance,
  CategoryType,
} from '@/features/categories/http/CategoryHttpService';
import { tagHttpServiceInstance, TagType } from '@/features/tag/http/TagHttpService';
import { formatMoneyInput } from '@/utils/mask/formatMoneyInput';

const budgetEntryCreateSchema = z.object({
  description: z.string().max(40),
  type: z.enum(['income', 'expense']),
  category_id: z.number(),
  tags: z.array(z.number()).optional(),
  values: z
    .array(z.object({ month: z.number(), amount: z.number() }))
    .min(1, 'Informe ao menos um mês')
    .refine((vals) => vals.some((v) => v.amount > 0), {
      message: 'Informe ao menos um valor maior que zero',
      path: ['values'],
    }),
});

export type BudgetEntryCreateDialogRef = {
  open: () => void;
  close: () => void;
  setBudgetId: (_: number) => void;
  setInitialMonth: (_: string) => void;
  setLastMonth: (_: string) => void;
};

const BudgetEntryCreateDialog = forwardRef<BudgetEntryCreateDialogRef>((_, ref) => {
  const [open, setOpen] = useState(false);
  const [budgetId, setBudgetId] = useState<number | null>(null);
  const [initialMonth, setInitialMonth] = useState<string | null>(null);
  const [lastMonth, setLastMonth] = useState<string | null>(null);
  const [defaultValue, setDefaultValue] = useState<number>(0);
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(budgetEntryCreateSchema),
    defaultValues: {
      description: '',
      type: undefined,
      category_id: undefined,
      tags: [],
      values: [],
    },
  });

  const watchedValues = useWatch({ control: form.control, name: 'values' });

  useImperativeHandle(ref, () => ({
    open: () => setOpen(true),
    close: () => setOpen(false),
    setBudgetId: (id) => setBudgetId(id),
    setInitialMonth: (m) => setInitialMonth(m),
    setLastMonth: (m) => setLastMonth(m),
  }));

  type BudgetEntryCreateData = z.infer<typeof budgetEntryCreateSchema>;

  const { data: categories } = useQuery<CategoryType[]>({
    queryKey: ['categories', budgetId],
    queryFn: () => categoryHttpServiceInstance.getCategories(),
    retry: false,
  });

  const { data: tags } = useQuery<TagType[]>({
    queryKey: ['tags', budgetId],
    queryFn: () => tagHttpServiceInstance.getTags(),
    retry: false,
  });

  const months = useMemo(() => {
    if (!initialMonth || !lastMonth) return [];
    const [startYear, startMonth] = initialMonth.split('-').map(Number);
    const [endYear, endMonth] = lastMonth.split('-').map(Number);

    const list = [];
    for (let y = startYear; y <= endYear; y++) {
      const start = y === startYear ? startMonth : 1;
      const end = y === endYear ? endMonth : 12;
      for (let m = start; m <= end; m++) {
        list.push({ year: y, month: m });
      }
    }
    return list;
  }, [initialMonth, lastMonth]);

  useEffect(() => {
    if (months.length > 0) {
      const initialValues = months.map((m) => ({ month: m.month, amount: 0 }));
      form.reset({
        ...form.getValues(),
        values: initialValues,
      });
    }
  }, [months, form]);

  const total = useMemo(() => {
    return (
      watchedValues.reduce((sum, v) => sum + (typeof v.amount === 'number' ? v.amount : 0), 0) / 100
    );
  }, [watchedValues]);

  const applyDefaultToAll = () => {
    if (defaultValue > 0) {
      form.setValue(
        'values',
        months.map((m) => ({ ...m, amount: defaultValue })),
      );
    }
  };

  const budgetMutation = useMutation({
    mutationFn: async (data: BudgetEntryCreateData) => {
      if (budgetId == null) return null;
      return budgetEntryHttpServiceInstance.createBudgetEntry(budgetId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgetCashFlow', budgetId] });
      setOpen(false);
      form.reset();
      toast.success('Entrada criada com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao criar entrada');
    },
  });

  const onSubmit = useCallback(
    (data: BudgetEntryBodyType) => {
      const dataConverted = {
        ...data,
        values: data.values
          .filter((v) => typeof v.amount === 'number' && v.amount > 0)
          .map((v) => ({
            ...v,
            amount: v.amount / 100,
          })),
      };
      budgetMutation.mutate(dataConverted);
    },
    [budgetMutation],
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[900px] p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle>Adicionar nova entrada</DialogTitle>
          <DialogDescription>
            Preencha os valores mensais e informações da entrada.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x">
              <div className="p-6 space-y-6 md:w-1/2">
                <FormField
                  control={form.control}
                  name="category_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria</FormLabel>
                      <FormControl>
                        <Select onValueChange={(v) => field.onChange(Number(v))}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories?.map((c) => (
                              <SelectItem key={c.id} value={c.id.toString()}>
                                {c.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="income">Receita</SelectItem>
                            <SelectItem value="expense">Despesa</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Agrupadores</FormLabel>
                      <FormControl>
                        <MultiSelect
                          options={tags?.map((tag) => ({ value: tag.id, label: tag.name })) ?? []}
                          selected={field.value ?? []}
                          onChange={field.onChange}
                          placeholder="Selecione os agrupadores"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <Label>Valor Padrão Mensal</Label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      inputMode="numeric"
                      placeholder="R$ 0,00"
                      value={formatMoneyInput(defaultValue.toString())}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, '');
                        const numeric = parseInt(raw || '0', 10);
                        setDefaultValue(numeric);
                      }}
                    />
                    <Button type="button" variant="outline" onClick={applyDefaultToAll}>
                      Aplicar a Todos
                    </Button>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="text-sm font-medium">Resumo</div>
                  <div className="flex justify-between">
                    <span>Total Anual:</span>
                    <span className="font-bold">R$ {total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Média Mensal:</span>
                    <span>R$ {(months.length > 0 ? total / months.length : 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 md:w-1/2">
                <FormLabel>Valores Mensais</FormLabel>
                <ScrollArea className="mt-4 h-[350px]">
                  <div className="space-y-4 pr-4">
                    {months.map((m, index) => (
                      <FormField
                        key={`${m.month}-${m.year}`}
                        control={form.control}
                        name={`values.${index}.amount`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{`${m.month}/${m.year}`}</FormLabel>
                            <FormControl>
                              <Input
                                value={
                                  field.value !== undefined
                                    ? formatMoneyInput(field.value.toString())
                                    : ''
                                }
                                onChange={(e) => {
                                  const raw = e.target.value.replace(/\D/g, '');
                                  const numeric = raw === '' ? '' : parseInt(raw, 10);
                                  field.onChange(numeric);
                                }}
                                inputMode="numeric"
                                placeholder="R$ 0,00"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
            <DialogFooter className="px-6 py-4 border-t">
              <Button variant="outline" type="button" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Salvar Entradas</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
});

export default BudgetEntryCreateDialog;
