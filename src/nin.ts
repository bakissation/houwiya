import type { ParseResultBase, Sex } from './types.js';
import { requireString } from './errors.js';
import { toAsciiDigits } from './normalize.js';
import { luhnValid } from './checksums.js';

export interface NinParsed extends ParseResultBase {
  /** Sex from the 2-digit prefix (10 → male, 11 → female), if recognized. */
  sex?: Sex;
  /** The 3-digit birth-year suffix (e.g. "988" for 1988). Century is not encoded. */
  birthYearDigits?: string;
  /** 4-digit birth-commune code. */
  communeCode?: string;
  /** 4-digit birth-certificate sequence number. */
  actSequence?: string;
  /** 4 reserve digits (usually "0000"). */
  reserve?: string;
  /** The final Luhn check digit. */
  checkDigit?: string;
}

/**
 * Parse an Algerian NIN (Numéro d'Identification National) — 18 digits with a
 * Luhn check digit. Decomposes into sex, birth year, commune, act sequence, etc.
 *
 * @example
 * parseNin('119881234056700007').sex // 'female'
 */
export function parseNin(input: string): NinParsed {
  requireString(input, 'NIN');
  const normalized = toAsciiDigits(input).replace(/\s/g, '');
  const base: NinParsed = { input, normalized, valid: false };

  if (!/^\d{18}$/.test(normalized)) {
    return { ...base, error: 'NIN must be 18 digits' };
  }

  const sexCode = normalized.slice(0, 2);
  const sex: Sex | undefined =
    sexCode === '10' ? 'male' : sexCode === '11' ? 'female' : undefined;

  const parsed: NinParsed = {
    ...base,
    sex,
    birthYearDigits: normalized.slice(2, 5),
    communeCode: normalized.slice(5, 9),
    actSequence: normalized.slice(9, 13),
    reserve: normalized.slice(13, 17),
    checkDigit: normalized.slice(17, 18),
  };

  if (!luhnValid(normalized)) {
    return { ...parsed, error: 'Invalid NIN checksum (Luhn)' };
  }
  return { ...parsed, valid: true };
}

/** True if `input` is a structurally- and checksum-valid NIN. */
export function isValidNin(input: string): boolean {
  return parseNin(input).valid;
}
