export type TrackId = 'wellness' | 'arcade' | 'pulse' | 'custom';

export interface TrackConfig {
  id: TrackId;
  badge: string;
  title: string;
  subtitle: string;
  slideRef: string;
  aiCapabilities: string[];
  vibe: string;
  color: string;
  lazyPrompt: string;
  layers: {
    role: string;
    goal: string;
    context: string;
    aiFeature: string;
    vibe: string;
    visual: string;
  };
  stitchPrompt: string;
  stitchScreens: {
    title: string;
    description: string;
    tokens: { name: string; hex: string }[];
  }[];
  annotationInstruction: string;
  antigravityMCPPrompt: string;
  antigravityPlanPrompt: string;
  backendSchemaSnippet: string;
}

export const TRACKS: Record<TrackId, TrackConfig> = {
  wellness: {
    id: 'wellness',
    badge: 'Track A • Multimodal Vision',
    title: 'SnapCalorie & Hydro',
    subtitle: 'Tactile daily food photo macro analyzer & hydration journal',
    slideRef: 'Slides 16 & 28',
    aiCapabilities: ['Gemini Vision (Image Analysis)', 'Structured JSON Schema', 'Weekly AI Coach'],
    vibe: 'Skeuomorphic Tactile Wellness Journal',
    color: 'emerald',
    lazyPrompt: 'Help me build an app to track my food and water intake.',
    layers: {
      role: "You're an expert full-stack React & Tailwind CSS app builder who prioritizes delightful, tactile user experience.",
      goal: 'Create a web app called "SnapCalorie & Hydro" that helps me track my daily food calories, macros (protein, carbs, fat), and water intake with a weekly summary dashboard.',
      context: 'I plan to use this app daily to count my calories and track 8 glasses of water. Pre-populate 5 days of realistic sample logs so the weekly summary chart looks alive immediately, and persist all logs in localStorage.',
      aiFeature: 'Use the Gemini API (@google/genai) so I can upload a picture of my meal (or describe it in text) and receive structured JSON with dishName, calories, proteinGrams, carbsGrams, fatGrams, confidenceScore, and a 1-sentence nutritionist tip.',
      vibe: 'Create a tactile skeuomorphic vibe—warm paper card textures, realistic 3D water droplet toggle buttons, circular macro gauge rings, and polaroid-style meal cards.',
      visual: 'Follow the 2-screen layout from the attached Google Stitch mockup (Daily Tracker tab + Weekly Insights tab).'
    },
    stitchPrompt: `Design a 2-screen web and mobile application for a daily food calorie and water intake tracker called "SnapCalorie & Hydro".
Screen 1 (Daily Dashboard): Skeuomorphic tactile aesthetic with warm cream paper textures (#FAF7F2), realistic 3D water glass toggle buttons (8 glasses), a camera viewfinder dropzone card to snap/upload food photos, and circular macro progress rings (Calories, Protein, Carbs, Fat).
Screen 2 (Weekly AI Insights): A tactile notebook summary view showing a 7-day calorie vs target bar chart, an AI Nutritionist streak card, and a polaroid meal photo log gallery.`,
    stitchScreens: [
      {
        title: 'Screen 1: Tactile Daily Log & Camera Dropzone',
        description: 'Interactive 8-glass hydro bar, food photo uploader with live Gemini Vision macro extraction, and circular progress gauges.',
        tokens: [
          { name: 'Warm Cream Surface', hex: '#FAF7F2' },
          { name: 'Emerald Vitality', hex: '#10B981' },
          { name: 'Hydro Blue', hex: '#0EA5E9' },
          { name: 'Espresso Ink', hex: '#1C1917' }
        ]
      },
      {
        title: 'Screen 2: 7-Day Macro Trends & AI Coach',
        description: 'Weekly calorie adherence chart, macro distribution breakdown, and personalized Gemini nutrition insights.',
        tokens: [
          { name: 'Amber Macro Pill', hex: '#F59E0B' },
          { name: 'Coral Calorie Ring', hex: '#F43F5E' }
        ]
      }
    ],
    annotationInstruction: 'Circle the top header bar in AI Studio Preview and type: "Add a Daily Hydration Streak Flame badge and a Quick-Add +250ml Espresso/Tea button next to the water glasses."',
    antigravityMCPPrompt: `Use the StitchMCP server to list my Stitch projects and inspect the screens for "SnapCalorie & Hydro". Compare the Stitch design tokens (colors, warm paper background #FAF7F2, card border radius, and typography) against my current src/App.tsx, and update the Tailwind CSS styles so the app matches the Stitch design 100%.`,
    antigravityPlanPrompt: `/plan Follow our .agent/skills/production-guardrails/SKILL.md skill to upgrade "SnapCalorie & Hydro" from a client-side prototype to a production-grade full-stack app:
1. Create an Express server (server.js) that exposes POST /api/analyze-food and GET /api/health, keeping GEMINI_API_KEY strictly on the server.
2. Enforce a strict @google/genai Type.OBJECT responseSchema for dishName, calories, proteinGrams, carbsGrams, fatGrams, confidence, and healthTip so the frontend never crashes on malformed JSON.
3. Configure Express to serve the built Vite static files from dist/ on process.env.PORT || 8080 for Google Cloud Run.
4. Test the server endpoint and verify the build succeeds.`,
    backendSchemaSnippet: `// Strict Anti-Hallucination Schema for SnapCalorie (server.js)
const foodAnalysisSchema = {
  type: Type.OBJECT,
  properties: {
    dishName: { type: Type.STRING, description: "Identified meal or dish name" },
    calories: { type: Type.INTEGER, description: "Total estimated kcal" },
    proteinGrams: { type: Type.INTEGER },
    carbsGrams: { type: Type.INTEGER },
    fatGrams: { type: Type.INTEGER },
    confidence: { type: Type.STRING, enum: ["HIGH", "MEDIUM", "LOW"] },
    healthTip: { type: Type.STRING, description: "Actionable 1-sentence tip" }
  },
  required: ["dishName", "calories", "proteinGrams", "carbsGrams", "fatGrams", "confidence", "healthTip"]
};`
  },
  arcade: {
    id: 'arcade',
    badge: 'Track B • Retro Game + Audio + AI DJ',
    title: 'SynthInvaders: Vaporwave Arcade',
    subtitle: 'Playable 80s Space Invaders + Web Audio Synthwave Radio & AI Coach',
    slideRef: 'Slides 19–26',
    aiCapabilities: ['Gemini Fast Chat & Game Modifiers', 'Procedural Web Audio Synthesizer', 'HTML5 Canvas Arcade Engine'],
    vibe: '80s Vaporwave CRT Neon (Purples, Pinks & Scanlines)',
    color: 'purple',
    lazyPrompt: 'Make a Space Invaders game with a music player.',
    layers: {
      role: "You're a creative retro-game engineer and web-audio synth designer.",
      goal: 'Build a React web app that is a playable Space Invaders game and a Synthwave Music Player combined, styled with Tailwind CSS.',
      context: 'I want to play the game in the center window (Arrow keys to move, Space to fire) while synth-wave music plays in the background. Use the browser Web Audio API to synthesize 3 procedural retro synthwave tracks ("Midnight City", "Cyber Grid 1984", "Neon Horizon") so the music plays out-of-the-box without broken external MP3 URLs.',
      aiFeature: 'Add an "AI Arcade DJ & Coach" panel powered by Gemini that generates witty 80s synth-DJ commentary on my live score and lets me type natural language cheat codes/modifiers (e.g., "give me rapid plasma lasers" or "slow down alien waves") that dynamically update game physics JSON.',
      vibe: '80s vaporwave aesthetic (deep cyber purple #0D0221, neon magenta #FF2A85, electric cyan #00F0FF, and a toggleable CRT scanlines overlay).',
      visual: '3-column arcade cabinet layout matching Slide 22: Left panel (Controls & Leaderboard), Center panel (Live Game Canvas), Right panel (Synthwave Radio Player & AI System Status).'
    },
    stitchPrompt: `Design a desktop web app combining a retro Space Invaders arcade cabinet and a Synthwave Music Player called "GARCADE GOOGLE EDITION V2.0".
Use an 80s vaporwave aesthetic with deep cyber purples (#0D0221), neon magenta (#FF2A85), cyan (#00F0FF), and subtle CRT scanlines.
Left panel: Arcade controls legend (Move Left, Move Right, Fire Space) and Leaderboard card (GOOG_DEV, ALPHABET, CHROME_OS).
Center panel: Retro pixel-art Space Invaders game canvas with glowing invader rows and score header.
Right panel: Synthwave radio player with album art, play/pause/skip controls, and a green "SYSTEM STATUS: ONLINE" AI DJ telemetry widget.`,
    stitchScreens: [
      {
        title: 'Screen 1: GARCADE 3-Column Vaporwave Cabinet',
        description: 'Center HTML5 canvas Space Invaders arena flanked by High Score Leaderboard and Synthwave FM Radio deck.',
        tokens: [
          { name: 'Cyber Void Purple', hex: '#0D0221' },
          { name: 'Neon Magenta', hex: '#FF2A85' },
          { name: 'Arcade Cyan', hex: '#00F0FF' },
          { name: 'CRT Matrix Green', hex: '#22C55E' }
        ]
      },
      {
        title: 'Screen 2: AI DJ Live Modifiers Modal',
        description: 'Natural-language game physics tuner where Gemini translates prompts into laser speed, shield count, and synth tempo.',
        tokens: [
          { name: 'Sunset Synth Gold', hex: '#F59E0B' },
          { name: 'Laser Violet', hex: '#A855F7' }
        ]
      }
    ],
    annotationInstruction: 'Circle the bottom of the game canvas in AI Studio Preview and type: "Add 3 destructible neon pixel shields above the player ship and a Boss Wave warning banner every 1,000 points!"',
    antigravityMCPPrompt: `Use the StitchMCP server to fetch my "GARCADE" Vaporwave Arcade screen design. Compare the neon glow shadows, CRT scanline overlay, and 3-column grid proportions with src/App.tsx and refine the Tailwind CSS classes to match the Stitch layout.`,
    antigravityPlanPrompt: `/plan Follow our .agent/skills/production-guardrails/SKILL.md skill to upgrade "SynthInvaders: Vaporwave Arcade" into a full-stack production app:
1. Create an Express backend (server.js) with POST /api/dj-modifier, GET /api/leaderboard, and GET /api/health so GEMINI_API_KEY stays strictly server-side.
2. Use a strict @google/genai responseSchema for POST /api/dj-modifier that returns djCommentary (string), laserCooldownMs (number), alienSpeedMultiplier (number), and laserColorHex (string).
3. Serve the Vite production build from dist/ on PORT=8080 and verify everything builds cleanly for Cloud Run.`,
    backendSchemaSnippet: `// Strict Anti-Hallucination Schema for AI Arcade DJ Physics (server.js)
const arcadeModifierSchema = {
  type: Type.OBJECT,
  properties: {
    djCommentary: { type: Type.STRING, description: "Hype 80s radio DJ shoutout" },
    laserCooldownMs: { type: Type.INTEGER, description: "Between 80 (rapid) and 500 (slow)" },
    alienSpeedMultiplier: { type: Type.NUMBER, description: "Between 0.4 and 2.5" },
    laserColorHex: { type: Type.STRING, description: "Hex color like #00F0FF or #FF2A85" }
  },
  required: ["djCommentary", "laserCooldownMs", "alienSpeedMultiplier", "laserColorHex"]
};`
  },
  pulse: {
    id: 'pulse',
    badge: 'Track C • Search Grounding + Audio TTS',
    title: 'PulseBrief AI Studio',
    subtitle: 'Live Google Search-grounded executive radar & audio podcast generator',
    slideRef: 'Slides 14 & 15',
    aiCapabilities: ['Google Search Grounding', 'Text-to-Speech (TTS) Audio Player', 'Source Citation Verification'],
    vibe: 'Editorial Dark Glassmorphism Intelligence Desk',
    color: 'blue',
    lazyPrompt: 'Build an app that summarizes news topics for me.',
    layers: {
      role: "You're a Principal Product Engineer specializing in grounded AI research tools and executive dashboards.",
      goal: 'Create a web app called "PulseBrief AI Studio" that turns any industry topic or company query into a fact-checked executive briefing with an interactive audio podcast player.',
      context: 'Users enter a topic (or pick from trending presets), inspect structured takeaway cards with verified source links, save briefs to a local library, and listen to an audio readout.',
      aiFeature: 'Use Gemini with Google Search Grounding enabled to synthesize live web developments, displaying source URLs, a verification badge, and a 2-host conversational audio script playable via Web Speech / Gemini TTS.',
      vibe: 'High-contrast editorial dark-mode glassmorphism (#0B0F19 background, translucent slate cards, Google Blue & Emerald verification accents) with a sticky bottom audio player dock.',
      visual: 'Follow the attached Google Stitch mockup: Top command bar with Grounding toggle, 3-column verified insight grid, and bottom waveform podcast scrubber.'
    },
    stitchPrompt: `Design a modern desktop intelligence dashboard called "PulseBrief AI Studio" that turns live web news into executive audio briefings.
Aesthetic: High-contrast editorial dark mode (#0B0F19) with translucent glassmorphism cards and emerald/blue accents.
Top bar: Topic command input with a glowing "Google Search Grounding: ACTIVE" pill.
Main Grid: 3-column verified intelligence cards with source citation chips, impact score meters, and key takeaways.
Bottom Dock: Sticky AI Podcast Audio Player with waveform scrubber, Host A / Host B dialogue transcript drawer, and play/pause/speed controls.`,
    stitchScreens: [
      {
        title: 'Screen 1: Grounded Intelligence Radar & Citation Grid',
        description: 'Live search bar with grounding confidence badges, verified source citation pills, and executive summary cards.',
        tokens: [
          { name: 'Obsidian Desk', hex: '#0B0F19' },
          { name: 'Grounded Blue', hex: '#3B82F6' },
          { name: 'Verified Emerald', hex: '#10B981' },
          { name: 'Slate Glass', hex: '#1E293B' }
        ]
      },
      {
        title: 'Screen 2: Dual-Host Audio Briefing Studio',
        description: 'Interactive transcript viewer synced with browser TTS / Gemini Audio playback and exportable Markdown brief.',
        tokens: [
          { name: 'Waveform Cyan', hex: '#06B6D4' },
          { name: 'Highlight Amber', hex: '#F59E0B' }
        ]
      }
    ],
    annotationInstruction: 'Circle one of the insight cards in AI Studio Preview and type: "Add a Verify Citations drawer button on each card that highlights the exact grounded source URL and publication date."',
    antigravityMCPPrompt: `Use the StitchMCP server to inspect my "PulseBrief AI Studio" screens. Sync the glassmorphism backdrop-blur, border opacity, and sticky bottom audio dock dimensions into src/App.tsx.`,
    antigravityPlanPrompt: `/plan Follow our .agent/skills/production-guardrails/SKILL.md skill to upgrade "PulseBrief AI Studio" into a production-ready full-stack Cloud Run application:
1. Create an Express backend (server.js) with POST /api/briefing and GET /api/health so GEMINI_API_KEY is never exposed in the browser.
2. Configure @google/genai with Google Search grounding and return structured executive takeaways, citation metadata, and a 2-host podcast script.
3. Serve the Vite static build on PORT=8080 and verify the production build succeeds.`,
    backendSchemaSnippet: `// Grounded Executive Briefing Schema (server.js)
const briefingSchema = {
  type: Type.OBJECT,
  properties: {
    headline: { type: Type.STRING },
    executiveSummary: { type: Type.STRING },
    keyTakeaways: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          summary: { type: Type.STRING },
          impactLevel: { type: Type.STRING, enum: ["HIGH", "MEDIUM", "EMERGING"] },
          sourceDomain: { type: Type.STRING }
        },
        required: ["title", "summary", "impactLevel", "sourceDomain"]
      }
    },
    podcastScript: { type: Type.STRING, description: "60-second Host A & Host B audio script" }
  },
  required: ["headline", "executiveSummary", "keyTakeaways", "podcastScript"]
};`
  },
  custom: {
    id: 'custom',
    badge: 'Track D • Build Your Own Idea',
    title: 'Custom Vibe-Coded App',
    subtitle: 'Design your own custom use case using the 6-Layer Prompt Builder',
    slideRef: 'Slide 14–16 (10 Project Scaffolds)',
    aiCapabilities: ['Custom Gemini Multimodal / Grounding / Chat', 'Structured JSON Output', 'Cloud Run Auto-Scaling'],
    vibe: 'Your Custom Aesthetic & Brand System',
    color: 'amber',
    lazyPrompt: 'Help me build an app that solves my daily workflow problem.',
    layers: {
      role: "You're a Principal Product Designer and Full-Stack React & Tailwind CSS Engineer.",
      goal: 'Create a responsive web application that solves [describe your core problem here] with an intuitive interactive dashboard.',
      context: 'Users will open this app daily to [describe main user workflow]. Include realistic starter data on first load and save user changes to localStorage.',
      aiFeature: 'Integrate the Gemini API (@google/genai) to analyze user input (text, image, or audio) and return structured JSON recommendations.',
      vibe: 'Craft a cohesive modern aesthetic with crisp typography, subtle micro-interactions, and high-contrast accessible cards.',
      visual: 'Follow the component hierarchy and color tokens from my attached Google Stitch mockup.'
    },
    stitchPrompt: `Design a 2-screen modern web application for my custom project idea:
Screen 1 (Main Workspace): Hero action card, interactive input dropzone, real-time Gemini AI analysis panel, and status metrics.
Screen 2 (History & Analytics): Saved items gallery, weekly trend chart, and export controls.
Aesthetic: Clean modern UI with high-contrast typography and cohesive accent colors.`,
    stitchScreens: [
      {
        title: 'Screen 1: Primary Interactive Workspace',
        description: 'Main user input surface paired with real-time Gemini intelligence output cards.',
        tokens: [
          { name: 'Primary Brand', hex: '#4285F4' },
          { name: 'Accent Action', hex: '#34A853' },
          { name: 'Surface Card', hex: '#FFFFFF' },
          { name: 'Ink Primary', hex: '#202124' }
        ]
      },
      {
        title: 'Screen 2: Analytics & Saved Library',
        description: 'Historical trends, saved AI outputs, and shareable export view.',
        tokens: [
          { name: 'Highlight Gold', hex: '#FBBC04' },
          { name: 'Alert Coral', hex: '#EA4335' }
        ]
      }
    ],
    annotationInstruction: 'Circle any component in AI Studio Preview using the Annotate tool and describe one visual enhancement or extra metric card you want added.',
    antigravityMCPPrompt: `Use the StitchMCP server to list my Stitch projects, fetch the screens for my custom app, and align the Tailwind CSS theme in src/App.tsx with my Stitch design system.`,
    antigravityPlanPrompt: `/plan Follow our .agent/skills/production-guardrails/SKILL.md skill to upgrade my custom app into a production-ready full-stack Cloud Run service:
1. Create an Express backend (server.js) with POST /api/gemini and GET /api/health so GEMINI_API_KEY remains strictly server-side.
2. Add a strict @google/genai responseSchema so all AI responses are type-safe JSON.
3. Serve the Vite production build from dist/ on PORT=8080 and verify the build succeeds.`,
    backendSchemaSnippet: `// Custom Structured Output Schema (server.js)
const customResponseSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    summary: { type: Type.STRING },
    actionItems: { type: Type.ARRAY, items: { type: Type.STRING } },
    confidenceScore: { type: Type.NUMBER }
  },
  required: ["title", "summary", "actionItems", "confidenceScore"]
};`
  }
};

