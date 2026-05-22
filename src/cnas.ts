import type { ParseResultBase, Wilaya } from './types.js';
import { requireString } from './errors.js';
import { toAsciiDigits } from './normalize.js';
import { lookupWilaya } from './wilaya.js';

export interface CnasEmployerParsed extends ParseResultBase {
  /** Wilaya from the leading 2 digits. */
  wilaya?: Wilaya;
  /** The remaining 8 sequence digits. */
  sequence?: string;
}

/**
 * Parse a CNAS employer number — 10 digits, `WW.xxx.xxx.xx`, where the first 2
 * digits are the wilaya code (Loi 83-14, art. 6). No checksum is defined, so
 * this validates structure only and extracts the wilaya.
 */
export function parseCnasEmployer(input: string): CnasEmployerParsed {
  requireString(input, 'CNAS employer number');
  const normalized = toAsciiDigits(input).replace(/\D/g, '');
  const base: CnasEmployerParsed = { input, normalized, valid: false };

  if (normalized.length !== 10) {
    return { ...base, error: 'CNAS employer number must be 10 digits' };
  }

  return {
    ...base,
    valid: true,
    wilaya: lookupWilaya(normalized.slice(0, 2)),
    sequence: normalized.slice(2),
  };
}

/** True if `input` is a structurally-valid CNAS employer number (10 digits). */
export function isValidCnasEmployer(input: string): boolean {
  return parseCnasEmployer(input).valid;
}
