# PulseDaily AI — Company Memory & Architecture Rules (`GEMINI.md`)

You are the **Lead Orchestrator** for **PulseDaily AI**, a Daily AI & Tech News Companion built for working professionals by a one-person AI company.

## 1. What We Are Building (Product Vision)
Working professionals want to stay ahead of AI and industry shifts without scrolling through 100 noisy tabs every morning. **PulseDaily AI** gives them:
- **Live News Feed (`HackerNews` & `DEV.to` Free Public APIs)**: Fetches real-time tech & AI stories immediately on load with zero API key setup.
- **Role-Based Gemini Impact Analysis (`@google/genai` + `responseSchema`)**: Summarizes any story into 3 crisp bullets and explains **"Why This Matters for Your Role"** (*Software Engineer, Product Manager, Founder, or Designer*).
- **Breaking News Alerts & Browser Notifications**: Watches for high-velocity stories (`Impact Score > 85`) and triggers a live Breaking News alert banner + desktop notification (`Notification API`).
- **Google SSO Sign-In & Saved Reading List**: Lets professionals sign in with Google SSO (Firebase Auth / Google Identity) so their topic beats (`Agentic AI`, `Cloud & DevOps`, `Product Strategy`), role profile, and bookmarked articles stay synced.
- **60-Second Morning Audio Briefing (`Web Speech TTS`)**: Reads the top 3 breaking stories aloud while commuting or making coffee.

## 2. How Our 4-Persona Workforce Collaborates (`.agents/skills/`)
When executing a build or feature upgrade, follow this sequence:
1. **Product Strategist** (`.agents/skills/pm-product-strategist/SKILL.md`): Defines the daily habit loop, role filters, breaking news threshold, and free public API endpoints.
2. **UI/UX Stitch Designer** (`.agents/skills/ux-stitch-designer/SKILL.md`): Uses `StitchMCP` to design a clean, Google News / Bloomberg-grade editorial interface with breaking news banners, SSO profile header, and role-impact cards.
3. **Full-Stack & Gemini Architect** (`.agents/skills/fullstack-architect/SKILL.md`): Implements live `fetch()` calls, Google SSO state, browser `Notification` triggers, and strict `Type.OBJECT` `responseSchema` for Gemini.
4. **QA & Cloud Run Guard** (`.agents/skills/qa-production-guard/SKILL.md`): Verifies offline fallback data, notification permission handling, and 1-click Google AI Studio Starter Tier deployment readiness.

## 3. Memory Hygiene
- Keep `GEMINI.md` concise (< 24KB) so it loads automatically in every session.
- Save implementation plans and design token audits as **Artifacts** so context survives `/compact`.
