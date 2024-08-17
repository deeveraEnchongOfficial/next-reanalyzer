export const currencySymbols: { [key: string]: string } = {
  USD: "$", // US Dollar
  EUR: "€", // Euro
  GBP: "£", // British Pound Sterling
  JPY: "¥", // Japanese Yen
  AUD: "A$", // Australian Dollar
  CAD: "C$", // Canadian Dollar
  CHF: "CHF", // Swiss Franc
  CNY: "¥", // Chinese Yuan
  INR: "₹", // Indian Rupee
  RUB: "₽", // Russian Ruble
  BRL: "R$", // Brazilian Real
  ZAR: "R", // South African Rand
};

/**
 * Function to get the currency symbol based on the currency code
 * @param currencyCode - The ISO 4217 currency code (e.g., 'USD', 'EUR', 'INR')
 * @returns The corresponding currency symbol if found, otherwise the currency code itself
 */
export function getCurrencySymbol(currencyCode: string): string {
  return currencySymbols[currencyCode.toUpperCase()] || currencyCode;
}
