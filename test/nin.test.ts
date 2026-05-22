import { describe, it, expect } from 'vitest';
import { parseNin, isValidNin, luhnCheckDigit } from '../src/index.js';

// Build a checksum-valid synthetic NIN: 17 structural digits + Luhn check.
const base17 = '11988123405670000'; // female (11), year 988, commune 1234, act 0567
const validNin = base17 + luhnCheckDigit(base17);

describe('parseNin', () => {
  it('validates a correct NIN and decomposes it', () => {
    const r = parseNin(validNin);
    expect(r.valid).toBe(true);
    expect(r.sex).toBe('female');
    expect(r.birthYearDigits).toBe('988');
    expect(r.communeCode).toBe('1234');
    expect(r.actSequence).toBe('0567');
  });

  it('reads male from a 10 prefix', () => {
    const male = '10988123405670000';
    expect(parseNin(male + luhnCheckDigit(male)).sex).toBe('male');
  });

  it('rejects a bad checksum but still extracts parts', () => {
    const tampered = base17 + ((Number(validNin.slice(-1)) + 1) % 10);
    const r = parseNin(tampered);
    expect(r.valid).toBe(false);
    expect(r.sex).toBe('female'); // lenient: parts still filled
  });

  it('rejects wrong length', () => {
    expect(parseNin('123').valid).toBe(false);
  });

  it('accepts Arabic-Indic digits', () => {
    const arabic = validNin.replace(/\d/g, (d) => String.fromCharCode(0x0660 + Number(d)));
    expect(isValidNin(arabic)).toBe(true);
  });
});
