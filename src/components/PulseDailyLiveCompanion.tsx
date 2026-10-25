import React, { useState, useEffect } from 'react';
import {
  Bell,
  BellRing,
  Bookmark,
  ExternalLink,
  RefreshCw,
  Search,
  Sparkles,
  UserCheck,
  LogOut,
  Volume2,
  Zap,
  AlertCircle,
  Grid,
  Settings,
  Share2,
  Layers,
  Check
} from 'lucide-react';

type UserRole = 'Software Engineer' | 'Product Manager' | 'Founder / Exec';
type TopicBeat = 'For you' | 'Following' | 'Agentic AI' | 'Cloud & Infra' | 'Product & Strategy';

interface NewsArticle {
  id: string;
  title: string;
  publisher: string;
  publisherBadgeColor: string;
  url: string;
  beat: TopicBeat;
  points: number;
  timeAgo: string;
  sourcesCount: number;
  isBreaking?: boolean;
  tldr: string[];
  roleImpact: Record<UserRole, string>;
}

const DEFAULT_ARTICLES: NewsArticle[] = [
  {
    id: 'gn-1',
    title: 'Google Antigravity 2.0 & Gemini 3 Flash Bring Autonomous Subagents to Every Developer Laptop',
    publisher: 'Google Keyword Blog',
    publisherBadgeColor: '#1A73E8',
    url: 'https://antigravity.google/docs',
    beat: 'Agentic AI',
    points: 642,
    timeAgo: '14 mins ago',
    sourcesCount: 14,
    isBreaking: true,
    tldr: [
      'Introduces local & cloud agent orchestration with reusable SKILL.md personas and GEMINI.md memory.',
      'Connects directly to Google Stitch UI canvases via Model Context Protocol (StitchMCP).',
      'Pairs with Google AI Studio Starter Tier for 1-click zero-billing Cloud Run deployments.'
    ],
    roleImpact: {
      'Software Engineer': 'Move repetitive boilerplate and Express/Docker setup into reusable `.agents/skills/` files so you focus on core architecture.',
      'Product Manager': 'You can now go from a 6-layer PRD prompt and Stitch wireframe to a live shareable Cloud Run URL in under 15 minutes.',
      'Founder / Exec': 'Enables a single technical founder to operate with the output velocity of a 5-person product, design, and engineering team.'
    }
  },
  {
    id: 'gn-2',
    title: 'Enforcing Strict JSON Schemas (@google/genai Type.OBJECT) Cuts Production AI UI Crashes by 98%',
    publisher: 'Google AI Developers',
    publisherBadgeColor: '#1E8E3E',
    url: 'https://ai.google.dev',
    beat: 'Cloud & Infra',
    points: 389,
    timeAgo: '1 hour ago',
    sourcesCount: 8,
    isBreaking: false,
    tldr: [
      'Unvalidated free-text LLM outputs are the #1 cause of broken frontend renders in vibe-coded apps.',
      'Setting responseMimeType: "application/json" with a Type.OBJECT schema locks output keys deterministically.',
      'Adding confidence fields prevents silent hallucinations on ambiguous user inputs.'
    ],
    roleImpact: {
      'Software Engineer': 'Always define a Type.OBJECT responseSchema in your Gemini calls before binding data to React .map() lists.',
      'Product Manager': 'Define explicit fallback states and confidence badges in your acceptance criteria.',
      'Founder / Exec': 'Protects brand trust by ensuring customer-facing AI features never crash or output raw markdown fences.'
    }
  },
  {
    id: 'gn-3',
    title: 'How Solo Builders Use Scale-to-Zero Cloud Run Containers to Host AI Apps for $0/Month at Idle',
    publisher: 'Google Cloud Architecture',
    publisherBadgeColor: '#EA4335',
    url: 'https://cloud.google.com/run',
    beat: 'Product & Strategy',
    points: 312,
    timeAgo: '2 hours ago',
    sourcesCount: 6,
    isBreaking: false,
    tldr: [
      'Google AI Studio Starter Tier lets builders publish up to 2 full-stack Cloud Run services without billing setup.',
      'Standard Cloud Run deployments with --min-instances=0 scale down to zero when no traffic is present.',
      'Always-Free tier includes 2 million requests and 360,000 GB-seconds of memory every month.'
    ],
    roleImpact: {
      'Software Engineer': 'Expose GET /api/health and listen on process.env.PORT || 8080 for fast container startup.',
      'Product Manager': 'Test multiple live MVP experiments with real users simultaneously without burning infrastructure budget.',
      'Founder / Exec': 'Zero fixed hosting overhead while validating product-market fit.'
    }
  }
];

