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

## Technical Stack
- **Frontend**: React 19 + TypeScript
- **Build Tooling**: Vite
- **Routing**: React Router
- **Styling**: Tailwind CSS v4 + DaisyUI
- **3D/Visualization**: react-globe.gl + three.js

## Architecture Overview
- Primary route: `/` (single-page section-based experience)
- Dynamic route: `/hobby/:slug` (individual hobby detail pages)
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

## Continuous Improvement
This site is intentionally iterative. I treat it as a living product and personal hub:
- content is updated as projects and experience grow
- personal sections evolve as interests and life experiences expand
- UI/UX is regularly refined to improve clarity and quality
- structure is continuously tuned for readability

