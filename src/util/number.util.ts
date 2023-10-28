export const THOUSAND = 1000;
export const MILLION = 1000000;
export const BILLION = 1000000000;

export const round = (value: number, digits = 4): number => {
  const aux = 10 ** digits;
  return Math.floor(value * aux) / aux;
};

export const shortenNumber = (value: number, digits = 2): string => {
  if (Math.abs(value) > BILLION) {
    const shortN = round(value / BILLION, digits);
    return `${shortN}B`;
  }

  if (Math.abs(value) > MILLION) {
    const shortN = round(value / MILLION, digits);
    return `${shortN}M`;
  }

  if (Math.abs(value) > THOUSAND) {
    const shortN = round(value / THOUSAND, digits);
    return `${shortN}k`;
  }

  return round(value, digits).toString();
};
