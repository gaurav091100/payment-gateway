import { CardType } from "../types/payment";

export const validateCardNumber = (num: string, cardType: CardType) => {
  const digits = num.replace(/\s/g, '');
  if (!/^\d+$/.test(digits)) return false;

  if (cardType === 'amex') return digits.length === 15;
  if (cardType === 'visa' || cardType === 'mastercard') return digits.length === 16;

  return digits.length >= 13 && digits.length <= 19;
};

export const validateName = (name: string) => {
  return name.trim().length >= 3;
};

export const validateCVV = (cvv: string, isAmex: boolean) => {
  return isAmex ? /^\d{4}$/.test(cvv) : /^\d{3}$/.test(cvv);
};

export const validateExpiry = (expiry: string) => {
  const [month, year] = expiry.split('/');
  if (!month || !year) return false;

  const mm = Number(month);
  const yy = Number(year);

  if (mm < 1 || mm > 12) return false;

  const now = new Date();
  const expDate = new Date(2000 + yy, mm);

  return expDate > now;
};