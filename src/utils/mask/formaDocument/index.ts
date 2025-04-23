import IMask from 'imask';

export function formatDocument(value: string): string {
  const digits = value.replace(/\D/g, '');

  const masked = IMask.createMask({
    mask: [{ mask: '000.000.000-00' }, { mask: '00.000.000/0000-00' }],
    dispatch: (appended, dynamicMasked) => {
      const newValue = (dynamicMasked.value + appended).replace(/\D/g, '');
      return newValue.length > 11 ? dynamicMasked.compiledMasks[1] : dynamicMasked.compiledMasks[0];
    },
  });

  masked.resolve(digits);
  return masked.value;
}
