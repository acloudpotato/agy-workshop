import React, { useState } from 'react';
import { CodeBlock } from './CodeBlock';
import {
  Cpu,
  Terminal,
  Laptop,
  Command,
  Shield,
  Sliders,
  Sparkles,
  FileCode2,
  Blocks,
  Plug,
  Webhook,
  FolderTree,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Globe,
  Play
} from 'lucide-react';

export const ToolAndConfigExplorer: React.FC<{ activeAppName: string }> = ({
  activeAppName
}) => {
  // 1. Surface Explorer State (Antigravity 2.0 App vs IDE vs CLI vs SDK vs AI Studio vs Stitch)
  const [selectedSurface, setSelectedSurface] = useState<'app2' | 'ide' | 'cli' | 'sdk' | 'aistudio' | 'stitch'>('app2');

  // 2. Settings & Sandbox Policy Simulator State
  const [modelChoice, setModelChoice] = useState<'gemini-3-flash' | 'gemini-3-pro' | 'gemini-next'>('gemini-3-pro');
  const [executionPolicy, setExecutionPolicy] = useState<'proceed-in-sandbox' | 'request-review' | 'always-proceed' | 'strict'>('proceed-in-sandbox');
  const [sandboxEnabled, setSandboxEnabled] = useState<boolean>(true);
  const [internetPolicy, setInternetPolicy] = useState<'ask' | 'allow' | 'deny'>('ask');
  const [nonWorkspaceAccess, setNonWorkspaceAccess] = useState<'ask' | 'allow' | 'deny'>('ask');
  const [artifactReviewMode, setArtifactReviewMode] = useState<'agent-decides' | 'asks-for-review' | 'always-proceed'>('asks-for-review');

  // 3. Customization Architecture Explorer State (Rules, Skills, MCP, Hooks, Plugins)
  const [activeCustomTab, setActiveCustomTab] = useState<'rules' | 'skills' | 'mcp' | 'hooks' | 'plugins'>('rules');

  // 4. Slash Command & @ Mention Interactive Simulator
  const [selectedSlash, setSelectedSlash] = useState<string>('/plan');

  const surfaces = {
    app2: {
      name: 'Antigravity 2.0 (Desktop App)',
      badge: 'Mission Control • Parallel Agent Orchestrator',
      whenToUse: 'Best when orchestrating multi-step missions, parallel subagents, background dev servers, scheduled cron automations, and browser testing independently of an editor.',
      keyPanels: [
        {
          area: 'Left-Hand Sidebar',
          items: [
            'New Conversation & Conversation History',
            'Projects / Workspaces switcher & Playground (quick throwaway prototypes)',
            'Scheduled Tasks (recurring cron jobs & delayed timers)',
            'Skills, Rules, Plugins & MCP Server manager',
            'Global & Project Settings'
          ]
        },
        {
          area: 'Center Chat Canvas',
          items: [
            'Slash Commands (/plan, /boost, /goal, /grill-me, /learn, /browser, /compact)',
            '@ Mentions (@files, @folders, @Rules, @MCP servers, @terminal sessions)',
            'Drag-and-drop multimodal media uploads (Stitch mockups, architecture PDFs)'
          ]
        },
        {
          area: 'Right HTML Auxiliary Pane',
          items: [
            'Live Subagents tree (research, self, image-generator, custom defined subagents)',
            'Background Tasks monitor (live Vite/Express dev servers & logs)',
            'Artifacts Viewer (Implementation Plans with Proceed button, Walkthroughs, Diffs)',
            'Files Changed & Integrated Sandboxed Terminals'
          ]
        }
      ]
    },
    ide: {
      name: 'Antigravity IDE (VS Code-based)',
      badge: 'In-Editor AI Pair Programmer',
      whenToUse: 'Best when writing/reviewing code line-by-line and combining passive autocomplete with targeted inline refactors and collaborative sidebar agents.',
      keyPanels: [
        {
          area: 'Passive Modality: Antigravity Tab',
          items: [
            'Autocomplete & Supercomplete (floating multi-line diff windows)',
            'Tab to Jump (predicts next cursor navigation point across files)',
            'Tab to Import (auto-inserts missing ES/TS imports at top of file)',
            'Accept word-by-word with Cmd/Ctrl + →'
          ]
        },
        {
          area: 'Instructive Modality: Inline Command (Cmd/Ctrl + I)',
          items: [
            'Highlight any function/component and press Cmd+I for surgical inline edits',
            'Inline Code Lenses above classes/functions ("Refactor", "Write Tests", "Explain")',
            'Visual red/green diff overlays with one-click Accept/Reject'
          ]
        },
        {
          area: 'Collaborative Modality: Sidebar Agent & Problems Auto-Fix',
          items: [
            'Full Agent Mode with Planning Mode review',
            'Diagnostic Auto-Fix directly from TypeScript/ESLint compiler errors in the Problems pane',
            'Auto-discovers workspace customizations in <project-root>/.agents/'
          ]
        }
      ]
    },
    cli: {
      name: 'Antigravity CLI (agy)',
      badge: 'Terminal-Native Agent TUI',
      whenToUse: 'Best for fast terminal-first workflows, SSH sessions, CI/CD debugging, and headless developer velocity.',
      keyPanels: [
        {
          area: 'Core CLI Commands',
          items: [
            'Launch interactive TUI in any repo by running `agy`',
            'Inspect flags and subcommands via `agy --help`',
            'Run `/help` inside the TUI for slash commands, `/exit` or Ctrl+D twice to quit'
          ]
        },
        {
          area: 'Configuration File',
          items: [
            'Configured via `~/.gemini/antigravity-cli/settings.json`',
            'Shares workspace `.agents/` skills, rules, and `GEMINI.md` context with IDE & 2.0'
          ]
        }
      ]
    },
    sdk: {
      name: 'Antigravity Python SDK',
      badge: 'Programmatic Agent Leasing & Custom Tools',
      whenToUse: 'Best when building custom Python pipelines or multi-agent backend orchestrators that lease Antigravity agents programmatically.',
      keyPanels: [
        {
          area: 'SDK Capabilities',
          items: [
            'Programmatic agent leasing and session management from Python',
            'Expose custom Python functions directly as agent tools',
            'Repository: github.com/google-antigravity/antigravity-sdk-python'
          ]
        }
      ]
    },
    aistudio: {
      name: 'Google AI Studio (ai.studio/build)',
      badge: 'Zero-to-One Browser Builder',
      whenToUse: 'Best for rapid 15-minute single-prompt React app generation, visual screen annotation, and 1-click Google Cloud Starter Tier publishing.',
      keyPanels: [
        {
          area: 'Key Build Mode Controls (Slides 19–26)',
          items: [
            'Action History & Prompt Chat (tracks every file created/edited)',
            'Live Preview vs. Raw Code Explorer (React, Tailwind, TypeScript, Vite)',
            'Smart AI Suggestion Chips & Visual Annotation Paintbrush Toolbar',
            '1-Click Publish to Google Cloud Starter Tier (up to 2 services free, no billing)'
          ]
        }
      ]
    },
    stitch: {
      name: 'Google Stitch (stitch.withgoogle.com)',
      badge: 'Visual UI Canvas & Design System Generator',
      whenToUse: 'Best for Step 1 (Think): transforming rough text ideas or wireframes into multi-screen mobile/desktop interfaces and Figma-ready design systems.',
      keyPanels: [
        {
          area: 'Design-to-Code Workflow',
          items: [
            'Generate Mobile, Desktop, or Tablet screens from text prompts',
            'Extract reusable Design Systems (color palettes, typography, component tokens)',
            'Connect directly to Antigravity 2.0 via the StitchMCP server!'
          ]
        }
      ]
    }
  };

  const slashCommands: Record<string, { badge: string; desc: string; examplePrompt: string }> = {
    '/plan': {
      badge: 'Architectural Step-by-Step Planning',
      desc: 'Instructs the agent to research the codebase first and produce a structured Implementation Plan Artifact with a "Proceed" button before modifying production code.',
      examplePrompt: `/plan Upgrade ${activeAppName} to use an Express backend on PORT=8080, move GEMINI_API_KEY server-side, and add strict responseSchema validation.`
    },
    '/grill-me': {
      badge: 'Interactive Design Interview',
      desc: 'The agent interviews you with targeted architectural questions to resolve edge cases, data models, and UX ambiguities before writing code.',
      examplePrompt: `/grill-me I want to add user authentication, daily streaks, and Cloud Firestore persistence to ${activeAppName}. Ask me questions to lock down the design.`
    },
    '/boost': {
      badge: 'Deep Multi-Perspective Engineering',
      desc: 'Activates deep strategic thinking, multiple architectural perspectives, and rigorous verification for complex bugs or system refactors.',
      examplePrompt: `/boost Audit ${activeAppName} for race conditions, memory leaks, accessibility (a11y), and Cloud Run cold-start performance.`
    },
    '/goal': {
      badge: 'Autonomous Long-Running Mission',
      desc: 'Runs the agent thoroughly in autonomous mode until the entire multi-milestone goal (build, test, lint, verify) is 100% achieved.',
      examplePrompt: `/goal Build full unit and integration tests for ${activeAppName}, fix any failing TypeScript or Vite build issues, and verify all API endpoints return 200.`
    },
    '/browser': {
      badge: 'Live Browser Automation & E2E Testing',
      desc: 'Launches the agent browser tool to open your running localhost app, click buttons, fill inputs, inspect console logs, and verify visual rendering.',
      examplePrompt: `/browser Open http://localhost:5173, test the main AI workflow in ${activeAppName}, and verify there are zero console errors.`
    },
    '/learn': {
      badge: 'Persist New Knowledge as a Skill/Rule',
      desc: 'After solving a tricky setup or correcting the agent, use /learn so the agent saves the pattern into your workspace rules or skills for future sessions.',
      examplePrompt: `/learn Save our Cloud Run Express + Vite static serving pattern and @google/genai responseSchema convention as a reusable workspace skill.`
    },
    '/schedule': {
      badge: 'Recurring Cron & Timer Automations',
      desc: 'Schedules a recurring background task (cron expression) or one-shot timer that wakes the agent up automatically.',
      examplePrompt: `/schedule Every Monday at 9am, check our Cloud Run service health endpoint and generate a weekly dependency & security audit artifact.`
    },
    '/compact': {
      badge: 'Context Window Optimization',
      desc: 'Summarizes and compacts a long conversation history so your agent keeps peak reasoning speed and frees up context tokens.',
      examplePrompt: `/compact Summarize our completed UI and backend refactoring steps so far and keep focus on the upcoming Cloud Run deployment.`
    }
  };

  // Simulator outcome calculation for Settings & Sandbox
  const getSandboxDiagnosis = () => {
    if (sandboxEnabled && internetPolicy === 'deny') {
      return {
        status: 'warn',
        title: 'Why `npm install` or `gcloud run deploy` pauses in Standard Sandbox',
        explanation:
          'Standard Sandbox Mode (BypassSandbox: false) gives the agent full read/write access to your workspace and /tmp without prompting you, but blocks outbound network calls. When a command needs network (like `npm install` or `gcloud`), Antigravity requests approval to run that specific step outside the sandbox!'
      };
    }
    if (executionPolicy === 'always-proceed' && !sandboxEnabled) {
      return {
        status: 'danger',
        title: 'High-Autonomy Unsandboxed Mode (Use Only in Trusted Repos)',
        explanation:
          'Commands run immediately without sandbox isolation or manual review. For production workshops, we recommend `proceed-in-sandbox` so local file edits and builds auto-run safely while network commands ask for approval.'
      };
    }
    return {
      status: 'recommended',
      title: 'Production Workshop Recommended Configuration Active!',
      explanation:
        'With `proceed-in-sandbox` + Terminal Sandbox enabled + `asks-for-review` on Artifacts, the agent builds and tests code autonomously at high speed while pausing for your approval on Implementation Plans and external network deployments.'
    };
  };

  const diagnosis = getSandboxDiagnosis();

  // Dynamic files for Customization Explorer
  const customizationFiles = {
    rules: {
      path: 'GEMINI.md (or .agents/rules/architecture.md)',
      scope: 'Always-On Contextual & Hierarchical (24KB per-file cap, 20K token budget)',
      summary:
        'Placed in your repo root or subdirectories. Antigravity walks up the directory tree and automatically applies these rules to enforce coding styles, SDK versions, and security boundaries.',
      code: `# Project Architecture & Coding Rules (${activeAppName})

## 1. Tech Stack & SDK Conventions
- Frontend: React 18, TypeScript, Tailwind CSS, Lucide Icons, Vite.
- Backend: Node 22 + Express (\`server.js\`) serving both \`/api/*\` and static \`dist/\` on \`PORT=8080\`.
- Always use the official \`@google/genai\` SDK (\`import { GoogleGenAI, Type } from '@google/genai'\`). Never use legacy \`@google/generative-ai\`.

## 2. Production Security & Anti-Hallucination Rules
- NEVER reference \`GEMINI_API_KEY\` in client-side \`src/\` files.
- Every Gemini call returning data to UI components MUST define \`responseMimeType: "application/json"\` and a strict \`responseSchema\`.`
    },
    skills: {
      path: '.agents/skills/production-guardrails/SKILL.md',
      scope: 'Progressive Disclosure (Loaded On-Demand When Relevant)',
      summary:
        'To save context window tokens, Antigravity only loads each skill’s name and description at startup. When your task matches the skill (e.g., upgrading to production or deploying to Cloud Run), the agent reads the full SKILL.md instructions!',
      code: `---
name: production-guardrails
description: Enforces production-grade architecture, strict structured JSON outputs, anti-hallucination citations, and backend API key security for Google Cloud Run deployments.
---

# Production Guardrails & Cloud Run Readiness Skill

When asked to make the app production-ready:
1. Create \`server.js\` with \`GET /api/health\` and \`POST /api/gemini\`.
2. Lock Gemini outputs with \`Type.OBJECT\` \`responseSchema\`.
3. Create a multi-stage \`Dockerfile\` (Node 22 Alpine) exposing port 8080.
4. Deploy with \`--min-instances 0 --max-instances 2\` to stay in Cloud Run Free Quota.`
    },
    mcp: {
      path: '~/.gemini/config/mcp_config.json (or plugin mcp_config.json)',
      scope: 'Universal Tool Connector (Stdio Local & Streamable HTTP Remote)',
      summary:
        'Connects Antigravity to external tools and live data (Google Stitch, Firebase, Cloud Run, SQLite, GitHub). Supports local Stdio binaries and remote Streamable HTTP (/mcp) endpoints.',
      code: `{
  "mcpServers": {
    "StitchMCP": {
      "url": "https://stitch.withgoogle.com/mcp"
    },
    "firebase-mcp": {
      "command": "npx",
      "args": ["-y", "firebase-tools@latest", "mcp"]
    },
    "local-sqlite-audit": {
      "command": "sqlite-mcp-server",
      "args": ["./data/workshop.db"],
      "env": {
        "DB_READONLY": "true"
      }
    }
  }
}`
    },
    hooks: {
      path: '.agents/hooks.json',
      scope: 'Deterministic Lifecycle Interceptors (SessionStart, PreToolUse, PostToolUse, Stop)',
      summary:
        'Runs shell scripts synchronously at key points in the agent loop. Use PreToolUse to block accidental secret leaks or destructive commands, PostToolUse to auto-run linters, or Stop to ensure tests pass before the agent finishes!',
      code: `{
  "production-safety-gate": {
    "enabled": true,
    "PreToolUse": [
      {
        "matcher": "run_command",
        "hooks": [
          {
            "type": "command",
            "command": "./scripts/verify-no-leaked-keys.sh",
            "timeout": 10
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "edit_file|write_file",
        "hooks": [
          {
            "type": "command",
            "command": "npm run build --if-present",
            "timeout": 25
          }
        ]
      }
    ]
  }
}`
    },
    plugins: {
      path: '.agents/plugins/gdg-cloud-run-pack/plugin.json',
      scope: 'Installable Bundle (Skills + Rules + MCP + Hooks in One Unit)',
      summary:
        'Packages your team’s skills, rules, MCP servers, and hooks into a single toggleable plugin that workshop attendees or engineering teams can enable with one click.',
      code: `{
  "name": "gdg-cloud-run-production-pack",
  "version": "1.0.0",
  "description": "Bundles Stitch design sync, @google/genai schema guardrails, and Cloud Run free-tier deployment skills.",
  "skills": ["skills/production-guardrails"],
  "rules": ["rules/architecture.md"],
  "mcpConfig": "mcp_config.json"
}`
    }
  };

  return (
    <div className="space-y-8">
      {/* =====================================================================
          MODULE A: GOOGLE AI & ANTIGRAVITY SURFACES EXPLORER
         ===================================================================== */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Laptop className="w-5 h-5 text-blue-600" />
            1. Interactive Ecosystem Explorer: Which Tool & Surface Should You Use?
          </h2>
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            Slides 9, 10 & 27
          </span>
        </div>
        <p className="text-xs text-slate-600 mb-4">
          Click each tool/surface below to explore its interface panels, keyboard shortcuts, and when to use it during your transition from beginner builder to production engineer:
        </p>

        {/* Surface Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-5">
          {(
            [
              { id: 'app2', label: 'Antigravity 2.0', sub: 'Mission Control' },
              { id: 'ide', label: 'Antigravity IDE', sub: 'VS Code Editor' },
              { id: 'cli', label: 'Antigravity CLI', sub: '`agy` Terminal' },
              { id: 'sdk', label: 'Python SDK', sub: 'Agent Leasing' },
              { id: 'aistudio', label: 'AI Studio Build', sub: '15m Prototype' },
              { id: 'stitch', label: 'Google Stitch', sub: 'UI Canvas' }
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedSurface(tab.id)}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                selectedSurface === tab.id
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <div className="text-xs font-bold truncate">{tab.label}</div>
              <div
                className={`text-[10px] truncate ${
                  selectedSurface === tab.id ? 'text-blue-100' : 'text-slate-400'
                }`}
              >
                {tab.sub}
              </div>
            </button>
          ))}
        </div>

        {/* Active Surface Detail Card */}
        <div className="p-5 rounded-xl bg-slate-900 text-slate-100 border border-slate-800">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-extrabold text-white">
                {surfaces[selectedSurface].name}
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                {surfaces[selectedSurface].whenToUse}
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
              {surfaces[selectedSurface].badge}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {surfaces[selectedSurface].keyPanels.map((panel, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-800/90 border border-slate-700"
              >
                <div className="text-xs font-bold text-cyan-300 uppercase tracking-wider mb-2.5">
                  {panel.area}
                </div>
                <ul className="space-y-2 text-xs text-slate-200">
                  {panel.items.map((it, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =====================================================================
          MODULE B: INTERACTIVE SETTINGS, SANDBOX & PERMISSIONS SIMULATOR
         ===================================================================== */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-600" />
            2. Interactive Antigravity Settings & Terminal Sandbox Simulator
          </h2>
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            Global & Project Settings
          </span>
        </div>
        <p className="text-xs text-slate-600 mb-4">
          Ever wonder why a terminal task waits for approval or how to balance agent speed with production safety? Toggle the actual Antigravity 2.0 settings below to see how they govern agent execution:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Setting 1: Model Selection */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <label className="block text-xs font-bold text-slate-800 mb-1">
              1. Model Selection
            </label>
            <p className="text-[11px] text-slate-500 mb-2">
              Choose speed vs. deep architectural reasoning:
            </p>
            <select
              value={modelChoice}
              onChange={(e) => setModelChoice(e.target.value as typeof modelChoice)}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold bg-white"
            >
              <option value="gemini-3-flash">Gemini 3 Flash (Ultra-Fast UI & Edits)</option>
              <option value="gemini-3-pro">Gemini 3 Pro (Complex Full-Stack & MCP)</option>
              <option value="gemini-next">Gemini Next / Argon (Deep Multi-Agent)</option>
            </select>
          </div>

          {/* Setting 2: Tool Execution Policy */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <label className="block text-xs font-bold text-slate-800 mb-1">
              2. Tool Execution Policy
            </label>
            <p className="text-[11px] text-slate-500 mb-2">
              Controls when terminal commands require approval:
            </p>
            <select
              value={executionPolicy}
              onChange={(e) => setExecutionPolicy(e.target.value as typeof executionPolicy)}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold bg-white"
            >
              <option value="proceed-in-sandbox">proceed-in-sandbox (Recommended)</option>
              <option value="request-review">request-review (Ask before commands)</option>
              <option value="always-proceed">always-proceed (Auto-run all)</option>
              <option value="strict">strict (Confirm every step)</option>
            </select>
          </div>

          {/* Setting 3: Artifact Review Mode */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <label className="block text-xs font-bold text-slate-800 mb-1">
              3. Artifact Review Mode
            </label>
            <p className="text-[11px] text-slate-500 mb-2">
              Should the agent pause for feedback on `/plan` artifacts?
            </p>
            <select
              value={artifactReviewMode}
              onChange={(e) => setArtifactReviewMode(e.target.value as typeof artifactReviewMode)}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold bg-white"
            >
              <option value="asks-for-review">asks-for-review (Shows Proceed Button)</option>
              <option value="agent-decides">agent-decides (Smart Pause)</option>
              <option value="always-proceed">always-proceed (Execute immediately)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Setting 4: Terminal Sandbox Toggle */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-800">4. Terminal Sandbox</div>
              <div className="text-[11px] text-slate-500">
                Isolates file & network access by default
              </div>
            </div>
            <button
              onClick={() => setSandboxEnabled(!sandboxEnabled)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                sandboxEnabled
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-300 text-slate-700'
              }`}
            >
              {sandboxEnabled ? 'ENABLED' : 'DISABLED'}
            </button>
          </div>

          {/* Setting 5: Internet Access Policy */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <label className="block text-xs font-bold text-slate-800 mb-1">
              5. Internet Access Policy
            </label>
            <select
              value={internetPolicy}
              onChange={(e) => setInternetPolicy(e.target.value as typeof internetPolicy)}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold bg-white"
            >
              <option value="ask">ask (Prompt on npm install / gcloud)</option>
              <option value="allow">allow (Permit outbound network)</option>
              <option value="deny">deny (Strict offline sandbox)</option>
            </select>
          </div>

          {/* Setting 6: Non-Workspace File Access */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <label className="block text-xs font-bold text-slate-800 mb-1">
              6. Non-Workspace File Access
            </label>
            <select
              value={nonWorkspaceAccess}
              onChange={(e) => setNonWorkspaceAccess(e.target.value as typeof nonWorkspaceAccess)}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold bg-white"
            >
              <option value="ask">ask (Prompt before reading outside repo)</option>
              <option value="allow">allow</option>
              <option value="deny">deny (Workspace-only lock)</option>
            </select>
          </div>
        </div>

        {/* Live Behavior Diagnosis Box */}
        <div
          className={`p-4 rounded-xl border flex items-start gap-3 ${
            diagnosis.status === 'recommended'
              ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
              : diagnosis.status === 'warn'
              ? 'bg-amber-50/80 border-amber-300 text-amber-950'
              : 'bg-rose-50/80 border-rose-300 text-rose-950'
          }`}
        >
          <Shield className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <div className="font-extrabold">{diagnosis.title}</div>
            <p className="leading-relaxed">{diagnosis.explanation}</p>
            <div className="pt-1 font-mono text-[11px] opacity-85">
              Active Profile: model={modelChoice} | policy={executionPolicy} | sandbox={String(sandboxEnabled)} | network={internetPolicy} | artifacts={artifactReviewMode}
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================================
          MODULE C: SLASH COMMANDS & @ MENTIONS INTERACTIVE LAUNCHPAD
         ===================================================================== */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <h2 className="text-lg font-extrabold text-slate-900 mb-2 flex items-center gap-2">
          <Command className="w-5 h-5 text-purple-600" />
          3. Interactive Slash Commands (`/`) & `@` Context Mentions Lab
        </h2>
        <p className="text-xs text-slate-600 mb-4">
          In Antigravity 2.0, typing <code>/</code> triggers specialized agent workflows, and typing <code>@</code> attaches files, folders, rules, or MCP tools directly to your prompt. Click any slash command below to get a ready-to-run prompt for <strong>{activeAppName}</strong>:
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {Object.keys(slashCommands).map((cmd) => (
            <button
              key={cmd}
              onClick={() => setSelectedSlash(cmd)}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition ${
                selectedSlash === cmd
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
              }`}
            >
              {cmd}
            </button>
          ))}
        </div>

        <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-200 mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono font-extrabold text-sm text-purple-900">
              {selectedSlash}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-200 text-purple-900">
              {slashCommands[selectedSlash].badge}
            </span>
          </div>
          <p className="text-xs text-purple-950">
            {slashCommands[selectedSlash].desc}
          </p>
        </div>

        <CodeBlock
          title={`Try ${selectedSlash} in Antigravity 2.0 Chat Canvas`}
          badge={`${selectedSlash} Workflow`}
          language="prompt"
          code={slashCommands[selectedSlash].examplePrompt}
          helperText="Copy and paste into Antigravity 2.0 to trigger this specialized workflow!"
        />
      </div>

      {/* =====================================================================
          MODULE D: THE 5 PILLARS OF ANTIGRAVITY CUSTOMIZATION ARCHITECTURE
         ===================================================================== */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <FolderTree className="w-5 h-5 text-blue-600" />
            4. Antigravity Customization Architecture: Rules, Skills, MCP, Hooks & Plugins
          </h2>
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
            Priority: Workspace (.agents/) → Global (~/.gemini/config/) → Built-in
          </span>
        </div>
        <p className="text-xs text-slate-600 mb-4">
          How do you turn a general AI assistant into a specialized production engineer for your team? By configuring the <strong>5 Customization Pillars</strong> inside your project’s <code>.agents/</code> directory:
        </p>

        {/* 5 Pillars Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4">
          {(
            [
              { id: 'rules', label: '1. Rules', file: 'GEMINI.md' },
              { id: 'skills', label: '2. Skills', file: 'SKILL.md' },
              { id: 'mcp', label: '3. MCP Servers', file: 'mcp_config.json' },
              { id: 'hooks', label: '4. Lifecycle Hooks', file: 'hooks.json' },
              { id: 'plugins', label: '5. Plugins', file: 'plugin.json' }
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCustomTab(tab.id)}
              className={`p-3 rounded-xl border text-left transition ${
                activeCustomTab === tab.id
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <div className="text-xs font-bold">{tab.label}</div>
              <div
                className={`text-[10px] font-mono mt-0.5 ${
                  activeCustomTab === tab.id ? 'text-cyan-300' : 'text-slate-400'
                }`}
              >
                {tab.file}
              </div>
            </button>
          ))}
        </div>

        {/* Active Pillar Details */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mb-3">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
            <span className="font-mono text-xs font-bold text-blue-700">
              Location: {customizationFiles[activeCustomTab].path}
            </span>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded bg-blue-100 text-blue-900">
              {customizationFiles[activeCustomTab].scope}
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            {customizationFiles[activeCustomTab].summary}
          </p>
        </div>

        <CodeBlock
          title={customizationFiles[activeCustomTab].path}
          badge={`Customization Pillar: ${activeCustomTab.toUpperCase()}`}
          language={activeCustomTab === 'rules' || activeCustomTab === 'skills' ? 'markdown' : 'json'}
          code={customizationFiles[activeCustomTab].code}
          downloadFileName={
            activeCustomTab === 'rules'
              ? 'GEMINI.md'
              : activeCustomTab === 'skills'
              ? 'SKILL.md'
              : activeCustomTab === 'mcp'
              ? 'mcp_config.json'
              : activeCustomTab === 'hooks'
              ? 'hooks.json'
              : 'plugin.json'
          }
          helperText="Copy or download this configuration file directly into your project workspace!"
        />
      </div>
    </div>
  );
};
