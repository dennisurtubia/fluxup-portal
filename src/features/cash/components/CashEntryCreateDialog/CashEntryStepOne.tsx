import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';

import { paymentTypeOptions } from './utils/payment_type-utils';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { CurrencyInput } from '@/components/ui/currency-input';
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CategoryType } from '@/features/categories/http/CategoryHttpService';
import { PartyCombobox } from '@/features/party/components/PartyCombobox';
import { PartyType } from '@/features/party/http/PartyHttpService';
import { TagType } from '@/features/tag/http/TagHttpService';
import { cn } from '@/lib/utils';

export type CashEntryStepOneData = {
  category_id: string;
  description: string;
  transaction_date: Date;
  type: 'income' | 'expense';
  payment_type:
    | 'boleto'
    | 'ted'
    | 'pix'
    | 'credit_card'
    | 'debit_card'
    | 'cash'
    | 'direct_debit'
    | 'account_credit';
  party_id: string;
  tags?: number[];
  amount: number;
};

interface CashEntryStepOneProps {
  form: UseFormReturn<CashEntryStepOneData>;
  categories?: CategoryType[];
  isLoadingCategories: boolean;
  tags?: TagType[];
  isLoadingTags: boolean;
  parties?: PartyType[];
  isLoadingParties: boolean;
  partySearch: string;
  onPartySearchChange: (_search: string) => void;
  selectedParty: PartyType | null;
  onSelectedPartyChange: (_party: PartyType | null) => void;
}

export function CashEntryStepOne({
  form,
  categories,
  isLoadingCategories,
  tags,
  isLoadingTags,
  parties,
  isLoadingParties,
  partySearch,
  onPartySearchChange,
  selectedParty,
  onSelectedPartyChange,
}: CashEntryStepOneProps) {
  return (
    <Form {...form}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        <FormField
          control={form.control}
          name="category_id"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Categoria</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        isLoadingCategories ? 'Carregando categorias...' : 'Selecione a categoria'
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
              <FormMessage className="min-h-[20px]" />
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
              <FormMessage className="min-h-[20px]" />
            </FormItem>
          )}
        />
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
              <FormMessage className="min-h-[20px]" />
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
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className=" w-full ">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent ref={field.ref}>
                    <SelectItem value="income">Receita</SelectItem>
                    <SelectItem value="expense">Despesa</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage className="min-h-[20px]" />
            </FormItem>
          )}
        />
        <div className="min-h-[20px]">
          <FormLabel>Valor</FormLabel>
          <CurrencyInput form={form} placeholder="Ex: R$100,00" name="amount" />
        </div>
        <FormField
          control={form.control}
          name="payment_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Forma de Pagamento</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
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
              <FormMessage className="min-h-[20px]" />
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
                <PartyCombobox
                  value={field.value}
                  onChange={field.onChange}
                  parties={parties}
                  isLoading={isLoadingParties}
                  search={partySearch}
                  onSearchChange={onPartySearchChange}
                  selectedParty={selectedParty}
                  onSelectedPartyChange={onSelectedPartyChange}
                />
              </FormControl>
              <FormMessage className="min-h-[20px]" />
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
                  options={tags ? tags.map((tag) => ({ value: tag.id, label: tag.name })) : []}
                  selected={field.value || []}
                  onChange={field.onChange}
                  placeholder={
                    isLoadingTags ? 'Carregando Agrupadores...' : 'Selecione os Agrupadores'
                  }
                />
              </FormControl>
              <FormMessage className="min-h-[20px]" />
            </FormItem>
          )}
        />
      </div>
    </Form>
  );
}
