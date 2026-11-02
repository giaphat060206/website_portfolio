# Project Filmstrip Rows — Design

**Date:** 2026-11-03
**Status:** awaiting approval
**Scope:** the Projects section only. Everything else on the page is unchanged.

## Intent

Four project cards in a 2-up grid give each project roughly half a screen and crop its screenshots
into small tiles. Replacing the grid with full-width rows gives each project the width of the page,
puts its written case on the left, and shows its screenshots at a readable size on the right.

## What it looks like

Each project is its own row, separated by the page's existing hairline rules.

- **Left column** (~45%): mono index (`01`), display-font title, role line, the two CV bullets,
  tag chips, and the Source / Live links.
- **Right column** (~55%): a filmstrip of that project's images. Roughly two images are fully
  visible with a sliver of the third, so the strip reads as continuing off-screen.

Below `md` the columns stack: text first, then the full-width filmstrip.

## Filmstrip behaviour

- One horizontal track per row, `overflow-x: auto`, no snapping, no autoplay, no loop.
- Drag to scroll: pointer down captures the pointer, pointer move adjusts `scrollLeft` by the
  horizontal delta, pointer up releases. Cursor changes from grab to grabbing while held.
- Native trackpad, wheel, and touch scrolling are untouched — the shim only adds mouse dragging.
- A drag that moves more than 6px suppresses the click, so releasing over a link does not navigate.
- Images are not natively draggable (`draggable={false}`) so the browser's image-drag never wins.
- Both edges fade out with a mask, signalling that the strip continues.
- The scrollbar is hidden; the strip is not scrollable by a visible bar.

## Accessibility

- The track is focusable (`tabIndex={0}`) with an accessible name naming the project.
- Left/Right arrow keys scroll by one image width.
- Images keep their row `alt` text; nothing is conveyed by the strip's position alone.
- `prefers-reduced-motion: reduce` removes smooth scrolling for keyboard movement.
- Nothing is hidden behind hover, so touch and keyboard reach the same content.

## Constraints

- No new dependencies. Build on native scroll plus pointer events.
- Still a static export: the component is a client component, but the images remain static imports.
- All copy still comes from `data/cv.ts`; images from `data/projectImages.ts`.
- Keeps the existing dark tokens and type scale.

## Non-goals

Snap-to-image · autoplay · infinite loop · lightbox or zoom · arrow buttons and dot indicators ·
a change to any other section.

## Amendment: infinite wrap (2026-11-03)

Replaces the original "no infinite loop" non-goal.

The filmstrip is a continuous reel. Dragging right past the last image brings the first one back;
dragging left past the first brings the last. It wraps in both directions, indefinitely.

**How the loop is built**

- The slide set is rendered three times: `[copy A][copy B][copy C]`, identical content.
- On mount, `scrollLeft` is set to the start of copy B, so there is a full copy of buffer on
  each side.
- A boundary check runs on scroll: if the track sits in the first half-copy it jumps forward by
  one set width; if in the last half-copy it jumps back. The jump is invisible because the
  destination shows identical pixels.
- Set width is measured as the offset difference between the first slide of copy B and the first
  slide of copy A — not `scrollWidth / 3` — so flex `gap` cannot accumulate drift across the loop.
- During a mouse drag, the recorded start offset is corrected by the same amount as the jump.
  Otherwise the next `pointermove` would compute its target from a stale origin and undo the wrap.
- On resize, the track resets to the start of copy B.

**When it does not loop**

A project with a single screenshot renders one slide, no clones, no loop — repeating one image
forever adds nothing. It stays non-scrollable, as today.

**Accessibility**

- Cloned slides are marked `aria-hidden="true"` with empty `alt`, so screen readers and search
  engines see each screenshot once.
- The track remains a single focus stop; arrow keys still move one slide at a time and wrap.
- Nothing auto-plays; the reel only moves when the visitor moves it.

**New non-goals**

Autoplay · snapping to slides · momentum simulation beyond native scrolling.

## Left to the builder

Exact column ratio, image width fraction, gap, and mask strength — tuned by eye at 360px, 768px,
and 1440px.
