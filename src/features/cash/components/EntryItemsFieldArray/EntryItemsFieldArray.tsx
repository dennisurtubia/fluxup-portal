import { useQuery } from '@tanstack/react-query';
import { ArrayPath, Control, FieldValues, Path } from 'react-hook-form';

import { CurrencyInput } from '@/components/ui/currency-input';
import FieldArray from '@/components/ui/field-array';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
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

export interface EntryItemsEntry {
  amount: number;
  bank_account_id: number;
}

export interface EntryItemsFieldArrayProps<TFieldValues extends FieldValues = FieldValues> {
  control: Control<TFieldValues>;
  name: ArrayPath<TFieldValues>;
  className?: string;
  minItems?: number;
  maxItems?: number;
  disabled?: boolean;
  onAdd?: (_index: number) => void;
  onRemove?: (_index: number) => void;
}

export function EntryItemsFieldArray<TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  className,
  minItems = 1,
  maxItems,
  disabled = false,
  onAdd,
  onRemove,
}: EntryItemsFieldArrayProps<TFieldValues>) {
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

  const defaultValue: EntryItemsEntry = {
    amount: 0,
    bank_account_id: 0,
  };

  return (
    <FieldArray
      control={control}
      name={name}
      defaultValue={defaultValue}
      addButtonText="Adicionar Valor e Conta"
      removeButtonText="Remover"
      className={className}
      minItems={minItems}
      maxItems={maxItems}
      onAdd={onAdd}
      onRemove={onRemove}
      disabled={disabled}
    >
      {(index) => (
        <>
          <div className="w-full min-w-0">
            <CurrencyInput
              control={control}
              placeholder="Ex: R$100,00"
              name={`${name}.${index}.amount` as unknown as Path<TFieldValues>}
              label="Valor"
            />
          </div>
          <div className="w-full min-w-0">
            <FormField
              control={control}
              name={`${name}.${index}.bank_account_id` as unknown as Path<TFieldValues>}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Conta Bancária</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value?.toString()}
                      onValueChange={(val) => field.onChange(Number(val))}
                      disabled={disabled || isLoadingBankAccounts}
                    >
                      <SelectTrigger className="overflow-hidden w-full">
                        <SelectValue
                          placeholder={
                            isLoadingBankAccounts
                              ? 'Carregando contas...'
                              : 'Selecione a conta bancária'
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {bankAccounts?.map((account) => (
                          <SelectItem key={account.id} value={account.id.toString()}>
                            {account.name}
                          </SelectItem>
                        )) || []}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-full min-w-0">
            <FormField
              control={control}
              name={`${name}.${index}.description` as unknown as Path<TFieldValues>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Viagem" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </>
      )}
    </FieldArray>
  );
}

export default EntryItemsFieldArray;
