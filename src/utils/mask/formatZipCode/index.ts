import IMask from 'imask';

export function formatZipCode(value: string): string {
  const digits = value.replace(/\D/g, '');

  const masked = IMask.createMask({
    mask: '00000-000',
  });

  masked.resolve(digits);
  return masked.value;
}
