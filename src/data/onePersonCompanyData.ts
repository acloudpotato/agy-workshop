export interface LabStep {
  number: number;
  title: string;
  shortTitle: string;
  durationMinutes: number;
  slideRef: string;
}

export const CODELAB_STEPS: LabStep[] = [
  {
    number: 1,
    title: 'Before you begin: Local setup & what we are building',
    shortTitle: '1. Before you begin & Setup',
    durationMinutes: 10,
    slideRef: 'Slides 1–11'
  },
  {
    number: 2,
    title: 'Product thinking: Shaping the Daily AI News Companion',
    shortTitle: '2. Product Ideation & Demo',
    durationMinutes: 10,
    slideRef: 'Slides 13–16'
  },
  {
    number: 3,
    title: 'Hire your AI team: Persona Skills & Memory in Antigravity',
    shortTitle: '3. Persona Skills & GEMINI.md',
    durationMinutes: 15,
    slideRef: 'Slide 11'
  },
  {
    number: 4,
    title: 'Design the interface: Google Stitch & the StitchMCP server',
    shortTitle: '4. UI Design with Stitch MCP',
    durationMinutes: 15,
    slideRef: 'Slides 9–11 & 16'
  },
  {
    number: 5,
    title: 'Build & verify locally: Orchestrating your 4-Persona workforce',
    shortTitle: '5. Build & Verify Locally',
    durationMinutes: 20,
    slideRef: 'Slides 27–29'
  },
  {
    number: 6,
    title: 'Host in AI Studio: Add Google SSO & Breaking News Alerts',
    shortTitle: '6. AI Studio: SSO & Alerts',
    durationMinutes: 15,
    slideRef: 'Slides 19–25'
  },
  {
    number: 7,
    title: 'Go live for free: 1-Click Cloud Run deployment in AI Studio',
    shortTitle: '7. Deploy to Cloud Run',
    durationMinutes: 10,
    slideRef: 'Slides 26, 30–32'
  }
];

export interface PersonaSkillCard {
  id: 'pm' | 'ux' | 'architect' | 'qa';
  roleTitle: string;
  folderPath: string;
  summary: string;
  whyWeNeedIt: string;
  skillMarkdown: string;
}

