/**
 * Remainder of a (potentially very long) numeric string modulo 97, computed
 * digit-by-digit so it never overflows `Number`. Used by RIB / RIP-CCP / IBAN.
 */
export function mod97(numeric: string): number {
  let remainder = 0;
  for (let i = 0; i < numeric.length; i++) {
    remainder = (remainder * 10 + (numeric.charCodeAt(i) - 48)) % 97;
  }
  return remainder;
}

/** Luhn validity of a numeric string (the last digit is the check digit). Used by the NIN. */
export function luhnValid(numeric: string): boolean {
  if (!/^\d+$/.test(numeric)) return false;
  let sum = 0;
  let double = false;
  for (let i = numeric.length - 1; i >= 0; i--) {
    let d = numeric.charCodeAt(i) - 48;
    if (double) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    double = !double;
  }
  return sum % 10 === 0;
}

/** The Luhn check digit (0–9) for a numeric string that does NOT yet include one. */
export function luhnCheckDigit(numericWithoutCheck: string): number {
  let sum = 0;
  let double = true;
  for (let i = numericWithoutCheck.length - 1; i >= 0; i--) {
    let d = numericWithoutCheck.charCodeAt(i) - 48;
    if (double) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    double = !double;
  }
  return (10 - (sum % 10)) % 10;
}
