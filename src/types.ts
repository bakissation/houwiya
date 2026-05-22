/** A legal entity flavour, as encoded by the RC letter (A → physique, B → morale). */
export type EntityType = 'physique' | 'morale';

/** Sex as encoded by the NIN prefix (10 → male, 11 → female). */
export type Sex = 'male' | 'female';

/** An Algerian province: its 2-digit code and French name. */
export interface Wilaya {
  code: string;
  name: string;
}

/**
 * Common shape returned by every `parse*` function. Parsing is **lenient**:
 * even when `valid` is `false`, any parts that could be extracted are still
 * filled in, so you can read e.g. the wilaya of a structurally-off value.
 */
export interface ParseResultBase {
  /** The original input, untouched. */
  input: string;
  /** Canonical form (whitespace/separators removed, upper-cased where relevant). */
  normalized: string;
  /** Whether the value is valid (structure, and checksum where one exists). */
  valid: boolean;
  /** Why it's invalid, when `valid` is false. */
  error?: string;
}