export const PERSONA_SKILLS: PersonaSkillCard[] = [
  {
    id: 'pm',
    roleTitle: '1. Product Strategist',
    folderPath: '.agents/skills/pm-product-strategist/SKILL.md',
    summary: 'Locks down the daily habit loop, topic beats, breaking news threshold, and Google SSO user profile rules.',
    whyWeNeedIt: 'Without a PM persona, AI builds a generic RSS reader instead of a focused executive briefing tool.',
    skillMarkdown: `---
name: pm-product-strategist
description: Acts as the Product Manager for PulseDaily AI. Defines the daily news habit loop, role-based impact filters, breaking news notification rules, and Google SSO user journeys.
---

# Persona 1: Product Strategist (pm-product-strategist)

When activated, shape **PulseDaily AI** into a daily companion working professionals rely on every morning:

1. **The "Zero-Noise Morning Brief" Rule**:
   - Curate top stories from free public APIs (\`HackerNews Firebase API\` and \`DEV.to API\`) and classify each story by **Topic Beat** (\`Agentic AI\`, \`Cloud & Infra\`, \`Product & Strategy\`) and **Breaking Urgency**.
2. **Personalization via Google SSO**:
   - When a user signs in with **Google SSO**, store their role (\`Software Engineer\`, \`Product Manager\`, \`Founder / Exec\`), saved bookmarks, and alert preferences.
3. **Breaking News Trigger**:
   - High-velocity stories trigger an in-app **Breaking News Banner** and a browser notification (\`window.Notification\`) with a 1-click **"Explain Impact with Gemini"** summary.`
  },
  {
    id: 'ux',
    roleTitle: '2. UI/UX Stitch Designer',
    folderPath: '.agents/skills/ux-stitch-designer/SKILL.md',
    summary: 'Enforces our exact Step 4 Google Stitch reference screen (news.google.com Material Design 3) with crisp solid surfaces, zero blur, and a 2-tier Google News header.',
    whyWeNeedIt: 'Prevents cramped navbars, duplicate filter rows, and blurry glassmorphism by enforcing the exact 4-zone Google News layout.',
    skillMarkdown: `---
name: ux-stitch-designer
description: Acts as the Principal UI/UX Designer using Google Stitch MCP. Enforces the exact Google News (news.google.com) Material Design 3 reference screen (screens/7fbc7f6de1ff40408f62405ddfb7ffb1) with crisp solid surfaces, zero blur, 2-tier Google header, and 12-column briefing layout.
---

# Persona 2: UI/UX Stitch Designer (ux-stitch-designer)

When activated, enforce our exact **Google Stitch Reference Screen** (\`projects/15737669260440006801/screens/7fbc7f6de1ff40408f62405ddfb7ffb1\` — anchored to **\`news.google.com\` Google News Material Design 3**):

## 1. Strict Surface & Anti-Blur Rules (100% Crisp Google Look)
- **NO Blur or Glassmorphism**: NEVER use \`backdrop-blur\`, \`bg-white/80\`, or blurry shadows. Use 100% solid, crisp surfaces (\`bg-[#FFFFFF]\` cards on \`bg-[#F8F9FA]\` canvas with \`1px solid #DADCE0\` hairline borders).
- **NO Text Wrapping or Clutter in Header**: Every button, badge, and tab in the header must use \`whitespace-nowrap\`. Never cram topic tabs or audio buttons into Row 1 of the top bar.
- **NO Duplicate Filter Bars**: Do NOT render a second box of topic pills or role buttons above the feed.

## 2. Exact 4-Zone Google News (news.google.com) Layout Architecture
1. **Row 1 — Top Google App Bar (\`h-16 bg-white px-6 flex items-center justify-between gap-4\`)**:
   - **Left (\`shrink-0\`)**: Official 4-color Google dots/G mark + \`"PulseDaily"\` (\`text-xl font-bold text-[#202124] whitespace-nowrap\`). Never stack or clip the logo text.
   - **Center (\`flex-1 max-w-xl mx-4\`)**: Wide pill-shaped search bar (\`bg-[#F1F3F4] rounded-full px-4 py-2 text-sm\`) with search icon and \`"Search AI topics, models, or sources..."\`.
   - **Right (\`shrink-0 flex items-center gap-2.5\`)**:
     - Compact Role Lens selector pill (\`bg-[#E8F0FE] text-[#1A73E8] rounded-full px-3 py-1.5 text-xs font-semibold\`: \`Software Engineer\` | \`Product Manager\` | \`Founder / Exec\`).
     - Breaking Alert Bell icon button (\`#D93025\` active dot).
     - Google SSO Profile Avatar Pill (\`Alex Rivera\` with 4-color Google G badge).
2. **Row 2 — Horizontal Google News Tab Bar (\`bg-white border-b border-[#DADCE0] px-6\`)**:
   - Centered horizontal single-line tabs: \`For you\`, \`Following (Saved)\`, \`Agentic AI\`, \`Cloud & Infra\`, \`Product & Strategy\`.
   - Active tab has \`text-[#1A73E8] font-semibold\` and a **\`3px\` rounded Google Blue (\`bg-[#1A73E8]\`) bottom indicator bar**.
3. **Zone 3 — "Your briefing" Header Row (\`max-w-6xl mx-auto px-6 pt-6 pb-4 flex items-end justify-between\`)**:
   - **Left**: Large \`"Your briefing"\` title (\`text-[28px] font-bold text-[#202124]\`) + current date subtitle with a green \`"● Live HackerNews API Active"\` status indicator.
   - **Right**: \`"Refresh Feed"\` pill button + Google Blue pill button \`"🔊 Listen to Daily Brief (60s)"\` (\`bg-[#1A73E8] text-white rounded-full px-4 py-2\`).
4. **Zone 4 — 12-Column Google News Content Grid (\`max-w-6xl mx-auto px-6 pb-12 grid grid-cols-12 gap-6\`)**:
   - **Left 8 Columns (\`col-span-12 lg:col-span-8\`)**: Single white \`rounded-2xl\` (\`16px\`) container (\`bg-white border border-[#DADCE0]\`) titled **"Top stories"** with \`divide-y divide-[#E8EAED]\` between stories, publisher badge + green \`"✓ Grounded"\` chip, bold headline, 3-bullet Gemini TL;DR, soft blue Material 3 tonal box (\`bg-[#E8F0FE]\`) titled \`"✨ Why this matters for you (<Active Role>)"\`, and \`"Save for later"\` + \`"Full coverage ↗"\` pills.
   - **Right 4 Columns (\`col-span-12 lg:col-span-4 space-y-5\`)**: Clean white \`rounded-2xl\` (\`16px\`) sidebar cards (\`bg-white border border-[#DADCE0] p-5\`) for **Breaking Alert Radar**, **60-Second Executive Audio Brief**, and **Saved Reading List**.`
  },
  {
    id: 'architect',
    roleTitle: '3. Full-Stack & Gemini Architect',
    folderPath: '.agents/skills/fullstack-architect/SKILL.md',
    summary: 'Implements live HackerNews API calls, Google SSO state, browser Notification API, and strict Gemini JSON schemas.',
    whyWeNeedIt: 'Ensures @google/genai returns deterministic Type.OBJECT JSON so the UI never crashes on malformed responses.',
    skillMarkdown: `---
name: fullstack-architect
description: Acts as the Full-Stack & Gemini Engineer for PulseDaily AI. Builds live news API hooks, Google SSO sign-in state, breaking news notifications, and strict @google/genai responseSchema.
---

# Persona 3: Full-Stack & Gemini Architect (fullstack-architect)

When activated, write clean React + TypeScript + Tailwind CSS code that runs smoothly both locally and inside **Google AI Studio Build Mode (\`ai.studio/build\`)**:

1. **Free Zero-Auth Live News APIs**:
   - Fetch real stories from \`https://hacker-news.firebaseio.com/v0/topstories.json\` inside \`useEffect\` with a 1-click **"Sync Live API"** button.
2. **Strict Anti-Hallucination Gemini Schema (\`responseSchema\`)**:
   - Use \`@google/genai\` (\`GoogleGenAI\` and \`Type.OBJECT\`) with \`responseMimeType: "application/json"\` returning \`headline\`, \`isBreaking\`, \`tldrBullets\` (array of 3 strings), and \`roleImpact\`.
3. **Google SSO & Breaking News Notifications**:
   - Implement Google SSO user profile state (avatar, name, email, role selector, saved bookmarks in \`localStorage\`) and Web \`Notification\` API alerts.`
  },
  {
    id: 'qa',
    roleTitle: '4. QA & Cloud Run Guard',
    folderPath: '.agents/skills/qa-production-guard/SKILL.md',
    summary: 'Audits notification permissions, offline fallback data, and 1-click Cloud Run Starter Tier readiness.',
    whyWeNeedIt: 'Guarantees the app works reliably on conference Wi-Fi and deploys to Cloud Run without build errors.',
    skillMarkdown: `---
name: qa-production-guard
description: Acts as the QA & Cloud Run SRE Engineer for PulseDaily AI. Verifies API fallback resilience, notification permissions, SSO session persistence, and 1-click Cloud Run Starter Tier deployment.
---

# Persona 4: QA & Cloud Run Guard (qa-production-guard)

When activated, audit **PulseDaily AI** before deployment:

1. **Resilient API & Notification Handling**:
   - If browser desktop notifications are blocked or not yet granted, display an in-app **Breaking News Banner** so alerts are always visible.
   - If offline, fall back to curated AI news stories so the screen is never blank.
2. **Cloud Run Free Quota Readiness**:
   - Verify \`npm run build\` completes with zero TypeScript errors and that the app is ready for 1-click publishing via **Google AI Studio Starter Tier**.`
  }
];

