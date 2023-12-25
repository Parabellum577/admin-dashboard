import getSymbolFromCurrency from 'currency-symbol-map';

export const renderCurrency = (currency: string) => {
  return getSymbolFromCurrency(currency) || currency;
};
