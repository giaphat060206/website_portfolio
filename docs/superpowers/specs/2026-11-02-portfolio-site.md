# Portfolio Website — Spec

**Status:** confirmed by user, 2026-11-02
**Supersedes:** nothing (first spec for this feature)

## Goal

A single-page, statically exported portfolio for Nguyen Don Gia Phat, built from
`public/CV_GiaPhat.pdf`, aimed at internship and junior software roles.

## Hard constraints

- Single route `/`. All content is sections on that one page.
- Pure static output. No server runtime, no API routes, no database, no CMS.
- All content lives in code (`data/cv.ts`). No runtime fetching of content.
- Hosted on Vercel.
- Dark, sleek, professional. No neon, no decorative gradients, no glows, no light theme.
- Nav is persistent, links scroll to sections, and the current section is highlighted.

## Page structure

Sections in order. `id` is the DOM anchor and the scroll-spy key.

| Order | id | Nav label | Content |
|---|---|---|---|
| 1 | `top` | — (logo links here) | Hero |
| 2 | `about` | About | Summary + languages |
| 3 | `skills` | Skills | 3 groups |
| 4 | `projects` | Projects | 4 cards |
| 5 | `education` | Education | RMIT + 3 certifications |
| 6 | `contact` | Contact | Email + socials + CV download |

Nav renders the logo/name (→ `#top`) plus exactly these five anchors:
`About`, `Skills`, `Projects`, `Education`, `Contact`.

## Visual system

### Colour tokens

| Token | Value | Use |
|---|---|---|
| `--color-canvas` | `#08080A` | page background |
| `--color-surface` | `#101013` | project cards |
| `--color-line` | `rgba(255,255,255,0.08)` | hairlines, card borders |
| `--color-ink` | `#F5F5F4` | primary text |
| `--color-ink-muted` | `#A1A1AA` | secondary text |
| `--color-ink-faint` | `#71717A` | meta, dates, labels |
| `--color-accent` | `#7C93A8` | active nav, link hover, primary button |

Accent is used **only** for: active nav item, link hover, the primary button, and
the focus ring. Everywhere else is monochrome.

### Typography

- Display: Instrument Serif — name, section headings.
- Body/UI: Geist Sans.
- Mono: Geist Mono — tags, dates, small labels.

### Structure

- One continuous canvas. Sections are separated by a hairline top border and
  generous vertical spacing (not alternating panels, not cards).
- Project cards are the only bordered surfaces.
- Every section has `scroll-margin-top` equal to the nav height so anchors do not
  land under the fixed bar.

### Motion

- Section entry: fade + 8px rise, 400ms, once per element.
- Anchor scrolling: smooth.
- `prefers-reduced-motion: reduce` disables both (instant, fully visible).

### Images

All imagery is bundled from `app/assets/images/` via static imports (hashed filenames,
works under `output: 'export'`). Source files are optimised once, before use:
longest edge ≤ 1600px, re-encoded to WebP quality 82. The originals stay in place;
optimised files are written alongside as `<name>.webp` and those are what components
import.

| Asset | Used in |
|---|---|
| `face/linkedin.jpg` | Hero portrait |
| `syntax-scalpel/title.png`, `syntax-scalpel/graph.png` | SyntaxScalpel card |
| `event-manager/event-management.png`, `event-manager/ticket-management.png` | Event Manager card |
| `pathfinder/main.png` | Smart Path Finder card |
| `tictactoang/welcome.png`, `tictactoang/board.png` | TicTacToang card |
| `hack-a-venture 2025/champion.jpg`, `interview.png`, `photo-report.jpg`, `admin-map.jpg` | Education award gallery |

Every image carries explicit `width`/`height` and descriptive `alt` text. Decorative
duplication gets `alt=""`. Images never become the only carrier of information.

## Nav behaviour

- Fixed from page load. Background `--color-canvas` at ~85% opacity with
  `backdrop-filter: blur(12px)` and a hairline bottom border.
- Active item: accent underline, full-opacity text. Inactive: 60% opacity.
- Scroll-spy rule: a section becomes active once its top crosses 30% of viewport
  height. The final section (`contact`) is force-activated when the page is
  scrolled to the bottom, because it can never reach the 30% line on a short page.
- Intent lock: after a nav click, scroll-spy is suppressed for 600ms so the
  highlight does not flicker through intermediate sections.
- Mobile: same bar. The anchor row scrolls horizontally and auto-centres the
  active chip. No hamburger, no overlay menu.

## Content (verbatim)

### Hero

- Name: `Nguyen Don Gia Phat`
- Role line: `Software Engineering Student · RMIT Vietnam`
- Photo: `face/linkedin.jpg` — right-hand portrait column on `md` and up, 4:5 crop,
  rounded, hairline border; stacked below the text on mobile
- Award meta: `1st Place — RMIT Hack-A-Venture 2025`
- Intro (first person, ~30 words):
  `I'm a software engineering student at RMIT Vietnam building secure full-stack web and mobile applications. I care about parsers, backend infrastructure, and interfaces that stay out of the way.`
- Primary CTA: `View Projects` → `#projects`
- Secondary CTA: `Download CV` → `/CV_GiaPhat.pdf`

### About

- Location: `Ho Chi Minh City, Vietnam`
- Summary:
  `I'm in my second year of a Bachelor of Software Engineering (Honours) at RMIT, working across TypeScript, Rust, Python, and Java. Most of what I build starts with a question about how something works internally — a parser, a dependency graph, a socket layer — and ends as a working tool I can hand to someone else. I'm looking for an internship or junior role where I can ship production code and learn from people who have done it longer.`
