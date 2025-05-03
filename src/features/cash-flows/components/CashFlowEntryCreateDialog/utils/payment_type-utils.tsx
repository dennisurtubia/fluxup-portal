export type PaymentType = 'boleto' | 'pix' | 'ted' | 'credit_card' | 'debit_card';

export const paymentTypeLabel: Record<PaymentType, string> = {
  boleto: 'Boleto',
  pix: 'PIX',
  ted: 'TED',
  credit_card: 'Cartão de Crédito',
  debit_card: 'Cartão de Débito',
};

export const paymentTypeOptions = Object.entries(paymentTypeLabel) as [PaymentType, string][];
