import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  stateMunicipalityHttpServiceInstance,
  StateType,
  MunicipalityType,
} from '../../http/StateMunicipalityHttpService';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatCpfCnpj } from '@/utils/formatCpfCnpj';
import { formatPhone } from '@/utils/formatPhone';

const partnerCreateSchema = z.object({
  name: z.string({ required_error: 'O nome é obrigatório' }),
  email: z.string({ required_error: 'O Email é obrigatório' }).email({ message: 'Email inválido' }),
  phone: z.string({ required_error: 'O telefone é obrigatório' }),
  address: z.string({ required_error: 'O endereço é obrigatório' }),
  city: z.string({ required_error: 'A cidade é obrigatória' }),
  state: z.string({ required_error: 'O estado é obrigatório' }),
  cpfCnpj: z.string({ required_error: 'O CPF/CNPJ é obrigatório' }),
});

export type PartnerCreateDialogRef = {
  open: () => void;
  close: () => void;
};

type PartnerCreateData = z.infer<typeof partnerCreateSchema>;

const PartnerCreateDialog = forwardRef<PartnerCreateDialogRef>((_, ref) => {
  const [open, setOpen] = useState(false);
  const [selectedUf, setSelectedUf] = useState('');

  const form = useForm<PartnerCreateData>({
    resolver: zodResolver(partnerCreateSchema),
  });

  useImperativeHandle(ref, () => ({
    open: () => setOpen(true),
    close: () => setOpen(false),
  }));

  const { data: states, isLoading: isLoadingStates } = useQuery<StateType[] | undefined>({
    queryKey: ['states'],
    retry: false,
    queryFn: async () => {
      const response = await stateMunicipalityHttpServiceInstance.getStates();
      return response;
    },
  });

  const { data: municipalities, isLoading: isLoadingMunicipalities } = useQuery<
    MunicipalityType[] | undefined
  >({
    queryKey: ['municipalities', selectedUf],
    enabled: !!selectedUf,
    retry: false,
    queryFn: async () => {
      const response = await stateMunicipalityHttpServiceInstance.getMunicipalities(selectedUf);
      return response;
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Criar parceiro</DialogTitle>
          <DialogDescription>Preencha os detalhes para criar um novo parceiro.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Marcos" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: marcos@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: (11) 98765-4321"
                      value={field.value || ''}
                      onChange={(e) => {
                        const formatted = formatPhone(e.target.value);
                        field.onChange(formatted);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cpfCnpj"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF/CNPJ</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: 123.456.789-00 ou 12.345.678/0001-00"
                      value={field.value || ''}
                      onChange={(e) => {
                        const formatted = formatCpfCnpj(e.target.value);
                        field.onChange(formatted);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedUf(value);
                        form.setValue('city', '');
                      }}
                      value={field.value || ''}
                      defaultValue=""
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione um estado" />
                      </SelectTrigger>
                      <SelectContent>
                        {isLoadingStates ? (
                          <SelectItem value="loading" disabled>
                            Carregando estados...
                          </SelectItem>
                        ) : (
                          states?.map((state) => (
                            <SelectItem key={state.sigla} value={state.sigla}>
                              {state.nome}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cidade</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ''}
                      disabled={!municipalities || municipalities.length === 0}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={
                            isLoadingMunicipalities
                              ? 'Carregando cidades...'
                              : 'Selecione uma cidade'
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {isLoadingMunicipalities ? (
                          <SelectItem value="loading" disabled>
                            Carregando cidades...
                          </SelectItem>
                        ) : (
                          municipalities?.map((city) => (
                            <SelectItem key={city.codigo_ibge} value={city.nome}>
                              {city.nome}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endereço</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Rua Exemplo, 123" {...field} />
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

export default PartnerCreateDialog;
