import { describe, it, expect } from 'vitest';
import { formatRib, formatIban, computeRibKey } from '../src/index.js';

const rib = '007' + '99999' + '0012345678' + computeRibKey('99999', '0012345678');

describe('formatRib', () => {
  it('groups a RIB into bank/agency/account/key', () => {
    expect(formatRib(rib)).toBe(`007 99999 0012345678 ${rib.slice(18)}`);
  });

  it('returns the digits unchanged when not a 20-digit RIB', () => {
    expect(formatRib('12345')).toBe('12345');
  });
});

describe('formatIban', () => {
  it('groups into blocks of four', () => {
    expect(formatIban('DZ5800021000000000000012')).toBe('DZ58 0002 1000 0000 0000 0012');
  });

  it('normalizes existing spacing', () => {
    expect(formatIban('dz58 00021000')).toBe('DZ58 0002 1000');
  });
});
