# Nguyen Don Gia Phat — Portfolio

A single-page portfolio for a software engineering student, built as a fully static
Next.js export. Dark, typographic, and deliberately monochrome: one slate accent, no
decorative gradients, no colour noise.

## What's on the page

- **Hero** — name, role, intro, award line, portrait, and two calls to action.
- **About** — a short summary plus location and languages.
- **Skills** — three columns, each entry with a monochrome brand mark.
- **Projects** — one full-width row per project: the written case on the left, a
  draggable filmstrip of screenshots on the right. The reel loops in both directions.
- **Education** — RMIT degree, certifications, and a Hack-A-Venture photo gallery.
- **Contact** — large email link with copy-to-clipboard, plus GitHub and LinkedIn.
- **Persistent nav** — anchors scroll to each section and the current one is highlighted.
- **Image zoom** — clicking any screenshot or gallery photo expands it from its own
  position to fill the screen; backdrop, Esc, or the close button returns it.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19, TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| Icons | `simple-icons` (monochrome, tree-shaken) |
| Analytics | Vercel Analytics |
| Output | `output: 'export'` → plain HTML/CSS/JS |

## Getting started

Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

## Scripts

```bash
npm run dev       # dev server with hot reload
npm run build     # static production build, written to out/
npm run lint      # eslint
npm run typecheck # generate Next route types, then run tsc --noEmit
```

Next generates `next-env.d.ts` and the route types in `.next/` when you run `next dev`,
`next build`, or `next typegen`. On a fresh checkout those files do not exist yet, so plain
`npx tsc --noEmit` fails on `LayoutProps` and image imports — use `npm run typecheck`, which
runs `next typegen` first. The CI workflow does the same.

`next start` does not work with a static export, so `npm start` is not used. To preview
the production build:

```bash
npm run build
npx serve out
```

## Project structure

```
app/
  layout.tsx            root layout, fonts, metadata, lightbox provider
  page.tsx              section composition
  globals.css           design tokens and base styles
  opengraph-image.tsx   social preview generated at build time
  icon.svg              favicon
components/
  Nav.tsx               sticky nav, scroll-spy, mobile chip row
  Hero.tsx  About.tsx  Skills.tsx  Projects.tsx
  ProjectCard.tsx       one project row
  Filmstrip.tsx         looping draggable screenshot reel
  Education.tsx  Contact.tsx  Footer.tsx
  Section.tsx           section shell
  Reveal.tsx            scroll-reveal wrapper
  Lightbox.tsx          zoom overlay and provider
  ZoomableImage.tsx     clickable image wrapper
data/
  cv.ts                 all page copy and structured content
  projectImages.ts      screenshot imports mapped by project slug
  skillIcons.ts         skill name → icon path
app/assets/images/      source images plus optimised .webp derivatives
```

## Editing content

All copy lives in [`data/cv.ts`](data/cv.ts) — name, role, intro, summary, links, skills,
projects, education, and certifications. Components read from it; there are no strings
duplicated in JSX.

To add a screenshot:

1. Drop the source image into `app/assets/images/<project>/`.
2. Convert it to WebP, longest edge 1600px, quality 82.
3. Import it in [`data/projectImages.ts`](data/projectImages.ts) under the project slug.

The hero portrait is imported directly in `components/Hero.tsx` and is not part of the
project reels.

## Deployment

The site is a static export, so any static host works. On Vercel, import the repository and
keep the default Next.js preset.

`metadataBase` resolves in this order:

1. `NEXT_PUBLIC_SITE_URL`
2. `VERCEL_PROJECT_PRODUCTION_URL` (set automatically on Vercel)
3. `VERCEL_URL`
4. `http://localhost:3000`

Set `NEXT_PUBLIC_SITE_URL` only if you deploy somewhere Vercel's variables are absent.

## Accessibility

Motion respects `prefers-reduced-motion`; the zoom dialog traps focus, closes on Esc, and
returns focus to the image; every control is reachable by keyboard; body copy meets WCAG AA
contrast.

## License

Private project. All rights reserved.