export const COMPANY_BRAIN_GEMINI_MD = `# PulseDaily AI — Company Memory & Architecture Rules (GEMINI.md)

You are the **Lead Orchestrator** for **PulseDaily AI**, a Daily AI & Tech News Companion built for working professionals by a one-person AI company.

## 1. What We Are Building (Product Vision)
Working professionals want to stay ahead of AI and tech shifts without reading 50 tabs every morning. **PulseDaily AI** gives them:
- **Live News Feed (\`HackerNews\` Free Public API)**: Fetches real-time tech & AI stories immediately on load with zero API key setup.
- **Role-Based Gemini Impact Analysis (\`@google/genai\` + \`responseSchema\`)**: Summarizes any story into 3 crisp bullets and explains **"Why This Matters for Your Role"** (*Software Engineer, Product Manager, or Founder*).
- **Breaking News Alerts & Browser Notifications**: Watches for high-velocity stories and triggers a live Breaking News banner + desktop notification (\`Notification API\`).
- **Google SSO Sign-In & Saved Reading List**: Lets professionals sign in with Google SSO so their role profile, topic beats, and bookmarked articles stay synced.
- **60-Second Morning Audio Briefing (\`Web Speech TTS\`)**: Reads the top breaking stories aloud.

## 2. How Our 4-Persona Workforce Collaborates (\`.agents/skills/\`)
When executing a build or feature upgrade, follow this sequence:
1. \`pm-product-strategist\`: Defines topic beats, role filters, breaking news rules, and free public API endpoints.
2. \`ux-stitch-designer\`: Uses \`StitchMCP\` to design a clean Google News-style editorial interface.
3. \`fullstack-architect\`: Implements live \`fetch()\` calls, Google SSO state, browser \`Notification\` triggers, and strict \`Type.OBJECT\` \`responseSchema\`.
4. \`qa-production-guard\`: Verifies fallback data, notification permissions, and 1-click AI Studio Starter Tier deployment readiness.

## 3. Memory Hygiene
- Keep \`GEMINI.md\` concise (< 24KB) so it loads automatically in every session.
- Save implementation plans and design token audits as **Artifacts** so context survives \`/compact\`.`;

