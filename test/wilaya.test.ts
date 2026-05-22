import { describe, it, expect } from 'vitest';
import { WILAYAS, lookupWilaya } from '../src/index.js';

describe('wilayas', () => {
  it('has the full 69-wilaya set (2026 reform)', () => {
    expect(Object.keys(WILAYAS).length).toBe(69);
  });

  it('resolves known codes', () => {
    expect(lookupWilaya('16')?.name).toBe('Alger');
    expect(lookupWilaya('31')?.name).toBe('Oran');
    expect(lookupWilaya('69')?.name).toBe('El Aricha');
  });

  it('returns undefined for unknown codes', () => {
    expect(lookupWilaya('99')).toBeUndefined();
    expect(lookupWilaya('00')).toBeUndefined();
  });
});
