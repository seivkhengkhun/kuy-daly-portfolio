# Kuy Daly — Developer Portfolio

A cinematic, editorial portfolio showcasing Kuy Daly's public development
work, education, and technical practice. Oversized typography, scroll-linked
composition, and an immersive project sequence are paired with accessible
navigation and a responsive vertical experience on smaller screens.

## Technology stack

- Next.js 16 App Router and React 19
- TypeScript
- Tailwind CSS 4
- GSAP and ScrollTrigger
- Lenis smooth scrolling
- Next.js Image and local WebP assets
- ESLint and Playwright for verification

The site uses system fonts and does not require an API, database, remote font
service, or application credentials.

## Local development

Use Node.js 22 or 24 and npm.

```sh
npm install
npm run dev
```

Open http://localhost:3000.

## Production build

```sh
npm run lint
npm run typecheck
npm run build
npm start
```

`npm start` serves the optimized production build at http://localhost:3000.
The home page is statically prerendered; Vercel provides image optimization.

## Responsive behavior

Desktop (1024px and wider) retains the editorial composition, pointer effects,
and cinematic project scrolling when the viewport is at least 720px tall.
Tablet uses a compact menu, vertical projects, and larger image previews.
Phones use a dedicated grid hero, images before project details, tap-controlled
skills, and stacked contact links. Touch devices use native scrolling.
Reduced motion disables scroll animation, and breakpoint changes clean up
scroll triggers and pointer transforms.

Browser checks cover 320–820px portrait widths, landscape layouts, menu scroll
locking, terminal input resizing, reduced motion, and desktop regression.

## Project structure

```text
src/
  app/          Page, layout, metadata, and global styling
  animations/   GSAP contexts, scroll sequences, and motion settings
  components/   Navigation, interactive links, visuals, and terminal
  data/         Editable profile, projects, skills, and education
  sections/     Hero, work, about, stack, terminal, timeline, and contact
public/         Portrait, project screenshots, and favicon
tests/          Browser verification
scripts/        Project screenshot refresh utility
vercel.json     Next.js deployment configuration
```

## Edit content

| File | Content |
| --- | --- |
| `src/data/profile.ts` | Contact, biography, current focus, portrait, CV URL |
| `src/data/projects.ts` | Projects, repository links, demos, visuals, evidence |
| `src/data/skills.ts` | Build areas and technology groups |
| `src/data/experience.ts` | Education and verified development practice |
| `src/animations/config.ts` | Motion settings and desktop breakpoint |
| `src/app/globals.css` | Design tokens and responsive styling |

Set `profile.cv` to a real public PDF path when available. Until then, the CV
action opens an email request. Confirm individual contribution wording,
project dates, and any employment history before adding them.

Project screenshots were captured from the actual public storefronts. The
library visual uses excerpts from public PHP source; the frontend-studies
visual is labeled as illustrative. Skill groups distinguish public-code
evidence, original-portfolio listings, and degree coursework.

## Verification

Start a local server, then run:

```sh
npm run test:e2e
```

The suite expects Chrome to be installed. Set `TEST_BASE_URL` to run the same
checks against a production or public deployment. The tests cover navigation,
project motion and images, terminal interactions, keyboard access, responsive
layouts, reduced motion, and the no-JavaScript fallback.

For another browser installation, install Playwright's Chromium with
`npx playwright install chromium` and remove `channel: "chrome"` from
`playwright.config.ts`.

## Deployment

**Production:** https://kuy-daly-portfolio.vercel.app

**GitHub:** https://github.com/seivkhengkhun/kuy-daly-portfolio

**Production branch:** `main`

Deploy the repository's `main` branch to Vercel with these settings:

| Setting | Value |
| --- | --- |
| Framework preset | Next.js |
| Root directory | Repository root |
| Install command | `npm ci` |
| Build command | `npm run build` |
| Output directory | Next.js default |
| Application environment variables | None required |

The configuration is included in `vercel.json`. For CLI deployment:

```sh
npx vercel login
npx vercel
npx vercel --prod
```

The GitHub repository is connected to Vercel. Future pushes to `main` deploy
automatically. Use the production URL above as the shareable address.
Keep account credentials outside the repository. `.gitignore` excludes local
environment files, Vercel account/project state, downloaded tools, build
artifacts, browser reports, and local research. `.vercelignore` also excludes
development-only files from the deployment upload.

## Content sources

- Original portfolio: https://dalytechie.github.io/kuydaly_portfolio/
- Public development work: https://github.com/DalyTechie

Education and contact information follow the original portfolio. Project
descriptions are grounded in inspected public repositories. Unverified legacy
project listings remain in the data file for editing and are not displayed as
verified case studies.
