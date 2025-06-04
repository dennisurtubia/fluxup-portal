export function formatCurrency(currency: number) {
  return currency.toFixed(2).replace('.', ',');
}
