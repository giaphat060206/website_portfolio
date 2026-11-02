# Portfolio Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a single-page, statically exported dark portfolio for Nguyen Don Gia Phat at `/`, with a persistent nav that scroll-spies the current section.

**Architecture:** Next.js App Router with one route. All copy lives in a typed `data/cv.ts` module; section components are presentational and read from it. Only two components are client-side — `Nav` (scroll-spy, intent lock, mobile chip centring) and `Reveal` (IntersectionObserver fade-in). Everything else renders on the server. `output: 'export'` produces plain HTML/CSS/JS in `out/`.

**Tech Stack:** Next.js 16.4.4 (App Router, Turbopack), React 19.3, TypeScript 5.9, Tailwind CSS v4, `@vercel/analytics`, `gh`-managed GitHub Actions CI.

**Spec:** `docs/superpowers/specs/2026-11-02-portfolio-site.md`

## Global Constraints

- Single route `/`. No additional pages, API routes, or route handlers.
- `output: "export"` and `images: { unoptimized: true }` in `next.config.ts`.
- All user-visible copy comes from `data/cv.ts`. No hardcoded strings in components.
- Colour tokens and typefaces exactly as specified in the spec's *Visual system* section. Accent `#7C93A8` is used **only** for active nav, link hover, primary button, and focus ring.
- No neon, no decorative gradients, no glows, no light theme.
- Every section carries `scroll-margin-top` equal to the nav height.
- `prefers-reduced-motion: reduce` disables smooth scrolling and entry animation.
- Nav is fixed from load; anchors are `About`, `Skills`, `Projects`, `Education`, `Contact`; logo links to `#top`.
- No unit test suite. Gate for every task: `npx tsc --noEmit` && `npm run lint` && `npm run build`.
- No phone number, street address, high school entry, contact form, i18n, or custom domain.

## Review Focus

Failure modes the spec implies that no automated test will catch. Each is pinned to the task that owns the code.

1. **Contact never highlights.** A naive "top crosses 30%" rule can never fire for the last section on a short page, so the final nav item stays dead. → pinned in Task 6.
2. **Anchors land under the fixed bar.** Without `scroll-margin-top`, clicking `Projects` puts the heading behind the nav. → pinned in Tasks 2 and 5.
3. **Reduced motion ignored.** Smooth scroll and entry animation must be fully off for users with `prefers-reduced-motion: reduce`, and content must still be visible. → pinned in Tasks 2 and 5.
4. **Mobile chip centring hijacks the page.** `element.scrollIntoView()` scrolls the *window* vertically as well as the chip row. Centring must scroll only the chip container. → pinned in Task 6.
5. **Static export breaks on image or OG generation.** `next/image` optimization is unavailable under `output: 'export'`, and `opengraph-image.tsx` must resolve at build time. → pinned in Tasks 1 and 11.
6. **Keyboard users lose focus.** On a `#08080A` canvas, the default focus ring is close to invisible; the skip link and nav must be reachable and obviously focused. → pinned in Tasks 2, 4, and 13.

---

### Task 1: Build config, assets, and repo housekeeping

**Files:**
- Modify: `next.config.ts`
- Modify: `package.json`
- Delete: `cv_extracted.txt`, `app/data/cvData.js`
- Create: `app/assets/images/**/*.webp` (optimised derivatives)
- Add to git: `package-lock.json`, `app/assets/`

**Interfaces:**
- Consumes: nothing.
- Produces: a build that emits `out/`; a committed lockfile; optimised WebP files sitting beside each original at the same relative path with a `.webp` extension (`app/assets/images/face/linkedin.webp`, `app/assets/images/syntax-scalpel/title.webp`, …). Tasks 7, 9, and 10 import the `.webp` files, never the originals.

- [ ] **Step 1: Remove the non-standard `allowScripts` block** from `package.json`. npm ignores unknown top-level keys, so removing it changes no behaviour.

- [ ] **Step 2: Delete the scratch file and the empty placeholder** — `cv_extracted.txt` was never tracked, and `app/data/cvData.js` is an empty file superseded by `data/cv.ts`:

```powershell
Remove-Item cv_extracted.txt -ErrorAction SilentlyContinue
Remove-Item app/data/cvData.js -ErrorAction SilentlyContinue
Remove-Item app/data -ErrorAction SilentlyContinue
```