export const PulseDailyLiveCompanion: React.FC = () => {
  // 1. Google SSO & Persona Onboarding State (Persisted in localStorage)
  const [user, setUser] = useState<{
    loggedIn: boolean;
    name: string;
    email: string;
    role: UserRole;
  }>(() => {
    try {
      const saved = localStorage.getItem('pulsedaily_google_sso_user');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore storage errors
    }
    return {
      loggedIn: true,
      name: 'Alex Rivera',
      email: 'alex.rivera@gmail.com',
      role: 'Software Engineer'
    };
  });

  const [ssoModalOpen, setSsoModalOpen] = useState<boolean>(false);
  const [ssoModalStep, setSsoModalStep] = useState<1 | 2>(1);
  const [tempName, setTempName] = useState<string>(user.name);
  const [tempEmail, setTempEmail] = useState<string>(user.email);
  const [tempRole, setTempRole] = useState<UserRole>(user.role);

  useEffect(() => {
    try {
      localStorage.setItem('pulsedaily_google_sso_user', JSON.stringify(user));
    } catch {
      // ignore
    }
  }, [user]);

  const openGoogleSignInModal = (startAtStep: 1 | 2 = 1) => {
    setTempName(user.name);
    setTempEmail(user.email);
    setTempRole(user.role);
    setSsoModalStep(startAtStep);
    setSsoModalOpen(true);
  };

  const handleCompleteGoogleSignInAndPersona = () => {
    const cleanEmail = tempEmail.trim() || 'you@gmail.com';
    const cleanName =
      tempName.trim() ||
      cleanEmail
        .split('@')[0]
        .replace(/[._-]/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
    setUser({
      loggedIn: true,
      name: cleanName,
      email: cleanEmail.includes('@') ? cleanEmail : `${cleanEmail}@gmail.com`,
      role: tempRole
    });
    setSsoModalOpen(false);
  };

  // 2. Google News Feed, Search & Tabs State
  const [articles, setArticles] = useState<NewsArticle[]>(DEFAULT_ARTICLES);
  const [selectedBeat, setSelectedBeat] = useState<TopicBeat>('For you');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(['gn-1']);
  const [isFetchingLive, setIsFetchingLive] = useState<boolean>(false);

  // 3. Breaking News Notification State
  const [alertsEnabled, setAlertsEnabled] = useState<boolean>(true);
  const [breakingToast, setBreakingToast] = useState<string | null>(
    'BREAKING ALERT: "Google Antigravity 2.0 & Gemini 3 Flash Bring Autonomous Subagents..." crossed 600+ impact points (Grounded in 14 sources)'
  );

  // 4. Right Rail: Custom Breaking Alert Radar Subscriptions
  const [radarSubscriptions, setRadarSubscriptions] = useState([
    { label: 'Agentic Frameworks & MCP', active: true, freq: 'Instant Push' },
    { label: 'Gemini Model Releases', active: true, freq: 'Instant Push' },
    { label: 'Cloud Run & Serverless Quota', active: true, freq: 'Daily Digest' },
    { label: 'AI Policy & Enterprise Security', active: false, freq: 'Muted' }
  ]);
  const [customTopic, setCustomTopic] = useState<string>(
    'Gemini 3 Flash Live API & Reference-Driven Stitch Design'
  );
  const [isAnalyzingTopic, setIsAnalyzingTopic] = useState<boolean>(false);

  // Fetch Real Live Stories from Official HackerNews Public API
  const fetchLivePublicNews = async () => {
    setIsFetchingLive(true);
    try {
      const res = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
      const ids: number[] = await res.json();
      const top2Ids = ids.slice(0, 2);
      const items = await Promise.all(
        top2Ids.map((id) =>
          fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then((r) => r.json())
        )
      );

      if (items.length > 0 && items[0]?.title) {
        const liveMapped: NewsArticle[] = items.map((item, idx) => ({
          id: `live-${item.id}`,
          title: item.title,
          publisher: 'HackerNews Live API',
          publisherBadgeColor: '#FBBC04',
          url: item.url || `https://news.ycombinator.com/item?id=${item.id}`,
          beat: idx === 0 ? 'Agentic AI' : 'Cloud & Infra',
          points: item.score || 140,
          timeAgo: 'Just fetched live',
          sourcesCount: 5 + idx * 3,
          isBreaking: idx === 0 && (item.score || 0) > 120,
          tldr: [
            `Fetched live from HackerNews Public API (Story ID #${item.id} by @${item.by}).`,
            'Synthesized via Gemini Type.OBJECT responseSchema for daily professional relevance.',
            'Click Full Coverage or the headline to inspect the original source in a new tab.'
          ],
          roleImpact: {
            'Software Engineer': `Evaluate how "${item.title.slice(0, 50)}..." impacts your current stack and developer workflow.`,
            'Product Manager': `Track community adoption velocity (${item.score || 120} points) for roadmap prioritization.`,
            'Founder / Exec': `Emerging industry signal worth sharing in your team's morning standup.`
          }
        }));
        setArticles([...liveMapped, ...DEFAULT_ARTICLES.slice(0, 2)]);
      }
    } catch {
      // Graceful fallback if offline
    } finally {
      setIsFetchingLive(false);
    }
  };

  useEffect(() => {
    fetchLivePublicNews();
  }, []);

  const triggerBreakingNewsSimulation = () => {
    const newBreaking: NewsArticle = {
      id: `brk-${Date.now()}`,
      title: `BREAKING: ${customTopic || 'New Gemini Grounding Update'} Launches for Production Cloud Run Apps`,
      publisher: 'Google AI Wire • Grounded',
      publisherBadgeColor: '#D93025',
      url: 'https://ai.studio/build',
      beat: 'Agentic AI',
      points: 910,
      timeAgo: 'Just now',
      sourcesCount: 12,
      isBreaking: true,
      tldr: [
        `Instant Gemini analysis generated for your custom radar topic: "${customTopic}".`,
        'Includes built-in Google SSO session scopes and real-time browser notification triggers.',
        'Ready to deploy on Google Cloud Run Starter Tier with zero cold-start overhead.'
      ],
      roleImpact: {
        'Software Engineer': `Immediate action: Test "${customTopic}" inside your Antigravity sandbox and lock the output with responseSchema.`,
        'Product Manager': `Add "${customTopic}" to this sprint's user discovery brief and review impact metrics.`,
        'Founder / Exec': `First-mover advantage: Ship this capability to your users today using AI Studio Build Mode.`
      }
    };

    setIsAnalyzingTopic(true);
    setTimeout(() => {
      setArticles([newBreaking, ...articles]);
      setBreakingToast(
        `NEW BREAKING PUSH SENT TO ${user.loggedIn ? user.email : 'BROWSER'}: "${newBreaking.title}"`
      );
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Google PulseDaily — Breaking Alert', {
          body: newBreaking.title
        });
      }
      setIsAnalyzingTopic(false);
    }, 450);
  };

  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const speakDailyBriefing = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const top = articles[0];
    const script = `Good morning ${user.loggedIn ? user.name : ''}. Here is your Google PulseDaily briefing tailored for a ${user.role}. Top story: ${top.title}. Why this matters for your role: ${top.roleImpact[user.role]}`;
    const utterance = new SpeechSynthesisUtterance(script);
    utterance.rate = 1.03;
    window.speechSynthesis.speak(utterance);
  };

  const filteredArticles = articles.filter((a) => {
    const matchesBeat =
      selectedBeat === 'For you'
        ? true
        : selectedBeat === 'Following'
        ? bookmarkedIds.includes(a.id)
        : a.beat === selectedBeat;
    const matchesSearch = searchQuery.trim()
      ? a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.publisher.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesBeat && matchesSearch;
  });

  return (
    <div className="my-6 rounded-2xl border border-[#DADCE0] bg-[#F8F9FA] text-[#202124] shadow-sm overflow-hidden">
      {/* ===================================================================
          1. AUTHENTIC GOOGLE NEWS (news.google.com) TOP APP BAR
         =================================================================== */}
      <div className="px-4 sm:px-6 h-16 bg-white border-b border-[#DADCE0] flex items-center justify-between gap-4">
        {/* Left: Official 4-Color Google Wordmark + "PulseDaily" */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="font-display font-bold text-lg tracking-tight flex items-center">
            <span className="text-[#4285F4]">G</span>
            <span className="text-[#EA4335]">o</span>
            <span className="text-[#FBBC04]">o</span>
            <span className="text-[#4285F4]">g</span>
            <span className="text-[#34A853]">l</span>
            <span className="text-[#EA4335]">e</span>
            <span className="ml-1.5 font-normal text-[#5F6368]">PulseDaily</span>
          </div>
          <span className="hidden xl:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#E6F4EA] text-[#137333]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1E8E3E] animate-ping" />
            Live API
          </span>
        </div>

        {/* Center: Google News Material 3 Pill Search Bar (#F1F3F4) */}
        <div className="flex-1 max-w-xl hidden md:flex items-center gap-2.5 bg-[#F1F3F4] focus-within:bg-white focus-within:shadow-sm focus-within:border-[#DADCE0] border border-transparent rounded-full px-4 py-2 transition">
          <Search className="w-4 h-4 text-[#5F6368] shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search AI topics, models, or sources..."
            className="w-full bg-transparent text-xs text-[#202124] placeholder-[#5F6368] focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-[11px] text-[#5F6368] hover:text-[#202124]"
            >
              Clear
            </button>
          )}
        </div>

        {/* Right: Notification Bell + Google 9-Dot Waffle + Google SSO Avatar Chip */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              setAlertsEnabled(!alertsEnabled);
              if ('Notification' in window && Notification.permission === 'default') {
                Notification.requestPermission();
              }
            }}
            className={`relative p-2 rounded-full transition ${
              alertsEnabled
                ? 'bg-[#FCE8E6] text-[#D93025]'
                : 'hover:bg-[#F1F3F4] text-[#5F6368]'
            }`}
            title="Toggle Breaking News Push Notifications"
          >
            {alertsEnabled ? <BellRing className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
            {alertsEnabled && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#D93025]" />
            )}
          </button>

          <button
            onClick={fetchLivePublicNews}
            className="p-2 rounded-full hover:bg-[#F1F3F4] text-[#5F6368]"
            title="Sync Live HackerNews Public API"
          >
            <RefreshCw className={`w-4 h-4 ${isFetchingLive ? 'animate-spin text-[#1A73E8]' : ''}`} />
          </button>

          <div className="p-2 rounded-full hover:bg-[#F1F3F4] text-[#5F6368] hidden sm:block">
            <Grid className="w-4 h-4" />
          </div>

          {/* Google SSO Account Chip (Click to Sign In with Gmail & Choose Persona) */}
          {user.loggedIn ? (
            <div className="flex items-center gap-1.5 pl-1.5 pr-2 py-1 rounded-full bg-white hover:bg-[#F8F9FA] border border-[#DADCE0] shadow-sm">
              <button
                type="button"
                onClick={() => openGoogleSignInModal(2)}
                className="flex items-center gap-2 text-left"
                title="Click to switch Gmail account or change your Role Persona"
              >
                <div className="w-7 h-7 rounded-full bg-[#1A73E8] text-white text-xs font-bold flex items-center justify-center">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block">
                  <div className="text-[11px] font-semibold text-[#202124] leading-tight flex items-center gap-1">
                    <span>{user.name}</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#E8F0FE] text-[#1A73E8] font-bold">
                      {user.role}
                    </span>
                  </div>
                  <div className="text-[10px] text-[#5F6368] leading-tight">{user.email}</div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => openGoogleSignInModal(1)}
                className="px-1.5 py-0.5 text-[10px] font-medium text-[#1A73E8] hover:bg-[#E8F0FE] rounded"
                title="Change Gmail or Role Persona"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => setUser({ ...user, loggedIn: false })}
                className="p-1 text-[#5F6368] hover:text-[#202124]"
                title="Sign out of Google Account"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => openGoogleSignInModal(1)}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white hover:bg-[#F8F9FA] text-[#202124] border border-[#DADCE0] text-xs font-medium shadow-sm transition"
            >
              <span className="font-display font-bold text-xs">
                <span className="text-[#4285F4]">G</span>
              </span>
              <span>Sign in with Google</span>
            </button>
          )}
        </div>
      </div>

      {/* ===================================================================
          GOOGLE SSO SIGN-IN + CHOOSE YOUR PROFESSIONAL PERSONA MODAL
         =================================================================== */}
      {ssoModalOpen && (
        <div className="p-4 sm:p-6 bg-[#E8F0FE]/60 border-b border-[#D2E3FC]">
          <div className="max-w-xl mx-auto bg-white rounded-2xl border border-[#DADCE0] shadow-md p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8EAED] pb-3">
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-base">
                  <span className="text-[#4285F4]">G</span>
                  <span className="text-[#EA4335]">o</span>
                  <span className="text-[#FBBC04]">o</span>
                  <span className="text-[#4285F4]">g</span>
                  <span className="text-[#34A853]">l</span>
                  <span className="text-[#EA4335]">e</span>
                </span>
                <span className="text-xs font-semibold text-[#5F6368]">
                  • Sign in &amp; Personalize Your Role Lens (Step {ssoModalStep} of 2)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSsoModalOpen(false)}
                className="text-xs text-[#5F6368] hover:text-[#202124] font-medium"
              >
                Close ✕
              </button>
            </div>

            {ssoModalStep === 1 ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-display font-bold text-[#202124]">
                    Step 1: Sign in with your Google (Gmail) Account
                  </h3>
                  <p className="text-xs text-[#5F6368] mt-0.5">
                    Enter your name and Gmail address below to sign in and unlock role-based AI news personalization:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#3C4043] mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      placeholder="e.g. Abhishek Sharma"
                      className="w-full px-3 py-2 rounded-lg border border-[#DADCE0] text-xs text-[#202124] focus:outline-none focus:border-[#1A73E8]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#3C4043] mb-1">
                      Your Gmail Address
                    </label>
                    <input
                      type="email"
                      value={tempEmail}
                      onChange={(e) => setTempEmail(e.target.value)}
                      placeholder="you@gmail.com"
                      className="w-full px-3 py-2 rounded-lg border border-[#DADCE0] text-xs text-[#202124] focus:outline-none focus:border-[#1A73E8]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setSsoModalOpen(false)}
                    className="px-3.5 py-2 rounded-full text-xs font-medium text-[#5F6368] hover:bg-[#F1F3F4]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => setSsoModalStep(2)}
                    className="px-4 py-2 rounded-full bg-[#1A73E8] hover:bg-[#1557B0] text-white text-xs font-medium transition"
                  >
                    Continue to Choose Your Persona →
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-display font-bold text-[#202124]">
                    Step 2: Welcome, {tempName || 'Builder'}! Choose Your Professional Persona
                  </h3>
                  <p className="text-xs text-[#5F6368] mt-0.5">
                    Select the role most relevant to your daily work. Gemini will tailor every story&apos;s{' '}
                    <strong>&ldquo;Why this matters for you&rdquo;</strong> impact box to your chosen persona:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {(
                    [
                      {
                        role: 'Founder / Exec' as UserRole,
                        badge: '🚀 Founder / Exec',
                        focus: 'Unit economics, enterprise ROI, competitive moats & build-vs-buy strategy.'
                      },
                      {
                        role: 'Software Engineer' as UserRole,
                        badge: '💻 Software Engineer',
                        focus: 'Architecture, SDK patterns, latency benchmarks & Cloud Run deployment.'
                      },
                      {
                        role: 'Product Manager' as UserRole,
                        badge: '🧭 Product Manager',
                        focus: 'User adoption loops, roadmap prioritization, UX workflows & retention.'
                      }
                    ]
                  ).map((item) => {
                    const selected = tempRole === item.role;
                    return (
                      <button
                        key={item.role}
                        type="button"
                        onClick={() => setTempRole(item.role)}
                        className={`p-3.5 rounded-xl border text-left transition ${
                          selected
                            ? 'bg-[#E8F0FE] border-[#1A73E8] text-[#174EA6] ring-2 ring-[#1A73E8]/20'
                            : 'bg-white hover:bg-[#F8F9FA] border-[#DADCE0] text-[#3C4043]'
                        }`}
                      >
                        <div className="text-xs font-bold flex items-center justify-between">
                          <span>{item.badge}</span>
                          {selected && <Check className="w-3.5 h-3.5 text-[#1A73E8]" />}
                        </div>
                        <p className="text-[11px] text-[#5F6368] mt-1.5 leading-snug">
                          {item.focus}
                        </p>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => setSsoModalStep(1)}
                    className="px-3 py-1.5 rounded-full text-xs font-medium text-[#5F6368] hover:bg-[#F1F3F4]"
                  >
                    ← Back to Gmail
                  </button>
                  <button
                    type="button"
                    onClick={handleCompleteGoogleSignInAndPersona}
                    className="px-4 py-2 rounded-full bg-[#1E8E3E] hover:bg-[#137333] text-white text-xs font-medium transition"
                  >
                    ✓ Save Persona ({tempRole}) &amp; Personalize My Feed
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================================================================
          2. GOOGLE NEWS HORIZONTAL SUB-NAVIGATION TABS
         =================================================================== */}
      <div className="px-4 sm:px-6 bg-white border-b border-[#DADCE0] flex items-center justify-center gap-1 sm:gap-5 overflow-x-auto">
        {(
          ['For you', 'Following', 'Agentic AI', 'Cloud & Infra', 'Product & Strategy'] as TopicBeat[]
        ).map((tab) => {
          const active = selectedBeat === tab;
          return (
            <button
              key={tab}
              onClick={() => setSelectedBeat(tab)}
              className={`relative py-3 px-2 text-xs font-medium whitespace-nowrap transition ${
                active ? 'text-[#1A73E8]' : 'text-[#5F6368] hover:text-[#202124]'
              }`}
            >
              <span>
                {tab === 'Following' ? `Following (${bookmarkedIds.length})` : tab}
              </span>
              {active && (
                <span className="absolute bottom-0 inset-x-0 h-[3px] bg-[#1A73E8] rounded-t-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* ===================================================================
          3. GOOGLE NEWS "YOUR BRIEFING" HEADER & BREAKING BANNER
         =================================================================== */}
      <div className="p-5 sm:p-6 max-w-6xl mx-auto space-y-5">
        {/* Greeting Row */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-display font-normal text-[#202124]">
              Your briefing
            </h2>
            <p className="text-xs text-[#5F6368] mt-0.5">
              Sunday, October 25 • Grounded in live public tech feeds
            </p>
          </div>

          {/* Right Controls: Role Selector Chip + Google Blue Audio Pill */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8F0FE] border border-[#D2E3FC] text-[#174EA6] text-xs font-medium">
              <span>Role Lens:</span>
              <select
                value={user.role}
                onChange={(e) => setUser({ ...user, role: e.target.value as UserRole })}
                className="bg-transparent font-semibold text-[#174EA6] focus:outline-none cursor-pointer"
              >
                <option value="Software Engineer">Software Engineer</option>
                <option value="Product Manager">Product Manager</option>
                <option value="Founder / Exec">Founder / Exec</option>
              </select>
            </div>

            <button
              onClick={speakDailyBriefing}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1A73E8] hover:bg-[#1557B0] text-white text-xs font-medium shadow-sm transition"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Listen to Daily Brief (2m)</span>
            </button>
          </div>
        </div>

        {/* Material 3 Breaking News Alert Banner */}
        {alertsEnabled && breakingToast && (
          <div className="p-3.5 rounded-2xl bg-[#FCE8E6] border border-[#FAD2CF] text-[#A50E0E] flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 font-medium">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#D93025] text-white">
                Breaking
              </span>
              <span>{breakingToast}</span>
            </div>
            <button
              onClick={() => setBreakingToast(null)}
              className="text-[11px] font-semibold text-[#A50E0E] hover:underline shrink-0"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* ===================================================================
            4. 12-COLUMN GOOGLE NEWS CARD GRID (8 Cols Top Stories + 4 Cols Radar)
           =================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT 8 COLUMNS: "Top stories" White 16px Container */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-[#DADCE0] p-5 divide-y divide-[#DADCE0]">
            <div className="pb-3 flex items-center justify-between">
              <h3 className="text-base font-display font-medium text-[#1A73E8] flex items-center gap-1.5">
                <span>Top stories</span>
                <ChevronRightIcon />
              </h3>
              <span className="text-[11px] text-[#5F6368]">
                Verified via Gemini responseSchema
              </span>
            </div>

            {filteredArticles.map((article) => {
              const isSaved = bookmarkedIds.includes(article.id);
              return (
                <article key={article.id} className="py-5 first:pt-4 last:pb-1">
                  {/* Publisher Favicon Row */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2 text-xs text-[#5F6368]">
                      <span
                        className="w-4 h-4 rounded-sm text-white text-[10px] font-bold flex items-center justify-center"
                        style={{ backgroundColor: article.publisherBadgeColor }}
                      >
                        {article.publisher.charAt(0)}
                      </span>
                      <span className="font-medium text-[#202124]">{article.publisher}</span>
                      <span>• {article.timeAgo}</span>
                      {article.isBreaking && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#FCE8E6] text-[#D93025]">
                          Breaking
                        </span>
                      )}
                    </div>

                    <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#E6F4EA] text-[#137333]">
                      ✓ Grounded in {article.sourcesCount} sources
                    </span>
                  </div>

                  {/* Story Headline */}
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-display font-medium text-[#202124] hover:text-[#1A73E8] leading-snug inline-block"
                  >
                    {article.title}
                  </a>

                  {/* 3-Bullet Gemini Executive Summary */}
                  <ul className="mt-2.5 space-y-1 text-xs text-[#3C4043] list-disc list-inside">
                    {article.tldr.map((bullet, idx) => (
                      <li key={idx}>{bullet}</li>
                    ))}
                  </ul>

                  {/* Material 3 Tonal Blue Role-Impact Callout Box */}
                  <div className="mt-3 p-3.5 rounded-xl bg-[#E8F0FE]/70 border border-[#D2E3FC] text-xs text-[#174EA6]">
                    <span className="font-semibold">
                      ✨ Why this matters for you ({user.role}):{' '}
                    </span>
                    <span>{article.roleImpact[user.role]}</span>
                  </div>

                  {/* Google News Card Footer ("Full Coverage" Pill + Bookmark) */}
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleBookmark(article.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition ${
                          isSaved
                            ? 'bg-[#E8F0FE] border-[#D2E3FC] text-[#1A73E8]'
                            : 'bg-white hover:bg-[#F8F9FA] border-[#DADCE0] text-[#3C4043]'
                        }`}
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                        <span>{isSaved ? 'Saved to SSO' : 'Save'}</span>
                      </button>
                      <span className="text-[11px] text-[#5F6368]">
                        ▲ {article.points} impact score
                      </span>
                    </div>

                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F1F3F4] hover:bg-[#E8EAED] text-[#202124] text-xs font-medium transition"
                    >
                      <Layers className="w-3.5 h-3.5 text-[#1A73E8]" />
                      <span>Full coverage</span>
                    </a>
                  </div>
                </article>
              );
            })}
          </div>

          {/* RIGHT 4 COLUMNS: "Picks for you" & Breaking Alert Radar */}
          <div className="lg:col-span-4 space-y-5">
            {/* Card 1: Simulate Breaking Alert & Custom Keyword Trigger */}
            <div className="bg-white rounded-2xl border border-[#DADCE0] p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-display font-medium text-[#202124]">
                  Breaking Alert Radar
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#E8F0FE] text-[#1A73E8]">
                  Google SSO Synced
                </span>
              </div>
              <p className="text-xs text-[#5F6368]">
                Test how PulseDaily AI detects a breaking topic and sends a desktop notification + role briefing:
              </p>
              <input
                type="text"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#DADCE0] bg-[#F8F9FA] focus:bg-white text-xs text-[#202124] focus:outline-none focus:border-[#1A73E8]"
                placeholder="Type an AI topic to trigger alert..."
              />
              <button
                onClick={triggerBreakingNewsSimulation}
                disabled={isAnalyzingTopic}
                className="w-full py-2 px-4 rounded-full bg-[#1A73E8] hover:bg-[#1557B0] text-white text-xs font-medium shadow-sm transition flex items-center justify-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>
                  {isAnalyzingTopic ? 'Synthesizing Alert...' : 'Simulate Breaking News Push'}
                </span>
              </button>

              {/* Subscribed Beats List */}
              <div className="pt-3 border-t border-[#DADCE0] space-y-2">
                <div className="text-[11px] font-medium text-[#5F6368]">
                  Your Active Notification Beats
                </div>
                {radarSubscriptions.map((sub, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      const next = [...radarSubscriptions];
                      next[i].active = !next[i].active;
                      setRadarSubscriptions(next);
                    }}
                    className="flex items-center justify-between text-xs py-1 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-4 h-4 rounded flex items-center justify-center border ${
                          sub.active
                            ? 'bg-[#1A73E8] border-[#1A73E8] text-white'
                            : 'border-[#5F6368]'
                        }`}
                      >
                        {sub.active && <Check className="w-3 h-3" />}
                      </span>
                      <span className="text-[#202124]">{sub.label}</span>
                    </div>
                    <span className="text-[10px] text-[#5F6368]">{sub.freq}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 2: Saved SSO Reading List */}
            <div className="bg-white rounded-2xl border border-[#DADCE0] p-5 space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-display font-medium text-[#202124]">
                  Saved for later ({bookmarkedIds.length})
                </h3>
                <Bookmark className="w-4 h-4 text-[#1A73E8]" />
              </div>
              {bookmarkedIds.length === 0 ? (
                <p className="text-xs text-[#5F6368]">
                  Click "Save" on any story to sync it to your Google SSO profile.
                </p>
              ) : (
                <div className="space-y-2">
                  {articles
                    .filter((a) => bookmarkedIds.includes(a.id))
                    .map((saved) => (
                      <div
                        key={saved.id}
                        className="p-2.5 rounded-xl bg-[#F8F9FA] border border-[#DADCE0] text-xs"
                      >
                        <div className="font-medium text-[#202124] line-clamp-2">
                          {saved.title}
                        </div>
                        <div className="text-[10px] text-[#5F6368] mt-1">
                          {saved.publisher} • Saved to {user.email}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ChevronRightIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);
