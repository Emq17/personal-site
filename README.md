# Emmette Quiambao — Life, Work, and Everything In Between

A modern, production-deployed personal website that blends my work, interests, travel, and day-to-day identity into one cohesive experience.

This project is designed to do more than display a resume or project list. It communicates how I think, what I build, and who I am beyond job titles.

## Live Deployment
This site is hosted on **Vercel** for fast global delivery, reliable builds, and streamlined deployment from source control.

## Project Objective
Most personal sites are either resume-only or personality-only. I built this one as an **interactive full-picture narrative**:
- clear enough for quick review
- deep enough for technical evaluation
- personal enough to reflect hobbies, travel, and personality
- flexible enough to evolve as I add new projects and life updates

## Why This Project Stands Out
- Built as a **single, cohesive showcase flow** instead of disconnected pages
- Presents both **business impact** and **technical execution**
- Shows the person behind the work, not just the work itself
- Organizes content intentionally: projects, skills, experience, education, hobbies, and travel
- Includes interactive experiences (travel globe, image-based project previews, dynamic hobby pages)
- Optimized for scanability: section pills, clear typography hierarchy, and concise content blocks

## Core Sections
- **Home / Intro**: personal brand, positioning, and primary call-to-action
- **Projects**: visual previews + project links + summary context
- **Skills**: categorized by:
  - Technologies
  - Data & Analytics
  - Practices
  - Platforms & Tooling
- **Experience**: timeline of analytical, operational, technical, and client-facing roles
- **Education**: degree path and certifications
- **Hobbies + Travel**: personality, interests, and global travel footprint to round out the profile
- **Contact**: direct links for outreach

### Chess Dashboard (Hobby Detail)
- Platform switcher in chess detail: **Lichess**, **Chess.com**, **All Accounts**
- **All Accounts** merges both connected sources into one unified view
- Shared dashboard layout across sources with source-aware feature toggles
- Performance Overview includes:
  - Time windows: `7 days`, `30 days`, `90 days`, `1 year`, `All Time`
  - Color filters: `All Games`, `White`, `Black`
  - Segmented W/L/D bar with counts and percentages
  - Best win and best streak highlight cards
  - Latest-first completed games list with platform labels
- Signal and AI Coach panels support:
  - **Single Game** mode (defaults to latest completed game)
  - **Totals** mode for aggregate windows
- Signal cards hide zero-value categories to keep view clean
- Moves trend and rating trend include point-based hover details for per-game inspection
- Top sync text now shows only `Last synced: <time>` (no exposed account username in UI)

## Technical Stack
- **Frontend**: React 19 + TypeScript
- **Build Tooling**: Vite
- **Routing**: React Router
- **Styling**: Tailwind CSS v4 + DaisyUI
- **3D/Visualization**: react-globe.gl + three.js

## Architecture Overview
- Primary route: `/` (single-page section-based experience)
- Dynamic route: `/hobby/:slug` (chess + music detail views; other hobbies currently show preview cards)
- Legacy routes are redirected into section anchors for continuity and backward compatibility

## UX / Product Decisions
- Section-aware pill navigation with active-state tracking
- Header-aware anchor scrolling for clean section alignment
- Responsive behavior tuned for both desktop and mobile
- Projects area includes compact visual previews and hover actions
- Travel map uses local texture assets for rendering reliability

## Repository Structure (Key Files)
- `src/pages/Showcase.tsx` — main page structure and section composition
- `src/pages/HobbyDetail.tsx` — dynamic hobby detail page
- `api/chess-sync.js` — platform-aware chess sync (Lichess + Chess.com) to Supabase snapshots
- `api/chess-data.js` — latest platform-filtered chess snapshot reader from Supabase
- `src/components/shared/Header.tsx` — global navigation and section state
- `src/components/hobbies/TravelMap.tsx` — interactive travel globe and location data interactions
- `src/components/hobbies/content/HobbiesData.ts` — hobby content model
- `src/components/work-page/content/ExperiencesData.ts` — experience timeline data
- `src/components/work-page/content/SkillsData.ts` — skills taxonomy and tags
- `src/components/work-page/content/EducationData.ts` — education/certification data
- `src/App.css` — global styling system and custom section-level design rules

## Local Development
Install dependencies and run:
```bash
npm install
npm run dev
```

Build for production:
```bash
npm run build
npm run preview
```

## Chess Data Notes
- Chess snapshots are stored in Supabase table `chess_game_snapshots`.
- Sync/read endpoints support a `platform` query parameter:
  - `lichess`
  - `chesscom`
- On-demand page loads can trigger live sync paths, so dashboard data can update before daily scheduled refreshes.

## Continuous Improvement
This site is intentionally iterative. I treat it as a living product and personal hub:
- content is updated as projects and experience grow
- personal sections evolve as interests and life experiences expand
- UI/UX is regularly refined to improve clarity and quality
- structure is continuously tuned for readability
