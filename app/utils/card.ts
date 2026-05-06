import { CardType } from "../types/payment";

export const detectCardType = (number: string): CardType => {
  if (/^4[0-9]{12}(?:[0-9]{3})?$/.test(number)) return 'visa';
  if (/^5[1-5][0-9]{14}$/.test(number)) return 'mastercard';
  if (/^3[47][0-9]{13}$/.test(number)) return 'amex';
  return 'unknown';
}














