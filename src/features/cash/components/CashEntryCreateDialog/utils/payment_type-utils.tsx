import { PaymentType } from '@/features/cash/http/CashEntryHttpService';

export const paymentTypeLabel: Record<PaymentType, string> = {
  boleto: 'Boleto',
  credit_card: 'Cartão de Crédito',
  debit_card: 'Cartão de Débito',
  account_credit: 'Crédito em conta',
  direct_debit: 'Débito em conta',
  cash: 'Dinheiro',
  pix: 'PIX',
  ted: 'TED',
};

export const paymentTypeOptions = Object.entries(paymentTypeLabel) as [PaymentType, string][];
