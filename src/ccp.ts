import type { ParseResultBase } from './types.js';
import { requireString } from './errors.js';
import { toAsciiDigits } from './normalize.js';
import { mod97 } from './checksums.js';

/** Algérie Poste's bank code and the fixed agency code used to bridge a CCP onto the interbank network. */
export const CCP_BANK_CODE = '007';
export const CCP_BRIDGE_AGENCY = '99999';

export interface CcpParsed extends ParseResultBase {
  /** 10-digit account number. */
  account?: string;
  /** 2-digit key (mod-97). */
  key?: string;
  /** True when the input was given as the 20-digit interbank RIB form (007 99999 …). */
  bridged?: boolean;
  /** The 20-digit interbank "BaridiMob RIB" form (007 + 99999 + account + key). */
  rib?: string;
}

/**
 * Parse an Algérie Poste CCP. Accepts either the bare postal form
 * (account + 2-digit key, postal-internal only) or the 20-digit interbank RIB
 * form `007 · 99999 · account · key` ("BaridiMob RIB") that bridges CCP ↔ banks.
 * The mod-97 key is validated either way. Use {@link CcpParsed.rib} to get the
 * interbank form, or strip `00799999` to get back the bare CCP.
 */
export function parseCcp(input: string): CcpParsed {
  requireString(input, 'CCP');
  const digits = toAsciiDigits(input).replace(/\D/g, '');
  const base: CcpParsed = { input, normalized: digits, valid: false };

  let account: string;
  let key: string;
  let bridged: boolean;

  if (digits.length === 20) {
    if (!digits.startsWith(CCP_BANK_CODE + CCP_BRIDGE_AGENCY)) {
      return { ...base, error: 'A 20-digit CCP must start with 007 99999 (the interbank bridge prefix)' };
    }
    account = digits.slice(8, 18);
    key = digits.slice(18, 20);
    bridged = true;
  } else if (digits.length >= 3 && digits.length <= 12) {
    key = digits.slice(-2);
    account = digits.slice(0, -2).padStart(10, '0');
    bridged = false;
  } else {
    return { ...base, error: 'CCP must be an account + 2-digit key, or the 20-digit 007 99999 form' };
  }

  const rib = CCP_BANK_CODE + CCP_BRIDGE_AGENCY + account + key;
  const valid = mod97(rib.slice(3)) === 0;
  return {
    ...base,
    valid,
    error: valid ? undefined : 'Invalid CCP key (mod-97)',
    account,
    key,
    bridged,
    rib,
  };
}

/** True if `input` is a structurally- and checksum-valid CCP. */
export function isValidCcp(input: string): boolean {
  return parseCcp(input).valid;
}
