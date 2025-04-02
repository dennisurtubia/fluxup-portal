import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';

import { TagsHttpServiceInstance } from '../../http/TagsHttpService';

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

const TagsCreateSchema = z.object({
  name: z.string(),
  description: z.string(),
});

export type TagsCreateDialogRef = {
  open: () => void;
  close: () => void;
};

type TagsCreateData = z.infer<typeof TagsCreateSchema>;

const TagsCreateDialog = forwardRef<TagsCreateDialogRef>((_, ref) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<TagsCreateData>({
    resolver: zodResolver(TagsCreateSchema),
  });

  useImperativeHandle(ref, () => ({
    open: () => setOpen(true),
    close: () => setOpen(false),
  }));

  const TagsMutation = useMutation({
    mutationFn: (data: TagsCreateData) => TagsHttpServiceInstance.createTags(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags', 1] });
      setOpen(false);
      form.reset();

      toast.success('Tag criada com sucesso!');
    },
    onError: () => {},
  });

  const onSubmit = useCallback(
    (data: TagsCreateData) => {
      TagsMutation.mutate(data);
    },
    [TagsMutation],
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Criar nova tag</DialogTitle>
          <DialogDescription>Preencha os detalhes para criar uma nova tag.</DialogDescription>
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
                    <Textarea placeholder="Descrição breve da categoria" {...field} />
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

export default TagsCreateDialog;
