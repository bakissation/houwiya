import type { ParseResultBase } from './types.js';
import { requireString } from './errors.js';
import { toAsciiDigits } from './normalize.js';

export interface NifParsed extends ParseResultBase {
  /** The 15-digit legal core. */
  core?: string;
  /** Establishment/activity suffix when the printed form is longer than 15 digits. */
  extension?: string;
}

/**
 * Parse an Algerian NIF (Numéro d'Identification Fiscale). The legal core is 15
 * digits; printed/extended forms run 15–20 (core + establishment suffix).
 *
 * No checksum is validated — the NIF's control key algorithm is not public, so
 * this checks structure only (15–20 digits, leading zeros significant).
 */
export function parseNif(input: string): NifParsed {
  requireString(input, 'NIF');
  const normalized = toAsciiDigits(input).replace(/\s/g, '');
  const base: NifParsed = { input, normalized, valid: false };

  if (!/^\d{15,20}$/.test(normalized)) {
    return { ...base, error: 'NIF must be 15 to 20 digits' };
  }

  return {
    ...base,
    valid: true,
    core: normalized.slice(0, 15),
    extension: normalized.length > 15 ? normalized.slice(15) : undefined,
  };
}

/** True if `input` is a structurally-valid NIF (15–20 digits). */
export function isValidNif(input: string): boolean {
  return parseNif(input).valid;
}
