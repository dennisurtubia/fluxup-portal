import IMask from 'imask';

export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '');

  const masked = IMask.createMask({
    mask: [
      {
        mask: '(00) 00000-0000',
      },
      {
        mask: '(00) 0000-0000',
      },
    ],
    dispatch: (appended, dynamicMasked) => {
      const newValue = (dynamicMasked.value + appended).replace(/\D/g, '');

      return newValue.length > 10 ? dynamicMasked.compiledMasks[0] : dynamicMasked.compiledMasks[1];
    },
  });

  masked.resolve(digits);
  return masked.value;
}
