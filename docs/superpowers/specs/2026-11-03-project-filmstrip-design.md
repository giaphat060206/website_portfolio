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

## Amendment: depth (2026-11-03)

The strip is no longer a flat row. Each slide is a plane in a shallow 3D scene, and its distance
from the middle of the strip decides how it is drawn.

- **Centred**: full size, sharp, fully opaque.
- **Towards either edge**: the slide shrinks, lifts up, turns away from the viewer, dims and
  blurs. The falloff is continuous — dragging a screenshot out of the middle grows it and brings
  it into focus, dragging it away pushes it back.
- **Blur starts later than the rest of the falloff.** The strip stays sharp until a slide is 85%
  of the way to the edge, then softens over the last stretch. Only what is genuinely leaving the
  strip goes out of focus, so the unblurred area covers most of the visible strip.
- The track opens with a screenshot centred rather than flush against the left edge, so both
  sides of the falloff are visible on arrival.
- Slides are wider: `56%` of the track at `lg`, `60%` at `sm`, `86%` on phones. The focused
  screenshot is roughly a third larger than before.
- A single-screenshot project is left alone: there is nothing to bring into focus.

**How it is built**

- `Filmstrip.tsx` measures each slide's layout centre once per resize and reads its position from
  `scrollLeft` on every frame, writing `--t` (signed distance, −1…1), `--d` (clamped magnitude,
  0…1) and `--e` (unclamped distance) onto the slide.
- Scale, lift, dim and rotation read `--d`; blur reads `--e` through `--b`, a clamped ramp that
  is zero until `0.85` and reaches full at `1.5`. Raising `0.85` widens the sharp band; lowering
  it blurs sooner.
- The look itself lives in `.filmstrip-slide` in `app/globals.css`, so scale, lift, rotation,
  dim and blur can be tuned without touching the scroll code.
- The track centres its slides vertically (`items-center`) so each slide's aspect ratio sets its
  height. A `wide` screenshot (16:9/2:1) therefore renders shorter than a 4:3 one instead of
  being stretched to the tallest slide and cropped.
- Geometry comes from `offsetLeft`/`offsetWidth`, never `getBoundingClientRect`: the rect would
  include the transform being applied and feed back into itself.
- Updates are batched into one `requestAnimationFrame`, and the existing wrap still jumps by a
  whole set, so the depth pattern is identical on both sides of the seam.

**Non-goals**

Snapping or autoplay · a per-slide height change · hiding the side screenshots entirely — they
stay clickable.

