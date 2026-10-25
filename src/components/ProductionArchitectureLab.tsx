import React, { useState } from 'react';
import { CodeBlock } from './CodeBlock';
import {
  ShieldCheck,
  AlertOctagon,
  Server,
  KeyRound,
  FileJson,
  Activity,
  CheckCircle2,
  ArrowRight,
  Lock
} from 'lucide-react';

interface ProductionArchitectureLabProps {
  activeAppName: string;
  backendSchemaSnippet: string;
}

export const ProductionArchitectureLab: React.FC<ProductionArchitectureLabProps> = ({
  activeAppName,
  backendSchemaSnippet
}) => {
  const [archMode, setArchMode] = useState<'prototype' | 'production'>('production');
  const [selectedPillar, setSelectedPillar] = useState<'security' | 'schema' | 'grounding' | 'cloudrun'>('security');

  const prototypeWeaknesses = [
    {
      label: 'Client-Side API Key Leak',
      detail: 'VITE_GEMINI_API_KEY is bundled into public browser JavaScript—anyone opening DevTools Network tab can steal your quota!'
    },
    {
      label: 'Unstructured Free-Text LLM Output',
      detail: 'Asking Gemini for "JSON" in plain text occasionally returns markdown fences or missing fields, crashing React .map() renders.'
    },
    {
      label: 'Zero Health Probes or Rate Limiting',
      detail: 'Running `vite` dev server directly in production lacks `/api/health` readiness checks and static asset caching.'
    }
  ];

  const productionStrengths = [
    {
      label: 'Server-Side Secret Isolation (Express Proxy)',
      detail: 'Browser calls `/api/gemini` on the same origin. `GEMINI_API_KEY` lives exclusively in Cloud Run environment variables.'
    },
    {
      label: 'Deterministic Type.OBJECT responseSchema',
      detail: 'Enforces strict schema validation inside the `@google/genai` decoding step—guaranteeing 100% type-safe JSON.'
    },
    {
      label: 'Single-Container Cloud Run Architecture (PORT 8080)',
      detail: 'Multi-stage Node 22 Alpine Docker image serves compiled `dist/` assets + `/api/*` routes + `/api/health` probe with `--min-instances 0`.'
    }
  ];

  const pillarDetails = {
    security: {
      title: 'Pillar 1: Zero Client-Side API Keys (Frontend → Express Backend Proxy)',
      problem: 'In a quick prototype, calling `@google/genai` directly from React (`src/App.tsx`) exposes your API key in the browser bundle.',
      solution: 'Move the `@google/genai` initialization to `server.js` and call `/api/gemini` via `fetch()` from your React frontend.',
      beforeCode: `// ❌ PROTOTYPE ANTI-PATTERN (Do NOT ship this to production!)
// Inside src/App.tsx (Browser Client Bundle):
import { GoogleGenAI } from '@google/genai';

// DANGER: Key is visible to anyone inspecting browser network/sources!
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
const response = await ai.models.generateContent({
  model: 'gemini-2.5-flash',
  contents: userPrompt,
});`,
      afterCode: `// ✅ PRODUCTION PATTERN: Frontend calls local Express route (/api/gemini)
// Inside src/App.tsx (Browser Client):
const response = await fetch('/api/gemini', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ prompt: userPrompt, imageBase64 }),
});
if (!response.ok) throw new Error('Backend AI request failed');
const safeStructuredData = await response.json();`
    },
    schema: {
      title: 'Pillar 2: Anti-Hallucination with Strict `responseSchema` (`Type.OBJECT`)',
      problem: 'Prompting "Please respond only in JSON" still fails ~5% of the time when the model wraps JSON in markdown backticks or renames keys.',
      solution: 'Pass `responseMimeType: "application/json"` and a `responseSchema` using `Type.OBJECT` from `@google/genai`.',
      beforeCode: `// ❌ PROTOTYPE ANTI-PATTERN: Hoping the LLM formats JSON properly
const response = await ai.models.generateContent({
  model: 'gemini-2.5-flash',
  contents: "Analyze this meal and return JSON with calories and protein.",
});
// Crashes with SyntaxError if model adds \`\`\`json or conversational text!
const data = JSON.parse(response.text);`,
      afterCode: `// ✅ PRODUCTION PATTERN: Enforced @google/genai responseSchema
import { GoogleGenAI, Type } from '@google/genai';

${backendSchemaSnippet}

const response = await ai.models.generateContent({
  model: 'gemini-2.5-flash',
  contents: userPrompt,
  config: {
    responseMimeType: 'application/json',
    responseSchema: Object.values({ schema: true })[0] // Uses the strict schema above!
  }
});`
    },
    grounding: {
      title: 'Pillar 3: Grounding & Confidence Thresholds (Slide 3 Builder’s Blueprint)',
      problem: 'Without grounding or confidence indicators, users cannot tell whether an AI insight is high-certainty or a low-confidence guess.',
      solution: 'Enable Google Search Grounding for live facts and include a mandatory `confidence: "HIGH" | "MEDIUM" | "LOW"` enum in your schema + UI fallback boundary.',
      beforeCode: `// ❌ No citation metadata or confidence indicator
<div className="card">
  <h4>{aiResult.title}</h4>
  <p>{aiResult.summary}</p>
</div>`,
      afterCode: `// ✅ PRODUCTION UI: Explicit Confidence Pill + Grounded Citation Link
<div className="p-4 rounded-xl border border-slate-200">
  <div className="flex items-center justify-between">
    <span className="font-bold">{aiResult.dishName || aiResult.title}</span>
    <span className={aiResult.confidence === 'HIGH' ? 'badge-emerald' : 'badge-amber'}>
      Confidence: {aiResult.confidence}
    </span>
  </div>
  {aiResult.confidence === 'LOW' && (
    <p className="text-xs text-amber-700 mt-1">
      ⚠️ Low image clarity detected — please verify portion size manually.
    </p>
  )}
</div>`
    },
    cloudrun: {
      title: 'Pillar 4: Cloud Run Stateless Container & Free-Quota Auto-Scaling',
      problem: 'Hardcoding port 3000 or running `npm run dev` inside Docker causes Cloud Run container startup timeout errors and wastes memory.',
      solution: 'Listen on `process.env.PORT || 8080`, expose `GET /api/health`, build a multi-stage Alpine image, and deploy with `--min-instances 0`.',
      beforeCode: `// ❌ Fails on Google Cloud Run (Hardcoded port & dev server)
app.listen(3000, () => console.log('Running on 3000'));`,
      afterCode: `// ✅ PRODUCTION CLOUD RUN SERVER (server.js)
app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(\`✅ Cloud Run service listening on port \${PORT}\`);
});`
    }
  };

  return (
    <div className="space-y-6">
      {/* Prototype vs Production Interactive Toggle Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              Slide 3: Builder’s Blueprint • Prototype vs. Production
            </span>
            <h2 className="text-lg font-extrabold text-slate-900 mt-1">
              Interactive Architecture Comparison ({activeAppName})
            </h2>
          </div>

          <div className="inline-flex rounded-xl p-1 bg-slate-100 border border-slate-200">
            <button
              onClick={() => setArchMode('prototype')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                archMode === 'prototype'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ⚠️ 15-Min Client Prototype
            </button>
            <button
              onClick={() => setArchMode('production')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                archMode === 'production'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ✅ Production-Grade Cloud Run App
            </button>
          </div>
        </div>

        {/* Visual Architecture Flow Diagram */}
        {archMode === 'prototype' ? (
          <div className="p-5 rounded-xl bg-rose-50/70 border border-rose-200 space-y-4">
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-bold text-rose-950 bg-white p-4 rounded-xl border border-rose-200">
              <span className="px-3 py-1.5 rounded-lg bg-slate-100">User Browser (React UI)</span>
              <ArrowRight className="w-4 h-4 text-rose-500" />
              <span className="px-3 py-1.5 rounded-lg bg-rose-100 border border-rose-300 text-rose-800">
                ❌ Exposes VITE_GEMINI_API_KEY in Client JS
              </span>
              <ArrowRight className="w-4 h-4 text-rose-500" />
              <span className="px-3 py-1.5 rounded-lg bg-amber-100 border border-amber-300 text-amber-900">
                ⚠️ Unvalidated Free-Text JSON
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {prototypeWeaknesses.map((w, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-white border border-rose-200">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700 mb-1">
                    <AlertOctagon className="w-4 h-4 shrink-0" />
                    <span>{w.label}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{w.detail}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-5 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-4">
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-bold text-emerald-950 bg-white p-4 rounded-xl border border-emerald-200">
              <span className="px-3 py-1.5 rounded-lg bg-slate-100">React Static Bundle (dist/)</span>
              <ArrowRight className="w-4 h-4 text-emerald-600" />
              <span className="px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-800">
                POST /api/gemini (Express on PORT 8080)
              </span>
              <ArrowRight className="w-4 h-4 text-emerald-600" />
              <span className="px-3 py-1.5 rounded-lg bg-emerald-100 border border-emerald-300 text-emerald-900">
                🔒 Server Env Key + Type.OBJECT Schema
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {productionStrengths.map((s, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-white border border-emerald-200">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 mb-1">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{s.label}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{s.detail}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 4 Production Engineering Pillars Deep-Dive with Before/After Code */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <h3 className="text-base font-extrabold text-slate-900 mb-2">
          2. Deep-Dive: The 4 Production Engineering Upgrades (Before vs. After)
        </h3>
        <p className="text-xs text-slate-600 mb-4">
          Click each production engineering pillar below to compare the beginner prototype code against the production-grade pattern that Antigravity generates:
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-4">
          {(
            [
              { id: 'security', label: '1. API Key Isolation', icon: KeyRound },
              { id: 'schema', label: '2. JSON Schema Lock', icon: FileJson },
              { id: 'grounding', label: '3. Grounding & UI Guard', icon: ShieldCheck },
              { id: 'cloudrun', label: '4. Cloud Run Port & Probe', icon: Server }
            ] as const
          ).map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedPillar(tab.id)}
                className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition ${
                  selectedPillar === tab.id
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="text-xs font-bold">{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mb-4">
          <div className="text-xs font-extrabold text-slate-900">
            {pillarDetails[selectedPillar].title}
          </div>
          <p className="text-xs text-rose-700 mt-1">
            <strong>Why Prototypes Break:</strong> {pillarDetails[selectedPillar].problem}
          </p>
          <p className="text-xs text-emerald-700 mt-1">
            <strong>Production Fix:</strong> {pillarDetails[selectedPillar].solution}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <CodeBlock
            title="❌ Before: Beginner Prototype Code"
            language="typescript"
            code={pillarDetails[selectedPillar].beforeCode}
          />
          <CodeBlock
            title="✅ After: Production-Grade Code"
            language="typescript"
            code={pillarDetails[selectedPillar].afterCode}
          />
        </div>
      </div>
    </div>
  );
};
