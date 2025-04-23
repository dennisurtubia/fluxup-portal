import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { forwardRef, useImperativeHandle, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';

import { partiesHttpServiceInstance } from '../../http/PartyHttpService';
import { zipCodeHttpServiceInstance, ZipCodeType } from '../../http/ZipCodeHttpService';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { formatDocument } from '@/utils/mask/formaDocument';
import { formatPhone } from '@/utils/mask/formatPhone';
import { formatZipCode } from '@/utils/mask/formatZipCode';

const personalSchema = z.object({
  name: z
    .string({ required_error: 'Nome é obrigatório' })
    .nonempty('Nome é obrigatório')
    .max(150, 'Nome deve ter no máximo 150 caracteres'),
  document: z
    .string({ required_error: 'CPF/CNPJ é obrigatório' })
    .nonempty('CPF/CNPJ é obrigatório')
    .transform((val) => val.replace(/\D/g, ''))
    .refine((digits) => /^\d{11}$/.test(digits) || /^\d{14}$/.test(digits), {
      message: 'Informe um CPF (11 dígitos) ou CNPJ (14 dígitos) válido',
    }),
  phone_number: z
    .string({ required_error: 'Telefone é obrigatório' })
    .nonempty('Telefone é obrigatório')
    .transform((val) => val.replace(/\D/g, ''))
    .refine((digits) => digits.length === 10 || digits.length === 11, {
      message: 'Telefone deve ter 10 ou 11 dígitos (somente números)',
    }),
  email: z.string({ required_error: 'Email é obrigatório' }).email('Email inválido'),
});
type PersonalData = z.infer<typeof personalSchema>;

const addressSchema = z.object({
  zip_code: z
    .string({ required_error: 'CEP é obrigatório' })
    .nonempty('CEP é obrigatório')
    .transform((val) => val.replace(/\D/g, ''))
    .refine((digits) => digits.length === 8, {
      message: 'CEP deve ter exatamente 8 dígitos (somente números)',
    }),
  state: z
    .string({ required_error: 'Estado é obrigatório' })
    .length(2, 'Estado deve ter exatamente 2 caracteres'),
  city: z
    .string({ required_error: 'Cidade é obrigatória' })
    .min(2, 'Cidade deve ter ao menos 2 caracteres')
    .max(50, 'Cidade deve ter no máximo 50 caracteres'),
  street: z
    .string({ required_error: 'Rua é obrigatória' })
    .min(2, 'Rua deve ter ao menos 2 caracteres')
    .max(100, 'Rua deve ter no máximo 100 caracteres'),
  number: z
    .string({ required_error: 'Número é obrigatório' })
    .min(1, 'Número deve ter ao menos 1 caractere')
    .max(10, 'Número deve ter no máximo 10 caracteres'),
  complement: z.string().optional(),
  neighborhood: z
    .string({ required_error: 'Bairro é obrigatório' })
    .min(2, 'Bairro deve ter ao menos 2 caracteres')
    .max(50, 'Bairro deve ter no máximo 50 caracteres'),
  country: z
    .string({ required_error: 'País é obrigatório' })
    .min(2, 'País deve ter ao menos 2 caracteres')
    .max(50, 'País deve ter no máximo 50 caracteres'),
});
type AddressData = z.infer<typeof addressSchema>;

export type PartyCreateDialogRef = { open(): void; close(): void };

const PartyCreateDialog = forwardRef<PartyCreateDialogRef>((_, ref) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  const personalForm = useForm<PersonalData>({
    resolver: zodResolver(personalSchema),
    mode: 'onTouched',
  });
  const addressForm = useForm<AddressData>({
    resolver: zodResolver(addressSchema),
    mode: 'onTouched',
  });

  useImperativeHandle(ref, () => ({
    open: () => {
      personalForm.reset();
      addressForm.reset();
      setStep(1);
      setOpen(true);
    },
    close: () => setOpen(false),
  }));

  const zipCodeRaw = addressForm.watch('zip_code') ?? '';
  const cleanedZip = zipCodeRaw.replace(/\D/g, '');

  const { isLoading } = useQuery<ZipCodeType, Error, ZipCodeType, readonly ['cep', string]>({
    queryKey: ['cep', cleanedZip] as const,
    queryFn: () =>
      zipCodeHttpServiceInstance.getZipCodeData(cleanedZip).then((data) => {
        addressForm.setValue('state', data.state);
        addressForm.setValue('city', data.city);
        addressForm.setValue('street', data.street);
        addressForm.setValue('neighborhood', data.neighborhood ?? '');
        return data;
      }),
    enabled: cleanedZip.length === 8,
    retry: false,
  });

  const queryClient = useQueryClient();
  const partieMutation = useMutation({
    mutationFn: (data: { address: AddressData } & PersonalData) =>
      partiesHttpServiceInstance.createParty(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parties', 1] });
      setOpen(false);
      personalForm.reset();
      addressForm.reset();
      toast.success('Parceiro criado com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao criar o parceiro.');
    },
  });

  const handleNext = async () => {
    const ok = await personalForm.trigger();
    if (!ok) return;
    setStep(2);
  };
  const handleBack = () => setStep(1);

  const onFinalSubmit = useCallback(
    async (addressData: AddressData) => {
      const okPersonal = await personalForm.trigger();
      if (!okPersonal) {
        setStep(1);
        return;
      }
      const personalData = personalForm.getValues();
      const payload = { ...personalData, address: addressData };
      partieMutation.mutate(payload);
    },
    [personalForm, partieMutation],
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Criar parceiro</DialogTitle>
          <DialogDescription>
            {step === 1 ? 'Informe os dados pessoais.' : 'Agora informe o endereço.'}
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <Form {...personalForm}>
            <form onSubmit={personalForm.handleSubmit(handleNext)} className="space-y-4">
              <FormField
                name="name"
                control={personalForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ex: Marcos" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="email"
                control={personalForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ex: marcos@gmail.com" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="phone_number"
                control={personalForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input
                        value={formatPhone(field.value || '')}
                        onChange={(e) => {
                          const raw = e.target.value.replace(/\D/g, '');
                          field.onChange(raw);
                        }}
                        placeholder="(00) 00000-0000"
                        inputMode="numeric"
                        maxLength={15}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="document"
                control={personalForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPF/CNPJ</FormLabel>
                    <FormControl>
                      <Input
                        value={formatDocument(field.value || '')}
                        onChange={(e) => {
                          const raw = e.target.value.replace(/\D/g, '');
                          field.onChange(raw);
                        }}
                        inputMode="numeric"
                        maxLength={18}
                        placeholder="000.000.000-00 ou 00.000.000/0000-00"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="submit">Próximo</Button>
              </DialogFooter>
            </form>
          </Form>
        )}

        {step === 2 && (
          <Form {...addressForm}>
            <form onSubmit={addressForm.handleSubmit(onFinalSubmit)} className="space-y-4">
              <FormField
                name="zip_code"
                control={addressForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CEP</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={formatZipCode(field.value || '')}
                        onChange={(e) => {
                          const raw = e.target.value.replace(/\D/g, '');
                          field.onChange(raw);
                        }}
                        inputMode="numeric"
                        maxLength={9}
                        disabled={isLoading}
                        placeholder="00000-000"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="state"
                control={addressForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ex: PR" disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="city"
                control={addressForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cidade</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ex: Campo Mourão" disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="street"
                control={addressForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rua</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ex: Rua das Flores" disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="number"
                control={addressForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ex: 201" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="complement"
                control={addressForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Complemento</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ex: Apto 202" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="neighborhood"
                control={addressForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bairro</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ex: Centro" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="country"
                control={addressForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>País</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ex: Brasil" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={handleBack}>
                  Voltar
                </Button>
                <Button type="submit" disabled={isLoading || partieMutation.isPending}>
                  {isLoading || partieMutation.isPending ? 'Carregando…' : 'Salvar'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
});

export default PartyCreateDialog;
