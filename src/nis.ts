import type { ParseResultBase, Wilaya } from './types.js';
import { requireString } from './errors.js';
import { toAsciiDigits } from './normalize.js';
import { lookupWilaya } from './wilaya.js';

export interface NisParsed extends ParseResultBase {
  /** Wilaya extracted from the leading geographic group (best-effort). */
  wilaya?: Wilaya;
  /** 2-digit commune code from the leading geographic group (best-effort). */
  communeCode?: string;
  /** 3-digit secondary-establishment suffix (only on the 18-digit form). */
  secondarySuffix?: string;
}

/**
 * Parse an Algerian NIS (Numéro d'Identification Statistique) — 15 digits
 * (décret 97-396, Art. 4), or 18 for a secondary establishment (Art. 5: the
 * 15-digit principal NIS + a 3-digit sequential suffix).
 *
 * Extracts the wilaya + commune from the leading geographic group (positions
 * 5–8, e.g. "1628" → wilaya 16 / commune 28). This position is inferred from
 * official ONS documents, not stated in the décret — treat as best-effort.
 */
export function parseNis(input: string): NisParsed {
  requireString(input, 'NIS');
  const normalized = toAsciiDigits(input).replace(/\s/g, '');
  const base: NisParsed = { input, normalized, valid: false };

  if (!/^\d{15}(\d{3})?$/.test(normalized)) {
    return { ...base, error: 'NIS must be 15 digits (or 18 for a secondary establishment)' };
  }

  return {
    ...base,
    valid: true,
    wilaya: lookupWilaya(normalized.slice(4, 6)),
    communeCode: normalized.slice(6, 8),
    secondarySuffix: normalized.length === 18 ? normalized.slice(15) : undefined,
  };
}

/** True if `input` is a structurally-valid NIS (15 or 18 digits). */
export function isValidNis(input: string): boolean {
  return parseNis(input).valid;
}