export interface CodelabStepMeta {
  number: number;
  title: string;
  shortTitle: string;
  durationMinutes: number;
  phase: 'OVERVIEW' | 'THINK' | 'BUILD' | 'ELEVATE' | 'PUBLISH';
  slideRange: string;
}

export const CODELAB_STEPS: CodelabStepMeta[] = [
  {
    number: 1,
    title: 'Before You Begin: Choose Your Vibe Coding Journey',
    shortTitle: '1. Choose Your Track',
    durationMinutes: 5,
    phase: 'OVERVIEW',
    slideRange: 'Slides 1–12'
  },
  {
    number: 2,
    title: 'Step 1 (Think): The 6-Layer Prompt & Google Stitch UI Design',
    shortTitle: '2. Think: Prompt & Stitch',
    durationMinutes: 15,
    phase: 'THINK',
    slideRange: 'Slides 13–16'
  },
  {
    number: 3,
    title: 'Step 2A (Build Fast): Instant App & Visual Annotation in AI Studio',
    shortTitle: '3. Build: Google AI Studio',
    durationMinutes: 15,
    phase: 'BUILD',
    slideRange: 'Slides 17–25'
  },
  {
    number: 4,
    title: 'Step 2B (Quick Publish): Zero-Billing Cloud Run Starter Tier',
    shortTitle: '4. Starter Tier Publish',
    durationMinutes: 10,
    phase: 'BUILD',
    slideRange: 'Slides 26 & 31'
  },
  {
    number: 5,
    title: 'Step 3A (Master the Stack): Antigravity Surfaces, Settings, Sandbox & Customizations',
    shortTitle: '5. Tools, Configs & Surfaces',
    durationMinutes: 20,
    phase: 'ELEVATE',
    slideRange: 'Slides 9–11, 27–29'
  },
  {
    number: 6,
    title: 'Step 3B (Production Architecture): Prototype vs. Production, Schemas & Skills',
    shortTitle: '6. Production Architecture Lab',
    durationMinutes: 15,
    phase: 'ELEVATE',
    slideRange: 'Slides 3 & 11'
  },
  {
    number: 7,
    title: 'Step 4 (Publish to Production): Cloud Run Free Quota & Live Demo',
    shortTitle: '7. Publish: Cloud Run Free Quota',
    durationMinutes: 15,
    phase: 'PUBLISH',
    slideRange: 'Slides 30–32'
  }
];