- [ ] **Step 3: Optimise the supplied images.** Origins stay untouched; WebP derivatives are written beside them. `interview.png` is 1.4 MB and must not ship as-is.

```powershell
python -c "
from PIL import Image
from pathlib import Path
for p in sorted(Path('app/assets/images').rglob('*')):
    if p.suffix.lower() in {'.png','.jpg','.jpeg'}:
        im = Image.open(p)
        im.thumbnail((1600,1600), Image.LANCZOS)
        out = p.with_suffix('.webp')
        im.convert('RGB').save(out, 'WEBP', quality=82, method=6)
        print(f'{p.name} -> {out.name} {out.stat().st_size//1024}KB')
"
```

Expected: ten `.webp` files, every one under 400 KB.

- [ ] **Step 4: Add export config** to `next.config.ts`:

```ts
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  // keep the existing experimental, cacheComponents, partialPrefetching,
  // and turbopack keys unchanged
};
```

- [ ] **Step 5: Build and confirm static export**

Run: `npm run build`
Expected: build succeeds and `out/index.html` exists (`Test-Path out/index.html` → `True`).
If the build fails citing `cacheComponents` or `partialPrefetching`, delete those two keys, rebuild, and record the change in the commit message.

- [ ] **Step 6: Commit**

```powershell
git add package-lock.json package.json next.config.ts app/assets
git commit -m "chore: enable static export, commit lockfile, add optimised assets"
```

---

### Task 2: Design tokens and base styles

**Files:**
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: nothing.
- Produces: Tailwind v4 theme tokens `bg-canvas`, `bg-surface`, `border-line`, `text-ink`, `text-ink-muted`, `text-ink-faint`, `text-accent`, `bg-accent`, `font-display`, `font-sans`, `font-mono`; global `:focus-visible` ring; reduced-motion overrides.

- [ ] **Step 1: Replace `app/globals.css`** with the token set below, plus a base layer that sets canvas background, ink colour, `font-sans`, `antialiased`, and `scroll-behavior: smooth` on `html`.

```css
@import "tailwindcss";

@theme inline {
  --color-canvas: #08080a;
  --color-surface: #101013;
  --color-line: rgba(255, 255, 255, 0.08);
  --color-ink: #f5f5f4;
  --color-ink-muted: #a1a1aa;
  --color-ink-faint: #71717a;
  --color-accent: #7c93a8;
  --font-display: var(--font-instrument-serif);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}
```

Also add, outside `@theme`: a `:root` block resetting `--background`/`--foreground` semantics to the tokens above, `::selection` in accent, `:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 3px; }`, and:

```css
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 2: Verify the tokens compile**

Run: `npm run build`
Expected: success; no unknown-utility warnings.

Run: `npx tsc --noEmit` — expected: no output.

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat: add dark design tokens and base styles"
```

---

### Task 3: Typed CV data module

**Files:**
- Create: `data/cv.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `cv: Cv` and these exported types:

```ts
export type NavItem = { id: string; label: string };
export type SkillGroup = { title: string; items: string[] };
export type Project = {
  slug: string;
  title: string;
  role: string;
  bullets: [string, string];
  tags: string[];
  source: string;
  live?: string;
};
export type EducationEntry = {
  school: string;
  degree: string;
  dates: string;
  detail: string;
  location: string;
};
export type Certification = { name: string; detail: string; date: string };
export type Cv = {
  name: string;
  role: string;
  location: string;
  intro: string;
  award: string;
  summary: string;
  languages: string;
  links: { email: string; github: string; linkedin: string; resume: string };
  nav: NavItem[];
  skills: SkillGroup[];
  projects: Project[];
  education: EducationEntry[];
  certifications: Certification[];
};
export const cv: Cv;
```

- [ ] **Step 1: Create `data/cv.ts`** and populate every field verbatim from the spec's *Content* section. `nav` is exactly `about, skills, projects, education, contact` with labels `About, Skills, Projects, Education, Contact`. `projects` is in spec order (SyntaxScalpel, TicTacToang, Event Manager, Smart Path Finder). `links.resume` is `/CV_GiaPhat.pdf`.

- [ ] **Step 2: Verify types**

Run: `npx tsc --noEmit`
Expected: no output.
Run: `npm run lint`
Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
git add data/cv.ts
git commit -m "feat: add typed CV content module"
```

