import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';

import { categoryHttpServiceInstance } from '../../http/CategoryHttpService';

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
import { Textarea } from '@/components/ui/textarea';

const CategoryCreateSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
});

export type CategoryCreateDialogRef = {
  open: () => void;
  close: () => void;
};

type CategoryCreateData = z.infer<typeof CategoryCreateSchema>;

const CategoryCreateDialog = forwardRef<CategoryCreateDialogRef>((_, ref) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<CategoryCreateData>({
    resolver: zodResolver(CategoryCreateSchema),
  });

  useImperativeHandle(ref, () => ({
    open: () => setOpen(true),
    close: () => setOpen(false),
  }));

  const CategoryMutation = useMutation({
    mutationFn: (data: CategoryCreateData) => categoryHttpServiceInstance.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories', 1] });
      setOpen(false);
      form.reset();

      toast.success('Categoria criada com sucesso!');
    },
    onError: () => {},
  });

  const onSubmit = useCallback(
    (data: CategoryCreateData) => {
      CategoryMutation.mutate(data);
    },
    [CategoryMutation],
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Criar uma nova categoria</DialogTitle>
          <DialogDescription>Preencha os detalhes para criar uma nova categoria.</DialogDescription>
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
                    <Input placeholder="Ex: Alimentação" {...field} />
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
                    <Textarea placeholder="Descrição breve da Categoria" {...field} />
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

export default CategoryCreateDialog;
