import React, { useState, useEffect, useRef } from 'react';
import { TrackId } from '../data/codelabData';
import {
  Camera,
  Droplets,
  Flame,
  Gamepad2,
  Globe,
  Play,
  Pause,
  SkipForward,
  Sparkles,
  Volume2,
  ShieldCheck,
  CheckCircle2,
  Plus,
  RefreshCw,
  Radio,
  Zap
} from 'lucide-react';

interface LivePreviewModalProps {
  activeTrack: TrackId;
  onSelectTrack: (t: TrackId) => void;
}

export const LiveTrackSimulator: React.FC<LivePreviewModalProps> = ({
  activeTrack,
  onSelectTrack
}) => {
  // --- TRACK A STATE (SnapCalorie & Hydro) ---
  const [waterGlasses, setWaterGlasses] = useState<number>(5);
  const [meals, setMeals] = useState([
    {
      name: 'Grilled Salmon & Quinoa Bowl',
      calories: 540,
      protein: 42,
      carbs: 48,
      fat: 18,
      tip: 'Rich in Omega-3s and complete protein for steady afternoon focus.',
      time: '12:45 PM'
    },
    {
      name: 'Greek Yogurt & Berry Parfait',
      calories: 290,
      protein: 22,
      carbs: 34,
      fat: 6,
      tip: 'Probiotics + low-glycemic berries keep blood sugar stable.',
      time: '08:30 AM'
    }
  ]);
  const [foodInput, setFoodInput] = useState('Avocado Sourdough Toast with 2 Poached Eggs & Chili Flakes');
  const [isAnalyzingFood, setIsAnalyzingFood] = useState(false);

  const handleAnalyzeFood = () => {
    if (!foodInput.trim()) return;
    setIsAnalyzingFood(true);
    setTimeout(() => {
      const lower = foodInput.toLowerCase();
      const newMeal = lower.includes('avocado')
        ? {
            name: 'Avocado Sourdough & 2 Poached Eggs',
            calories: 465,
            protein: 21,
            carbs: 38,
            fat: 24,
            tip: 'Healthy monounsaturated fats pair with choline-rich eggs for brain energy.',
            time: 'Just now (Gemini Vision JSON)'
          }
        : lower.includes('pizza') || lower.includes('burger')
        ? {
            name: foodInput,
            calories: 780,
            protein: 34,
            carbs: 76,
            fat: 36,
            tip: 'Pair with 2 extra glasses of water and a leafy side salad to balance sodium.',
            time: 'Just now (Gemini Vision JSON)'
          }
        : {
            name: foodInput,
            calories: 420,
            protein: 28,
            carbs: 44,
            fat: 14,
            tip: 'Balanced macro profile verified via Gemini responseSchema.',
            time: 'Just now (Gemini Vision JSON)'
          };
      setMeals([newMeal, ...meals]);
      setIsAnalyzingFood(false);
    }, 600);
  };

  // --- TRACK B STATE (SynthInvaders Arcade + Web Audio) ---
  const [arcadeScore, setArcadeScore] = useState(4300);
  const [shipX, setShipX] = useState(50);
  const [invadersAlive, setInvadersAlive] = useState<boolean[]>(Array(18).fill(true));
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [djCommentary, setDjCommentary] = useState(
    'DJ GEMINI-3: "All systems operational! Google Cloud frequency synchronized with arcade pulse."'
  );
  const [laserColor, setLaserColor] = useState('#00F0FF');
  const audioCtxRef = useRef<AudioContext | null>(null);
  const synthIntervalRef = useRef<number | null>(null);

  const synthTracks = [
    { title: 'Midnight City 1984', artist: 'SynthWave Pro • Google Music FM', notes: [220, 261.63, 329.63, 440] },
    { title: 'Neon Cloud Run', artist: 'GARCADE v2.0 • Vaporwave Mix', notes: [196, 246.94, 293.66, 392] },
    { title: 'Antigravity Orbit', artist: 'DeepMind Synth Collective', notes: [261.63, 311.13, 392, 523.25] }
  ];

  useEffect(() => {
    if (isPlayingMusic) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContextClass();
      }
      let step = 0;
      const notes = synthTracks[trackIndex].notes;
      synthIntervalRef.current = window.setInterval(() => {
        if (!audioCtxRef.current) return;
        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') ctx.resume();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(notes[step % notes.length], ctx.currentTime);
        gain.gain.setValueAtTime(0.03, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.24);
        step++;
      }, 260);
    } else if (synthIntervalRef.current) {
      clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }
    return () => {
      if (synthIntervalRef.current) clearInterval(synthIntervalRef.current);
    };
  }, [isPlayingMusic, trackIndex]);

  const handleFireLaser = () => {
    const aliveIndices = invadersAlive
      .map((alive, idx) => (alive ? idx : -1))
      .filter((idx) => idx !== -1);

    if (aliveIndices.length === 0) {
      setInvadersAlive(Array(18).fill(true));
      setArcadeScore((s) => s + 1000);
      setDjCommentary('DJ GEMINI-3: "WAVE CLEARED! +1,000 BONUS POINTS! Respawning neon fleet!"');
      return;
    }
    const targetIdx = aliveIndices[Math.floor(Math.random() * aliveIndices.length)];
    const updated = [...invadersAlive];
    updated[targetIdx] = false;
    setInvadersAlive(updated);
    setArcadeScore((s) => s + 250);
  };

  const applyArcadeModifier = (mod: 'plasma' | 'hyper' | 'reset') => {
    if (mod === 'plasma') {
      setLaserColor('#FF2A85');
      setDjCommentary('DJ GEMINI-3: "Magenta Plasma Overdrive activated via Gemini JSON modifier!"');
    } else if (mod === 'hyper') {
      setLaserColor('#22C55E');
      setArcadeScore((s) => s + 500);
      setDjCommentary('DJ GEMINI-3: "Matrix Emerald Shields +500 XP injected into game loop!"');
    } else {
      setInvadersAlive(Array(18).fill(true));
      setLaserColor('#00F0FF');
      setDjCommentary('DJ GEMINI-3: "Arcade cabinet reset to factory 1984 settings."');
    }
  };

  // --- TRACK C STATE (PulseBrief Studio) ---
  const [pulseQuery, setPulseQuery] = useState('Google Cloud Run & Agentic AI 2026');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [pulseCards, setPulseCards] = useState([
    {
      title: 'Zero-to-One Vibe Coding Surges Across Developer Communities',
      summary: 'Teams combine Google Stitch visual canvases, AI Studio Build mode, and Antigravity 2.0 MCP workflows to cut prototype-to-production time by 80%.',
      impact: 'HIGH',
      source: 'cloud.google.com • Verified Grounding'
    },
    {
      title: 'Cloud Run Starter Tier Enables Instant Zero-Billing Launches',
      summary: 'Builders can publish up to 2 live full-stack services directly from Google AI Studio or scale to zero with --min-instances=0.',
      impact: 'HIGH',
      source: 'ai.google.dev • Verified Grounding'
    },
    {
      title: 'Structured JSON Schemas Eliminate Frontend LLM Hallucinations',
      summary: 'Enforcing Type.OBJECT responseSchema in @google/genai guarantees deterministic UI rendering.',
      impact: 'EMERGING',
      source: 'antigravity.google/docs • Verified Grounding'
    }
  ]);

  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const script = `Welcome to PulseBrief Studio. Today's grounded executive briefing on ${pulseQuery}: First, ${pulseCards[0].title}. ${pulseCards[0].summary}`;
    const utterance = new SpeechSynthesisUtterance(script);
    utterance.rate = 1.04;
    utterance.onend = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const totalCalories = meals.reduce((acc, m) => acc + m.calories, 0);

  return (
    <div className="my-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-md overflow-hidden">
      {/* Simulator Top Selector Bar */}
      <div className="px-4 py-3 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Interactive Live App Preview (What You Will Build!)
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => onSelectTrack('wellness')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
              activeTrack === 'wellness'
                ? 'bg-emerald-500 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Track A: SnapCalorie
          </button>
          <button
            onClick={() => onSelectTrack('arcade')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
              activeTrack === 'arcade'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Track B: SynthInvaders (Slide 22)
          </button>
          <button
            onClick={() => onSelectTrack('pulse')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
              activeTrack === 'pulse'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Track C: PulseBrief
          </button>
        </div>
      </div>

      {/* TRACK A: SNAPCALORIE & HYDRO (Slide 16 & 28) */}
      {(activeTrack === 'wellness' || activeTrack === 'custom') && (
        <div className="p-5 bg-[#FAF7F2] text-stone-800">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-stone-200">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                Slide 16 & 28 Use Case • Skeuomorphic Vibe
              </span>
              <h4 className="text-lg font-extrabold text-stone-900 mt-1">
                SnapCalorie & Hydro Daily Journal
              </h4>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100/80 border border-amber-300 text-amber-900 text-xs font-bold shadow-inner">
                <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                <span>7-Day Streak</span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-white border border-stone-300 shadow-sm text-xs font-bold">
                {totalCalories} / 2,100 kcal
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Left Column: AI Meal Photo Logger */}
            <div className="md:col-span-7 space-y-3">
              <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-sm">
                <label className="block text-xs font-bold uppercase text-stone-500 mb-2">
                  Simulate Gemini Vision Meal Photo / Prompt Analysis
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={foodInput}
                    onChange={(e) => setFoodInput(e.target.value)}
                    placeholder="Describe a meal or snap photo..."
                    className="flex-1 px-3 py-2 rounded-lg border border-stone-300 bg-stone-50 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    onClick={handleAnalyzeFood}
                    disabled={isAnalyzingFood}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow transition"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>{isAnalyzingFood ? 'Analyzing...' : 'Snap & Log AI'}</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {meals.map((meal, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-white border border-stone-200 shadow-sm flex items-start justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-stone-900">{meal.name}</span>
                        <span className="text-[10px] text-stone-400">{meal.time}</span>
                      </div>
                      <p className="text-[11px] text-emerald-700 mt-1">
                        ✨ AI Tip: {meal.tip}
                      </p>
                      <div className="flex gap-2 mt-2 text-[10px] font-semibold text-stone-600">
                        <span className="px-2 py-0.5 rounded bg-stone-100">Protein: {meal.protein}g</span>
                        <span className="px-2 py-0.5 rounded bg-stone-100">Carbs: {meal.carbs}g</span>
                        <span className="px-2 py-0.5 rounded bg-stone-100">Fat: {meal.fat}g</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-extrabold text-xs shrink-0">
                      {meal.calories} kcal
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Tactile Hydration Glasses */}
            <div className="md:col-span-5 p-4 rounded-xl bg-white border border-stone-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase text-stone-500 flex items-center gap-1.5">
                    <Droplets className="w-4 h-4 text-sky-500" />
                    Tactile Hydration (8 Glasses)
                  </span>
                  <span className="text-xs font-extrabold text-sky-600">
                    {waterGlasses * 250} ml / 2,000 ml
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 mb-3">
                  Click any water glass below to toggle your daily hydration intake:
                </p>
                <div className="grid grid-cols-4 gap-2.5 my-2">
                  {Array.from({ length: 8 }).map((_, idx) => {
                    const filled = idx < waterGlasses;
                    return (
                      <button
                        key={idx}
                        onClick={() => setWaterGlasses(idx + 1)}
                        className={`h-14 rounded-xl border flex flex-col items-center justify-center transition-all shadow-sm ${
                          filled
                            ? 'bg-gradient-to-b from-sky-400 to-blue-600 border-blue-500 text-white scale-[1.02]'
                            : 'bg-stone-100 border-stone-300 text-stone-400 hover:bg-stone-200'
                        }`}
                      >
                        <Droplets className="w-4 h-4" />
                        <span className="text-[10px] font-bold mt-0.5">{(idx + 1) * 250}mL</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                <span>Weekly Adherence: 92%</span>
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Schema Validated
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TRACK B: SYNTHINVADERS VAPORWAVE ARCADE (Slide 19–26) */}
      {activeTrack === 'arcade' && (
        <div className="p-5 bg-[#0D0221] text-slate-100 font-mono relative overflow-hidden">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4 border-b border-fuchsia-500/30">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-fuchsia-600/20 border border-fuchsia-500 text-fuchsia-400">
                <Gamepad2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-pink-500">
                  GARCADE • GOOGLE EDITION V2.0 (SLIDE 22 LIVE REPLICA)
                </h4>
                <p className="text-[11px] text-fuchsia-300/80">
                  Space Invaders + Procedural Web Audio Synthwave Player + Gemini AI DJ
                </p>
              </div>
            </div>
            <div className="px-3.5 py-1.5 rounded-lg bg-slate-900 border border-cyan-500/50 text-cyan-300 text-xs font-bold">
              HIGH SCORE: {arcadeScore.toLocaleString()}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left Panel: Controls & Leaderboard */}
            <div className="lg:col-span-3 space-y-3">
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                <div className="text-[11px] font-bold text-cyan-400 mb-2">CONTROLS & AI MODS</div>
                <div className="space-y-1.5 text-[11px] text-slate-300">
                  <div className="flex justify-between">
                    <span>MOVE SHIP</span>
                    <span className="text-fuchsia-400">◀ / ▶ Buttons</span>
                  </div>
                  <div className="flex justify-between">
                    <span>FIRE LASER</span>
                    <span className="text-cyan-400">FIRE CANNON</span>
                  </div>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800 space-y-1.5">
                  <div className="text-[10px] text-slate-400">Trigger Gemini Physics Mod:</div>
                  <div className="flex flex-wrap gap-1">
                    <button
                      onClick={() => applyArcadeModifier('plasma')}
                      className="px-2 py-1 rounded bg-fuchsia-950 border border-fuchsia-500/50 text-[10px] text-fuchsia-300 hover:bg-fuchsia-900"
                    >
                      + Plasma Beam
                    </button>
                    <button
                      onClick={() => applyArcadeModifier('hyper')}
                      className="px-2 py-1 rounded bg-emerald-950 border border-emerald-500/50 text-[10px] text-emerald-300 hover:bg-emerald-900"
                    >
                      +500 XP Boost
                    </button>
                    <button
                      onClick={() => applyArcadeModifier('reset')}
                      className="px-2 py-1 rounded bg-slate-800 text-[10px] text-slate-300"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                <div className="text-[11px] font-bold text-pink-400 mb-2">LEADERBOARD</div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-amber-300">
                    <span>01 GOOG_DEV</span>
                    <span>15,000</span>
                  </div>
                  <div className="flex justify-between text-cyan-300">
                    <span>02 ALPHABET</span>
                    <span>12,200</span>
                  </div>
                  <div className="flex justify-between text-fuchsia-300">
                    <span>03 YOU (LIVE)</span>
                    <span>{arcadeScore.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Center Panel: Interactive Invaders Arena */}
            <div className="lg:col-span-5 p-4 rounded-xl bg-black/80 border-2 border-fuchsia-500/40 flex flex-col justify-between min-h-[230px] relative">
              <div className="flex justify-between items-center text-[11px] text-pink-400">
                <span>SCORE: {arcadeScore}</span>
                <span className="text-emerald-400">WAVE 01 • ACTIVE</span>
              </div>

              {/* Invader Grid */}
              <div className="grid grid-cols-6 gap-2.5 my-4 justify-items-center">
                {invadersAlive.map((alive, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      if (!alive) return;
                      const next = [...invadersAlive];
                      next[idx] = false;
                      setInvadersAlive(next);
                      setArcadeScore((s) => s + 250);
                    }}
                    className={`w-6 h-5 rounded-sm transition-all cursor-pointer flex items-center justify-center text-xs ${
                      !alive
                        ? 'opacity-10 scale-50'
                        : idx < 6
                        ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e]'
                        : idx < 12
                        ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
                        : 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]'
                    }`}
                    title="Click invader or press FIRE CANNON!"
                  >
                    👾
                  </div>
                ))}
              </div>

              {/* Player Ship & Controls */}
              <div className="space-y-2">
                <div className="relative h-6 w-full bg-slate-900/70 rounded overflow-hidden">
                  <div
                    style={{ left: `${shipX}%`, backgroundColor: laserColor }}
                    className="absolute bottom-1 -translate-x-1/2 w-8 h-3.5 rounded-t-md shadow-[0_0_12px_#00F0FF] transition-all"
                  />
                </div>
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => setShipX((x) => Math.max(10, x - 15))}
                    className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-bold"
                  >
                    ◀ LEFT
                  </button>
                  <button
                    onClick={handleFireLaser}
                    className="px-4 py-1 rounded bg-gradient-to-r from-fuchsia-600 to-cyan-500 text-white text-xs font-black tracking-wider shadow"
                  >
                    ⚡ FIRE CANNON
                  </button>
                  <button
                    onClick={() => setShipX((x) => Math.min(90, x + 15))}
                    className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-bold"
                  >
                    RIGHT ▶
                  </button>
                </div>
              </div>
            </div>

            {/* Right Panel: Synthwave Radio Player & System Status */}
            <div className="lg:col-span-4 space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-900/95 border border-cyan-500/30">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-xs font-bold text-white">
                      {synthTracks[trackIndex].title}
                    </div>
                    <div className="text-[10px] text-cyan-400">
                      {synthTracks[trackIndex].artist}
                    </div>
                  </div>
                  <Volume2 className={`w-4 h-4 ${isPlayingMusic ? 'text-fuchsia-400 animate-bounce' : 'text-slate-500'}`} />
                </div>

                <div className="flex items-center justify-center gap-3 my-3">
                  <button
                    onClick={() => setTrackIndex((i) => (i + synthTracks.length - 1) % synthTracks.length)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                  >
                    <SkipForward className="w-3.5 h-3.5 rotate-180" />
                  </button>
                  <button
                    onClick={() => setIsPlayingMusic(!isPlayingMusic)}
                    className="px-4 py-2 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-[0_0_15px_#06b6d4]"
                  >
                    {isPlayingMusic ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isPlayingMusic ? 'PAUSE SYNTH' : 'PLAY SYNTH FM'}</span>
                  </button>
                  <button
                    onClick={() => setTrackIndex((i) => (i + 1) % synthTracks.length)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                  >
                    <SkipForward className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/95 border border-emerald-500/30">
                <div className="text-[10px] font-bold text-amber-400 uppercase mb-1">
                  SYSTEM STATUS • AI DJ LIVE
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {djCommentary}
                </p>
                <div className="mt-2 flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>ONLINE • CLOUD RUN READY</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TRACK C: PULSEBRIEF AI STUDIO (Slide 14 & 15) */}
      {activeTrack === 'pulse' && (
        <div className="p-5 bg-[#0B0F19] text-slate-100">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/30 px-2.5 py-0.5 rounded-full">
                Slide 15 • Google Search Grounding + Speech TTS
              </span>
              <h4 className="text-base font-bold text-white mt-1">
                PulseBrief Grounded Intelligence Radar
              </h4>
            </div>
            <button
              onClick={handleToggleSpeech}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                isSpeaking
                  ? 'bg-rose-600 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              <Radio className="w-4 h-4" />
              <span>{isSpeaking ? 'Stop Audio Briefing' : 'Listen to AI Audio Briefing (TTS)'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {pulseCards.map((card, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {card.impact} IMPACT
                    </span>
                    <Globe className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  <h5 className="text-xs font-bold text-white mb-1.5">{card.title}</h5>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{card.summary}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-blue-300">
                  <span>{card.source}</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
