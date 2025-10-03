import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';

import { cashEntryHttpServiceInstance } from '../../http/CashEntryHttpService';

import { getBankDisplayData } from './utils/bank-utils';
import { paymentTypeOptions } from './utils/payment_type-utils';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { CurrencyInput } from '@/components/ui/currency-input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MultiSelect } from '@/components/ui/multi-select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  bankAccountHttpServiceInstance,
  BankAccountType,
} from '@/features/bank-account/http/BankAcoountHttpService';
import {
  categoryHttpServiceInstance,
  CategoryType,
} from '@/features/categories/http/CategoryHttpService';
import { partiesHttpServiceInstance, PartyType } from '@/features/party/http/PartyHttpService';
import { tagHttpServiceInstance, TagType } from '@/features/tag/http/TagHttpService';
import { useDidMountUpdate } from '@/hooks/useDidMountUpdate';
import { cn } from '@/lib/utils';

const cashEntryCreateSchema = z.object({
  description: z.string().max(40, 'A descrição deve ter no máximo 40 caracteres'),
  amount: z.number({ required_error: 'O valor é obrigatório' }),
  type: z.enum(['income', 'expense']),
  payment_type: z.enum([
    'boleto',
    'ted',
    'pix',
    'credit_card',
    'debit_card',
    'direct_debit',
    'cash',
  ]),
  transaction_date: z.date(),
  tags: z.array(z.number().int()).optional(),
  category_id: z.string(),
  bank_account_id: z.string(),
  party_id: z.string(),
});

export type CashEntryCreateDialogRef = {
  open: () => void;
  close: () => void;
  setCashId: (_: number) => void;
};

type CashEntryCreateData = z.infer<typeof cashEntryCreateSchema>;

const CashEntryCreateDialog = forwardRef<CashEntryCreateDialogRef>((_, ref) => {
  const [open, setOpen] = useState(false);
  const [cashId, setCashId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const form = useForm<CashEntryCreateData>({
    resolver: zodResolver(cashEntryCreateSchema),
    mode: 'onTouched',
    defaultValues: {
      description: '',
    },
  });

  useImperativeHandle(ref, () => ({
    open: () => setOpen(true),
    close: () => setOpen(false),
    setCashId: (newCashId: number) => setCashId(newCashId),
  }));

  const cashMutation = useMutation({
    mutationFn: async (data: CashEntryCreateData) => {
      if (cashId == null) return Promise.resolve(null);

      return cashEntryHttpServiceInstance.createCashEntry(cashId, {
        ...data,
        category_id: Number(data.category_id),
        bank_account_id: Number(data.bank_account_id),
        party_id: Number(data.party_id),
        transaction_date: data.transaction_date.toISOString(),
        tags: data.tags,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cash-entry', 1] });

      setOpen(false);
      form.reset();

      toast.success('Entrada criada com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao criar entrada');
    },
  });

  const onSubmit = useCallback(
    (data: CashEntryCreateData) => {
      cashMutation.mutate(data);
    },
    [cashMutation],
  );

  const { data: tags, isLoading: isLoadingTags } = useQuery<TagType[] | undefined>({
    queryKey: ['tags', 1],
    retry: false,
    queryFn: async () => {
      const response = await tagHttpServiceInstance.getTags();
      return response;
    },
  });

  const { data: categories, isLoading: isLoadingCategories } = useQuery<CategoryType[] | undefined>(
    {
      queryKey: ['categories', 1],
      retry: false,
      queryFn: async () => {
        const response = await categoryHttpServiceInstance.getCategories();
        return response;
      },
    },
  );

  const { data: bankAccounts, isLoading: isLoadingBankAccounts } = useQuery<
    BankAccountType[] | undefined
  >({
    queryKey: ['bank-accounts', 1],
    retry: false,
    queryFn: async () => {
      const response = await bankAccountHttpServiceInstance.getBankAccounts();
      return response;
    },
  });

  const { data: parties, isLoading: isLoadingParties } = useQuery<PartyType[] | undefined>({
    queryKey: ['parties', 1],
    retry: false,
    queryFn: async () => {
      const response = await partiesHttpServiceInstance.getParties();
      return response;
    },
  });

  useDidMountUpdate(() => {
    if (open) {
      form.reset(undefined, {
        keepErrors: false,
      });
    }
  }, [open, form]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Criar entrada</DialogTitle>
          <DialogDescription>Preencha os detalhes para criar uma nova entrada.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder={
                              isLoadingCategories
                                ? 'Carregando categorias...'
                                : 'Selecione a categoria'
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {categories
                            ? categories.map((category) => (
                                <SelectItem key={category.name} value={category.id.toString()}>
                                  {category.name}
                                </SelectItem>
                              ))
                            : []}
                        </SelectContent>
                      </Select>
                    </FormControl>
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
                      <Input placeholder="Ex: Viagem" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div>
                <FormLabel>Valor</FormLabel>
                <CurrencyInput form={form} placeholder="Ex: R$100,00" name="amount" />
              </div>
              <FormField
                control={form.control}
                name="transaction_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data de transação</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'dd/MM/yyyy')
                            ) : (
                              <span>Selecione uma data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        />
                      </PopoverContent>
                    </Popover>
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
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="payment_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Forma de Pagamento</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger className=" w-full ">
                          <SelectValue placeholder="Selecione a forma de pagamento" />
                        </SelectTrigger>
                        <SelectContent ref={field.ref}>
                          {paymentTypeOptions.map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bank_account_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Conta bancária</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder={
                              isLoadingBankAccounts ? 'Carregando contas...' : 'Selecione a conta'
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {bankAccounts?.map((bankAccount) => {
                            const { logo } = getBankDisplayData(bankAccount.bank);

                            return (
                              <SelectItem key={bankAccount.id} value={bankAccount.id.toString()}>
                                <div className="flex items-center gap-2">
                                  {logo}
                                  {bankAccount.name}
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="party_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parceiro</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder={
                              isLoadingParties ? 'Carregando parceiros...' : 'Selecione o parceiro'
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {parties
                            ? parties.map((party) => (
                                <SelectItem key={party.id} value={party.id.toString()}>
                                  {party.name}
                                </SelectItem>
                              ))
                            : []}
                        </SelectContent>
                      </Select>
                    </FormControl>
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
                        options={
                          tags ? tags.map((tag) => ({ value: tag.id, label: tag.name })) : []
                        }
                        selected={field.value || []}
                        onChange={field.onChange}
                        placeholder={
                          isLoadingTags ? 'Carregando Agrupadores...' : 'Selecione os Agrupadores'
                        }
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
});

export default CashEntryCreateDialog;
