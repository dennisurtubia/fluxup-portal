export function formatCpfCnpj(value: string): string {
  const digits = value.replace(/\D/g, '');
  if (!digits) return '';

  if (digits.length <= 11) {
    let cpf = digits.slice(0, 3);
    if (digits.length > 3) cpf += '.' + digits.slice(3, 6);
    if (digits.length > 6) cpf += '.' + digits.slice(6, 9);
    if (digits.length > 9) cpf += '-' + digits.slice(9, 11);
    return cpf;
  } else {
    let cnpj = digits.slice(0, 2);
    if (digits.length > 2) cnpj += '.' + digits.slice(2, 5);
    if (digits.length > 5) cnpj += '.' + digits.slice(5, 8);
    if (digits.length > 8) cnpj += '/' + digits.slice(8, 12);
    if (digits.length > 12) cnpj += '-' + digits.slice(12, 14);
    return cnpj;
  }
}