---

### Task 4: Root layout, fonts, and metadata

**Files:**
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: `cv` (for `metadata.title`/`description` and the skip-link label context).
- Produces: `<html>`/`<body>` shell with CSS variables `--font-instrument-serif`, `--font-geist-sans`, `--font-geist-mono`; a skip link targeting `#main`.

- [ ] **Step 1: Replace fonts and metadata.** Use `Instrument_Serif` (weight `400`, `subsets: ["latin"]`, `variable: "--font-instrument-serif"`), `Geist`, and `Geist_Mono` from `next/font/google`. Set:

```ts
export const metadata: Metadata = {
  title: "Nguyen Don Gia Phat — Software Engineer",
  description:
    "Software engineering student at RMIT Vietnam building secure full-stack web and mobile applications.",
};
```

- [ ] **Step 2: Add the shell.** `<html lang="en">` carries all three font variables plus `h-full scroll-smooth antialiased`. `<body>` is `min-h-full bg-canvas text-ink font-sans`. First child of `<body>` is a skip link: `<a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded focus:bg-surface focus:px-4 focus:py-2 focus:text-ink">Skip to content</a>`.

- [ ] **Step 3: Verify**

Run: `npm run build`
Expected: success; the build log shows the Google Fonts for Instrument Serif, Geist, and Geist Mono resolved (no "Failed to fetch font" error).

- [ ] **Step 4: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: add root layout, display fonts, and metadata"
```

---

### Task 5: Section shell and scroll-reveal

**Files:**
- Create: `components/Section.tsx`
- Create: `components/Reveal.tsx`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `export function Section({ id, kicker, title, children }: { id: string; kicker?: string; title: string; children: React.ReactNode }): JSX.Element` — renders `<section id={id} className="scroll-mt-24 border-t border-line px-6 py-24 sm:py-32">` with an optional mono kicker and a display-font `h2`, then children inside a `mx-auto max-w-5xl` wrapper.
  - `export function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }): JSX.Element` — `"use client"`, IntersectionObserver, `rootMargin: "0px 0px -10% 0px"`, triggers once, sets `opacity-100 translate-y-0` from `opacity-0 translate-y-2`, `transition-all duration-400`, `transitionDelay` = `` `${delay}ms` ``.

- [ ] **Step 1: Implement `Section`** as a server component with the exact signature above. `scroll-mt-24` is mandatory — it is what keeps anchored headings clear of the fixed nav.

- [ ] **Step 2: Implement `Reveal`** as a client component. It must render children at `opacity-100` immediately when the browser reports `prefers-reduced-motion: reduce` (via `window.matchMedia`), and must never leave content at `opacity-0` if the observer never fires — render the final state when `IntersectionObserver` is unavailable.

- [ ] **Step 3: Verify**

Run: `npm run build` — expected: success.
Manual: run `npm run dev`, temporarily wrap a paragraph in `<Reveal>` on the home page, toggle OS reduced-motion, and confirm the paragraph is visible either way. Revert the temporary markup before committing.

- [ ] **Step 4: Commit**

```bash
git add components/Section.tsx components/Reveal.tsx
git commit -m "feat: add section shell and scroll-reveal primitive"
```

---

### Task 6: Persistent navigation with scroll-spy

**Files:**
- Create: `components/Nav.tsx`

**Interfaces:**
- Consumes: `cv.nav` (ids and labels).
- Produces: `export function Nav(): JSX.Element` — `"use client"`, renders `<header className="fixed inset-x-0 top-0 z-40 border-b border-line bg-canvas/85 backdrop-blur-xl">` containing the name/logo link to `#top` and the anchor list.

- [ ] **Step 1: Implement scroll-spy.** Track `activeId` with `useState`. Observe each `cv.nav` section with an `IntersectionObserver` using `rootMargin: "-30% 0px -69% 0px"` and `threshold: 0`; on intersect, set that id active. Add a `scroll` listener (passive, rAF-throttled) that runs only to handle the bottom override: when `innerHeight + scrollY >= document.body.scrollHeight - 2`, force `activeId` to the last nav id. This override is required — without it `Contact` can never activate.

