# Project Filmstrip Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the 2-up Projects grid with four full-width rows: written case on the left, draggable horizontal filmstrip of that project's screenshots on the right.

**Architecture:** A new client component `Filmstrip` owns native horizontal scrolling plus a ~30-line pointer-drag shim. `ProjectCard` becomes a server component laying out text and `<Filmstrip>` in a two-column row. `Projects` stops rendering a grid and stacks rows with hairline separators.

**Tech Stack:** Next.js 16.4.4 App Router, React 19, TypeScript strict, Tailwind v4. No new dependencies.

**Spec:** `docs/superpowers/specs/2026-11-03-project-filmstrip-design.md`

## Global Constraints

- No new dependencies; native scroll + pointer events only.
- Still `output: 'export'`. Images stay static imports from `data/projectImages.ts`.
- All copy still comes from `data/cv.ts`.
- No snapping, autoplay, looping, lightbox, arrows, or dots.
- `prefers-reduced-motion: reduce` removes smooth keyboard scrolling.
- Existing dark tokens and type scale unchanged.
- Gate for every task: `npx tsc --noEmit` && `npm run lint` && `npm run build`.

## Review Focus

1. **Drag-then-click navigates.** Releasing a drag over a Source/Live link must not open it. → Task 1.
2. **Touch scrolling broken.** Pointer handlers must not `preventDefault` on touch, or native momentum dies. → Task 1.
3. **Keyboard users cannot reach the strip.** The track must be focusable and arrow-scrollable. → Task 1.
4. **Focus ring clipped.** `overflow-x-auto` clips vertical outlines; the row must leave room. → Task 2.
5. **Missing images.** A project with no screenshots must not render an empty strip or a gap. → Task 2.
6. **Mobile stack order.** Text must come before the strip below `md`. → Task 2.

---

### Task 1: Filmstrip component

**Files:**
- Create: `components/Filmstrip.tsx`

**Interfaces:**
- Consumes: `ProjectImage` from `@/data/projectImages`.
- Produces: `export function Filmstrip({ images, label }: { images: ProjectImage[]; label: string }): JSX.Element` — `"use client"`.

- [ ] **Step 1: Create the component.** Structure:

```tsx
<div className="relative [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]">
  <div ref={trackRef} role="group" aria-label={`${label} screenshots`} tabIndex={0}
       className="flex cursor-grab gap-4 overflow-x-auto pb-2 active:cursor-grabbing
                  [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
                  focus-visible:outline-offset-4">
    {images.map((image, i) => (
      <Image key={i} src={image.src} alt={image.alt} draggable={false}
             sizes="(min-width: 1024px) 28vw, (min-width: 640px) 50vw, 85vw"
             className="aspect-[4/3] w-[85%] shrink-0 select-none rounded-lg border border-line object-cover sm:w-[58%] lg:w-[50%]" />
    ))}
  </div>
</div>
```

- [ ] **Step 2: Add the pointer-drag shim.** Only engage for `e.pointerType === "mouse"` so touch keeps native scrolling. On `pointerdown` record `{ startX: e.clientX, startScroll: el.scrollLeft, moved: false }`, call `setPointerCapture`, and set a `dragging` ref. On `pointermove` set `el.scrollLeft = startScroll - (e.clientX - startX)` and mark `moved = true` once `|delta| > 6`. On `pointerup`/`pointercancel` release capture and clear the drag. Never call `preventDefault` on `pointerdown`/`pointermove` for touch. Do not use React state for the drag record — a ref avoids re-render per pixel.

- [ ] **Step 3: Suppress the click after a drag.** On the track's `onClickCapture`, if `moved` is true, call `e.preventDefault()` and `e.stopPropagation()`, then reset `moved`. A drag must never activate a link.

- [ ] **Step 4: Keyboard support.** On `onKeyDown`, `ArrowLeft`/`ArrowRight` scroll by one child width:

