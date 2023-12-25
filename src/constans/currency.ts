export const currencies: Record<string, string> = {
  eur: '€',
  usd: '$',
  gbp: '£',
};
export enum CURRENCY {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  MXN = 'MXN',
}

export const CURRENCY_LIST: string[] = [CURRENCY.USD, CURRENCY.EUR, CURRENCY.GBP, CURRENCY.MXN]