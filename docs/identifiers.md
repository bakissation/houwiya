# Identifiers reference

Per-identifier format, what each part means, whether it's checksum-verifiable, and its legal basis. **All examples are synthetic.**

> Where the law fixes a format, the library enforces it. Where it's convention (RC), the library parses leniently and never invents a checksum. NIF/NIS control-key algorithms are not public.

## NIN — Numéro d'Identification National (person)
- **18 digits.** `[2]` sex (10 = M, 11 = F) · `[3]` birth-year suffix · `[4]` birth-commune · `[4]` birth-act sequence · `[4]` reserve · `[1]` **Luhn** check.
- **Checksum:** Luhn ✅. **Legal basis:** décret 10-210 (2010) + 2023 décret.

## NIF — Numéro d'Identification Fiscale (person + business)
- **15 digits** legal core; **15–20** in the printed/extended form (core + establishment suffix). Leading zeros significant.
- **Checksum:** control key exists but algorithm not public → structure only. **Legal basis:** LF 2006 art. 41–42.
- The NIF is progressively superseding the NIS (2023 unification) — both still appear on documents.

## NIS — Numéro d'Identification Statistique (business)
- **15 digits** (décret 97-396 art. 4); **18** for a secondary establishment (art. 5: 15 + 3-digit suffix).
- Wilaya + commune sit in the leading geographic group (positions 5–8) — extracted best-effort.
- **Checksum:** none public → structure only.

## RC — Registre de Commerce (business / merchant)
- **Format is CNRC convention, not codified.** Modern (Sidjilcom): `YY` + `A|B` + ~7-digit chrono (e.g. `24B1234567`); a wilaya code may be appended (`… 00/16`). Legacy: `wilaya/antenne-chrono TYPE year`.
- **`A`/`أ` = personne physique, `B`/`ب` = personne morale.** Written inconsistently → parsed leniently.
- **Checksum:** none. **Legal frame:** décret 15-111 (2015, superseded 97-41) + Code de commerce + décret 92-68 (CNRC).

## CNAS employer number (business / employer)
- **10 digits**, `WW.xxx.xxx.xx`, first 2 = wilaya. **Legal basis:** Loi 83-14 art. 6. **Checksum:** none.

## RIB — Relevé d'Identité Bancaire (person + business)
- **20 digits:** bank `[3]` · agency `[5]` · account `[10]` · key `[2]`.
- **Checksum:** mod-97 ✅ — `agency·account·key` ≡ 0 (mod 97). **Legal basis:** BoA Instruction 62-94 → 20-digit form via règlement 2005-06.

## CCP / RIP — Algérie Poste (person + business)
- A bare **CCP** (account + 2-digit key) is **postal-only**. Prefix bank `007` + agency `99999` → the 20-digit interbank **"BaridiMob RIB"** that bridges CCP ↔ banks. Strip `00799999` to recover the bare CCP.
- **Checksum:** mod-97 ✅ (same family as RIB).

## IBAN (Algeria)
- **24 chars:** `DZ` + 2 ISO check digits + the 20-digit RIB (BBAN).
- **Checksum:** ISO 13616 mod-97 ✅. Algeria is **not** in the official SWIFT IBAN registry → best-effort support.

## Not (yet) covered
AI (article d'imposition — no legal format), CASNOS / CACOBATPH / CNR / CNAC affiliation numbers and the individual SS number (no public digit structure), NAA activity code, passport / permis. These are documented in the reference report but lack a public structure to validate against.
