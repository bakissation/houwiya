# API reference

Everything is exported from the package root.

## Result shape

Every `parse*` returns an object extending:

```typescript
interface ParseResultBase {
  input: string;       // original, untouched
  normalized: string;  // whitespace/separators removed, upper-cased where relevant
  valid: boolean;      // structure + checksum (where one exists)
  error?: string;      // set when valid is false
}
```

Parsing is **lenient**: extracted parts are present even when `valid` is `false`.

## Identifiers

| Function | Returns (extra fields) |
|---|---|
| `parseNin(s)` / `isValidNin(s)` | `sex`, `birthYearDigits`, `communeCode`, `actSequence`, `reserve`, `checkDigit` — Luhn-validated |
| `parseNif(s)` / `isValidNif(s)` | `core` (15), `extension` (suffix if 16–20) — structure only |
| `parseNis(s)` / `isValidNis(s)` | `wilaya`, `communeCode`, `secondarySuffix` (18-digit form) — structure only |
| `parseRc(s)` / `isValidRc(s)` | `entityType` (`'physique'`/`'morale'`), `year`, `sequence`, `wilaya` — lenient |
| `parseRib(s)` / `isValidRib(s)` | `bank`, `agency`, `account`, `key` — mod-97 validated |
| `parseCcp(s)` / `isValidCcp(s)` | `account`, `key`, `bridged`, `rib` — mod-97 validated |
| `parseIban(s)` / `isValidIban(s)` | `country`, `checkDigits`, `rib` — ISO mod-97 validated |
| `parseCnasEmployer(s)` / `isValidCnasEmployer(s)` | `wilaya`, `sequence` — structure only |

## Helpers

| Export | Description |
|---|---|
| `WILAYAS` | `Record<string,string>` — the 69 wilaya codes → names |
| `lookupWilaya(code)` | `{ code, name }` or `undefined` |
| `computeRibKey(agency, account)` | the 2-digit mod-97 RIB key |
| `mod97(numeric)` | overflow-safe mod 97 of a digit string |
| `luhnValid(numeric)` / `luhnCheckDigit(numericWithoutCheck)` | Luhn check / generate |
| `toAsciiDigits(s)` | Arabic-Indic / Persian digits → ASCII |
| `IdentifierError` | thrown only for non-string input (invalid *values* are reported via `valid`, never thrown) |

## Types

`EntityType` (`'physique' \| 'morale'`), `Sex` (`'male' \| 'female'`), `Wilaya` (`{ code, name }`), `ParseResultBase`, and one `*Parsed` interface per identifier (`NinParsed`, `NifParsed`, `NisParsed`, `RcParsed`, `RibParsed`, `CcpParsed`, `IbanParsed`, `CnasEmployerParsed`).

## Constants

`CCP_BANK_CODE` (`'007'`), `CCP_BRIDGE_AGENCY` (`'99999'`).