export const STITCH_PRODUCTION_PROMPT = `Use news.google.com (Google News Material Design 3 Web App) as our exact visual reference!
Design a desktop web application called "Google PulseDaily — AI Briefing & Breaking News Companion" that looks and feels like an official Google Workspace / Google News product:

1. Top Google Bar (#FFFFFF, border-b #DADCE0):
   - Left: Official 4-color Google wordmark + "PulseDaily" in clean Google Sans typography.
   - Center: Pill-shaped search bar (#F1F3F4 background, "Search AI topics, models, or sources...").
   - Right: Breaking Notification bell with crimson badge, Google Apps 9-dot grid icon, and circular Google SSO Account Avatar chip ("Alex Rivera • Software Engineer").

2. Sub-Navigation Tabs:
   - Centered horizontal Google News tabs ("For you", "Following", "Agentic AI", "Cloud & Infra", "Product & Strategy") with a 3px rounded Google Blue (#1A73E8) bottom indicator under the active tab.

3. Greeting & Briefing Header ("Your briefing"):
   - Left: Large "Your briefing" title, current date, and a "Role Lens: [Software Engineer ▾]" Material 3 filter chip (#E8F0FE).
   - Right: Google Blue pill button "🔊 Listen to Daily Brief (2m)".

4. Breaking News Alert Banner:
   - Soft red Material 3 alert container (#FCE8E6) with crimson "BREAKING" pill (#D93025) and live alert headline.

5. 12-Column Google News Card Grid (on #F8F9FA background):
   - Left 8 Columns ("Top stories"): White 16px rounded container (#FFFFFF) with hairline dividers between stories, publisher favicon badges, "✓ Grounded in 14 sources" green chip, 3-bullet Gemini TL;DR, a soft blue Material 3 tonal box (#E8F0FE) titled "✨ Why this matters for you (Software Engineer)", and a "Full coverage" pill button.
   - Right 4 Columns ("Breaking Alert Radar" & "Saved for later"): White 16px rounded sidebar cards where users subscribe to custom breaking alert topics and view their Google SSO saved reading list.`;

export const ANTIGRAVITY_STITCH_MCP_PROMPT = `@StitchMCP Act as our UI/UX Stitch Designer (.agents/skills/ux-stitch-designer/SKILL.md):
1. Use news.google.com as our visual reference! Call generate_screen_from_text in our Stitch project ("PulseDaily AI") using our Google News Material Design 3 prompt.
2. Call get_screen to inspect the generated Workspace & Editorial Canvas design system (#F8F9FA canvas, #FFFFFF 16px rounded cards, #F1F3F4 pill search bar, #1A73E8 active tab indicator, and #E8F0FE tonal callout boxes), and update our React components to match 100%.`;

