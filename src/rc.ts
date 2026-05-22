import type { ParseResultBase, EntityType, Wilaya } from './types.js';
import { requireString } from './errors.js';
import { toAsciiDigits } from './normalize.js';
import { lookupWilaya } from './wilaya.js';

export interface RcParsed extends ParseResultBase {
  /** physique (A / أ) or morale (B / ب). */
  entityType?: EntityType;
  /** 4-digit registration year, best-effort from the modern `YY…` form. */
  year?: number;
  /** The chronological sequence digits (best-effort). */
  sequence?: string;
  /** Wilaya, if a recognizable wilaya code is present in the number. */
  wilaya?: Wilaya;
}

// Arabic letter variants → Latin: alif family → A (personne physique), bā → B (personne morale).
function toLatinLetters(s: string): string {
  return s.replace(/[أإآاٱ]/g, 'A').replace(/ب/g, 'B');
}

/**
 * Parse an Algerian RC (Registre de Commerce) number. The format is CNRC
 * convention, not codified, and is written many ways — so parsing is lenient
 * and normalizing. Modern form is `YY` + `A|B` (or `أ|ب`) + sequence
 * (e.g. `24B1282577`); a wilaya code may be appended (e.g. `… 00/16`).
 *
 * @example
 * parseRc('24B1282577').entityType // 'morale'
 * parseRc('٢٤ب1282577').wilaya     // (handles Arabic letter; wilaya if present)
 */
export function parseRc(input: string): RcParsed {
  requireString(input, 'RC');
  const normalized = toLatinLetters(toAsciiDigits(input)).toUpperCase().replace(/\s+/g, ' ').trim();
  const compact = normalized.replace(/[\s./-]/g, '');
  const base: RcParsed = { input, normalized, valid: false };

  let entityType: EntityType | undefined;
  let year: number | undefined;
  let sequence: string | undefined;

  const modern = compact.match(/^(\d{2})([AB])(\d{3,})/);
  if (modern) {
    year = 2000 + Number(modern[1]);
    entityType = modern[2] === 'A' ? 'physique' : 'morale';
    sequence = modern[3];
  } else {
    if (/B/.test(compact)) entityType = 'morale';
    else if (/A/.test(compact)) entityType = 'physique';
    const seq = compact.match(/\d{4,}/);
    if (seq) sequence = seq[0];
  }

  // Wilaya: prefer a "/NN" group that is a known wilaya; else a leading "NN/".
  let wilaya: Wilaya | undefined;
  for (const m of [...normalized.matchAll(/\/(\d{2})/g)].reverse()) {
    const w = lookupWilaya(m[1]!);
    if (w) {
      wilaya = w;
      break;
    }
  }
  if (!wilaya) {
    const lead = normalized.match(/^(\d{2})\//);
    if (lead) wilaya = lookupWilaya(lead[1]!);
  }

  const valid = Boolean(entityType && sequence);
  return {
    ...base,
    valid,
    error: valid ? undefined : 'Unrecognized RC format (expected an A/B (or أ/ب) marker and a number)',
    entityType,
    year,
    sequence,
    wilaya,
  };
}

/** True if `input` looks like a valid RC (has an entity marker and a number). */
export function isValidRc(input: string): boolean {
  return parseRc(input).valid;
}