```ts
const item = track.children[0] as HTMLElement | undefined;
const step = item ? item.offsetWidth + 16 : 320;
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
track.scrollBy({ left: dir * step, behavior: reduced ? "auto" : "smooth" });
```

Call `e.preventDefault()` for both keys so the page does not scroll.

- [ ] **Step 5: Verify**

Run: `npx tsc --noEmit` → no output.
Run: `npm run lint` → exit 0.
Run: `npm run build` → success.

- [ ] **Step 6: Commit**

```powershell
git add components/Filmstrip.tsx
git commit -m "feat: add draggable filmstrip component"
```

---

### Task 2: ProjectCard becomes a row

**Files:**
- Modify: `components/ProjectCard.tsx`

**Interfaces:**
- Consumes: `Filmstrip` from Task 1 (`{ images, label }`), `Project`, `ProjectImage`.
- Produces: `export function ProjectCard({ project, images, index }: { project: Project; images?: ProjectImage[]; index: number }): JSX.Element` — server component, no `"use client"`.

- [ ] **Step 1: Replace the card layout.** Outer `<article id={project.slug}>` with `grid gap-8 border-t border-line py-14 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-12 md:py-20`. Text column first in source order (so mobile stacks text above images): mono index `String(index + 1).padStart(2, "0")`, `h3` in `font-display text-3xl`, role line in mono uppercase faint, the two bullets in `text-ink-muted`, tag chips, and the Source/Live links. Right column renders `<Filmstrip images={images} label={project.title} />` **only when `images?.length`** is truthy; otherwise render nothing (the text column simply occupies the row).

- [ ] **Step 2: Remove the old bordered-card styling** — no `rounded-lg border bg-surface p-6` wrapper, no image grid, no `hover:border-accent`. Rows are separated by the hairline only.

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit` → no output.
Run: `npm run lint` → exit 0.
Run: `npm run build` → success.

- [ ] **Step 4: Commit**

```powershell
git add components/ProjectCard.tsx
git commit -m "refactor: turn project cards into full-width rows"
```

---

### Task 3: Projects section spacing

**Files:**
- Modify: `components/Projects.tsx`

**Interfaces:**
- Consumes: `ProjectCard` from Task 2 (now needs `index`).
- Produces: `export function Projects(): JSX.Element` rendering a `flex flex-col` of rows, no grid.

- [ ] **Step 1: Replace the grid** with `<div className="flex flex-col">`, mapping `cv.projects` to `<ProjectCard key={project.slug} project={project} images={projectImages[project.slug]} index={index} />`. Drop the `Reveal` wrapper's delay stagger (`index * 60`) — with full-height rows, staggering introduces visible lag; keep `Reveal` with no delay, or drop it if rows already animate adequately.

- [ ] **Step 2: Verify**

Run: `npm run build` → success.
Manual: `npm run dev` at 1440px — four stacked rows, each with text left and a filmstrip right.

- [ ] **Step 3: Commit**

```powershell
git add components/Projects.tsx
git commit -m "refactor: stack project rows"
```

---

### Task 4: Full verification

**Files:** none expected.

- [ ] **Step 1: Gate** — `npx tsc --noEmit`, `npm run lint`, `npm run build` all clean; `out/index.html` exists.

- [ ] **Step 2: Serve the export** — `python -m http.server 3123 -d out`, request `/`. Expect HTTP 200 and 13 `<img>` tags.

- [ ] **Step 3: Manual checks**
  - Drag a strip with the mouse: it scrolls, cursor is `grab`/`grabbing`, and the page does not scroll vertically.
  - Release a drag over a Source link: it does not navigate.
  - Tab into a strip, press arrows: it scrolls one image per press.
  - At 360px: text sits above the strip, strip is full width, page has no horizontal overflow.
  - With reduced motion on, arrow-key scrolling is instant.
  - A project with one image (Smart Path Finder) still renders a clean single slide.

- [ ] **Step 4: Commit any fixes** — `git add -A && git commit -m "fix: address filmstrip verification findings"` (skip if nothing to fix).
