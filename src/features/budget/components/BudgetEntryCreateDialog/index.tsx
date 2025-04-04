import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';

import { budgetEntryHttpServiceInstance } from '../../http/BudgetEntryHttpService';

import { Button } from '@/components/ui/button';
import { CurrencyInput } from '@/components/ui/currency-input';
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
import { MultiSelect } from '@/components/ui/multi-select';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TagHttpServiceInstance, TagType } from '@/features/tag/http/TagHttpService';

const budgetEntryCreateSchema = z.object({
  description: z.string().max(40, 'A descrição deve ter no máximo 40 caracteres'),
  amount_micro: z.number(),
  type: z.enum(['income', 'expense']),
  tags: z.array(z.number().int()),
});

export type BudgetEntryCreateDialogRef = {
  open: () => void;
  close: () => void;
};

type BudgetEntryCreateData = z.infer<typeof budgetEntryCreateSchema>;

const BudgetEntryCreateDialog = forwardRef<BudgetEntryCreateDialogRef>((_, ref) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<BudgetEntryCreateData>({
    resolver: zodResolver(budgetEntryCreateSchema),
  });

  useImperativeHandle(ref, () => ({
    open: () => setOpen(true),
    close: () => setOpen(false),
  }));

  const budgetMutation = useMutation({
    mutationFn: (data: BudgetEntryCreateData) =>
      budgetEntryHttpServiceInstance.createBudgetEntry(1, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets-entry', 1] });
      setOpen(false);
      form.reset();

      toast.success('Entrada criada com sucesso!');
    },
    onError: () => {},
  });

  const onSubmit = useCallback(
    (data: BudgetEntryCreateData) => {
      const convertedData = {
        ...data,
        amount_micro: Math.round(data.amount_micro * 100),
      };

      budgetMutation.mutate(convertedData);
    },
    [budgetMutation],
  );

  const { data: tags, isLoading } = useQuery<TagType[] | undefined>({
    queryKey: ['tags', 1],
    retry: false,
    queryFn: async () => {
      const response = await TagHttpServiceInstance.getTags();
      return response;
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Criar entrada</DialogTitle>
          <DialogDescription>Preencha os detalhes para criar uma nova entrada.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Viagem" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount_micro"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor</FormLabel>
                  <FormControl>
                    <CurrencyInput form={form} placeholder="Ex: R$100,00" {...field} />
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
                  <FormLabel>Tipo de entrada</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange}>
                      <SelectTrigger className=" w-full ">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent ref={field.ref}>
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
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={tags ? tags.map((tag) => ({ value: tag.id, label: tag.name })) : []}
                      selected={field.value}
                      onChange={field.onChange}
                      placeholder={isLoading ? 'Carregando tags...' : 'Selecione as tags'}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
});

export default BudgetEntryCreateDialog;