- [ ] **Step 2: Implement the intent lock.** A `useRef<number>` holds a release timestamp. Clicking an anchor sets `Date.now() + 600` and suppresses observer updates until then. Do not use a bare `setTimeout` that can outlive unmount.

- [ ] **Step 3: Implement active styling.** Active: `text-ink` plus an `after:` hairline underline in `bg-accent`. Inactive: `text-ink/60 hover:text-ink`. Both states must keep the underline's colour accessible against `#08080A`.

- [ ] **Step 4: Implement mobile chip centring.** The anchor list is `flex gap-1 overflow-x-auto` on mobile and `sm:overflow-visible`. On `activeId` change, centre the active chip by scrolling **the container only**:

```ts
const el = listRef.current?.querySelector<HTMLElement>(`[data-id="${activeId}"]`);
const list = listRef.current;
if (el && list) {
  list.scrollTo({ left: el.offsetLeft - list.clientWidth / 2 + el.clientWidth / 2, behavior: "smooth" });
}
```

Do **not** call `scrollIntoView()` here — it scrolls the window and yanks the page.

- [ ] **Step 5: Verify**

Run: `npm run build` — expected: success.

Manual, in `npm run dev`:
- Scroll to the bottom → `Contact` is highlighted.
- Click `Projects` → underline lands on `Projects`, no flicker through `Skills`.
- Click `Education` → the heading is fully visible below the bar, not underneath it.
- Narrow to 360px → the chip row scrolls horizontally and the page does not jump when the active chip changes.
- Tab through the bar → focus ring is clearly visible.

- [ ] **Step 6: Commit**

```bash
git add components/Nav.tsx
git commit -m "feat: add persistent nav with scroll-spy and intent lock"
```

---

### Task 7: Hero and page scaffold

**Files:**
- Create: `app/page.tsx`
- Create: `components/Hero.tsx`

**Interfaces:**
- Consumes: `cv`, `Section` is not used (Hero is a full-bleed block with `id="top"`).
- Produces: `export default function Home(): JSX.Element` rendering `<Nav />` then `<main id="main">` containing `<Hero />`; `export function Hero(): JSX.Element`.

- [ ] **Step 1: Create `app/page.tsx`** as a server component: `<Nav />` outside `<main>`, `<main id="main">` wrapping the sections. Import and render `<Hero />` only for now.

- [ ] **Step 2: Implement `Hero`.** Full-height block with `id="top"`, `min-h-[85svh]`, `flex items-center`. Inside, a two-column grid: `grid gap-10 md:grid-cols-[1.15fr_0.85fr] md:items-center`.

  **Text column**, top to bottom: mono award line (`cv.award`, `text-ink-faint`), `h1` in `font-display` with `text-5xl sm:text-7xl` containing `cv.name`, role line (`cv.role`), intro paragraph (`cv.intro`, `max-w-2xl text-ink-muted`), then two CTAs — primary `View Projects` linking to `#projects` (`bg-accent text-canvas`), secondary `Download CV` linking to `cv.links.resume` (bordered, `hover:border-accent`).

  **Portrait column**: `import portrait from "@/app/assets/images/face/linkedin.webp"` and render with `next/image` as `<Image src={portrait} alt="Portrait of Nguyen Don Gia Phat" priority className="h-auto w-full rounded-lg border border-line object-cover" />`. On mobile the portrait renders *below* the text column (source order: text first, then portrait).

  Wrap both columns' content in `<Reveal>`.

- [ ] **Step 3: Verify**

Run: `npm run build` — expected: success.
Manual: `npm run dev` → the hero renders, both CTAs work, `Download CV` serves the PDF.

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx components/Hero.tsx
git commit -m "feat: add hero section and page scaffold"
```

---

### Task 8: About and Skills

**Files:**
- Create: `components/About.tsx`
- Create: `components/Skills.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `cv.summary`, `cv.location`, `cv.languages`, `cv.skills`, `Section`, `Reveal`.
- Produces: `export function About(): JSX.Element`, `export function Skills(): JSX.Element`; `app/page.tsx` renders `<About />` then `<Skills />`.

- [ ] **Step 1: Implement `About`.** `<Section id="about" kicker="01" title="About">`. Render `cv.summary` as a `text-lg leading-relaxed text-ink-muted` paragraph, then a two-item meta row: location (`cv.location`) and languages (`cv.languages`), each prefixed with a mono uppercase label.

