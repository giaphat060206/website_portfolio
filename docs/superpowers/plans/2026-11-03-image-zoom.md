# Image Zoom — Plan

**Spec:** `docs/superpowers/specs/2026-11-03-image-zoom-design.md`

## Global constraints

- No new dependencies. `output: 'export'` stays intact.
- Filmstrip drags of more than 6px must not open the lightbox.
- Reduced motion swaps instantly.
- Gate: `npx tsc --noEmit` && `npm run lint` && `npm run build`.

## Review focus

1. Click-after-drag opens the lightbox by accident. → Task 3
2. FLIP starts from the wrong rectangle (transformed ancestors, scroll offset). → Task 1
3. Body scroll not restored after close. → Task 1
4. Focus not returned to the thumbnail. → Task 1
5. Clones become unnamed tab stops. → Task 3
6. Closing animation never completes if `transitionend` doesn't fire. → Task 1

---

### Task 1: Lightbox provider and overlay

**Files:** create `components/Lightbox.tsx`

**Interfaces:** `LightboxProvider({ children })`, `useLightbox(): { open(src, alt, el) }`.

- [ ] **Step 1:** Context + provider holding `{ src, alt, from: DOMRect }`. `open()` records `el.getBoundingClientRect()` and the trigger element.
- [ ] **Step 2:** Overlay marked `role="dialog" aria-modal="true"` with `aria-label` from the alt text. Backdrop `bg-canvas/95` at `z-50`; clicking the backdrop (target === currentTarget) closes.
- [ ] **Step 3:** Target box: 92vw × 92vh max, aspect from `src.width / src.height`, centred with `fixed inset-0 m-auto`.
- [ ] **Step 4:** FLIP open — set `transform: translate(dx,dy) scale(s)` where `s = from.width / targetWidth`, then next frame clear it with a 300ms transition. Reverse on close; call `onClose` on `transitionend`, with a timeout fallback so a missing event cannot strand the overlay.
- [ ] **Step 5:** Lock `body` overflow while open and restore the previous value on unmount. Move focus to the close button on open; return focus to the trigger on close. Esc closes; Tab is trapped.
- [ ] **Step 6:** Verify gate, then commit `feat: add zoomable image lightbox`.

---

### Task 2: ZoomableImage wrapper

**Files:** create `components/ZoomableImage.tsx`

**Interfaces:** `ZoomableImage({ src, alt, className?, sizes?, decorative? })` — a `<button type="button">` wrapping `next/image`.

- [ ] **Step 1:** Button calls `open(src, alt, event.currentTarget)`. Accessible name comes from the image alt; no duplicate `aria-label`.
- [ ] **Step 2:** `decorative` sets `aria-hidden="true"` and `tabIndex={-1}` for cloned slides.
- [ ] **Step 3:** Image fills the button (`h-full w-full object-cover`), button carries the frame classes.

---

### Task 3: Wire filmstrip and gallery

**Files:** modify `components/Filmstrip.tsx`, `components/Education.tsx`, `app/layout.tsx`

- [ ] **Step 1:** Wrap layout children in `<LightboxProvider>`.
- [ ] **Step 2:** Filmstrip renders `ZoomableImage` for every slide; clones are `decorative`. Stop forcing `tabIndex = 0` on the track — the image buttons are the focus stops now; keep arrow-key scrolling.
- [ ] **Step 3:** Education gallery renders `ZoomableImage` in place of `Image`.
- [ ] **Step 4:** Verify a drag does not open the lightbox, and a plain click does.
- [ ] **Step 5:** Gate, commit `feat: make screenshots and gallery photos zoomable`.

---

### Task 4: Verification

- [ ] `tsc`, `lint`, `build` clean; serve `out/`; confirm the dialog appears only after interaction.
- [ ] Reduced motion: instant open/close.
- [ ] Esc, backdrop, and close button all reverse the animation and restore scroll and focus.
