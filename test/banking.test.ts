import { describe, it, expect } from 'vitest';
import {
  parseRib, isValidRib, computeRibKey,
  parseCcp, isValidCcp,
  parseIban, isValidIban,
  mod97,
} from '../src/index.js';

const agency = '99999';
const account = '0012345678';
const ribKey = computeRibKey(agency, account);
const rib = '007' + agency + account + ribKey; // 20-digit RIB / RIP

describe('RIB', () => {
  it('validates a mod-97-correct RIB and decomposes it', () => {
    const r = parseRib(rib);
    expect(r.valid).toBe(true);
    expect(r.bank).toBe('007');
    expect(r.agency).toBe('99999');
    expect(r.account).toBe('0012345678');
    expect(r.key).toBe(ribKey);
  });

  it('rejects a tampered key', () => {
    const wrongKey = String((Number(ribKey) + 1) % 100).padStart(2, '0');
    expect(isValidRib('007' + agency + account + wrongKey)).toBe(false);
  });

  it('rejects wrong length', () => {
    expect(isValidRib('12345')).toBe(false);
  });
});

describe('CCP', () => {
  it('validates the bare postal form and yields the interbank RIB', () => {
    const r = parseCcp(account + ribKey);
    expect(r.valid).toBe(true);
    expect(r.bridged).toBe(false);
    expect(r.account).toBe('0012345678');
    expect(r.rib).toBe(rib);
  });

  it('validates the 20-digit BaridiMob form and flags it bridged', () => {
    const r = parseCcp(rib);
    expect(r.valid).toBe(true);
    expect(r.bridged).toBe(true);
    expect(r.account).toBe('0012345678');
  });

  it('rejects a 20-digit number that is not 007 99999', () => {
    expect(isValidCcp('00112345' + account + ribKey)).toBe(false);
  });
});

describe('IBAN', () => {
  const bban = rib;
  const cd = String(98 - mod97(bban + '1335' + '00')).padStart(2, '0');
  const iban = 'DZ' + cd + bban;

  it('validates a correct DZ IBAN and exposes the underlying RIB', () => {
    const r = parseIban(iban);
    expect(r.valid).toBe(true);
    expect(r.country).toBe('DZ');
    expect(r.rib).toBe(bban);
  });

  it('rejects a tampered IBAN', () => {
    expect(isValidIban('DZ00' + bban)).toBe(false);
  });

  it('tolerates spaces', () => {
    const spaced = iban.replace(/(.{4})/g, '$1 ').trim();
    expect(isValidIban(spaced)).toBe(true);
  });
});
