import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';

import { cashEntryHttpServiceInstance } from '../../http/CashEntryHttpService';

import { CashEntryStepOne } from './CashEntryStepOne';
import { CashEntryStepTwo } from './CashEntryStepTwo';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Stepper } from '@/components/ui/stepper';
import {
  categoryHttpServiceInstance,
  CategoryType,
} from '@/features/categories/http/CategoryHttpService';
import { partiesHttpServiceInstance, PartyType } from '@/features/party/http/PartyHttpService';
import { tagHttpServiceInstance, TagType } from '@/features/tag/http/TagHttpService';
import { useDebounce } from '@/hooks/useDebounce';
import { useDidMountUpdate } from '@/hooks/useDidMountUpdate';

const cashEntryCreateSchema = z.object({
  description: z.string().max(40, 'A descrição deve ter no máximo 40 caracteres'),
  type: z.enum(['income', 'expense']),
  payment_type: z.enum([
    'boleto',
    'ted',
    'pix',
    'credit_card',
    'debit_card',
    'cash',
    'direct_debit',
    'account_credit',
  ]),
  transaction_date: z.date(),
  tags: z.array(z.number().int()).optional(),
  category_id: z.string(),
  party_id: z.string(),
  amount: z.number({ required_error: 'O valor é obrigatório' }),
  items: z
    .array(
      z.object({
        amount: z.number().min(0.01, 'Valor deve ser maior que zero'),
        bank_account_id: z.number().min(1, 'Selecione uma conta bancária'),
        description: z.string(),
      }),
    )
    .min(1, 'Pelo menos um item é obrigatório'),
});

const cashEntryStepOneSchema = z.object({
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
});

const cashEntryStepTwoSchema = cashEntryCreateSchema.pick({
  items: true,
});

const STEPS = [
  {
    title: 'Informações Gerais',
    description: 'Dados básicos da entrada',
  },
  {
    title: 'Valores e Contas',
    description: 'Defina os valores e contas bancárias',
  },
];

export type CashEntryCreateDialogRef = {
  open: () => void;
  close: () => void;
  setCashId: (_: number) => void;
};

type CashEntryCreateData = z.infer<typeof cashEntryCreateSchema>;
type CashEntryStepOneData = z.infer<typeof cashEntryStepOneSchema>;
type CashEntryStepTwoData = z.infer<typeof cashEntryStepTwoSchema>;

const CashEntryCreateDialog = forwardRef<CashEntryCreateDialogRef>((_, ref) => {
  const [open, setOpen] = useState(false);
  const [cashId, setCashId] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [partySearch, setPartySearch] = useState('');
  const [selectedParty, setSelectedParty] = useState<PartyType | null>(null);
  const debouncedPartySearch = useDebounce(partySearch);
  const queryClient = useQueryClient();

  const formStepOne = useForm<CashEntryStepOneData>({
    resolver: zodResolver(cashEntryStepOneSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      description: '',
    },
  });

  const formStepTwo = useForm<CashEntryStepTwoData>({
    resolver: zodResolver(cashEntryStepTwoSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      items: [
        {
          amount: 0,
          bank_account_id: 0,
          description: '',
        },
      ],
    },
  });

  const total = useWatch({ control: formStepOne.control, name: 'amount', defaultValue: 0.0 });
  const totalItems = useWatch({ control: formStepTwo.control, name: 'items', defaultValue: [] });
  const partyId = useWatch({ control: formStepOne.control, name: 'party_id', defaultValue: '' });

  const computedTotalItems = useMemo(() => {
    return totalItems.reduce((acc, item) => acc + (item.amount || 0), 0);
  }, [totalItems]);

  useEffect(() => {
    if (!partyId) {
      setSelectedParty(null);
    }
  }, [partyId]);

  useImperativeHandle(ref, () => ({
    open: () => {
      setOpen(true);
      setCurrentStep(0);
    },
    close: () => {
      setOpen(false);
      setCurrentStep(0);
    },
    setCashId: (newCashId: number) => setCashId(newCashId),
  }));

  const cashMutation = useMutation({
    mutationFn: async (data: CashEntryCreateData) => {
      if (cashId == null) return Promise.resolve(null);

      return cashEntryHttpServiceInstance.createCashEntry(cashId, {
        ...data,
        category_id: Number(data.category_id),
        party_id: Number(data.party_id),
        transaction_date: data.transaction_date.toISOString(),
        tags: data.tags,
        items: data.items,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cash-entry', 1] });

      setOpen(false);
      setCurrentStep(0);
      formStepOne.reset();
      formStepTwo.reset();

      toast.success('Entrada criada com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao criar entrada');
    },
  });

  const handleSubmitStepOne = formStepOne.handleSubmit(async () => {
    // Validação bem-sucedida, avança para o próximo step
    setCurrentStep(1);
    // Limpa os erros do step 2 ao entrar nele
    formStepTwo.clearErrors();
  });

  const handleSubmitStepTwo = formStepTwo.handleSubmit(async (dataStepTwo) => {
    const dataStepOne = formStepOne.getValues();

    const data: CashEntryCreateData = {
      ...dataStepOne,
      ...dataStepTwo,
    };

    cashMutation.mutate(data);
  });

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

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

  useDidMountUpdate(() => {
    if (open) {
      formStepOne.reset(undefined, {
        keepErrors: false,
        keepDirty: false,
        keepTouched: false,
      });
      formStepTwo.reset(undefined, {
        keepErrors: false,
        keepDirty: false,
        keepTouched: false,
      });
      setCurrentStep(0);
    }
  }, [formStepOne, formStepTwo, open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar entrada</DialogTitle>
          <DialogDescription>Preencha os detalhes para criar uma nova entrada.</DialogDescription>
        </DialogHeader>

        <div className="mb-6">
          <Stepper currentStep={currentStep} steps={STEPS} />
        </div>

        {currentStep === 0 && (
          <form onSubmit={handleSubmitStepOne} className="space-y-4">
            <CashEntryStepOne
              form={formStepOne}
              categories={categories}
              isLoadingCategories={isLoadingCategories}
              tags={tags}
              isLoadingTags={isLoadingTags}
              parties={parties}
              isLoadingParties={isLoadingParties}
              partySearch={partySearch}
              onPartySearchChange={setPartySearch}
              selectedParty={selectedParty}
              onSelectedPartyChange={setSelectedParty}
            />

            <DialogFooter className="flex justify-end mt-6">
              <Button type="submit">Próximo</Button>
            </DialogFooter>
          </form>
        )}

        {currentStep === 1 && (
          <form onSubmit={handleSubmitStepTwo} className="space-y-4">
            <CashEntryStepTwo
              form={formStepTwo}
              total={total}
              computedTotalItems={computedTotalItems}
            />

            <DialogFooter className="flex justify-between mt-6">
              <Button type="button" variant="outline" onClick={handlePreviousStep}>
                Voltar
              </Button>
              <Button type="submit" disabled={cashMutation.isPending}>
                {cashMutation.isPending ? 'Salvando...' : 'Salvar'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
});

export default CashEntryCreateDialog;
