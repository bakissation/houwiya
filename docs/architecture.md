# Architecture

## Layout

```
src/
  checksums.ts   mod97 (overflow-safe), luhnValid, luhnCheckDigit
  normalize.ts   toAsciiDigits (Arabic-Indic / Persian → ASCII)
  wilaya.ts      WILAYAS (69 provinces) + lookupWilaya
  types.ts       EntityType, Sex, Wilaya, ParseResultBase
  errors.ts      IdentifierError + requireString
  nin.ts nif.ts nis.ts rc.ts rib.ts ccp.ts iban.ts cnas.ts   one identifier each
  index.ts       public re-exports
```

Zero runtime dependencies. Built to ESM + CommonJS with type declarations via tsup.

## The parse contract

Each identifier exposes `parseX(input): XParsed` and `isValidX(input): boolean`. Every parser:

1. Coerces input via `toAsciiDigits` (so Arabic-Indic numerals work), then normalizes (strip separators, upper-case, RC also maps `أ/ب` → `A/B`).
2. Checks structure (length / shape). On failure returns `{ valid: false, error }` — **but still fills any parts it can** (lenient).
3. Where a checksum exists (NIN Luhn; RIB/CCP/IBAN mod-97), verifies it and reflects the result in `valid`.

`isValidX` is just `parseX(input).valid`. Invalid *values* never throw; only non-string input throws `IdentifierError`.

## Why "lenient + don't fabricate"

Algerian identifiers are written inconsistently (RC especially), mix Latin/Arabic, and several have **no publicly-specified digit format or checksum**. So the library:

- enforces a format/checksum **only** when it's law-backed (e.g. NIS = 15, décret 97-396) or empirically confirmed (RIB mod-97, BoA 62-94);
- otherwise validates structure and **parses leniently**, never inventing a checksum (NIF/NIS control keys are not public).

This keeps false negatives low on messy real-world data while never asserting correctness it can't back.

## Checksum algorithms

- **Luhn (NIN):** standard; the last digit is the check. `luhnValid` / `luhnCheckDigit` in `checksums.ts`.
- **mod-97 (RIB / CCP):** the 17 digits `agency·account·key`, read as an integer, must be ≡ 0 (mod 97). To generate the key: `97 − ((agency·account × 100) mod 97)` (`computeRibKey`). Per BoA Instruction 62-94.
- **mod-97 (IBAN, ISO 13616):** move the first 4 chars to the end, map letters `A=10 … Z=35`, the integer mod 97 must equal 1.

`mod97` folds the value digit-by-digit so arbitrarily long inputs never overflow `Number`.

## Reference data

`wilaya.ts` carries the 69 provinces (codes 49–58 from the 2019 reform, 59–69 from loi 26-06 / 2026). Update it here when the découpage changes.
