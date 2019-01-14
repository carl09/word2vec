export const DEFAULT_CURRENCY = 'AUD';

export type currencyTypes = 'AUD' | 'USD' | 'EUR' | 'MYR';

export const convertCurrency = (currency: currencyTypes, value: number) => {
  // console.log('convertCurrency', currency, value);
  switch (currency) {
    case 'AUD':
      return value;
    case 'USD':
      return value * 0.75;
    case 'EUR':
      return value * 0.64;
    case 'MYR':
      return value * 3.0;
    default:
      return 0;
  }
};
