export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  const ddd = digits.slice(0, 2);
  const rest = digits.slice(2);
  if (!ddd) return '';
  let num: string;
  if (rest.length <= 8) {
    // (00) 0000-0000
    const p1 = rest.slice(0, 4);
    const p2 = rest.slice(4);
    num = `${p1}${p2 ? `-${p2}` : ''}`;
  } else {
    // (00) 00000-0000
    const p1 = rest.slice(0, 5);
    const p2 = rest.slice(5);
    num = `${p1}${p2 ? `-${p2}` : ''}`;
  }
  return `(${ddd}) ${num}`;
}
