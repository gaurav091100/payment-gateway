export const validateCardNumber = (num: string) => {
  return num.replace(/\s/g, '').length >= 16;
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