export function formatCep(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  const p1 = digits.slice(0, 5);
  const p2 = digits.slice(5, 8);
  return `${p1}${p2 ? `-${p2}` : ''}`;
}
