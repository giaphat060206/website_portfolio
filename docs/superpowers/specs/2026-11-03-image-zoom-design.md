# Image Zoom — Design

**Date:** 2026-11-03
**Status:** awaiting approval
**Scope:** filmstrip screenshots and the award gallery. The hero portrait is not zoomable.

## Intent

Screenshots in the reel are deliberately small — two fit in a column. A visitor who wants to read
one currently has no way to see it at size. Clicking an image should grow it out of its own place
in the reel to fill the screen, and releasing it should put it back where it came from.

## Interaction

- Click (or tap) any filmstrip slide or award-gallery photo → it expands.
- The expansion is continuous: the image starts at the exact rectangle it occupied in the page and
  grows to a centred, aspect-correct box capped at 92vw × 92vh. No fade-in from nothing.
- Clicking the backdrop, pressing Esc, or clicking the close button reverses the same motion —
  the image shrinks back to its slot in the reel.
- While open the page behind is dimmed (`rgba(8,8,10,0.92)`), does not scroll, and takes no clicks.
- The image draws above the fixed nav.

## Motion

Transform-based FLIP, not width/height animation:

1. Measure the thumbnail's viewport rectangle.
2. Render the image fixed and centred at its final size, then apply
   `translate(dx, dy) scale(s)` so it visually sits exactly on the thumbnail.
3. On the next frame, clear the transform with a 300ms `ease-out` transition.

Closing runs the reverse. `prefers-reduced-motion: reduce` skips both frames and swaps instantly.

## Accessibility

- Overlay is `role="dialog"` `aria-modal="true"` with an accessible name from the image's alt text.
- Focus moves to the close button on open and returns to the thumbnail on close.
- Esc closes. Tab is trapped inside the dialog while open.
- Slide and gallery images become real `<button>` elements with an accessible name, not clickable
  `<div>`s.
- The close button is reachable and visible against the dark backdrop.
- Alt text is announced exactly once, on the dialog, not duplicated on the image.

## Constraints

- No new dependencies.
- Static export stays intact; the lightbox is a client component mounted once at the root.
- Images keep their existing `alt` text; nothing is added to `data/cv.ts`.
- Must not break filmstrip dragging: a drag that moves more than 6px must not open the lightbox.

## Non-goals

Pinch or scroll-wheel zoom · panning · previous/next arrows between images · captions · download
buttons · zooming the hero portrait.

## Left to the builder

Exact easing, backdrop opacity, close-button placement, and whether the backdrop dims with the
zoom or appears instantly — all tuned by eye.
