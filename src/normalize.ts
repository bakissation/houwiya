/**
 * Convert Eastern Arabic (٠-٩) and Persian (۰-۹) digits to ASCII 0-9, so the
 * parsers work whether identifiers are written in Latin or Arabic numerals.
 * Letters are left untouched (RC handles أ/ب separately).
 */
export function toAsciiDigits(input: string): string {
  return input
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0));
}
