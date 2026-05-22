import type { ParseResultBase } from './types.js';
import { requireString } from './errors.js';
import { toAsciiDigits } from './normalize.js';
import { mod97 } from './checksums.js';

export interface RibParsed extends ParseResultBase {
  /** 3-digit bank code (007 = Algérie Poste). */
  bank?: string;
  /** 5-digit agency code. */
  agency?: string;
  /** 10-digit account number. */
  account?: string;
  /** 2-digit RIB key (mod-97). */
  key?: string;
}

/**
 * Parse a 20-digit Algerian RIB: bank(3) · agency(5) · account(10) · key(2).
 * The key is validated by the mod-97 rule of BoA Instruction 62-94:
 * `agency·account·key` (17 digits) must be ≡ 0 (mod 97).
 */
export function parseRib(input: string): RibParsed {
  requireString(input, 'RIB');
  const normalized = toAsciiDigits(input).replace(/\D/g, '');
  const base: RibParsed = { input, normalized, valid: false };

  if (normalized.length !== 20) {
    return { ...base, error: 'RIB must be 20 digits' };
  }

  const parsed: RibParsed = {
    ...base,
    bank: normalized.slice(0, 3),
    agency: normalized.slice(3, 8),
    account: normalized.slice(8, 18),
    key: normalized.slice(18, 20),
  };

  if (mod97(normalized.slice(3)) !== 0) {
    return { ...parsed, error: 'Invalid RIB key (mod-97)' };
  }
  return { ...parsed, valid: true };
}

/** True if `input` is a structurally- and checksum-valid RIB. */
export function isValidRib(input: string): boolean {
  return parseRib(input).valid;
}

/** Compute the 2-digit mod-97 RIB key for an agency + account (zero-padded). */
export function computeRibKey(agency: string, account: string): string {
  const ac = agency.padStart(5, '0') + account.padStart(10, '0');
  const key = 97 - mod97(ac + '00');
  return String(key).padStart(2, '0');
}
