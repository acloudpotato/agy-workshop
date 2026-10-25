import React, { useState, useEffect } from 'react';
import {
  CODELAB_STEPS,
  PERSONA_SKILLS,
  COMPANY_BRAIN_GEMINI_MD,
  STITCH_PRODUCTION_PROMPT,
  ANTIGRAVITY_STITCH_MCP_PROMPT,
  ANTIGRAVITY_ORCHESTRATOR_PROMPT,
  AI_STUDIO_BASE_APP_PROMPT,
  AI_STUDIO_SSO_AND_ALERTS_UPGRADE_PROMPT
} from './data/onePersonCompanyData';
import { CodeBlock } from './components/CodeBlock';
import { PulseDailyLiveCompanion } from './components/PulseDailyLiveCompanion';
import {
  Check,
  Clock,
  ExternalLink,
  Menu,
  X,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  CheckSquare,
  Square
} from 'lucide-react';

export function App() {
  const [currentStep, setCurrentStep] = useState<number>(() => {
    const saved = localStorage.getItem('gdg_pulse_step_v2');
    return saved ? Math.min(parseInt(saved, 10), CODELAB_STEPS.length) : 1;
  });

  const [completedSteps, setCompletedSteps] = useState<number[]>(() => {
    const saved = localStorage.getItem('gdg_pulse_completed_v2');
    return saved ? JSON.parse(saved) : [];
  });

  const [activePersonaTab, setActivePersonaTab] = useState<'pm' | 'ux' | 'architect' | 'qa'>('pm');
  const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('gdg_pulse_tasks_v2');
    return saved ? JSON.parse(saved) : {};
  });
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('gdg_pulse_step_v2', String(currentStep));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  useEffect(() => {
    localStorage.setItem('gdg_pulse_completed_v2', JSON.stringify(completedSteps));
  }, [completedSteps]);

  useEffect(() => {
    localStorage.setItem('gdg_pulse_tasks_v2', JSON.stringify(checkedTasks));
  }, [checkedTasks]);

  const toggleTask = (id: string) => {
    setCheckedTasks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleStepComplete = (stepNum: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCompletedSteps((prev) =>
      prev.includes(stepNum) ? prev.filter((n) => n !== stepNum) : [...prev, stepNum]
    );
  };

  const handleSelectStepFromSidebar = (targetStep: number) => {
    if (targetStep > currentStep) {
      setCompletedSteps((prev) => {
        const next = new Set(prev);
        for (let i = 1; i < targetStep; i++) {
          next.add(i);
        }
        return Array.from(next);
      });
    }
    setCurrentStep(targetStep);
    setMobileDrawerOpen(false);
  };

  const handleNextStep = () => {
    setCompletedSteps((prev) =>
      prev.includes(currentStep) ? prev : [...prev, currentStep]
    );
    if (currentStep < CODELAB_STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const resetProgress = () => {
    setCompletedSteps([]);
    setCheckedTasks({});
    setCurrentStep(1);
    localStorage.removeItem('gdg_pulse_completed_v2');
    localStorage.removeItem('gdg_pulse_tasks_v2');
    localStorage.removeItem('gdg_pulse_step_v2');
  };

  const remainingMinutes = CODELAB_STEPS.filter((s) => s.number >= currentStep).reduce(
    (sum, s) => sum + s.durationMinutes,
    0
  );

  const activeStepMeta = CODELAB_STEPS[currentStep - 1] || CODELAB_STEPS[0];
  const selectedPersona = PERSONA_SKILLS.find((p) => p.id === activePersonaTab) || PERSONA_SKILLS[0];

  const bootstrapCommand = `# Create your project folder and the 4 Persona Skill directories
mkdir -p ~/Documents/pulsedaily-ai/.agents/skills/{pm-product-strategist,ux-stitch-designer,fullstack-architect,qa-production-guard}
cd ~/Documents/pulsedaily-ai

# Check that Node.js (v20+) is installed
node -v && npm -v`;

  const mcpConfigJson = `{
  "mcpServers": {
    "StitchMCP": {
      "url": "https://stitch.withgoogle.com/mcp"
    }
  }
}`;

  const mcpOneClickTerminalMac = `# Run this in your Mac / Linux terminal (or Antigravity's built-in terminal):
mkdir -p ~/.gemini/config && cat << 'EOF' > ~/.gemini/config/mcp_config.json
{
  "mcpServers": {
    "StitchMCP": {
      "url": "https://stitch.withgoogle.com/mcp"
    }
  }
}
EOF
echo "✅ StitchMCP configured at ~/.gemini/config/mcp_config.json"`;

  const mcpChatPrompt = `Please create or update my ~/.gemini/config/mcp_config.json file so that the Google Stitch MCP server ("StitchMCP" with url "https://stitch.withgoogle.com/mcp") is enabled, then verify the file exists.`;

  const workspaceFolderTree = `pulsedaily-ai/                        <-- Your Project Folder Root
├── GEMINI.md                         <-- Lead Orchestrator & Always-On Company Memory
└── .agents/
    └── skills/                       <-- On-Demand Specialist Personas (Progressive Disclosure)
        ├── pm-product-strategist/
        │   └── SKILL.md              <-- Persona 1: Product Manager
        ├── ux-stitch-designer/
        │   └── SKILL.md              <-- Persona 2: Google Stitch UI/UX Designer
        ├── fullstack-architect/
        │   └── SKILL.md              <-- Persona 3: Full-Stack & Gemini Engineer
        └── qa-production-guard/
            └── SKILL.md              <-- Persona 4: QA & Cloud Run SRE Guard`;

  const personasAndOrchestratorChatPrompt = `Please create our Lead Orchestrator file (GEMINI.md) and our 4 Persona Skill files (.agents/skills/*/SKILL.md) in this project folder using the exact specifications below:

1. Create GEMINI.md at the project root:
${COMPANY_BRAIN_GEMINI_MD}

${PERSONA_SKILLS.map(
  (p, idx) => `${idx + 2}. Create ${p.folderPath}:
${p.skillMarkdown}`
).join('\n\n')}`;

  const personasAndOrchestratorOneClickTerminal = `# Run this inside your project folder to create GEMINI.md + all 4 Persona SKILL.md files at once:
mkdir -p .agents/skills/{pm-product-strategist,ux-stitch-designer,fullstack-architect,qa-production-guard}

cat << 'EOF' > GEMINI.md
${COMPANY_BRAIN_GEMINI_MD}
EOF

${PERSONA_SKILLS.map(
  (p) => `cat << 'EOF' > ${p.folderPath}
${p.skillMarkdown}
EOF`
).join('\n\n')}

echo "✅ Created GEMINI.md (Orchestrator) and all 4 Persona SKILL.md files!"`;

  const aiStudioClipboardBundlerCmd = `# Run this inside your pulsedaily-ai folder (Mac):
# It ignores node_modules & dist, bundles all your src/ files, and copies them to your clipboard!
(
  echo "Build and run this React + TypeScript + Tailwind application in Google AI Studio. Recreate each file below and wire @google/genai to process.env.GEMINI_API_KEY:"
  find src -type f \\( -name "*.ts" -o -name "*.tsx" -o -name "*.css" \\) | while read -r file; do
    echo ""
    echo "=== FILE: $file ==="
    cat "$file"
  done
) | pbcopy && echo "✅ All src/ files copied to clipboard! Now open https://ai.studio/build and press Cmd+V in the prompt box!"`;

  const antigravitySingleFileBundlePrompt = `Google AI Studio (ai.studio/build) does not accept folder uploads. Please merge all our components, types, and styles from src/ into a single self-contained src/App.tsx file (and also save a ready-to-paste prompt in AI_STUDIO_PASTE.md) so I only have to copy and paste 1 file into Google AI Studio.`;

  const localRunChatPrompt = `Please verify our PulseDaily AI build locally:
1. Run "npm install" to ensure all packages (@google/genai, lucide-react, tailwindcss) are installed.
2. Create a .env.example (and .env if missing) for VITE_GEMINI_API_KEY, and make sure the app works out-of-the-box even without an API key using our live HackerNews feed and fallback role summaries.
3. Run "npm run build" to check for any TypeScript errors, then start the local dev server with "npm run dev" and share the localhost URL so I can test the app in my browser.`;

  const localRunTerminalCmd = `# 1. Go to your project folder
cd ~/Documents/pulsedaily-ai

# 2. (Optional) Add your free Gemini API key from https://aistudio.google.com/apikey
# Note: Even without a key, the app loads live HackerNews stories and pre-computed role summaries!
echo 'VITE_GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE"' > .env

# 3. Install dependencies and start the local server
npm install
npm run dev`;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-[#202124]">
      {/* Authentic Google Codelabs Top App Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#DADCE0] px-4 lg:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            className="lg:hidden p-2 rounded-full hover:bg-[#F1F3F4] text-[#5F6368]"
            aria-label="Open navigation"
          >
            {mobileDrawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Official Google 4-Dot Mark + Title */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1" aria-hidden="true">
              <span className="w-2.5 h-2.5 rounded-full bg-[#4285F4]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#EA4335]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#FBBC04]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#34A853]" />
            </div>
            <div className="h-5 w-[1px] bg-[#DADCE0] hidden sm:block" />
            <div>
              <span className="font-display font-bold text-sm sm:text-base text-[#202124]">
                Build with Google AI
              </span>
              <span className="hidden md:inline-block ml-2 text-sm text-[#5F6368]">
                Hands-on Codelab: Daily AI News Companion
              </span>
            </div>
          </div>
        </div>

        {/* Right Toolbar: Time Remaining + Official Tool Links */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-[#5F6368] bg-[#F1F3F4] px-3 py-1.5 rounded-full">
            <Clock className="w-3.5 h-3.5 text-[#5F6368]" />
            <span>{remainingMinutes} min remaining</span>
          </div>

          <a
            href="https://stitch.withgoogle.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium text-[#1A73E8] hover:bg-[#E8F0FE] transition"
          >
            <span>Google Stitch</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <a
            href="https://ai.studio/build"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded text-xs font-medium bg-[#1A73E8] hover:bg-[#1765CC] text-white transition"
          >
            <span>Open AI Studio</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </header>

      {/* Main Codelab Body */}
      <div className="flex-1 flex max-w-[1380px] w-full mx-auto relative">
        {/* Mobile Backdrop Overlay */}
        {mobileDrawerOpen && (
          <div
            onClick={() => setMobileDrawerOpen(false)}
            className="fixed inset-0 top-16 bg-black/30 z-30 lg:hidden"
          />
        )}

        {/* Authentic Google Codelabs Left Stepper Drawer */}
        <aside
          className={`${
            mobileDrawerOpen ? 'fixed inset-y-16 left-0 z-40 flex shadow-xl' : 'hidden'
          } lg:flex w-72 shrink-0 bg-white border-r border-[#DADCE0] py-4 px-3 lg:sticky lg:top-16 lg:h-[calc(100vh-64px)] overflow-y-auto flex-col justify-between`}
        >
          <div>
            <div className="flex items-center justify-between px-3 mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#5F6368]">
                Steps ({completedSteps.length}/{CODELAB_STEPS.length} Done)
              </span>
              <button
                onClick={resetProgress}
                className="text-[11px] font-medium text-[#1A73E8] hover:underline inline-flex items-center gap-1"
                title="Reset step progress"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* Thin Progress Bar */}
            <div className="mx-3 mb-3 h-1.5 bg-[#E8EAED] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#1E8E3E] transition-all duration-300"
                style={{
                  width: `${Math.round((completedSteps.length / CODELAB_STEPS.length) * 100)}%`
                }}
              />
            </div>

            <nav className="space-y-1">
              {CODELAB_STEPS.map((step) => {
                const isActive = step.number === currentStep;
                const isCompleted = completedSteps.includes(step.number);
                return (
                  <div
                    key={step.number}
                    onClick={() => handleSelectStepFromSidebar(step.number)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleSelectStepFromSidebar(step.number);
                      }
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-r-full flex items-center gap-3 cursor-pointer select-none transition ${
                      isActive
                        ? 'bg-[#E8F0FE] text-[#1A73E8] font-semibold border-l-4 border-[#1A73E8]'
                        : isCompleted
                        ? 'text-[#202124] hover:bg-[#F1F3F4] border-l-4 border-transparent'
                        : 'text-[#5F6368] hover:bg-[#F1F3F4] border-l-4 border-transparent'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={(e) => toggleStepComplete(step.number, e)}
                      title={
                        isCompleted
                          ? 'Click to unmark step complete'
                          : 'Click to mark step complete'
                      }
                      className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shrink-0 transition ${
                        isCompleted
                          ? 'bg-[#1E8E3E] text-white ring-2 ring-[#CEEAD6]'
                          : isActive
                          ? 'bg-[#1A73E8] text-white'
                          : 'bg-[#E8EAED] text-[#5F6368] hover:bg-[#DADCE0]'
                      }`}
                    >
                      {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : step.number}
                    </button>
                    <div className="truncate text-xs leading-snug flex-1">
                      {step.shortTitle}
                    </div>
                  </div>
                );
              })}
            </nav>
          </div>

          {/* Workspace Files Status Box */}
          <div className="mx-2 mt-6 p-3 rounded-lg bg-[#F8F9FA] border border-[#DADCE0] text-xs space-y-1.5">
            <div className="font-semibold text-[#202124]">
              Workspace Files Ready
            </div>
            <p className="text-[11px] text-[#5F6368] leading-relaxed">
              Your project folder already includes <code>GEMINI.md</code> and the 4 Persona <code>SKILL.md</code> files so you can run them right away.
            </p>
            <div className="pt-1 text-[11px] font-mono text-[#3C4043] space-y-0.5">
              <div>• GEMINI.md</div>
              <div>• .agents/skills/pm-...</div>
              <div>• .agents/skills/ux-...</div>
              <div>• .agents/skills/fullstack-...</div>
              <div>• .agents/skills/qa-...</div>
            </div>
          </div>
        </aside>

        {/* Main Step Document Surface */}
        <main className="flex-1 px-4 sm:px-8 lg:px-14 py-8 max-w-4xl mx-auto">
          <div className="bg-white rounded-lg border border-[#DADCE0] p-6 sm:p-10 shadow-sm">
            {/* Step Title Header */}
            <div className="border-b border-[#DADCE0] pb-5 mb-6">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#5F6368] mb-2">
                <span>
                  Step {activeStepMeta.number} of {CODELAB_STEPS.length} • {activeStepMeta.slideRef}
                </span>
                <span>Duration: ~{activeStepMeta.durationMinutes} min</span>
              </div>
              <h1 className="text-2xl sm:text-[28px] font-display font-bold text-[#202124] leading-tight">
                {activeStepMeta.title}
              </h1>
            </div>

            {/* ===============================================================
                STEP 1: BEFORE YOU BEGIN & SETUP FROM SCRATCH
               =============================================================== */}
            {currentStep === 1 && (
              <div className="space-y-6 text-sm text-[#3C4043] leading-relaxed">
                <p>
                  Welcome! In this workshop, we are going to build and ship a real software product from scratch—the way a modern <strong>one-person AI company</strong> works.
                </p>
                <p>
                  Instead of jumping straight into a random prompt and hoping for the best, we will walk through the complete product lifecycle step by step: deciding what to build, setting up our AI team in <strong>Google Antigravity</strong>, designing the interface with <strong>Google Stitch</strong>, adding Google SSO and breaking news alerts in <strong>Google AI Studio</strong>, and deploying a live URL on <strong>Google Cloud Run</strong> under the free tier.
                </p>

                <div className="p-4 rounded-r-md g-callout-info text-xs leading-relaxed">
                  <strong>What we are building today: PulseDaily AI</strong> — A daily AI & tech news companion for working professionals. It pulls live tech stories from free public APIs, uses Gemini to explain why each story matters for your specific job role, lets users sign in with <strong>Google SSO</strong> to save their reading list, and sends <strong>Breaking News notifications</strong> when major updates drop.
                </div>

                <h2 className="text-lg font-display font-bold text-[#202124] pt-2">
                  1. Set up your tools (Starting from a clean laptop)
                </h2>
                <p className="text-xs text-[#5F6368]">
                  Click each item below as you verify that your tools are ready:
                </p>

                <div className="space-y-2.5">
                  {[
                    {
                      id: 'chk_agy',
                      title: 'Download Google Antigravity 2.0',
                      desc: 'Install Antigravity for macOS, Windows, or Linux. Sign in with your Google account and keep Tool Execution Policy set to "proceed-in-sandbox".',
                      link: 'https://antigravity.google',
                      linkLabel: 'antigravity.google'
                    },
                    {
                      id: 'chk_stitch',
                      title: 'Open Google Stitch',
                      desc: 'Sign in at stitch.withgoogle.com. We will use both the web canvas and the StitchMCP server inside Antigravity.',
                      link: 'https://stitch.withgoogle.com',
                      linkLabel: 'stitch.withgoogle.com'
                    },
                    {
                      id: 'chk_aistudio',
                      title: 'Open Google AI Studio (Build Mode)',
                      desc: 'Go to ai.studio/build. You do not need a credit card or billing account to build apps or publish on the Cloud Run Starter Tier.',
                      link: 'https://ai.studio/build',
                      linkLabel: 'ai.studio/build'
                    },
                    {
                      id: 'chk_node',
                      title: 'Verify Node.js (v20 or v22)',
                      desc: 'We will run a quick terminal check below to make sure Node and npm are ready on your machine.',
                      link: 'https://nodejs.org',
                      linkLabel: 'nodejs.org'
                    }
                  ].map((item) => {
                    const done = !!checkedTasks[item.id];
                    return (
                      <div
                        key={item.id}
                        onClick={() => toggleTask(item.id)}
                        className={`p-3.5 rounded-lg border cursor-pointer transition flex items-start justify-between gap-3 ${
                          done
                            ? 'bg-[#E6F4EA]/50 border-[#CEEAD6]'
                            : 'bg-white hover:bg-[#F8F9FA] border-[#DADCE0]'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 text-[#1A73E8]">
                            {done ? (
                              <CheckSquare className="w-4 h-4 text-[#1E8E3E]" />
                            ) : (
                              <Square className="w-4 h-4 text-[#5F6368]" />
                            )}
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-[#202124]">
                              {item.title}
                            </div>
                            <div className="text-xs text-[#5F6368] mt-0.5">{item.desc}</div>
                          </div>
                        </div>
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs font-medium text-[#1A73E8] hover:underline shrink-0 inline-flex items-center gap-1"
                        >
                          <span>{item.linkLabel}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    );
                  })}
                </div>

                <h2 className="text-lg font-display font-bold text-[#202124] pt-2">
                  2. Create your project folder
                </h2>
                <p className="text-xs text-[#5F6368]">
                  If you are starting from a brand-new folder, run this command in your terminal to create the workspace and skill directories:
                </p>

                <CodeBlock
                  title="Terminal — Create Workspace & Persona Skill Folders"
                  language="bash"
                  code={bootstrapCommand}
                  helperText="Creates the .agents/skills/ folders where our 4 AI personas will live."
                />

                <h2 className="text-lg font-display font-bold text-[#202124] pt-4">
                  3. How & where to set up Google Stitch MCP (<code>~/.gemini/config/mcp_config.json</code>)
                </h2>
                <p className="text-xs text-[#3C4043] leading-relaxed">
                  A common question in workshops is: <strong>&ldquo;Wait—where do I run or paste <code>~/.gemini/config/mcp_config.json</code>? I can&apos;t see a <code>.gemini</code> folder on my computer!&rdquo;</strong>
                </p>

                <div className="p-4 rounded-r-md g-callout-info text-xs space-y-1.5 leading-relaxed">
                  <div className="font-bold text-[#202124]">
                    What is <code>~/.gemini/config/mcp_config.json</code>?
                  </div>
                  <p>
                    It is NOT a terminal command—it is a small <strong>JSON settings file</strong> stored inside a hidden folder (<code>.gemini</code>) in your computer&apos;s home directory:
                  </p>
                  <ul className="list-disc pl-5 space-y-0.5 text-[#3C4043]">
                    <li>
                      <strong>macOS / Linux:</strong> <code>/Users/&lt;your-username&gt;/.gemini/config/mcp_config.json</code>
                    </li>
                    <li>
                      <strong>Windows:</strong> <code>C:\Users\&lt;your-username&gt;\.gemini\config\mcp_config.json</code>
                    </li>
                  </ul>
                  <p>
                    Because folders starting with a dot (<code>.gemini</code>) are hidden by default in macOS Finder and Windows Explorer, <strong>pick any ONE of the 3 easy methods below</strong> so you don&apos;t have to hunt for hidden folders:
                  </p>
                </div>

                {/* 3 Easy Methods to Configure MCP */}
                <div className="space-y-4">
                  {/* Method A: Inside Antigravity UI */}
                  <div className="p-4 rounded-lg border border-[#DADCE0] bg-[#F8F9FA] space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-[#1A73E8] uppercase tracking-wider">
                        Method A (Easiest — Inside the Antigravity App UI)
                      </span>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#E8F0FE] text-[#1A73E8]">
                        No Terminal Needed
                      </span>
                    </div>
                    <ol className="list-decimal pl-5 text-xs text-[#3C4043] space-y-1">
                      <li>
                        Open <strong>Google Antigravity 2.0</strong> on your computer.
                      </li>
                      <li>
                        In the left sidebar (or the top-right <strong><code>...</code> Additional Options</strong> menu), click <strong>Skills &amp; Customizations → MCP Servers</strong>.
                      </li>
                      <li>
                        Click <strong>Edit <code>mcp_config.json</code></strong> (or <strong>Add MCP Server</strong>), paste the JSON below, and press <strong>Save</strong>:
                      </li>
                    </ol>
                    <CodeBlock
                      title="~/.gemini/config/mcp_config.json — Paste Inside Antigravity MCP Settings"
                      language="json"
                      code={mcpConfigJson}
                      downloadFileName="mcp_config.json"
                      helperText="Tells Antigravity how to connect to the official Google Stitch MCP server."
                    />
                  </div>

                  {/* Method B: Ask the Antigravity Agent in Chat */}
                  <div className="p-4 rounded-lg border border-[#DADCE0] bg-[#F8F9FA] space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-[#1E8E3E] uppercase tracking-wider">
                        Method B (Zero-Effort — Let the Antigravity Agent Do It For You)
                      </span>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#E6F4EA] text-[#1E8E3E]">
                        Beginner Favorite
                      </span>
                    </div>
                    <p className="text-xs text-[#3C4043]">
                      Since Antigravity is an agent that can create files on your computer, you don&apos;t even have to open a config file yourself! Just copy this prompt and paste it directly into the <strong>Antigravity chat box</strong>:
                    </p>
                    <CodeBlock
                      title="Paste into Antigravity Chat — Auto-Configure StitchMCP"
                      language="markdown"
                      code={mcpChatPrompt}
                      helperText="Antigravity will automatically create the hidden ~/.gemini/config/ folder and write mcp_config.json for you."
                    />
                  </div>

                  {/* Method C: 1-Click Terminal Command */}
                  <div className="p-4 rounded-lg border border-[#DADCE0] bg-[#F8F9FA] space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-[#5F6368] uppercase tracking-wider">
                        Method C (1-Command Terminal Setup — Mac / Linux)
                      </span>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#E8EAED] text-[#3C4043]">
                        One Copy-Paste Command
                      </span>
                    </div>
                    <p className="text-xs text-[#3C4043]">
                      Prefer the terminal? Copy and run this single command—it creates the hidden <code>~/.gemini/config</code> folder and writes the entire <code>mcp_config.json</code> file automatically:
                    </p>
                    <CodeBlock
                      title="Terminal — Create ~/.gemini/config/mcp_config.json in One Command"
                      language="bash"
                      code={mcpOneClickTerminalMac}
                      helperText="Run this in your Mac/Linux terminal, then restart or reload Antigravity so StitchMCP appears in your tools list."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ===============================================================
                STEP 2: PRODUCT THINKING & LIVE DEMO OF PULSEDAILY AI
               =============================================================== */}
            {currentStep === 2 && (
              <div className="space-y-6 text-sm text-[#3C4043] leading-relaxed">
                <p>
                  Before writing any prompt, let’s talk about <strong>how to pick a strong use case</strong>. When people first try vibe coding, they often build a toy calculator or a basic to-do list that nobody opens twice.
                </p>
                <p>
                  If you want to think like a <strong>one-person product company</strong>, ask yourself four simple questions before you build:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-4 rounded-lg bg-[#F8F9FA] border border-[#DADCE0]">
                    <div className="text-xs font-bold text-[#1A73E8] uppercase mb-1">
                      1. Is it a daily habit?
                    </div>
                    <p className="text-xs text-[#3C4043]">
                      AI & tech news changes every single day. Working professionals need a 2-minute morning briefing they can trust before starting work.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-[#F8F9FA] border border-[#DADCE0]">
                    <div className="text-xs font-bold text-[#1A73E8] uppercase mb-1">
                      2. Does it use live data right away?
                    </div>
                    <p className="text-xs text-[#3C4043]">
                      By connecting the free <strong>HackerNews Public API</strong>, our app shows real stories the second it loads—no API key setup required.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-[#F8F9FA] border border-[#DADCE0]">
                    <div className="text-xs font-bold text-[#1A73E8] uppercase mb-1">
                      3. Where does Gemini add real value?
                    </div>
                    <p className="text-xs text-[#3C4043]">
                      Anyone can list headlines. Gemini adds value by explaining <strong>"Why this matters for your role"</strong> (Engineer vs. PM vs. Founder).
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-[#F8F9FA] border border-[#DADCE0]">
                    <div className="text-xs font-bold text-[#1A73E8] uppercase mb-1">
                      4. What makes it feel like a real product?
                    </div>
                    <p className="text-xs text-[#3C4043]">
                      Adding <strong>Google SSO sign-in</strong> (to save bookmarks and role preferences) and <strong>Breaking News notifications</strong> turns a demo into a product.
                    </p>
                  </div>
                </div>

                <h2 className="text-lg font-display font-bold text-[#202124] pt-2">
                  Try the finished app right here: PulseDaily AI
                </h2>
                <p className="text-xs text-[#5F6368]">
                  Test the interactive preview below! Try switching the <strong>Role dropdown</strong> (watch how the blue Gemini impact box changes), click <strong>Trigger Breaking Alert + AI Brief</strong>, or test the <strong>Google SSO</strong> and <strong>Listen to Daily Brief</strong> buttons:
                </p>

                <PulseDailyLiveCompanion />
              </div>
            )}

            {/* ===============================================================
                STEP 3: HIRE YOUR AI TEAM — PERSONA SKILLS & MEMORY
               =============================================================== */}
            {currentStep === 3 && (
              <div className="space-y-6 text-sm text-[#3C4043] leading-relaxed">
                <p>
                  If you ask an AI coding tool to <em>&ldquo;build a news app with SSO and notifications&rdquo;</em> in one giant prompt, it usually mixes everything together and cuts corners on the UI or error handling.
                </p>
                <p>
                  In <strong>Google Antigravity</strong>, we solve this by splitting responsibilities into <strong>4 Specialist Persona Skills</strong> (stored in <code>.agents/skills/*/SKILL.md</code>) and a shared <strong>Lead Orchestrator &amp; Company Memory file</strong> (<code>GEMINI.md</code>).
                </p>

                <div className="p-4 rounded-r-md g-callout-info text-xs space-y-2 leading-relaxed">
                  <div className="font-bold text-[#202124]">
                    Where do <code>GEMINI.md</code> and <code>SKILL.md</code> live, and how does Antigravity load them?
                  </div>
                  <p>
                    Unlike <code>mcp_config.json</code> (which lives in your computer&apos;s home folder), <strong>your Orchestrator and Persona files live right inside your project folder</strong>:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-[#3C4043]">
                    <li>
                      <strong><code>GEMINI.md</code> (Always-On Orchestrator &amp; Company Memory):</strong> Sits at the very top of your project folder. Antigravity reads it automatically on every turn so it always knows your product vision and the exact sequence to run your 4 specialists.
                    </li>
                    <li>
                      <strong><code>.agents/skills/&lt;role&gt;/SKILL.md</code> (On-Demand Specialist Personas):</strong> Each <code>SKILL.md</code> starts with a short <code>name</code> and <code>description</code> header. Antigravity uses <strong>Progressive Disclosure</strong>—it keeps only those 2 header lines in memory at first, and loads the full specialist playbook only when that role is called!
                    </li>
                  </ul>
                </div>

                <CodeBlock
                  title="Project Folder Structure — Where Orchestrator & Persona Files Live"
                  language="text"
                  code={workspaceFolderTree}
                  helperText="Both GEMINI.md and the .agents/skills/ folder sit inside your project workspace."
                />

                <h2 className="text-lg font-display font-bold text-[#202124] pt-2">
                  1. Inspect the 4 Persona Skills (<code>.agents/skills/*/SKILL.md</code>)
                </h2>
                <p className="text-xs text-[#5F6368]">
                  Click through each specialist tab below to see how we define our Product Strategist, UI Designer, Full-Stack Architect, and QA Guard:
                </p>

                {/* Clean Google-style Pill Tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {PERSONA_SKILLS.map((p) => {
                    const active = activePersonaTab === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => setActivePersonaTab(p.id)}
                        className={`p-3 rounded-lg border text-left transition ${
                          active
                            ? 'bg-[#E8F0FE] border-[#1A73E8] text-[#174EA6]'
                            : 'bg-white hover:bg-[#F8F9FA] border-[#DADCE0] text-[#3C4043]'
                        }`}
                      >
                        <div className="text-xs font-bold">{p.roleTitle}</div>
                        <div className="text-[10px] font-mono text-[#5F6368] truncate mt-0.5">
                          {p.folderPath}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="p-4 rounded-lg bg-[#F8F9FA] border border-[#DADCE0] text-xs space-y-1">
                  <div className="font-semibold text-[#202124]">
                    {selectedPersona.roleTitle} — <code>{selectedPersona.folderPath}</code>
                  </div>
                  <p className="text-[#3C4043]">{selectedPersona.summary}</p>
                  <p className="text-[#1E8E3E] font-medium">
                    Why this matters: {selectedPersona.whyWeNeedIt}
                  </p>
                </div>

                <CodeBlock
                  title={selectedPersona.folderPath}
                  badge="Antigravity Skill"
                  language="markdown"
                  code={selectedPersona.skillMarkdown}
                  downloadFileName="SKILL.md"
                  helperText="Notice the --- name / description --- header at the top: that is what triggers Progressive Disclosure."
                />

                <h2 className="text-lg font-display font-bold text-[#202124] pt-2">
                  2. Inspect the Lead Orchestrator &amp; Company Memory (<code>GEMINI.md</code>)
                </h2>
                <p className="text-xs text-[#5F6368]">
                  <code>GEMINI.md</code> acts as our company founder and orchestrator—it tells Antigravity what we are building and in what exact order to invoke our 4 Persona Skills:
                </p>

                <CodeBlock
                  title="GEMINI.md — Project Root Memory & Orchestrator Rules"
                  badge="Always-On Memory"
                  language="markdown"
                  code={COMPANY_BRAIN_GEMINI_MD}
                  downloadFileName="GEMINI.md"
                  helperText="Keep GEMINI.md concise (<24KB) and use /compact during long sessions to keep memory fresh."
                />

                <h2 className="text-lg font-display font-bold text-[#202124] pt-4">
                  3. How to add <code>GEMINI.md</code> + all 4 Persona <code>SKILL.md</code> files (Pick any 1 method)
                </h2>
                <p className="text-xs text-[#3C4043]">
                  You do <strong>not</strong> need to manually create 5 folders and copy-paste 5 files one by one! Just like we did for MCP setup in Step 1, pick whichever method below feels easiest for you:
                </p>

                <div className="space-y-4">
                  {/* Method A: Ask the Antigravity Agent in Chat */}
                  <div className="p-4 rounded-lg border border-[#DADCE0] bg-[#F8F9FA] space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-[#1E8E3E] uppercase tracking-wider">
                        Method A (Easiest — Let the Antigravity Agent Create All 5 Files in Chat)
                      </span>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#E6F4EA] text-[#1E8E3E]">
                        Beginner Favorite
                      </span>
                    </div>
                    <p className="text-xs text-[#3C4043]">
                      Open your project folder in <strong>Google Antigravity 2.0</strong>, copy this prompt, and paste it straight into the <strong>Antigravity chat box</strong>. The agent will create <code>GEMINI.md</code> and all 4 <code>.agents/skills/*/SKILL.md</code> folders and files for you automatically:
                    </p>
                    <CodeBlock
                      title="Paste into Antigravity Chat — Auto-Create Orchestrator + 4 Persona Skills"
                      language="markdown"
                      code={personasAndOrchestratorChatPrompt}
                      helperText="Antigravity will write GEMINI.md and all 4 SKILL.md files into your workspace in seconds."
                    />
                  </div>

                  {/* Method B: Inside Antigravity UI */}
                  <div className="p-4 rounded-lg border border-[#DADCE0] bg-[#F8F9FA] space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-[#1A73E8] uppercase tracking-wider">
                        Method B (Visual UI — Inside Antigravity&apos;s Customizations Panel)
                      </span>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#E8F0FE] text-[#1A73E8]">
                        No Terminal Needed
                      </span>
                    </div>
                    <ol className="list-decimal pl-5 text-xs text-[#3C4043] space-y-1">
                      <li>
                        In <strong>Google Antigravity 2.0</strong>, click <strong>Skills &amp; Customizations</strong> in the left sidebar (or open the <code>...</code> menu at the top right).
                      </li>
                      <li>
                        Under <strong>Rules / Memory</strong>, click <strong>+ Add Workspace Rule (<code>GEMINI.md</code>)</strong> and paste the <code>GEMINI.md</code> content above.
                      </li>
                      <li>
                        Under <strong>Skills</strong>, click <strong>+ New Workspace Skill</strong> for each persona (e.g., <code>pm-product-strategist</code>, <code>ux-stitch-designer</code>, <code>fullstack-architect</code>, <code>qa-production-guard</code>) and paste its <code>SKILL.md</code> content.
                      </li>
                    </ol>
                  </div>

                  {/* Method C: 1-Command Terminal Script */}
                  <div className="p-4 rounded-lg border border-[#DADCE0] bg-[#F8F9FA] space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-[#5F6368] uppercase tracking-wider">
                        Method C (1-Command Terminal Script — Creates All 5 Files Instantly)
                      </span>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#E8EAED] text-[#3C4043]">
                        1-Second Setup
                      </span>
                    </div>
                    <p className="text-xs text-[#3C4043]">
                      Want to create every folder, all 4 <code>SKILL.md</code> files, and <code>GEMINI.md</code> with a single copy-paste in your terminal? Run this inside your project folder:
                    </p>
                    <CodeBlock
                      title="Terminal — Create GEMINI.md + All 4 Persona SKILL.md Files in One Command"
                      language="bash"
                      code={personasAndOrchestratorOneClickTerminal}
                      helperText="Creates .agents/skills/*, writes all 4 Persona SKILL.md files, and writes GEMINI.md in 1 second."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ===============================================================
                STEP 4: UI DESIGN WITH GOOGLE STITCH & STITCH MCP
               =============================================================== */}
            {currentStep === 4 && (
              <div className="space-y-6 text-sm text-[#3C4043] leading-relaxed">
                <p>
                  Here is one of the best tricks to share in your workshop: <strong>you don't need to be a trained UI designer to get a world-class look in Google Stitch.</strong> Instead of guessing hex codes or layouts from scratch, tell Stitch to use a <strong>website you already love as a reference</strong> (like <code>news.google.com</code>, <code>linear.app</code>, or <code>airbnb.com</code>) or drop a screenshot of that site right into the prompt!
                </p>

                <div className="p-4 rounded-r-md g-callout-info text-xs leading-relaxed">
                  <strong>Reference-Driven Design with Google Stitch:</strong> For our Daily AI News Companion, we want it to feel immediately familiar and trustworthy—just like an official Google app. So we instruct Stitch to use <strong>Google News (`news.google.com` Material Design 3)</strong> as its exact reference!
                </div>

                <h2 className="text-lg font-display font-bold text-[#202124]">
                  How to write a "Reference-Driven" Stitch prompt (3 steps)
                </h2>
                <ul className="list-disc list-inside text-xs text-[#3C4043] space-y-1.5">
                  <li>
                    <strong>1. Name your reference website upfront:</strong> Start with <em>"Use news.google.com (Google News Material Design 3 Web App) as our exact visual reference!"</em> (or attach a screenshot of your favorite site).
                  </li>
                  <li>
                    <strong>2. Call out the signature UI patterns you want to borrow:</strong> For Google News, that means the centered pill search bar (<code>#F1F3F4</code>), the horizontal tab bar with the <code>3px</code> blue bottom indicator, the <em>"Your briefing"</em> greeting header, and the <code>16px</code> rounded white story containers with <em>"Full coverage"</em> pills.
                  </li>
                  <li>
                    <strong>3. Layer in your custom AI features:</strong> Tell Stitch where to place our <strong>Role Lens chip</strong>, our <strong>Google SSO profile avatar</strong>, and the <strong>Breaking Alert Radar</strong> sidebar.
                  </li>
                </ul>

                <CodeBlock
                  title="Option A: Reference-Driven Prompt for stitch.withgoogle.com"
                  badge="Reference: news.google.com"
                  language="prompt"
                  code={STITCH_PRODUCTION_PROMPT}
                  launchUrl={{ label: 'Google Stitch', url: 'https://stitch.withgoogle.com' }}
                  helperText="Click 'Copy & Open Google Stitch' (you can also paste a screenshot of any website you like into Stitch!)."
                />

                <h2 className="text-lg font-display font-bold text-[#202124] pt-2">
                  Option B: Generate & sync the Google News design from Antigravity via `StitchMCP`
                </h2>
                <p className="text-xs text-[#5F6368]">
                  You can also run this prompt inside Antigravity 2.0 so your <strong>UX Stitch Designer Skill</strong> calls <code>StitchMCP</code> to generate the Google News-styled screen and extract the Material Design 3 tokens directly into your code:
                </p>

                <CodeBlock
                  title="Antigravity Prompt — Trigger StitchMCP with Reference Website"
                  badge="StitchMCP"
                  language="prompt"
                  code={ANTIGRAVITY_STITCH_MCP_PROMPT}
                  helperText="Paste this into Antigravity 2.0 to let your agent call generate_screen_from_text and get_screen."
                />

                {/* Live StitchMCP Generated Screen & Design System Preview */}
                <div className="mt-6 p-4 rounded-lg bg-[#F8F9FA] border border-[#DADCE0] space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#E6F4EA] text-[#1E8E3E] border border-[#CEEAD6]">
                        ✓ Generated Live via StitchMCP (Reference: news.google.com)
                      </span>
                      <h3 className="text-sm font-display font-bold text-[#202124] mt-1">
                        Google News Material Design 3 Screen (`screens/7fbc7f6de1ff40408f62405ddfb7ffb1`)
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-1.5 text-[11px] font-mono">
                      <span className="px-2 py-0.5 rounded bg-white border border-[#DADCE0]">
                        Search Pill: #F1F3F4
                      </span>
                      <span className="px-2 py-0.5 rounded bg-white border border-[#DADCE0]">
                        Cards: 16px Radius
                      </span>
                      <span className="px-2 py-0.5 rounded bg-white border border-[#DADCE0]">
                        Primary: #1A73E8
                      </span>
                      <span className="px-2 py-0.5 rounded bg-white border border-[#DADCE0]">
                        Tonal Box: #E8F0FE
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-[#5F6368]">
                    Look how closely Google Stitch matched the real <code>news.google.com</code> layout when we gave it a clear reference website:
                  </p>
                  <div className="rounded-lg overflow-hidden border border-[#DADCE0] bg-white max-h-[540px] overflow-y-auto">
                    <img
                      src="https://lh3.googleusercontent.com/aida/AEtjO1XvDruVkwu2sKnUYnqYZQJr5PnbaE1Wqd-RySXOaJ6Cufm10SvAMj3aYBBc0Z8wK4AlO_Odyfwdd3RDdvm0Qex-0cWlYGLErbfvfs8ZEDbxDIiINRj8vpM9w9iH2ub0aFj8tmtUG008f5_HJNbAbBRClK1CrjCdh5lYWT2spbF3JSD1e5D6MaYJ57nZmtO4G59MYyOIoOjTd3CZZPiZU7S7YDkS_vMuwhhBvh9pxSheydOxNoxIDhXkJsY"
                      alt="Google PulseDaily Material Design 3 Screen Generated by Google Stitch MCP"
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>

                {/* Clear Next Steps After Seeing the Design in Google Stitch */}
                <h2 className="text-lg font-display font-bold text-[#202124] pt-4">
                  What is the next step once your design is ready in Google Stitch?
                </h2>
                <p className="text-xs text-[#3C4043] leading-relaxed">
                  Once you can see your generated screen inside Google Stitch (for example, at{' '}
                  <a
                    href="https://stitch.withgoogle.com/projects/15737669260440006801"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#1A73E8] font-medium hover:underline"
                  >
                    stitch.withgoogle.com/projects/15737669260440006801
                  </a>
                  ), here is how you turn that static design into a real, working application:
                </p>

                <div className="space-y-3">
                  <div className="p-4 rounded-lg border border-[#DADCE0] bg-[#F8F9FA] space-y-2">
                    <div className="text-xs font-bold text-[#1A73E8] uppercase tracking-wider">
                      Next Step 1 (Optional in Stitch): Inspect Code or Generate Variants
                    </div>
                    <p className="text-xs text-[#3C4043]">
                      Inside the Google Stitch canvas, click on the generated screen to <strong>inspect the generated HTML/CSS code</strong>, export to Figma, or ask Stitch to tweak any visual detail before writing application logic.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg border border-[#DADCE0] bg-[#F8F9FA] space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-[#1E8E3E] uppercase tracking-wider">
                        Next Step 2 (Move to Step 5): Tell Antigravity to Pull Your Stitch Screen via StitchMCP &amp; Build the App
                      </span>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#E6F4EA] text-[#1E8E3E]">
                        Recommended Workflow
                      </span>
                    </div>
                    <p className="text-xs text-[#3C4043]">
                      Because Antigravity is connected to <code>StitchMCP</code>, you don&apos;t have to manually copy-paste HTML from the browser! Paste this prompt into <strong>Antigravity 2.0</strong> (or click <strong>Next Step → Step 5</strong> below) so Antigravity fetches your Stitch project directly and wires up the live HackerNews API and Gemini logic:
                    </p>
                    <CodeBlock
                      title="Paste into Antigravity Chat — Turn Stitch Project 15737669260440006801 into Live Code"
                      badge="StitchMCP → Code"
                      language="prompt"
                      code={`Use StitchMCP (get_project / get_screen) to inspect our generated Google Stitch design in project "15737669260440006801" (screen "7fbc7f6de1ff40408f62405ddfb7ffb1").
Build or refactor our React application to match this exact 4-Zone Google News (news.google.com) Material Design 3 screen 100%:
1. ZERO BLUR & ZERO DUPLICATE FILTERS: Use 100% solid crisp surfaces (#FFFFFF cards on #F8F9FA background, 1px #DADCE0 borders). Never use backdrop-blur or glassmorphism, never wrap text in the top bar (use whitespace-nowrap), and remove any duplicate second filter card below the header!
2. ROW 1 — TOP GOOGLE APP BAR (h-16 bg-white px-6 flex items-center justify-between gap-4):
   - Left: Official 4-color Google dots/G mark + "PulseDaily" (single-line, never stacks or clips).
   - Center: Wide pill search bar (bg-[#F1F3F4] rounded-full px-4 py-2, "Search AI topics, models, or sources...").
   - Right: Compact Role Lens selector pill ("Software Engineer ▾"), Breaking Alert Bell icon button, and Google SSO Profile Avatar chip ("Alex Rivera").
3. ROW 2 — HORIZONTAL GOOGLE NEWS TAB BAR (bg-white border-b border-[#DADCE0] px-6):
   - Centered single-line tabs ("For you", "Following", "Agentic AI", "Cloud & Infra", "Product & Strategy") with a 3px rounded Google Blue (#1A73E8) bottom indicator bar under the active tab.
4. ZONE 3 — "YOUR BRIEFING" HEADER ROW (max-w-6xl mx-auto px-6 pt-6 pb-4 flex items-end justify-between):
   - Left: Large "Your briefing" title (28px bold #202124) + current date & green "● Live HackerNews API Active" badge.
   - Right: "Refresh Feed" pill button + Google Blue pill button "🔊 Listen to Daily Brief (60s)".
5. ZONE 4 — 12-COLUMN GOOGLE NEWS GRID (max-w-6xl mx-auto px-6 pb-12 grid grid-cols-12 gap-6):
   - Left 8 Columns: Single white 16px rounded container ("Top stories") with divide-y divide-[#E8EAED] rows, publisher domain badge + green "✓ Grounded" pill, bold headline, 3-bullet Gemini TL;DR, soft blue #E8F0FE tonal box ("✨ Why this matters for you"), and "Save for later" + "Full coverage ↗" pills.
   - Right 4 Columns: Clean white 16px rounded sidebar cards for "Breaking Alert Radar", "60-Second Executive Audio Brief", and "Saved Reading List".`}
                      helperText="Antigravity will read the Stitch screen directly via MCP and build the exact crisp 4-Zone Google News UI!"
                    />
                  </div>

                  <div className="p-4 rounded-lg border border-[#DADCE0] bg-[#F8F9FA] space-y-2">
                    <div className="text-xs font-bold text-[#5F6368] uppercase tracking-wider">
                      Next Step 3 (Move to Step 6 &amp; Step 7): Host in Google AI Studio, Add SSO + Alerts &amp; Deploy to Cloud Run
                    </div>
                    <p className="text-xs text-[#3C4043]">
                      After building the core app in <strong>Step 5</strong>, move to <strong>Step 6</strong> to open the app inside <strong>Google AI Studio (<code>ai.studio/build</code>)</strong>, layer on <strong>Google SSO Sign-In</strong> and <strong>Breaking News Push Notifications</strong>, and finally click <strong>Publish</strong> in <strong>Step 7</strong> to deploy it live on <strong>Google Cloud Run</strong>!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ===============================================================
                STEP 5: ORCHESTRATE THE CORE BUILD IN ANTIGRAVITY & VERIFY LOCALLY
               =============================================================== */}
            {currentStep === 5 && (
              <div className="space-y-6 text-sm text-[#3C4043] leading-relaxed">
                <p>
                  Now we bring our <strong>Product Strategist</strong>, <strong>UX Designer</strong>, <strong>Full-Stack Architect</strong>, and <strong>QA Guard</strong> together—and then <strong>run and verify the entire application locally on your laptop</strong> before moving to Google AI Studio.
                </p>

                <h2 className="text-lg font-display font-bold text-[#202124]">
                  1. Trigger the `/plan` Master Orchestrator in Antigravity
                </h2>
                <p className="text-xs text-[#5F6368]">
                  By starting our prompt with <code>/plan</code> in Antigravity 2.0, the Lead Orchestrator reads <code>GEMINI.md</code>, consults each of the 4 <code>SKILL.md</code> files in order, and presents a step-by-step <strong>Implementation Plan Artifact</strong> before writing the code:
                </p>

                <div className="p-4 rounded-r-md g-callout-success text-xs leading-relaxed">
                  <strong>Why we build incrementally (like a real company):</strong> First, we get the core live news feed, role-based Gemini summaries (using a strict <code>Type.OBJECT</code> <code>responseSchema</code>), and audio briefing working cleanly on your laptop. Then, once you verify it works locally, we will move it into Google AI Studio in Step 6!
                </div>

                <CodeBlock
                  title="Master Orchestrator Prompt — Paste in Antigravity 2.0"
                  badge="/plan Workflow"
                  language="prompt"
                  code={ANTIGRAVITY_ORCHESTRATOR_PROMPT}
                  helperText="Review the Implementation Plan Artifact that Antigravity creates, click 'Proceed', and watch it build PulseDaily AI."
                />

                <h2 className="text-lg font-display font-bold text-[#202124] pt-4">
                  2. How to run &amp; test your app locally (Before moving to AI Studio)
                </h2>
                <p className="text-xs text-[#3C4043] leading-relaxed">
                  Once Antigravity finishes writing your code in <code>pulsedaily-ai</code>, let&apos;s boot up the local server and test the whole app in your browser! Pick either method below:
                </p>

                <div className="space-y-4">
                  {/* Option A: Ask Antigravity in Chat to Start Local Server */}
                  <div className="p-4 rounded-lg border border-[#DADCE0] bg-[#F8F9FA] space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-[#1E8E3E] uppercase tracking-wider">
                        Method A (Easiest — Ask Antigravity in Chat to Build &amp; Start the Local Server)
                      </span>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#E6F4EA] text-[#1E8E3E]">
                        Zero Terminal Typing
                      </span>
                    </div>
                    <p className="text-xs text-[#3C4043]">
                      Paste this prompt into the <strong>Antigravity chat box</strong>. The agent will install any missing packages, verify there are zero TypeScript errors, start <code>npm run dev</code> in the background, and give you a clickable <code>http://localhost:5173</code> link:
                    </p>
                    <CodeBlock
                      title="Paste into Antigravity Chat — Install, Verify & Launch Local Dev Server"
                      language="prompt"
                      code={localRunChatPrompt}
                      helperText="Note: If npm install needs network access inside Antigravity's sandbox, click 'Allow / Approve' when prompted."
                    />
                  </div>

                  {/* Option B: Run Terminal Commands Yourself */}
                  <div className="p-4 rounded-lg border border-[#DADCE0] bg-[#F8F9FA] space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-[#1A73E8] uppercase tracking-wider">
                        Method B (Manual Terminal — Run npm install &amp; npm run dev Yourself)
                      </span>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#E8F0FE] text-[#1A73E8]">
                        Standard Local Dev
                      </span>
                    </div>
                    <p className="text-xs text-[#3C4043]">
                      Prefer running the commands yourself? Open your terminal inside <code>~/Documents/pulsedaily-ai</code> and run:
                    </p>
                    <CodeBlock
                      title="Terminal — Install Dependencies & Start Local Server (localhost:5173)"
                      language="bash"
                      code={localRunTerminalCmd}
                      launchUrl={{ label: 'Get Free Gemini Key', url: 'https://aistudio.google.com/apikey' }}
                      helperText="Once Vite prints 'Local: http://localhost:5173/', open that URL in Chrome!"
                    />
                  </div>
                </div>

                <h2 className="text-lg font-display font-bold text-[#202124] pt-2">
                  3. Local Verification Checklist (Test at <code>http://localhost:5173</code>)
                </h2>
                <p className="text-xs text-[#5F6368]">
                  Open <code>http://localhost:5173</code> in your browser and check off these 4 items before moving to Step 6:
                </p>

                <div className="space-y-2.5">
                  {[
                    {
                      id: 'loc_1',
                      title: '1. Verify the Google News (news.google.com) Material Design 3 UI loads cleanly',
                      desc: 'Check that the top Google PulseDaily header, centered #F1F3F4 search pill, horizontal topic tabs ("For you", "Agentic AI", "Cloud & Infra"), and "Your briefing" header appear.'
                    },
                    {
                      id: 'loc_2',
                      title: '2. Test the Live HackerNews Public API Feed & Search Bar',
                      desc: 'Confirm real tech & AI stories load immediately, click "Refresh Live Feed", and try typing a keyword (like "Agent" or "Cloud") in the top search bar.'
                    },
                    {
                      id: 'loc_3',
                      title: '3. Test the Role Lens Switcher (Engineer vs. PM vs. Founder)',
                      desc: 'Switch the Role dropdown in the top header and verify the blue "Why this matters for a..." callout box updates inside each story card.'
                    },
                    {
                      id: 'loc_4',
                      title: '4. Test the 2-Minute Audio Morning Briefing (Web Speech TTS)',
                      desc: 'Click "Listen to 2-Min Brief" in the briefing header and confirm your browser reads the top headlines and role impacts aloud.'
                    }
                  ].map((item) => {
                    const done = !!checkedTasks[item.id];
                    return (
                      <div
                        key={item.id}
                        onClick={() => toggleTask(item.id)}
                        className={`p-3.5 rounded-lg border cursor-pointer transition flex items-start gap-3 ${
                          done
                            ? 'bg-[#E6F4EA]/50 border-[#CEEAD6]'
                            : 'bg-white hover:bg-[#F8F9FA] border-[#DADCE0]'
                        }`}
                      >
                        <div className="mt-0.5">
                          {done ? (
                            <CheckSquare className="w-4 h-4 text-[#1E8E3E]" />
                          ) : (
                            <Square className="w-4 h-4 text-[#5F6368]" />
                          )}
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-[#202124]">{item.title}</div>
                          <div className="text-xs text-[#5F6368] mt-0.5">{item.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ===============================================================
                STEP 6: HOST IN AI STUDIO + ADD GOOGLE SSO & BREAKING ALERTS
               =============================================================== */}
            {currentStep === 6 && (
              <div className="space-y-6 text-sm text-[#3C4043] leading-relaxed">
                <p>
                  Now let’s move into <strong>Google AI Studio Build Mode (<code>ai.studio/build</code>)</strong>. AI Studio gives you an instant browser-hosted preview with the Gemini API pre-configured, visual screen annotation tools, and 1-click Cloud Run deployment.
                </p>

                <div className="p-4 rounded-r-md g-callout-info text-xs space-y-1.5 leading-relaxed">
                  <div className="font-bold text-[#202124]">
                    &ldquo;Why are there so many files in my <code>pulsedaily-ai</code> folder, and why doesn&apos;t AI Studio accept folder uploads?&rdquo;
                  </div>
                  <p>
                    When Antigravity builds a local React project, your folder contains <code>node_modules/</code> (thousands of library files), <code>dist/</code>, <code>.agents/</code>, <code>package-lock.json</code>, and multiple files inside <code>src/</code>.
                  </p>
                  <p>
                    <strong>You NEVER need to upload <code>node_modules</code> or config files to AI Studio!</strong> Google AI Studio already runs a pre-configured React + TypeScript + Tailwind + <code>@google/genai</code> container in the cloud. You only need to bring over your <code>src/</code> code—and you don&apos;t have to copy files one by one! Pick any of the <strong>3 easy methods below</strong>:
                  </p>
                </div>

                <h2 className="text-lg font-display font-bold text-[#202124]">
                  1. Move your app into Google AI Studio (Pick any 1 method)
                </h2>

                <div className="space-y-4">
                  {/* Method A: 1-Command Clipboard Bundler */}
                  <div className="p-4 rounded-lg border border-[#DADCE0] bg-[#F8F9FA] space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-[#1E8E3E] uppercase tracking-wider">
                        Method A (Fastest for Local Projects — 1-Command Clipboard Bundler)
                      </span>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#E6F4EA] text-[#1E8E3E]">
                        Copies All src/ Files at Once
                      </span>
                    </div>
                    <p className="text-xs text-[#3C4043]">
                      Run this single command in your terminal inside <code>pulsedaily-ai</code>. It automatically skips <code>node_modules</code> and <code>dist</code>, bundles every file inside your <code>src/</code> folder into one prompt, and copies it straight to your clipboard:
                    </p>
                    <CodeBlock
                      title="Terminal — Bundle All src/ Files to Clipboard in 1 Second (Mac)"
                      language="bash"
                      code={aiStudioClipboardBundlerCmd}
                      launchUrl={{ label: 'AI Studio', url: 'https://ai.studio/build' }}
                      helperText="After running this command, just open ai.studio/build, press Cmd+V in the prompt box, and hit Enter! AI Studio will recreate all your files automatically."
                    />
                  </div>

                  {/* Method B: Ask Antigravity to Merge into 1 Single App.tsx */}
                  <div className="p-4 rounded-lg border border-[#DADCE0] bg-[#F8F9FA] space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-[#1A73E8] uppercase tracking-wider">
                        Method B (Ask Antigravity to Merge Everything into 1 File)
                      </span>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#E8F0FE] text-[#1A73E8]">
                        Single-File Paste
                      </span>
                    </div>
                    <p className="text-xs text-[#3C4043]">
                      Don&apos;t want multiple files at all? Paste this into the <strong>Antigravity chat box</strong> and let the agent combine all your components into one single <code>src/App.tsx</code> file so you only have 1 file to copy:
                    </p>
                    <CodeBlock
                      title="Paste into Antigravity Chat — Merge Project into a Single File for AI Studio"
                      language="prompt"
                      code={antigravitySingleFileBundlePrompt}
                      helperText="Antigravity will combine all components into one self-contained App.tsx file."
                    />
                  </div>

                  {/* Method C: Pre-Built 1-Click Prompt */}
                  <div className="p-4 rounded-lg border border-[#DADCE0] bg-[#F8F9FA] space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-[#5F6368] uppercase tracking-wider">
                        Method C (Zero-Wait Workshop Shortcut — 1-Click AI Studio Prompt)
                      </span>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#E8EAED] text-[#3C4043]">
                        Instant Start
                      </span>
                    </div>
                    <p className="text-xs text-[#3C4043]">
                      Or simply click <strong>Copy &amp; Open AI Studio</strong> below to paste our ready-made specification directly into <code>ai.studio/build</code>:
                    </p>
                    <CodeBlock
                      title="Step 6A: Base App Prompt for Google AI Studio (ai.studio/build)"
                      badge="ai.studio/build"
                      language="prompt"
                      code={AI_STUDIO_BASE_APP_PROMPT}
                      launchUrl={{ label: 'AI Studio', url: 'https://ai.studio/build' }}
                      helperText="Generates the live HackerNews + Gemini Role-Impact companion inside AI Studio."
                    />
                  </div>
                </div>

                <h2 className="text-lg font-display font-bold text-[#202124] pt-2">
                  2. Add &ldquo;Sign in with Google&rdquo; (Gmail Login) + Post-Login Persona Selection &amp; Breaking Alerts
                </h2>
                <p className="text-xs text-[#5F6368]">
                  Once your app is running in the AI Studio preview window, paste this upgrade prompt into the AI Studio chat box. It adds a <strong>2-step &ldquo;Sign in with Google&rdquo; flow</strong> where users log in with their own <strong>Gmail account (<code>@gmail.com</code>)</strong>, immediately <strong>choose their relevant Professional Persona</strong> (<em>Founder / Exec</em>, <em>Software Engineer</em>, or <em>Product Manager</em>), and receive personalized Gemini impact summaries and Breaking News alerts:
                </p>

                <CodeBlock
                  title="Step 6B: Feature Upgrade Prompt — Gmail Sign-In + Choose Your Persona + Breaking Alerts"
                  badge="Feature Iteration in AI Studio"
                  language="prompt"
                  code={AI_STUDIO_SSO_AND_ALERTS_UPGRADE_PROMPT}
                  helperText="Paste this in the bottom-left chat box in AI Studio (or use the Annotate App paintbrush button!)."
                />

                <div className="p-4 rounded-r-md g-callout-info text-xs leading-relaxed">
                  <strong>How the 2-Step Gmail Sign-In &amp; Persona Selection Works:</strong>
                  <ol className="list-decimal pl-5 mt-1 space-y-1">
                    <li>
                      <strong>Step 1 (Sign in with Google / Gmail):</strong> Users click <strong>&ldquo;Sign in with Google&rdquo;</strong> in the top-right bar and sign in with their own <code>@gmail.com</code> account (supports both Google Identity Services <code>accounts.google.com/gsi/client</code> OAuth and direct Gmail entry inside AI Studio&apos;s preview iframe).
                    </li>
                    <li>
                      <strong>Step 2 (Choose Your Professional Persona):</strong> Right after signing in, an onboarding modal asks them to pick the role most relevant to them—<strong>🚀 Founder / Exec</strong>, <strong>💻 Software Engineer</strong>, or <strong>🧭 Product Manager</strong>—and dynamically tailors every story&apos;s <em>&ldquo;Why this matters for you&rdquo;</em> box!
                    </li>
                  </ol>
                </div>
              </div>
            )}

            {/* ===============================================================
                STEP 7: DEPLOY TO CLOUD RUN & SIGN IN WITH YOUR GMAIL + PERSONA
               =============================================================== */}
            {currentStep === 7 && (
              <div className="space-y-6 text-sm text-[#3C4043] leading-relaxed">
                <p>
                  Our Daily AI News Companion now has live public API feeds, Gemini role-based impact summaries, <strong>Sign in with Google + Persona Selection</strong>, and breaking news notifications. In this final step, we deploy it live to <strong>Google Cloud Run</strong> and test signing in with your own <strong>Gmail account</strong> and choosing your persona!
                </p>

                <div className="p-4 rounded-r-md g-callout-info text-xs leading-relaxed">
                  <strong>How the Google Cloud Starter Tier works (Slide 31):</strong> Directly inside Google AI Studio Build Mode, you can publish up to <strong>2 full-stack applications</strong> to <strong>Google Cloud Run</strong> without setting up a Google Cloud project or entering a billing card.
                </div>

                <h2 className="text-lg font-display font-bold text-[#202124] pt-2">
                  Checklist: Publish to Cloud Run, Sign In with Your Gmail &amp; Pick Your Persona
                </h2>

                <div className="space-y-2.5">
                  {[
                    {
                      id: 'pub_1',
                      title: '1. Click "Publish" in the top-right corner of Google AI Studio',
                      desc: 'Look at the top bar next to Remix and Share (Slide 26) and click Publish.'
                    },
                    {
                      id: 'pub_2',
                      title: '2. Choose "Google Cloud Starter Tier" (Zero billing required)',
                      desc: 'AI Studio automatically packages your application and deploys it to a managed Google Cloud Run service in ~60 seconds.'
                    },
                    {
                      id: 'pub_3',
                      title: '3. Open your live `.run.app` URL and click "Sign in with Google"',
                      desc: 'Log in using your own personal Gmail account (@gmail.com) in the top-right Google App Bar.'
                    },
                    {
                      id: 'pub_4',
                      title: '4. Choose your relevant Persona (Founder, Software Engineer, or Product Manager)',
                      desc: 'In Step 2 of the sign-in modal, select the persona most relevant to you and watch Gemini immediately tailor every story card and breaking news alert to your Gmail profile and role!'
                    }
                  ].map((item) => {
                    const done = !!checkedTasks[item.id];
                    return (
                      <div
                        key={item.id}
                        onClick={() => toggleTask(item.id)}
                        className={`p-3.5 rounded-lg border cursor-pointer transition flex items-start gap-3 ${
                          done
                            ? 'bg-[#E6F4EA]/50 border-[#CEEAD6]'
                            : 'bg-white hover:bg-[#F8F9FA] border-[#DADCE0]'
                        }`}
                      >
                        <div className="mt-0.5">
                          {done ? (
                            <CheckSquare className="w-4 h-4 text-[#1E8E3E]" />
                          ) : (
                            <Square className="w-4 h-4 text-[#5F6368]" />
                          )}
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-[#202124]">
                            {item.title}
                          </div>
                          <div className="text-xs text-[#5F6368] mt-0.5">{item.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 p-6 rounded-lg bg-[#E8F0FE] border border-[#D2E3FC] flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-bold uppercase text-[#1A73E8] mb-1">
                      Codelab Complete • #BuildwithGoogleAI
                    </div>
                    <h3 className="text-lg font-display font-bold text-[#174EA6]">
                      You just built & shipped PulseDaily AI like a One-Person Company!
                    </h3>
                    <p className="text-xs text-[#174EA6]/90 mt-1 max-w-xl">
                      You went from product ideation and Antigravity Persona Skills to Google Stitch MCP design, AI Studio SSO & Breaking Alert upgrades, and a live Google Cloud Run deployment.
                    </p>
                  </div>
                  <a
                    href="https://g.dev/ai/build"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded bg-[#1A73E8] hover:bg-[#1765CC] text-white text-xs font-medium inline-flex items-center gap-1.5 shrink-0"
                  >
                    <span>Explore g.dev/ai/build</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}

            {/* Official Google Codelabs Bottom Step Navigation */}
            <div className="mt-10 pt-5 border-t border-[#DADCE0] flex items-center justify-between">
              <button
                onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
                disabled={currentStep === 1}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded text-xs font-medium border transition ${
                  currentStep === 1
                    ? 'opacity-40 cursor-not-allowed bg-[#F1F3F4] text-[#5F6368] border-[#DADCE0]'
                    : 'bg-white hover:bg-[#F8F9FA] text-[#1A73E8] border-[#DADCE0]'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <span className="text-xs text-[#5F6368]">
                Step {currentStep} of {CODELAB_STEPS.length}
              </span>

              {currentStep < CODELAB_STEPS.length ? (
                <button
                  onClick={handleNextStep}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded text-xs font-medium bg-[#1A73E8] hover:bg-[#1765CC] text-white shadow-sm transition"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (!completedSteps.includes(currentStep)) {
                      setCompletedSteps([...completedSteps, currentStep]);
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded text-xs font-medium bg-[#1E8E3E] hover:bg-[#137333] text-white shadow-sm transition"
                >
                  <Check className="w-4 h-4" />
                  <span>Done</span>
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
