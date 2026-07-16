# CareerMap AI (React Version) - Ready to Launch

An AI-powered, artistic career guidance platform that acts as a digital career counselor. Designed with a hand-drawn sketch, pencil, and watercolor aesthetic, built entirely in **React + LocalStorage**.

## Features Included
1. **Stateless & Serverless Architecture** (ideal for instant Vercel hosting, running entirely client-side).
2. **Interactive Profiler Wizard** (4-step quiz covering academic profile, subject ratings, working styles, and goals).
3. **Interactive Dashboard** (rendered with dynamic `Chart.js` Radar Compatibility Charts, career options, opportunity areas, and roadmap timelines).
4. **Printable PDF Reports** (responsive CSS optimizations for direct document print export).
5. **Local Database & Admin Panel** (includes fully operational client-side lists for custom Questions manager, Career database list, settings configuration, and usage statistics).
6. **OpenAI Client-Side Engine** (allows users/admins to optionally save their OpenAI API Key to settings to query live GPT models, defaulting to a highly realistic client-side mock profiling framework).

## Project Structure
* [src/App.jsx](file:///usr/local/nextstepai/src/App.jsx) - Complete single-page application. Handles client-side database, state routing, questionnaire panels, admin tabs, and Chart.js initialization.
* [src/index.css](file:///usr/local/nextstepai/src/index.css) - Global stylesheets for the hand-drawn sketch visual identity.
* [index.html](file:///usr/local/nextstepai/index.html) - CDN integration (Bootstrap 5, Font Awesome) and layout skeleton.
* [src/assets/careermap_ui_mockup_1784202226695.jpg](file:///usr/local/nextstepai/src/assets/careermap_ui_mockup_1784202226695.jpg) - Seeded header/hero visual mockup asset.

## How to Run & Build
To install packages (already done in workspace) and spin up the local development server:
```bash
npm run dev
```

To build the optimized static asset bundles for production hosting (Vercel, Netlify, Github Pages):
```bash
npm run build
```
The output directory will be `dist/`.