export const GLOSSARY_ITEMS = [
  {
    term: 'Vibe Coding',
    badge: 'Intent Orchestration',
    definition: 'Shifting from writing manual syntax to orchestrating intent. You provide the "vibe" (the goal, user experience, and style), and the AI handles implementation.'
  },
  {
    term: 'Agentic AI',
    badge: 'Action Era (Gemini 3.x)',
    definition: 'AI models that do not just "chat," but take autonomous action—browsing the web, running terminal commands, editing multi-file projects, and verifying builds.'
  },
  {
    term: 'Model Context Protocol (MCP)',
    badge: 'Universal Connector',
    definition: 'Allows your AI agents in Antigravity to securely inspect and act on external systems like Google Stitch screens, local files, Firebase, or GitHub repos.'
  },
  {
    term: 'Skills & Artifacts',
    badge: 'Reusable Guardrails',
    definition: 'Modular domain instructions (SKILL.md) and structured deliverables (Plans, Walkthroughs, Diffs) that teach agents best practices and preserve state.'
  },
  {
    term: 'Context Window',
    badge: 'Active Memory',
    definition: 'The AI’s working memory. Gemini’s massive context window allows the agent to hold your entire codebase, Stitch mockups, and documentation simultaneously.'
  },
  {
    term: 'Cloud Run Starter Tier & Quota',
    badge: 'Zero-Cost Publishing',
    definition: 'Publish up to 2 apps directly from AI Studio with zero billing setup, or deploy full-stack containers to Cloud Run with --min-instances=0 so idle cost is $0.'
  }
];