- [ ] **Step 2: Implement `Skills`.** `<Section id="skills" kicker="02" title="Skills">`. Render `cv.skills` as a `grid gap-8 sm:grid-cols-3`, each column showing the group title in `font-mono text-xs uppercase tracking-widest text-ink-faint` and its items as a vertical list of `text-ink-muted`.

- [ ] **Step 3: Wire into `app/page.tsx`** inside `<main id="main">` after `<Hero />`.

- [ ] **Step 4: Verify**

Run: `npm run build` — expected: success.
Manual: both sections appear in order; `About` appears in nav as active while it is on screen.

- [ ] **Step 5: Commit**

```bash
git add components/About.tsx components/Skills.tsx app/page.tsx
git commit -m "feat: add about and skills sections"
```

---

### Task 9: Projects

**Files:**
- Create: `components/Projects.tsx`
- Create: `components/ProjectCard.tsx`
- Create: `data/projectImages.ts`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `cv.projects`, `Project` type, `Section`, `Reveal`.
- Produces:
  - `export type ProjectImage = { src: StaticImageData; alt: string }` (`StaticImageData` from `next/image`)
  - `export const projectImages: Record<string, ProjectImage[]>`, keyed by `project.slug`
  - `export function ProjectCard({ project, images }: { project: Project; images?: ProjectImage[] }): JSX.Element`
  - `export function Projects(): JSX.Element`; `app/page.tsx` renders `<Projects />`.

- [ ] **Step 1: Create `data/projectImages.ts`.** Static imports only (the bundler needs literal paths):

```ts
import ssTitle from "@/app/assets/images/syntax-scalpel/title.webp";
import ssGraph from "@/app/assets/images/syntax-scalpel/graph.webp";
import emEvents from "@/app/assets/images/event-manager/event-management.webp";
import emTickets from "@/app/assets/images/event-manager/ticket-management.webp";
import pfMain from "@/app/assets/images/pathfinder/main.webp";
import tttWelcome from "@/app/assets/images/tictactoang/welcome.webp";
import tttBoard from "@/app/assets/images/tictactoang/board.webp";
```

Map: `syntax-scalpel` → `[ssTitle, ssGraph]`, `event-manager` → `[emEvents, emTickets]`, `smart-path-finder` → `[pfMain]`, `tictactoang` → `[tttWelcome, tttBoard]`. Give each an `alt` describing the screenshot's content (e.g. `"SyntaxScalpel showing a dependency graph of a TypeScript project"`), not the file name.

- [ ] **Step 2: Implement `ProjectCard`** with no `index` prop — spacing stagger is `Reveal`'s job. `<article>` with `rounded-lg border border-line bg-surface overflow-hidden` and `hover:border-accent/40 transition-colors`. Contents in order: an image strip **only when `images` is non-empty** — a `grid grid-cols-2 gap-px bg-line` where the first image spans both columns (`col-span-2`) and any second sits beside it, each `next/image` with `className="h-full w-full object-cover"` and `sizes="(min-width: 1024px) 50vw, 100vw"`; then a `p-6` body containing `h3` in `font-display text-2xl` (`project.title`), role line in `font-mono text-xs uppercase tracking-widest text-ink-faint`, a `<ul>` of the two `project.bullets` in `text-ink-muted`, a tag row of `project.tags` as small bordered mono chips, and a link row: `Source` → `project.source`, plus `Live` → `project.live` **only when `project.live` is defined**. All external links get `target="_blank" rel="noopener noreferrer"`.

- [ ] **Step 3: Implement `Projects`.** `<Section id="projects" kicker="03" title="Selected Projects">` rendering `cv.projects` as a `grid gap-6 lg:grid-cols-2`, each card wrapped in `<Reveal delay={index * 60}>` and receiving `images={projectImages[project.slug]}`.

- [ ] **Step 4: Wire into `app/page.tsx`** after `<Skills />`.

- [ ] **Step 5: Verify**

Run: `npm run build` — expected: success.
Manual: four cards in spec order; only TicTacToang shows a `Live` link; every `Source` link resolves (they are all public repos); cards stack in one column at 360px. Every card shows two screenshots, all at the same aspect ratio, so the four 2-up grids align across the 2-column layout.

