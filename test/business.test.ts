import { describe, it, expect } from 'vitest';
import {
  parseNif, isValidNif,
  parseNis, isValidNis,
  parseRc, isValidRc,
  parseCnasEmployer,
} from '../src/index.js';

describe('NIF', () => {
  it('accepts 15-digit core and exposes it', () => {
    const r = parseNif('000916040012375');
    expect(r.valid).toBe(true);
    expect(r.core).toBe('000916040012375');
    expect(r.extension).toBeUndefined();
  });

  it('accepts the 20-digit extended form and splits the suffix', () => {
    const r = parseNif('00091604001237500000');
    expect(r.valid).toBe(true);
    expect(r.core).toBe('000916040012375');
    expect(r.extension).toBe('00000');
  });

  it('rejects 14 digits', () => {
    expect(isValidNif('00091604001237')).toBe(false);
  });
});

describe('NIS', () => {
  it('validates 15 digits and extracts wilaya + commune', () => {
    const r = parseNis('009916050123456'); // wilaya 16 at positions 5-6
    expect(r.valid).toBe(true);
    expect(r.wilaya?.code).toBe('16');
    expect(r.wilaya?.name).toBe('Alger');
    expect(r.communeCode).toBe('05');
  });

  it('handles the 18-digit secondary form', () => {
    const r = parseNis('009916050123456789');
    expect(r.valid).toBe(true);
    expect(r.secondarySuffix).toBe('789');
  });

  it('rejects 14 digits', () => {
    expect(isValidNis('00991605012345')).toBe(false);
  });
});

describe('RC', () => {
  it('parses the modern form (B = morale)', () => {
    const r = parseRc('24B1234567');
    expect(r.valid).toBe(true);
    expect(r.entityType).toBe('morale');
    expect(r.year).toBe(2024);
    expect(r.sequence).toBe('1234567');
  });

  it('parses A = physique and a wilaya suffix', () => {
    const r = parseRc('20A5051955 00/16');
    expect(r.entityType).toBe('physique');
    expect(r.year).toBe(2020);
    expect(r.wilaya?.name).toBe('Alger');
  });

  it('accepts Arabic letters (ب) and Arabic-Indic digits', () => {
    const r = parseRc('٢٤ب١٢٣٤٥٦٧');
    expect(r.valid).toBe(true);
    expect(r.entityType).toBe('morale');
    expect(r.year).toBe(2024);
  });

  it('rejects garbage', () => {
    expect(isValidRc('hello')).toBe(false);
  });
});

describe('CNAS employer number', () => {
  it('extracts the wilaya from the first two digits', () => {
    const r = parseCnasEmployer('1612345678');
    expect(r.valid).toBe(true);
    expect(r.wilaya?.name).toBe('Alger');
    expect(r.sequence).toBe('12345678');
  });

  it('rejects wrong length', () => {
    expect(parseCnasEmployer('161234567').valid).toBe(false);
  });
});
