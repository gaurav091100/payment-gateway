import { CardType } from "../types/payment";

export const detectCardType = (number: string): CardType => {
  const digits = number.replace(/\D/g, "");

  if (digits.startsWith("4")) return "visa";

  const firstTwo = Number(digits.slice(0, 2));
  const firstFour = Number(digits.slice(0, 4));
  if ((firstTwo >= 51 && firstTwo <= 55) || (firstFour >= 2221 && firstFour <= 2720)) {
    return "mastercard";
  }

  if (digits.startsWith("34") || digits.startsWith("37")) return "amex";

  return 'unknown';
}