- [ ] **Step 6: Commit**

```bash
git add components/Projects.tsx components/ProjectCard.tsx data/projectImages.ts app/page.tsx
git commit -m "feat: add projects grid with screenshots"
```

---

### Task 10: Education, Contact, and Footer

**Files:**
- Create: `components/Education.tsx`
- Create: `components/Contact.tsx`
- Create: `components/Footer.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `cv.education`, `cv.certifications`, `cv.links`, `cv.name`, `Section`, `Reveal`.
- Produces: `Education`, `Contact` (`"use client"`, owns clipboard state), `Footer`; `app/page.tsx` renders `<Education />` then `<Contact />` inside `<main>`, and `<Footer />` after `</main>`.

- [ ] **Step 1: Implement `Education`.** `<Section id="education" kicker="04" title="Education">`. Render `cv.education[0]` as a row: school in `font-display text-xl`, degree, `dates` and `location` in `font-mono text-xs text-ink-faint`, `detail` (GPA) in `text-ink-muted`. Below it, `cv.certifications` as a `<ul>`, each row: name, `detail`, `date` right-aligned in `font-mono text-xs text-ink-faint`.

  Then the award gallery: eyebrow `Hack-A-Venture 2025 · 1st of 100+ teams` in `font-mono text-xs uppercase tracking-widest text-ink-faint`, followed by `grid grid-cols-2 gap-3 sm:grid-cols-4` (on mobile, `flex gap-3 overflow-x-auto`). Static-import the four photos from `@/app/assets/images/hack-a-venture 2025/` with the literal quoted path — the folder name contains a space, so the import specifier must include it:

```ts
import champion from "@/app/assets/images/hack-a-venture 2025/champion.webp";
import interview from "@/app/assets/images/hack-a-venture 2025/interview.webp";
import photoReport from "@/app/assets/images/hack-a-venture 2025/photo-report.webp";
import adminMap from "@/app/assets/images/hack-a-venture 2025/admin-map.webp";
```

  Each renders through `next/image` with `className="h-full w-full rounded-md border border-line object-cover"`, `sizes="(min-width: 640px) 25vw, 50vw"`, and a descriptive `alt`. If the space in the path breaks the bundler, rename the directory to `hack-a-venture-2025` with `git mv`, update the imports, and ledger the ruling.

- [ ] **Step 2: Implement `Contact`.** `"use client"`. `<Section id="contact" kicker="05" title="Contact">`. Render `cv.links.email` as a large `mailto:` link in `font-display text-3xl sm:text-5xl` with `hover:text-accent`. Beside/below it a copy button that calls `navigator.clipboard.writeText(cv.links.email)` and swaps its label to `Copied` for 2 seconds (clear the timer on unmount). Then GitHub and LinkedIn links, then a `Download CV` button. Buttons must be real `<button type="button">` elements, not divs.

- [ ] **Step 3: Implement `Footer`.** Hairline top border, `© 2026 {cv.name}` in `text-ink-faint`, `font-mono text-xs`. Optionally a "Back to top" anchor to `#top`.

- [ ] **Step 4: Wire into `app/page.tsx`.**

- [ ] **Step 5: Verify**

Run: `npm run build` — expected: success.
Manual: copy button writes the email and shows `Copied`; both social links resolve; `Download CV` serves the PDF; the last nav item highlights when scrolled to the bottom.

- [ ] **Step 6: Commit**

```bash
git add components/Education.tsx components/Contact.tsx components/Footer.tsx app/page.tsx
git commit -m "feat: add education, contact, and footer"
```

---

### Task 11: Social preview image and favicon

**Files:**
- Create: `app/opengraph-image.tsx`
- Create: `app/icon.svg`
- Delete: `app/favicon.ico`

**Interfaces:**
- Consumes: `cv.name`, `cv.role`.
- Produces: a build-time 1200×630 OG image and an SVG favicon; Next wires both into `<head>` automatically.

- [ ] **Step 1: Implement `app/opengraph-image.tsx`** using `ImageResponse` from `next/og`, with `export const size = { width: 1200, height: 630 }`, `export const contentType = "image/png"`, and `export const alt = "Nguyen Don Gia Phat — Software Engineer"`. Render `cv.name` in a large serif (`font-family: serif` — custom fonts are not loaded in the edge renderer), `cv.role` beneath it, an accent `#7C93A8` hairline, and background `#08080A`. Set `export const dynamic = "force-static"`.

