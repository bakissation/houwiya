import type { ParseResultBase } from './types.js';
import { requireString } from './errors.js';
import { toAsciiDigits } from './normalize.js';

/** ISO 13616 mod-97: move first 4 chars to the end, map letters A=10…Z=35, take mod 97. Valid IBAN ⇒ 1. */
function ibanMod97(iban: string): number {
  const rearranged = iban.slice(4) + iban.slice(0, 4);
  let remainder = 0;
  for (let i = 0; i < rearranged.length; i++) {
    const c = rearranged.charCodeAt(i);
    const value = c >= 65 ? c - 55 : c - 48; // 'A'(65)→10 … 'Z'(90)→35 ; '0'(48)→0
    remainder = (remainder * (value > 9 ? 100 : 10) + value) % 97;
  }
  return remainder;
}

export interface IbanParsed extends ParseResultBase {
  /** Country code (DZ for Algeria). */
  country?: string;
  /** 2 ISO check digits. */
  checkDigits?: string;
  /** The 20-digit BBAN — which is exactly the Algerian RIB. */
  rib?: string;
}

/**
 * Parse an Algerian IBAN: `DZ` + 2 ISO check digits + the 20-digit RIB (BBAN),
 * 24 characters total, validated by ISO 13616 mod-97. Note Algeria is not in
 * the official SWIFT IBAN registry, so support is best-effort.
 */
export function parseIban(input: string): IbanParsed {
  requireString(input, 'IBAN');
  const normalized = toAsciiDigits(input).replace(/\s/g, '').toUpperCase();
  const base: IbanParsed = { input, normalized, valid: false };

  if (!/^DZ\d{22}$/.test(normalized)) {
    return { ...base, error: 'Algerian IBAN must be "DZ" + 22 digits (24 chars total)' };
  }

  const parsed: IbanParsed = {
    ...base,
    country: 'DZ',
    checkDigits: normalized.slice(2, 4),
    rib: normalized.slice(4),
  };

  if (ibanMod97(normalized) !== 1) {
    return { ...parsed, error: 'Invalid IBAN checksum (mod-97)' };
  }
  return { ...parsed, valid: true };
}

/** True if `input` is a structurally- and checksum-valid Algerian IBAN. */
export function isValidIban(input: string): boolean {
  return parseIban(input).valid;
}
