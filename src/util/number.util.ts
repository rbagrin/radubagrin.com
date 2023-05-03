export const keepOnlyXDigits = (value: number, digits = 4): number => {
  const aux = 10 ** digits;
  return Math.floor(value * aux) / aux;
};