- Languages: `Vietnamese — native · English — fluent (IELTS 7.5)`

### Skills

1. **Frontend** — React, Next.js, TypeScript, HTML/CSS, Tailwind, Flutter, JavaFX
2. **Backend** — Node.js, Express, Python, Java, Rust, C/C++, REST APIs, Socket.IO
3. **Data & Infrastructure** — PostgreSQL, MongoDB, Oracle, Supabase, Neon, Docker, Vercel, Git, GitHub Actions

MATLAB and SolidWorks are deliberately excluded (covered by the CSWA certification).

### Projects

Rendered in this order. Each card shows: title, role, exactly two bullets, tag
row, `Source` link, and `Live` when present.

1. **SyntaxScalpel** — Parser & AI Integration Engineer
   - `Built a local-first Tauri v2 desktop app that dissects a source tree into interactive dependency graphs and function-level call graphs using tree-sitter parsers written in Rust.`
   - `Implemented a React Flow canvas with Eclipse Layout Kernel placement.`
   - Tags: `Rust`, `TypeScript`, `Tauri`, `tree-sitter`, `React Flow`
   - Source: `https://github.com/giaphat060206/SyntaxScalpel`
   - Images: `syntax-scalpel/title.png` (primary), `syntax-scalpel/graph.png`

2. **TicTacToang** — Frontend Developer
   - `Developed a Gomoku webpage with single-player, local multiplayer, and online multiplayer, plus game customization, profile, match history, and replay.`
   - `Contributed to a 5-person Scrum team to ship the webpage for 50+ concurrent players, implementing dynamic mobile UI/UX for admin, guest, and player pages.`
   - Tags: `React`, `Socket.IO`, `Express`, `MongoDB`, `Tailwind`
   - Source: `https://github.com/RMIT-Full-Stack-Development-2026A/Group1`
   - Live: `https://tictactoang.vercel.app`
   - Images: `tictactoang/welcome.png` (primary), `tictactoang/board.png`

3. **Event Manager** — Team Lead, Frontend, Backend & DB
   - `Developed a full-featured event management system with a graphical interface and a relational database backend using Java, JavaFX, and PostgreSQL.`
   - `Designed the complete database schema, configured PostgreSQL/JDBC, managed Maven builds, and generated standalone executable JARs.`
   - Tags: `Java`, `JavaFX`, `PostgreSQL`, `Maven`
   - Source: `https://github.com/RMIT-Vietnam-Teaching/assignment-2-build-a-backend-sgs-tut02-group1`
   - Images: `event-manager/event-management.png` (primary), `event-manager/ticket-management.png`

4. **Smart Path Finder** — Leader, Graph Generation & Path Finding
   - `Engineered a dual-optimization pathfinding system on a perfect square graph that computes both shortest-distance and fastest-time routes using Dijkstra's algorithm.`
   - `Simulated real-world accumulated hourly traffic variations to model realistic navigation paths.`
   - Tags: `Python`, `Dijkstra`
   - Source: `https://github.com/giaphat060206/Algorithms_and_Analysis_Group11`
   - Images: `pathfinder/main.png` (primary)

### Education

- `RMIT University` — `Bachelor of Software Engineering (Honours)` — `Oct 2024 – Sep 2028` — `GPA 3.3/4.0` — `Ho Chi Minh City, Vietnam`

Certifications:

- `IELTS Band 7.5` — `Reading 9 · Listening 8.5 · Writing 7 · Speaking 6` — `Aug 2023`
- `Certified SOLIDWORKS Associate (CSWA)` — `Jun 2025`
- `Big-O Coding Blue: Algorithms & Interview Patterns` — `May 2026`

Award gallery — eyebrow `Hack-A-Venture 2025 · 1st of 100+ teams`, then a 2×2 grid
on `sm` and up (horizontal scroll strip on mobile) of:
`hack-a-venture 2025/champion.jpg`, `interview.png`, `photo-report.jpg`, `admin-map.jpg`.
Captions are not required; `alt` text describes each photo.

Lê Quý Đôn High School is deliberately excluded.

### Contact

- Email `giaphat060206@gmail.com` rendered as a large `mailto:` link plus a
  copy-to-clipboard button (with a visible "Copied" confirmation).
- GitHub: `https://github.com/giaphat060206`
- LinkedIn: `https://www.linkedin.com/in/ph%C3%A1t-gia-492b39294/`
- `Download CV` → `/CV_GiaPhat.pdf`

Phone number and street address are deliberately excluded.

## Metadata & assets

- Title: `Nguyen Don Gia Phat — Software Engineer`
- Description: `Software engineering student at RMIT Vietnam building secure full-stack web and mobile applications.`
- OG image: generated at build by `app/opengraph-image.tsx`, 1200×630.
- Favicon: `app/icon.svg`, "GP" monogram in accent on near-black.
- No light theme, no i18n, no contact form, no custom domain (ship on `*.vercel.app`).

## Out of scope

Bilingual toggle · contact form · blog · CMS · phone number · street address ·
high school entry · custom domain · light theme · unit test suite.

## Verification strategy

No automated test suite (explicit user decision). Every task's gate is:

```
npx tsc --noEmit
npm run lint
npm run build
```

plus the task's stated manual/browser check. A GitHub Actions workflow runs the
same three commands on push and pull request.
