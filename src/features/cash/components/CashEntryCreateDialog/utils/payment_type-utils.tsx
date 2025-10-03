import { PaymentType } from '@/features/cash/http/CashEntryHttpService';

export const paymentTypeLabel: Record<PaymentType, string> = {
  boleto: 'Boleto',
  pix: 'PIX',
  ted: 'TED',
  credit_card: 'Cartão de Crédito',
  debit_card: 'Cartão de Débito',
  direct_debit: 'Débito em conta',
  cash: 'Dinheiro',
};

export const paymentTypeOptions = Object.entries(paymentTypeLabel) as [PaymentType, string][];
