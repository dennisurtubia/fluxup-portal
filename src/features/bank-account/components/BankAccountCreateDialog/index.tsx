import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';

import BancoDoBrasilLogo from '../../../../assets/bb-logo.svg';
import CresolLogo from '../../../../assets/cresol-logo.svg';
import { bankAccountHttpServiceInstance } from '../../http/BankAcoountHttpService';

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

const bankAccountCreateSchema = z.object({
  name: z.string({ required_error: 'Nome é obrigatório' }),
  number: z.string().max(15),
  branch_code: z.string().max(15),
  bank: z.enum(['BANCO_DO_BRASIL', 'CRESOL'], {
    errorMap: () => ({ message: 'Selecione um banco' }),
  }),
});

export type BankAccountCreateDialogRef = {
  open: () => void;
  close: () => void;
};

type BankAccountCreateData = z.infer<typeof bankAccountCreateSchema>;

const BankAccountCreateDialog = forwardRef<BankAccountCreateDialogRef>((_, ref) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<BankAccountCreateData>({
    resolver: zodResolver(bankAccountCreateSchema),
  });

  useImperativeHandle(ref, () => ({
    open: () => setOpen(true),
    close: () => setOpen(false),
  }));

  const bankAccountMutation = useMutation({
    mutationFn: (data: BankAccountCreateData) =>
      bankAccountHttpServiceInstance.createBankAccount(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bankAccounts', 1] });
      setOpen(false);
      form.reset();
      toast.success('Conta bancária criada com sucesso!');
    },
    onError: () => {},
  });

  const onSubmit = useCallback(
    (data: BankAccountCreateData) => {
      bankAccountMutation.mutate(data);
    },
    [bankAccountMutation],
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Criar conta bancária</DialogTitle>
          <DialogDescription>
            Preencha os detalhes para criar uma nova conta bancária.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Conta BB" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nº da Conta</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: 12345-0"
                      inputMode="numeric"
                      onBeforeInput={(e) => {
                        const inputEvent = e.nativeEvent as InputEvent;
                        const char = inputEvent.data;
                        if (char && !/[\d-]/.test(char)) {
                          e.preventDefault();
                        }
                      }}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="branch_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nº da Agência</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: 0406-5"
                      inputMode="numeric"
                      onBeforeInput={(e) => {
                        const inputEvent = e.nativeEvent as InputEvent;
                        const char = inputEvent.data;
                        if (char && !/[\d-]/.test(char)) {
                          e.preventDefault();
                        }
                      }}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bank"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Banco</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange}>
                      <SelectTrigger className=" w-full ">
                        <SelectValue placeholder="Selecione o banco" />
                      </SelectTrigger>
                      <SelectContent ref={field.ref}>
                        <SelectItem value="BANCO_DO_BRASIL">
                          <div className="flex items-center gap-2">
                            <img
                              src={BancoDoBrasilLogo}
                              alt="Banco do Brasil"
                              className="w-6 h-6"
                            />
                            Banco do Brasil
                          </div>
                        </SelectItem>

                        <SelectItem value="CRESOL">
                          <div className="flex items-center gap-2">
                            <img src={CresolLogo} alt="Cresol" className="w-6 h-6" />
                            Cresol
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
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

export default BankAccountCreateDialog;