export const ANTIGRAVITY_ORCHESTRATOR_PROMPT = `/plan Act as our One-Person Company Orchestrator following GEMINI.md. Coordinate our 4 Persona Skills one by one to build the core "Google PulseDaily" web application matching our exact Step 4 Google Stitch reference screen (projects/15737669260440006801/screens/7fbc7f6de1ff40408f62405ddfb7ffb1 — Google News news.google.com Material Design 3):

1. [PM Skill - pm-product-strategist]: Connect the live HackerNews Public API (https://hacker-news.firebaseio.com/v0/topstories.json) and organize stories into Topic Beats ("For you", "Following", "Agentic AI", "Cloud & Infra", "Product & Strategy") with rich pre-populated fallback stories so the feed is never empty.
2. [UX Skill - ux-stitch-designer]: Enforce our exact 4-Zone Google News Material Design 3 layout with 100% crisp solid surfaces (#FFFFFF cards on #F8F9FA background, 1px #DADCE0 borders, ZERO backdrop-blur or glassmorphism, and ZERO duplicate filter bars):
   - Row 1 (Top Google App Bar, h-16 bg-white): Left: 4-color Google dots/G mark + "PulseDaily" (single-line whitespace-nowrap, never wraps or clips). Center: Wide pill search bar (bg-[#F1F3F4] rounded-full). Right: Compact Role Lens selector pill ("Software Engineer ▾"), Breaking Alert Bell icon button, and Google SSO Profile Avatar pill ("Alex Rivera").
   - Row 2 (Horizontal Google News Tab Bar, bg-white border-b border-[#DADCE0]): Centered single-line tabs ("For you", "Following", "Agentic AI", "Cloud & Infra", "Product & Strategy") with a 3px rounded Google Blue (#1A73E8) bottom indicator bar under the active tab. Never put a second duplicate filter card below the header!
   - Zone 3 ("Your briefing" Header Row): Left: Large "Your briefing" title (28px bold #202124) + current date & green "● Live HackerNews API Active" indicator. Right: "Refresh Feed" pill button + Google Blue "🔊 Listen to Daily Brief (60s)" pill button.
   - Zone 4 (12-Column Google News Grid, max-w-6xl mx-auto): Left 8 cols: Single white 16px rounded container ("Top stories") with divide-y divide-[#E8EAED] rows, publisher domain badge + green "✓ Grounded" pill, bold headline, 3-bullet Gemini TL;DR, soft blue #E8F0FE tonal box ("✨ Why this matters for you"), and "Save for later" + "Full coverage ↗" pills. Right 4 cols: Clean white 16px rounded sidebar cards for "Breaking Alert Radar", "60-Second Executive Audio Brief", and "Saved for later".
3. [Architect Skill - fullstack-architect]: Build the React + Tailwind CSS app using @google/genai with a strict Type.OBJECT responseSchema that summarizes any news story into 3 TL;DR bullets and a Role-Specific Impact takeaway (Software Engineer, Product Manager, Founder / Exec), plus a 60-second Web Speech TTS audio reader.
4. [QA Skill - qa-production-guard]: Verify clean error handling, zero header text wrapping, and confirm npm run build succeeds.`;

