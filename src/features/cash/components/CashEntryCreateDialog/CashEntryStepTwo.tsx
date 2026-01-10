import { UseFormReturn } from 'react-hook-form';

import EntryItemsFieldArray from '../EntryItemsFieldArray/EntryItemsFieldArray';

import { Form, FormLabel } from '@/components/ui/form';

export type CashEntryStepTwoData = {
  items: Array<{
    amount: number;
    bank_account_id: number;
    description: string;
  }>;
};

interface CashEntryStepTwoProps {
  form: UseFormReturn<CashEntryStepTwoData>;
  total: number;
  computedTotalItems: number;
}

export function CashEntryStepTwo({ form, total, computedTotalItems }: CashEntryStepTwoProps) {
  return (
    <Form {...form}>
      <div>
        <div className="space-y-4">
          <div>
            <FormLabel className="text-sm font-medium">Valores e Contas Bancárias</FormLabel>
            <EntryItemsFieldArray control={form.control} name="items" minItems={1} />
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="font-medium">Resumo</div>
          <div className="flex justify-between">
            <span className="text-sm">Total:</span>
            <span className="font-bold">R$ {total}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Soma dos itens:</span>
            <span>R$ {computedTotalItems}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Restante:</span>
            <span>R$ {(total - computedTotalItems).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </Form>
  );
}
