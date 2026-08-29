import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';

import { cashEntryHttpServiceInstance } from '../../http/CashEntryHttpService';

import { CashEntryForm, CashEntryFormData } from './CashEntryForm';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
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
import { useDebounce } from '@/hooks/useDebounce';
import { useDidMountUpdate } from '@/hooks/useDidMountUpdate';

const cashEntryCreateSchema = z.object({
  category_id: z
    .string({ required_error: 'Selecione uma categoria' })
    .min(1, 'Selecione uma categoria'),
  description: z.string().max(40, 'A descrição deve ter no máximo 40 caracteres'),
  transaction_date: z.date({ required_error: 'Selecione uma data' }),
  type: z.enum(['income', 'expense'], { required_error: 'Selecione o tipo de entrada' }),
  payment_type: z.enum(
    ['boleto', 'ted', 'pix', 'credit_card', 'debit_card', 'cash', 'direct_debit', 'account_credit'],
    { required_error: 'Selecione a forma de pagamento' },
  ),
  party_id: z.string({ required_error: 'Selecione um parceiro' }).min(1, 'Selecione um parceiro'),
  tags: z.array(z.number().int()).optional(),
  amount: z
    .number({ required_error: 'O valor é obrigatório' })
    .min(0.01, 'O valor deve ser maior que zero'),
  bank_account_id: z
    .number({ required_error: 'Selecione uma conta bancária' })
    .min(1, 'Selecione uma conta bancária'),
});

export type CashEntryCreateDialogRef = {
  open: () => void;
  close: () => void;
  setCashId: (_: number) => void;
};

const CashEntryCreateDialog = forwardRef<CashEntryCreateDialogRef>((_, ref) => {
  const [open, setOpen] = useState(false);
  const [cashId, setCashId] = useState<number | null>(null);
  const [partySearch, setPartySearch] = useState('');
  const [selectedParty, setSelectedParty] = useState<PartyType | null>(null);
  const debouncedPartySearch = useDebounce(partySearch);
  const queryClient = useQueryClient();

  const form = useForm<CashEntryFormData>({
    resolver: zodResolver(cashEntryCreateSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      description: '',
      tags: [],
    },
  });

  const partyId = useWatch({ control: form.control, name: 'party_id', defaultValue: '' });

  useEffect(() => {
    if (!partyId) {
      setSelectedParty(null);
    }
  }, [partyId]);

  useImperativeHandle(ref, () => ({
    open: () => setOpen(true),
    close: () => setOpen(false),
    setCashId: (newCashId: number) => setCashId(newCashId),
  }));

  const cashMutation = useMutation({
    mutationFn: async (data: CashEntryFormData) => {
      if (cashId == null) return Promise.resolve(null);

      return cashEntryHttpServiceInstance.createCashEntry(cashId, {
        description: data.description,
        amount: data.amount,
        type: data.type,
        tags: data.tags,
        transaction_date: data.transaction_date.toISOString(),
        category_id: Number(data.category_id),
        party_id: Number(data.party_id),
        payment_type: data.payment_type,
        bank_account_id: data.bank_account_id,
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

  const onSubmit = form.handleSubmit((data) => {
    cashMutation.mutate(data);
  });

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

  const { data: parties, isLoading: isLoadingParties } = useQuery<PartyType[] | undefined>({
    queryKey: ['parties', debouncedPartySearch],
    retry: false,
    queryFn: async () => {
      const response = await partiesHttpServiceInstance.getParties({
        name: debouncedPartySearch.trim(),
        limit: 5,
        offset: 0,
      });
      return response;
    },
  });

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

  useDidMountUpdate(() => {
    if (open) {
      form.reset(undefined, {
        keepErrors: false,
        keepDirty: false,
        keepTouched: false,
      });
    }
  }, [form, open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar entrada</DialogTitle>
          <DialogDescription>Preencha os detalhes para criar uma nova entrada.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-6">
            <CashEntryForm
              form={form}
              categories={categories}
              isLoadingCategories={isLoadingCategories}
              tags={tags}
              isLoadingTags={isLoadingTags}
              parties={parties}
              isLoadingParties={isLoadingParties}
              bankAccounts={bankAccounts}
              isLoadingBankAccounts={isLoadingBankAccounts}
              partySearch={partySearch}
              onPartySearchChange={setPartySearch}
              selectedParty={selectedParty}
              onSelectedPartyChange={setSelectedParty}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={cashMutation.isPending}>
                {cashMutation.isPending ? 'Salvando...' : 'Salvar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
});

export default CashEntryCreateDialog;
