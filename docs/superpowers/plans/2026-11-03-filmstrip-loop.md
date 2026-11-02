# Filmstrip Infinite Loop — Plan

**Spec:** `docs/superpowers/specs/2026-11-03-project-filmstrip-design.md` (see *Amendment: infinite wrap*)

## Global constraints

- No new dependencies. Native scroll only.
- Wraps in both directions, indefinitely.
- Single-screenshot projects do not loop and stay non-scrollable.
- Clones are `aria-hidden` with empty `alt`.
- Gate: `npx tsc --noEmit` && `npm run lint` && `npm run build`.

## Review focus

1. Seam drift from flex `gap` — measure set width from child offsets, not `scrollWidth / 3`. → Task 1
2. Drag across the boundary — correct `startScroll` when the wrap jump happens. → Task 1
3. Initial position — the track must start in the middle copy or the first left-drag hits a wall. → Task 1
4. Duplicate content announced twice by screen readers. → Task 1
5. Single-image rows must not gain clones or a focus stop. → Task 1
6. Keyboard wrap — arrow keys must cross the boundary too. → Task 1

---

### Task 1: Loop the filmstrip

**Files:** modify `components/Filmstrip.tsx`

**Interfaces:** unchanged — `Filmstrip({ images, label })`.

- [ ] **Step 1:** Render `slides = images.length >= 2 ? [...images, ...images, ...images] : images`. Mark slides outside the middle copy `aria-hidden="true"` and `alt=""`.
- [ ] **Step 2:** On mount and resize, set `track.scrollLeft` to the measured set width (offset of the first slide of the middle copy minus the first slide overall).
- [ ] **Step 3:** Add `normalize()` called on scroll and after each pointer move: if `scrollLeft < setWidth/2` add `setWidth`; if `> setWidth*1.5` subtract it; when a drag is active, apply the same delta to `drag.current.startScroll`.
- [ ] **Step 4:** For non-looping rows set `tabIndex = -1` and `data-scrollable="false"`; looping rows get `tabIndex = 0`.
- [ ] **Step 5:** Verify — gate clean, then serve `out/` and confirm the rendered HTML has 3× slides for multi-image projects and 1 slide for Smart Path Finder.

- [ ] **Step 6:** Commit `feat: loop filmstrip in both directions`.
