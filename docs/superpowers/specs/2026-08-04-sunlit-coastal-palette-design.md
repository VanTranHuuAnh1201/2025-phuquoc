# Sunlit Coastal palette rollout — `apps/2026-thenamduhillresort`

**Status:** Approved · **Date:** 2026-08-04

## Context

`apps/2026-thenamduhillresort` currently ships the "PA3" navy palette
(`Primary-900 #0F2D52` etc.), defined once as CSS variables in
`src/app/globals.css` `@theme` block but never actually consumed via token
classes — all 30 component/page files hardcode the hex values directly as
Tailwind arbitrary values (`bg-[#0F2D52]`, `text-[#1D4E89]`, ...). 412
occurrences total.

The user judged the current hero overlay (`from-[#101828]/90 ...`) too dark
and wants the whole app's color system replaced with a new, warmer "Sunlit
Coastal Booking" palette (teal-blue brand + gold accent, off-white
background), inspired by Booking.com/Airbnb/Aman and Nam Du's actual colors
(turquoise sea, sun, bright rock, greenery).

This app is a standalone product app outside the `packages/theme-*` monorepo
token architecture (CLAUDE.md §2) — it predates that pattern and is not
bound by `packages/ui`/`core` boundary rules. This change stays entirely
within `apps/2026-thenamduhillresort`.

## Scope

1. Replace the hero background overlay gradient with a lighter, navy-tinted
   version per spec.
2. Replace every hardcoded PA3 hex value across all 30 files with its Sunlit
   Coastal equivalent, 1:1 by role — same technique (inline Tailwind
   arbitrary hex), no refactor to token classes.
3. Update the `@theme` CSS variables in `globals.css` to match, for
   consistency, even though nothing currently consumes them.
4. Update `DESIGN_DIRECTION.md` §3 "Color Strategy" to document the new
   palette as source of truth, replacing the PA3 table.

Out of scope: converting hardcoded hex to token classes (explicitly declined
by user — different task), touching `apps/2025-phogroup` or any
`packages/theme-*`, changing layout/spacing/components.

## Color mapping

| Role | Old (PA3) | New (Sunlit Coastal) |
|---|---|---|
| Primary-900 | `#0F2D52` | `#0B5F7D` |
| Primary-800 | `#163B6C` | `#0F7194` |
| Primary-700 (brand) | `#1D4E89` | `#1786AE` |
| Primary-600 | `#2563A6` | `#2497C4` |
| Primary-500 | `#3B82C4` | `#39A9D6` |
| Gold-500 (accent) | `#C6A86A` | `#E8B545` |
| Gold-400 | `#D8BA7C` | `#F5D68A` |
| Gold-300 | `#E8D5A5` | `#FFF8E9` |
| Background | `#FAFAF8` | `#FCFAF6` |
| Heading text | `#1A1A1A` | `#21323C` |
| Body text | `#4B5563` | `#52616B` |
| Caption text | `#6B7280` | `#7B8A95` |
| Border | `#E5E7EB` | `#E7ECEF` |
| Divider | `#ECECEC` | `#EEF2F4` |
| Hover bg | `#F5F7FA` | `#F2F6F8` |

New roles introduced by the spec that had no PA3 equivalent (Success
`#22A06B`, Error `#D14343`, Warning `#F5A623`, Rating `#F7B731`, Footer dark
`#0D2F3F`) are added to `@theme` for future use but not swept into existing
code — no current usage maps to them uniquely enough for a safe mechanical
replace, and none were flagged as currently wrong.

## Hero overlay

Replace:
```
bg-gradient-to-t from-[#101828]/90 via-[#101828]/35 to-[#101828]/40
```
with an inline-style linear-gradient matching the approved spec exactly:
```css
linear-gradient(180deg, rgba(11,95,125,0.15), rgba(11,95,125,0.55))
```
(top → bottom, light → darker toward the booking widget/text area at the
bottom, using new Primary-900 `#0B5F7D` as the tint color instead of neutral
black).

## Approach

Mechanical find-and-replace of the old hex strings for the mapped roles
across the 30 identified files, plus the two doc/config updates. Case
matters (Tailwind arbitrary values are case-sensitive in practice via
uppercase hex convention already used in this codebase) — replace
uppercase hex exactly as it appears.

## Verification

- `pnpm turbo build --filter=@repo/2026-thenamduhillresort` succeeds
- Grep for old PA3 hex values across `src/` returns zero matches
- Visual check: `pnpm dev:thenamduhill`, view hero and a few sampled pages
  (rooms, admin dashboard, checkout) to confirm palette looks coherent and
  contrast is still readable (white text on hero image with new overlay)
