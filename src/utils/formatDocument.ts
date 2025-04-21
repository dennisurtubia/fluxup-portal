export function formatDocument(value: string): string {
  const digits = value.replace(/\D/g, '');
  if (digits.length <= 11) {
    // CPF: 000.000.000-00
    const part1 = digits.slice(0, 3);
    const part2 = digits.slice(3, 6);
    const part3 = digits.slice(6, 9);
    const part4 = digits.slice(9, 11);
    return [
      part1,
      part2 ? `.${part2}` : '',
      part3 ? `.${part3}` : '',
      part4 ? `-${part4}` : '',
    ].join('');
  } else {
    // CNPJ: 00.000.000/0000-00
    const part1 = digits.slice(0, 2);
    const part2 = digits.slice(2, 5);
    const part3 = digits.slice(5, 8);
    const part4 = digits.slice(8, 12);
    const part5 = digits.slice(12, 14);
    return [
      part1,
      part2 ? `.${part2}` : '',
      part3 ? `.${part3}` : '',
      part4 ? `/${part4}` : '',
      part5 ? `-${part5}` : '',
    ].join('');
  }
}
