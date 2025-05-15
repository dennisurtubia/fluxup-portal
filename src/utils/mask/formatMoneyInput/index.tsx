export function formatMoneyInput(raw: string): string {
  const digits = raw.replace(/\D/g, '');

  if (!digits) return '';

  const number = parseFloat(digits) / 100;

  return number.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  });
}
