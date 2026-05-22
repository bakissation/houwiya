import { parseRib } from './rib.js';
import { toAsciiDigits } from './normalize.js';

/**
 * Group a RIB for display: `bank agency account key` (e.g. `007 99999 0012345678 90`).
 * Returns the digits unchanged if the input isn't a 20-digit RIB.
 */
export function formatRib(input: string): string {
  const r = parseRib(input);
  if (!r.bank) return r.normalized;
  return `${r.bank} ${r.agency} ${r.account} ${r.key}`;
}

/**
 * Group an IBAN into blocks of 4 for display (e.g. `DZ58 0002 1000 …`).
 */
export function formatIban(input: string): string {
  const normalized = toAsciiDigits(input).replace(/\s/g, '').toUpperCase();
  return normalized.replace(/(.{4})/g, '$1 ').trim();
}