export const AI_STUDIO_BASE_APP_PROMPT = `You are a Principal Full-Stack React, Tailwind CSS, and Gemini AI Engineer.
Build "Google PulseDaily — Daily AI News Companion for Working Professionals" matching the exact Google News (news.google.com) Material Design 3 layout from our Google Stitch reference screen:

### 1. Strict 4-Zone Google News (news.google.com) Layout & Anti-Blur Rules
- Use 100% crisp solid surfaces (#F8F9FA background, solid #FFFFFF 16px rounded cards with 1px #DADCE0 borders, #1A73E8 primary blue, #D93025 breaking red, #1E8E3E verified green). NEVER use backdrop-blur, glassmorphism, or duplicate filter boxes!
- **Row 1 — Top Google App Bar (h-16 bg-white px-6 flex items-center justify-between)**:
  - Left: 4-color Google dots/G mark + "PulseDaily" (whitespace-nowrap, never wraps or clips).
  - Center: Wide pill-shaped search bar (#F1F3F4 rounded-full, "Search AI topics, models, or sources...").
  - Right: Compact Role Lens pill dropdown ("Role: Software Engineer ▾"), Breaking Alert Bell icon button, and Google SSO Profile Avatar chip ("Alex Rivera").
- **Row 2 — Horizontal Google News Tab Bar (bg-white border-b border-[#DADCE0])**:
  - Centered single-line tabs ("For you", "Following", "Agentic AI", "Cloud & Infra", "Product & Strategy") with a 3px rounded Google Blue (#1A73E8) bottom indicator under the active tab.
- **Zone 3 — "Your briefing" Header Row**:
  - Left: Large "Your briefing" title (28px bold) + current date & green "● Live HackerNews API Active" badge.
  - Right: "Refresh Feed" pill button + Google Blue pill button "🔊 Listen to Daily Brief (60s)".
- **Zone 4 — 12-Column Google News Grid (max-w-6xl mx-auto)**:
  - Left 8 Columns: Single white 16px rounded container ("Top stories") with hairline dividers between stories, publisher badge, "✓ Grounded" green chip, 3-bullet Gemini TL;DR, soft blue tonal box (#E8F0FE) titled "✨ Why this matters for you (Software Engineer)", and "Save for later" + "Full coverage ↗" pills.
  - Right 4 Columns: Clean white 16px rounded sidebar cards for "Breaking Alert Radar", "60-Second Executive Audio Brief", and "Saved Reading List".

### 2. Live Public API Integration (Zero Auth Required)
- Fetch top live tech stories from the official HackerNews API (\`https://hacker-news.firebaseio.com/v0/topstories.json\` and \`/v0/item/{id}.json\`) on load, with a "Refresh Feed" button and pre-populated AI news stories so the screen looks rich immediately.

### 3. Gemini Role-Based Impact Synthesis (@google/genai + responseSchema)
- Use \`@google/genai\` (\`gemini-2.5-flash\`) with \`responseMimeType: "application/json"\` and a strict \`Type.OBJECT\` \`responseSchema\` so users can enter any AI topic or story and get 3 crisp TL;DR bullets + a tailored "Why this matters for your role" box!`;

export const AI_STUDIO_SSO_AND_ALERTS_UPGRADE_PROMPT = `Now let's upgrade Google PulseDaily with our two production features:

1. **🔐 "Sign in with Google" (Gmail Login) + Post-Login "Choose Your Persona" Onboarding Modal**:
   - Add an official "Sign in with Google" button in the top-right Google App Bar.
   - Support Google Identity Services (\`https://accounts.google.com/gsi/client\` JWT credential decoding for real \`@gmail.com\` accounts when a Google OAuth Client ID is provided) AND an interactive 2-Step "Sign in with your Gmail Account" Modal so any user can sign in immediately with their own Name and \`@gmail.com\` email address!
   - **Step 1 of Modal (Gmail Login)**: User authenticates or enters their Name and \`@gmail.com\` address.
   - **Step 2 of Modal (Choose Your Professional Persona Based on Relevance)**: Immediately after signing in with Gmail, present 3 selectable Persona Cards so the user picks the lens most relevant to their daily work:
     * **🚀 Founder / Exec**: Focuses Gemini impact analysis on unit economics, enterprise ROI, competitive moats, and build-vs-buy strategy.
     * **💻 Software Engineer**: Focuses Gemini impact analysis on system architecture, SDK patterns, latency benchmarks, and Cloud Run deployment.
     * **🧭 Product Manager**: Focuses Gemini impact analysis on user adoption loops, roadmap prioritization, UX workflows, and retention.
   - **Dynamic Feed Personalization**: Persist the user's Gmail address, name, chosen Persona, and bookmarked articles in \`localStorage\`. Show their Gmail address and Persona badge in the top header (with an "Edit Persona" button to switch roles anytime), and dynamically update every story card's **"✨ Why this matters for <User Name> (<Chosen Persona>)"** callout box!

2. **🔔 Live Breaking News Detector & Push Notification Banner**:
   - Add a Breaking Alert bell toggle in the header that requests browser \`Notification.requestPermission()\`.
   - In the "Breaking Alert Radar" sidebar card, let users enter any breaking AI topic to trigger a crimson Breaking News Banner at the top of the feed, fire a desktop browser notification addressed to their signed-in Gmail account, and use Gemini (\`@google/genai\` with \`responseSchema\`) to generate a 3-bullet summary + role-specific impact for their chosen Persona!`;
