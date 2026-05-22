# @bakissation/houwiya

**Validate, parse, and extract Algerian identifiers** in TypeScript — NIN, NIF, NIS, RC, RIB/CCP/IBAN, CNAS. Don't just check validity: pull out exactly the part you need (the wilaya of an RC, the sex from a NIN, the account from a RIB). **Zero runtime dependencies.**

[![npm](https://img.shields.io/npm/v/@bakissation/houwiya?label=npm&color=cb3837)](https://www.npmjs.com/package/@bakissation/houwiya)
[![CI](https://github.com/bakissation/houwiya/actions/workflows/ci.yml/badge.svg)](https://github.com/bakissation/houwiya/actions/workflows/ci.yml)
[![license](https://img.shields.io/badge/license-MIT-blue)](./LICENSE)

- 🔎 **Parse, don't just validate** — every `parse*` returns a typed object you can read one field from.
- ✅ **Real checksums** — NIN (Luhn), RIB / CCP / IBAN (mod-97). Structural validation for the rest.
- 🧩 **Semantic extraction** — wilaya (NIF/NIS/RC/CNAS), entity type (RC `A/B`), sex + birth year (NIN), bank/agency/account (RIB).
- 🇩🇿 **Algeria-aware** — 69 wilayas (2026 reform), Latin **and** Arabic input (`أ/ب`, Arabic-Indic digits), the CCP↔RIB "BaridiMob" bridge.
- 🧱 **Strict TypeScript, ESM + CommonJS, zero dependencies.**

## Install

```bash
npm install @bakissation/houwiya
```

Requires **Node.js ≥ 18**.

## Quick start

```typescript
import { parseRc, parseNin, parseRib, isValidIban } from '@bakissation/houwiya';

// Extract just the part you need
parseRc('24B1282577').wilaya;       // { code: '16', name: 'Alger' } (when present)
parseRc('24B1282577').entityType;   // 'morale'   (A/أ → physique, B/ب → morale)
parseNin('119881234056700007').sex; // 'female'   (+ birthYearDigits, communeCode…) — Luhn-checked
parseRib('00100023456...').account; // decomposed; mod-97 verified
isValidIban('DZ58 0002 1000 ...');  // ISO mod-97
```

Lenient by design: even when `valid` is `false`, any parts that could be extracted are still returned.

## Supported identifiers

| Identifier | Function | Checksum | Extracts |
|---|---|---|---|
| **NIN** (national ID) | `parseNin` | Luhn | sex, birth year, commune, act sequence |
| **NIF** (tax) | `parseNif` | — | 15-digit core, establishment suffix |
| **NIS** (statistical) | `parseNis` | — | wilaya, commune, secondary suffix |
| **RC** (trade register) | `parseRc` | — | entity type (A/B/أ/ب), year, sequence, wilaya |
| **RIB** (bank) | `parseRib` | mod-97 | bank, agency, account, key |
| **CCP / RIP** (postal) | `parseCcp` | mod-97 | account, key, bridged RIB |
| **IBAN** (DZ) | `parseIban` | ISO mod-97 | country, check, underlying RIB |
| **CNAS** (employer) | `parseCnasEmployer` | — | wilaya, sequence |

Plus `WILAYAS` / `lookupWilaya` (the 69 provinces) and the `mod97` / `luhnValid` / `luhnCheckDigit` / `computeRibKey` helpers.

## Documentation

Full docs in **[`docs/`](./docs/)**: [getting started](./docs/getting-started.md) · [API reference](./docs/api-reference.md) · [identifiers reference](./docs/identifiers.md) (formats, checksums, legal basis) · [architecture](./docs/architecture.md).

## A note on accuracy

Where the law fixes a format (e.g. NIS = 15 digits, décret 97-396) the library enforces it. Where it doesn't (e.g. the RC digit layout, which is CNRC convention) the library parses **leniently** and never invents a checksum. See [docs/identifiers.md](./docs/identifiers.md) for the per-identifier legal basis and caveats. These values are PII — don't log them in clear.

## Contributing

Issues and PRs welcome — see [CONTRIBUTING.md](./CONTRIBUTING.md) and the [Code of Conduct](./CODE_OF_CONDUCT.md). Releases are automated from [Conventional Commits](https://www.conventionalcommits.org/); don't bump the version or edit the changelog by hand.

## Credits

Built and maintained by **Abdelbaki Berkati** — [berkati.xyz](https://berkati.xyz) · [@bakissation](https://github.com/bakissation).

## License

[MIT](./LICENSE)