- [ ] **Step 2: Implement `app/icon.svg`** — a 32×32 `viewBox` with background `#08080A`, rounded corners, and the text `GP` in `#7C93A8` at bold weight. Use a `<text>` element with an explicit `font-family="ui-sans-serif, system-ui, sans-serif"`; do not reference a webfont.

- [ ] **Step 3: Delete `app/favicon.ico`** so `icon.svg` is the only icon.

- [ ] **Step 4: Verify**

Run: `npm run build`
Expected: success, and `out/opengraph-image.png` exists (`Test-Path out/opengraph-image.png` → `True`). If the OG route fails under `output: 'export'`, keep `dynamic = "force-static"` and re-run; that combination is required for export.

- [ ] **Step 5: Commit**

```bash
git add app/opengraph-image.tsx app/icon.svg app/favicon.ico
git commit -m "feat: add generated social preview and GP favicon"
```

---

### Task 12: Analytics and CI workflow

**Files:**
- Create: `.github/workflows/ci.yml`
- Modify: `app/layout.tsx`
- Modify: `package.json`

**Interfaces:**
- Consumes: the committed `package-lock.json` from Task 1.
- Produces: `@vercel/analytics` mounted in the root layout; CI that runs typecheck, lint, and build on push and pull request.

- [ ] **Step 1: Add the dependency**

Run: `npm install @vercel/analytics`
Expected: `package.json` and `package-lock.json` updated.

- [ ] **Step 2: Mount analytics** in `app/layout.tsx`: import `{ Analytics }` from `@vercel/analytics/next` and render `<Analytics />` as the last child of `<body>`. Do not add Speed Insights.

- [ ] **Step 3: Create `.github/workflows/ci.yml`** — trigger on `push` and `pull_request`; single job on `ubuntu-latest` with `actions/checkout@v4`, `actions/setup-node@v4` (`node-version: 24`, `cache: npm`), then `npm ci`, `npx tsc --noEmit`, `npm run lint`, `npm run build` as separate named steps.

- [ ] **Step 4: Verify locally**

Run: `npx tsc --noEmit` → no output.
Run: `npm run lint` → exit 0.
Run: `npm run build` → success, `out/index.html` exists.

- [ ] **Step 5: Commit**

```bash
git add .github/workflows/ci.yml app/layout.tsx package.json package-lock.json
git commit -m "chore: add vercel analytics and CI workflow"
```

---

### Task 13: Full-page verification

**Files:**
- Modify: only if a check fails.

**Interfaces:**
- Consumes: everything.
- Produces: a verified `out/` that can be deployed to Vercel.

- [ ] **Step 1: Run the gate**

```bash
npx tsc --noEmit
npm run lint
npm run build
```

Expected: all three clean; `out/index.html` and `out/opengraph-image.png` exist.

- [ ] **Step 2: Serve the exported output and check it is genuinely static**

Run: `npx serve out -l 3123` (or `python -m http.server 3123 -d out`), then request `/`.
Expected: HTTP 200 with rendered hero markup, and no request to any `/_next/server` or API path.

- [ ] **Step 3: Accessibility and keyboard pass**

- Tab from the top of the page: the skip link appears first and is visibly focused.
- Every nav link is reachable by keyboard and shows a visible accent focus ring.
- Anchor text meets contrast against `#08080A` (accent `#7C93A8` is ≥ 4.5:1 at body size; do not use it for small body text).
- With OS reduced-motion enabled, sections appear instantly and no transition runs.

- [ ] **Step 4: Responsive pass** at 360px, 768px, and 1440px: no horizontal page scroll, nav chips scroll only inside their row, project grid collapses to one column.

- [ ] **Step 5: Confirm no out-of-scope content shipped**

Search the built output for `0935`, `Riverside`, `Lê Quý Đôn`, and `Le Quy Don`.
Run: `Select-String -Path out/index.html -Pattern '0935','Riverside','Quý','Quy Don'`
Expected: no matches.

- [ ] **Step 6: Commit any fixes**

```bash
git add -A
git commit -m "fix: address issues found in full-page verification"
```

If nothing needed fixing, skip this commit.
