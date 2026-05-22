# Getting started

## Install

```bash
npm install @bakissation/houwiya
```

Requires **Node.js ≥ 18**. Ships ESM + CommonJS with bundled types; zero runtime dependencies.

## The pattern: parse, then read what you need

Every identifier has a `parse*` function that returns a typed object, and a thin `isValid*` boolean wrapper.

```typescript
import { parseRc } from '@bakissation/houwiya';

const rc = parseRc('24B1282577');
rc.valid;       // true
rc.entityType;  // 'morale'  (A/أ → physique, B/ب → morale)
rc.year;        // 2024
rc.sequence;    // '1282577'
rc.wilaya;      // { code, name } when a wilaya code is present
```

You only read the field you care about — "give me just the wilaya of this RC" is `parseRc(x).wilaya`.

### Lenient by design

Parsing fills in whatever it can even when the value is invalid, so you can still inspect parts:

```typescript
const r = parseNin('11988123405670000X'); // bad checksum
r.valid; // false
r.sex;   // 'female'  — still extracted
r.error; // 'Invalid NIN checksum (Luhn)'
```

## Checksums

NIN, RIB, CCP, and IBAN are checksum-verified (Luhn / mod-97); `valid` reflects the checksum. The others validate structure only.

```typescript
import { isValidNin, isValidRib, isValidIban } from '@bakissation/houwiya';

isValidNin('119881234056700007'); // Luhn
isValidRib('00100023456...');     // mod-97
isValidIban('DZ58 0002 ...');     // ISO mod-97 (spaces tolerated)
```

## Banking: RIB, CCP, IBAN

```typescript
import { parseRib, parseCcp, parseIban, computeRibKey } from '@bakissation/houwiya';

parseRib(rib).account;     // bank/agency/account/key, mod-97 verified
parseIban(iban).rib;       // the 20-digit RIB embedded in the IBAN

// CCP ↔ interbank bridge: a bare CCP is postal-only; prefix 007 99999 → interbank RIB
const ccp = parseCcp('0012345678' + computeRibKey('99999', '0012345678'));
ccp.bridged; // false (bare form)
ccp.rib;     // '00799999…' — the interbank "BaridiMob RIB"
```

## Arabic input

Latin and Arabic are both accepted — RC entity letters `أ`/`ب`, and Arabic-Indic digits anywhere:

```typescript
parseRc('٢٤ب١٢٣٤٥٦٧').entityType; // 'morale'
```

## Wilayas

```typescript
import { lookupWilaya, WILAYAS } from '@bakissation/houwiya';
lookupWilaya('16');        // { code: '16', name: 'Alger' }
Object.keys(WILAYAS).length; // 69
```
