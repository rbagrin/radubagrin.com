export const THOUSAND = 1000;
export const MILLION = 1000000;
export const BILLION = 1000000000;

export const round = (value: number, digits = 4): number => {
  const aux = 10 ** digits;
  return Math.floor(value * aux) / aux;
};

export const shortenNumber = (value: number): string => {
  if (value > BILLION) {
    const shortN = round(value / BILLION, 2);
    return `${shortN}B`;
  }

  if (value > MILLION) {
    const shortN = round(value / MILLION, 2);
    return `${shortN}M`;
  }

  if (value > THOUSAND) {
    const shortN = round(value / THOUSAND, 2);
    return `${shortN}k`;
  }

  return value.toString();
};
