# Soft Field → Next.js repo

Three files, in order of importance.

## 1. `code/globals.css` → paste over `app/globals.css`
Full replacement. Every class name from your current file is preserved
(`.nav`, `.hero-name`, `.pcard`, `.badge-gold`, `.refl-step`, `.spill`, …), so
**no component markup has to change**. What changed is the skin: black ground,
Oxford blue / aubergine / oxblood fields, 8·16·28·pill radii, four surface steps,
soft focus ring.

Notes:
- `.grain` and `.ambient` are now `display: none` — Soft Field has no texture or
  gradient wash. The elements can stay in `layout.tsx` or be deleted.
- The custom cursor is kept but recolored. To restore the native cursor, delete
  the `body { cursor: none; }` line and the `#cur` / `#cur-ring` block.
- `.badge-gold` is now oxblood, `.badge-eng` blue, `.badge-silver` outline, plus a
  new `.badge-aub`.
- `.ttag` and `.spill` are pills now, not monospace squares.

New classes you can use as you go: `.pmedia` (16:10 image plate at the top of a
project card), `.avail` (oxblood availability chip), `.field` / `.field-label`
(contact inputs), `.btn-blue`, `.btn-aub`, `.contact-field` (aubergine section
ground), `.nav-links a.active`.

## 2. `code/layout.tsx` → paste over `app/layout.tsx`
Swaps Cormorant Garamond + DM Sans for **Newsreader + Figtree** and renames the
CSS variables to `--font-newsreader` / `--font-figtree`. The CSS above expects
those two names.

## 3. `code/tailwind.config.ts` → paste over `tailwind.config.ts`
Optional but recommended: exposes the palette and radius scale as Tailwind
utilities (`bg-aub-field`, `text-ink-2`, `rounded-pill`, `shadow-ring`, …) for
anything new you build, and updates the `fontFamily` keys.

## Search & replace after pasting
If any component references the old font variables or accent, update:
- `var(--font-cormorant)` → `var(--font-newsreader)`
- `var(--font-dm-sans)` → `var(--font-figtree)`
- `font-cormorant` (Tailwind class) → `font-newsreader`
- `#e09340` / `var(--acc)` used as a *background* → `var(--paper)` for the primary
  action, `var(--blue)` or `var(--aub)` for secondary. `var(--acc)` still exists
  and now resolves to lilac `#c9b0da` for accent *text*.

## Contrast
Colored small text is out on this palette: keep body copy `--txt2` (#C6C3BF) and
captions `--txt3` (#8B8986). Lilac `#C9B0DA` is the only tinted text color, for
links and eyebrows. Never set 13px type in `--blue` or `--aub`.
