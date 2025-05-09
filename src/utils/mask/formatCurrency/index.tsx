export function formatCurrency(currency: number) {
  return currency.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}
