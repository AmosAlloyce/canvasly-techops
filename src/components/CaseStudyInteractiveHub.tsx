import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Clock,
  Code2,
  Cpu,
  Database,
  Download,
  ExternalLink,
  FileSpreadsheet,
  FileText,
  Filter,
  Flame,
  HelpCircle,
  Layers,
  LayoutGrid,
  Lock,
  Mail,
  MessageSquare,
  Phone,
  Play,
  RefreshCw,
  Search,
  Server,
  ShieldAlert,
  Sliders,
  Sparkles,
  Target,
  TrendingDown,
  Users,
  Zap,
} from 'lucide-react';
import { INITIAL_TICKETS, TicketRecord } from '../data/caseData';

interface CaseStudyInteractiveHubProps {
  onNavigate: (view: 'casestudy' | 'home' | 'canvas' | 'agent' | 'datadog' | 'wfm') => void;
  onSelectTicketInAgent: (ticket: TicketRecord) => void;
}

const CONFIRMED_ENTERPRISE_IDS = new Set([
  'T-4804',
  'T-4805',
  'T-4810',
  'T-4813',
  'T-4815',
  'T-4823',
  'T-4824',
  'T-4828',
  'T-4829',
]);

const ACTUAL_WAIT_MAP: Record<
  string,
  { actualWaitHrs: number; distortion: string; note: string; categoryTag: string }
> = {
  'T-4804': {
    actualWaitHrs: 67.0,
    distortion: '118.2x',
    note: 'Agent replied in 6m, routed 30-page PDF to 67h Design Curation queue, and closed ticket in 34m with CSAT=4 (masking 3rd multi-day wait this week).',
    categoryTag: 'Handoff Gaming (Curation)',
  },
  'T-4811': {
    actualWaitHrs: 67.0,
    distortion: '98.0x',
    note: 'Agent quoted static 2–3 hour SLA while actual Design Curation queue was 67 hours; routed unsupported architectural blueprints to human curators.',
    categoryTag: 'Handoff Gaming (Curation)',
  },
  'T-4816': {
    actualWaitHrs: 70.0,
    distortion: '110.5x',
    note: 'Curation backlog grew from 67h to 70+h overnight (+3h in 15.5h -> arrival rate λ > service rate μ). Agent again quoted fictional 2–3h SLA.',
    categoryTag: 'Handoff Gaming (Curation)',
  },
  'T-4824': {
    actualWaitHrs: 70.0,
    distortion: '93.3x',
    note: 'Meridian Health (450 seats) hit 2nd mangled PDF import in 26h. Threatened: "If this isn\'t fixed by Friday, I\'m recommending we switch to Miro." Marked Low priority!',
    categoryTag: 'Miro Churn Threat',
  },
  'T-4805': {
    actualWaitHrs: 3.87,
    distortion: '3.5x',
    note: '80-seat Enterprise onboarding SSO failure. Eng Slack took 3.5h (210m) to respond, yet Zendesk logged 67m (timer paused). Customer CEO emailed Canvasly CEO.',
    categoryTag: '<100 Seat Edge Case + Slack Stall',
  },
  'T-4810': {
    actualWaitHrs: 2.07,
    distortion: 'Unanswered Flag',
    note: 'Luma Analytics (200 seats) VP of Product requesting downgrade due to Magic Import quality degradation over last 4 months. Flagged in #customer-health with 0 response.',
    categoryTag: 'Downgrade Marked Low',
  },
  'T-4813': {
    actualWaitHrs: 13.25,
    distortion: '4.3x',
    note: 'CoreVista (300 seats) SSO broken at 7:45pm EST (4:45pm PST!). Devon R. answered on evening shift, but Tier 2 left at 6pm EST. Sat until 9am next day (logged as 187m).',
    categoryTag: 'West Coast / Eve SSO Lockout',
  },
  'T-4815': {
    actualWaitHrs: 8.08,
    distortion: '6.9h FRT Outlier',
    note: 'DataForge (175 seats) billing email arrived at 10:30pm EST. Sat untouched for 412m; customer replied twice before open. Drove T-4828 cancellation next day.',
    categoryTag: 'Overnight Email Black Hole',
  },
  'T-4823': {
    actualWaitHrs: 48.0,
    distortion: '8.5x',
    note: 'NovaTech (500 seats) onboarding (SSO + custom domain + data residency) took 2 days across 4 Slack channels & 3 teams with no runbook (Zendesk logged 340m).',
    categoryTag: 'Chaotic 500-Seat Onboarding',
  },
  'T-4828': {
    actualWaitHrs: 2.37,
    distortion: '88m Cancel Wait',
    note: 'DataForge (175 seats, from T-4815) submitting formal cancellation citing "poor support responsiveness and Magic Import quality regression." Assigned Low priority!',
    categoryTag: 'Enterprise Cancellation',
  },
  'T-4829': {
    actualWaitHrs: 14.75,
    distortion: '4.5x',
    note: 'Ridgeline Corp (250 seats) locked out by SSO at 6:15pm EST (3:15pm PST — middle of West Coast workday!) during a live client presentation. Abandoned overnight.',
    categoryTag: '3:15pm PST SSO Lockout',
  },
};

export const CaseStudyInteractiveHub: React.FC<CaseStudyInteractiveHubProps> = ({
  onNavigate,
  onSelectTicketInAgent,
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'diagnosis' | 'solutions' | 'roadmap' | 'memo'
  >('overview');

  // Forensic Table Filters
  const [segmentFilter, setSegmentFilter] = useState<'all' | 'enterprise' | 'general' | 'anomalies'>('all');
  const [channelFilter, setChannelFilter] = useState<'all' | 'email' | 'chat' | 'voice'>('all');
  const [agentFilter, setAgentFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Solution Simulator A State (Day 1 Internal Note vs Week 2 ZAF Sidebar)
  const [simTicketId, setSimTicketId] = useState<string>('T-4824');
  const [simMode, setSimMode] = useState<'day1_note' | 'week2_zaf'>('day1_note');
  const [webhookExecuted, setWebhookExecuted] = useState<boolean>(true);
  const [slackModalSent, setSlackModalSent] = useState<string | null>(null);

  // Solution Simulator B State (Workforce, Shrinkage & Capacity Model)
  const [simAccounts, setSimAccounts] = useState<number>(800);
  const [simAhtSaved, setSimAhtSaved] = useState<number>(5.5);
  const [simImportDeflectPct, setSimImportDeflectPct] = useState<number>(75);
  const [simShrinkagePct, setSimShrinkagePct] = useState<number>(25);

  const filteredTickets = useMemo(() => {
    return INITIAL_TICKETS.filter((t) => {
      const isEnt = CONFIRMED_ENTERPRISE_IDS.has(t.ticket_id);
      if (segmentFilter === 'enterprise' && !isEnt) return false;
      if (segmentFilter === 'general' && isEnt) return false;
      if (segmentFilter === 'anomalies' && !ACTUAL_WAIT_MAP[t.ticket_id]) return false;
      if (channelFilter !== 'all' && t.channel !== channelFilter) return false;
      if (agentFilter !== 'all' && t.agent_name !== agentFilter) return false;
      if (
        searchQuery &&
        !`${t.ticket_id} ${t.account_name} ${t.category} ${t.agent_internal_notes}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [segmentFilter, channelFilter, agentFilter, searchQuery]);

  const activeSimTicket = useMemo(
    () => INITIAL_TICKETS.find((t) => t.ticket_id === simTicketId) || INITIAL_TICKETS[23],
    [simTicketId]
  );

  // Workforce & Capacity Calculations
  const capacityMath = useMemo(() => {
    const baseDailyVolume = 1200;
    const baseAht = 14.0;
    const baselineDailyHours = (baseDailyVolume * baseAht) / 60.0; // 280 hrs/day

    // Import error share in sample is 8/30 = 26.67% (conservatively 25% of base volume = 300/day)
    const importErrorShare = 0.2667;
    const deflectedVolumeRatio = importErrorShare * (simImportDeflectPct / 100.0);
    const effectiveBaseVolume = Math.round(baseDailyVolume * (1 - deflectedVolumeRatio));
    const effectiveAht = Math.max(4.0, baseAht - simAhtSaved);
    const optimizedDailyHoursAt300 = (effectiveBaseVolume * effectiveAht) / 60.0;
    const freedHoursPerDay = baselineDailyHours - optimizedDailyHoursAt300;
    const freedFteEquivalent = freedHoursPerDay / 6.5;

    // Account for 11% monthly attrition vacancy (~4.5 seats vacant initially -> drops to 2 seats at healthy occupancy)
    const scheduledWeekdayAgents = 34; // out of 45 payroll headcount across 7-day coverage
    const netProductiveHoursPerAgent = 8.0 * (1 - simShrinkagePct / 100.0);
    const totalNetProductiveHours = scheduledWeekdayAgents * netProductiveHoursPerAgent;

    const baselineNetOccupancy = (baselineDailyHours / totalNetProductiveHours) * 100;
    const optimizedNetOccupancyAt300 = (optimizedDailyHoursAt300 / totalNetProductiveHours) * 100;

    // Scaling to simAccounts (300 -> 800 Enterprise accounts)
    // Enterprise accounts are 30% of volume at 300 accounts; scaling Enterprise from 300 to simAccounts:
    const entGrowthMultiplier = simAccounts / 300.0;
    const scaledDailyVolume = Math.round(
      baseDailyVolume * (0.7 + 0.3 * entGrowthMultiplier) * (1 - deflectedVolumeRatio)
    );
    const scaledDailyHours = (scaledDailyVolume * effectiveAht) / 60.0;
    const scaledNetOccupancy = (scaledDailyHours / totalNetProductiveHours) * 100;

    const statusQuoAgentsNeeded = Math.round(45 * (simAccounts / 300.0));
    const annualSavingsUsd = Math.max(0, (statusQuoAgentsNeeded - 45) * 3489 * 12);

    return {
      baselineDailyHours,
      effectiveBaseVolume,
      effectiveAht,
      optimizedDailyHoursAt300,
      freedHoursPerDay,
      freedFteEquivalent,
      totalNetProductiveHours,
      baselineNetOccupancy,
      optimizedNetOccupancyAt300,
      scaledDailyVolume,
      scaledDailyHours,
      scaledNetOccupancy,
      statusQuoAgentsNeeded,
      annualSavingsUsd,
    };
  }, [simAccounts, simAhtSaved, simImportDeflectPct, simShrinkagePct]);

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 flex flex-col selection:bg-sky-400 selection:text-slate-950">
      {/* Top Executive Case Study Banner */}
      <div className="bg-gradient-to-r from-sky-950/90 via-indigo-950/90 to-slate-900 border-b border-sky-500/30 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="px-2 py-0.5 rounded bg-sky-500/20 border border-sky-400/40 text-sky-300 font-mono font-bold uppercase tracking-wider">
              Canvasly Case Study // v3 5.04.26
            </span>
            <span className="text-slate-200 font-medium">
              Interactive Executive Briefing: What We Were Solving, Forensic Diagnosis &amp; Sequenced TechOps Architecture
            </span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="./Canvasly_Case_Study_Submission.md"
              download="Canvasly_Case_Study_Submission.md"
              className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/15 border border-white/15 text-slate-100 font-medium flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5 text-sky-400" />
              <span>Download Written Memo (.md)</span>
            </a>
            <a
              href="./canvasly_techops_case_data.csv"
              download="canvasly_techops_case_data.csv"
              className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-mono flex items-center gap-1.5 transition"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Raw CSV (N=30)</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Header & Navigation */}
      <header className="sticky top-0 z-40 bg-[#0b101b]/95 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-sky-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-white">CANVASLY</span>
                <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-sky-300 border border-slate-700">
                  HEAD OF TECHOPS CASE SOLUTION
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Stopping 4.2% Enterprise Churn &amp; Scaling 300 → 800 Accounts Within $2,500/mo Budget
              </p>
            </div>
          </div>

          {/* Live Prototype Sandboxes Switcher */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-mono text-slate-400 hidden xl:inline mr-1">
              Live Prototypes:
            </span>
            <button
              onClick={() => onNavigate('agent')}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-sky-200 flex items-center gap-1.5 cursor-pointer transition"
            >
              <Zap className="w-3.5 h-3.5 text-sky-400" />
              <span>Agent Sidebar Demo</span>
            </button>
            <button
              onClick={() => onNavigate('datadog')}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-purple-200 flex items-center gap-1.5 cursor-pointer transition"
            >
              <BarChart3 className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden md:inline">Queue &amp; SLA Monitor</span>
            </button>
            <button
              onClick={() => onNavigate('wfm')}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-emerald-200 flex items-center gap-1.5 cursor-pointer transition"
            >
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden lg:inline">WFM Console</span>
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 hidden sm:flex items-center gap-1 cursor-pointer transition"
            >
              <span>Product Site</span>
            </button>
          </div>
        </div>

        {/* 5-Stage Story Navigation Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 border-t border-slate-800/60 bg-[#090d16]">
          <nav className="flex items-center gap-1 overflow-x-auto py-2 no-scrollbar">
            {[
              {
                id: 'overview',
                label: '1. What We Were Solving (Scenario & Constraints)',
                icon: Target,
                badge: 'The Brief',
              },
              {
                id: 'diagnosis',
                label: '2. What the Problem Was (Forensic Data Diagnosis)',
                icon: Search,
                badge: 'N=30 CSV Proof',
              },
              {
                id: 'solutions',
                label: '3. What Solutions We Suggest (Architecture & Simulators)',
                icon: Cpu,
                badge: 'Interactive',
              },
              {
                id: 'roadmap',
                label: '4. Execution Plan & Strategic Questions (Week 1 → Day 60)',
                icon: Clock,
                badge: '$1,935/mo',
              },
              {
                id: 'memo',
                label: '5. Full Written Case Study Memo & Charts',
                icon: BookOpen,
                badge: 'Complete Prose',
              },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-medium flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${
                    isActive
                      ? 'bg-sky-500/20 text-sky-200 border border-sky-400/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-slate-500'}`} />
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                      isActive ? 'bg-sky-500/30 text-sky-100' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {tab.badge}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* =====================================================================
            TAB 1: WHAT WE WERE SOLVING (SCENARIO, CONSTRAINTS & PILOT PARADOX)
           ===================================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Hero Executive Overview Card */}
            <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-[#0f172a] to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-mono">
                    <Flame className="w-3.5 h-3.5 text-rose-400" />
                    <span>BREAKING POINT: ENTERPRISE CHURN DOUBLED (1.8% → 4.2% / QTR)</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight">
                    What We Were Solving: Stopping Active Enterprise Churn While Scaling{' '}
                    <span className="text-sky-400">300 → 800 Accounts</span>
                  </h1>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                    You have just been hired as <strong>Head of Technical Operations</strong> at{' '}
                    <strong>Canvasly</strong>, a B2B SaaS collaborative infinite-canvas platform whose
                    Enterprise customer base (100–500 seats, $50K+ ARR) grew <strong>6x</strong> in 12
                    months (50 → 300 accounts) with <strong>+500 more Enterprise accounts</strong>{' '}
                    scheduled to onboard in the next 6 months (<strong>~3.8 onboardings/business day</strong>).
                    Support grew from 8 to 45 agents, but the system architecture has been unowned for 9
                    months—and Enterprise accounts are actively cancelling this week.
                  </p>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      onClick={() => setActiveTab('diagnosis')}
                      className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-sky-500/20 cursor-pointer transition"
                    >
                      <span>Explore Forensic Data Diagnosis (N=30 CSV)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setActiveTab('solutions')}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-100 font-semibold text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition"
                    >
                      <Cpu className="w-4 h-4 text-sky-400" />
                      <span>Test Interactive Solution Simulators</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('memo')}
                      className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 font-medium text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition"
                    >
                      <BookOpen className="w-4 h-4 text-emerald-400" />
                      <span>Read Full Written Memo</span>
                    </button>
                  </div>
                </div>

                {/* Key Baseline Numbers Grid */}
                <div className="lg:col-span-5 grid grid-cols-2 gap-3">
                  {[
                    {
                      label: 'Enterprise Churn Rate',
                      val: '4.2% / qtr',
                      sub: 'Up from 1.8% (38% cite support)',
                      color: 'text-rose-400',
                      border: 'border-rose-500/30 bg-rose-950/20',
                    },
                    {
                      label: 'Daily Ticket Volume',
                      val: '~1,200 / day',
                      sub: '55% Chat · 30% Email · 15% Voice',
                      color: 'text-sky-400',
                      border: 'border-slate-800 bg-slate-900/70',
                    },
                    {
                      label: 'Support Roster & Cost',
                      val: '45 Agents',
                      sub: '$3,400/mo salary + $89/mo Zendesk',
                      color: 'text-indigo-400',
                      border: 'border-slate-800 bg-slate-900/70',
                    },
                    {
                      label: 'Monthly Agent Attrition',
                      val: '11% / month',
                      sub: '~5 agents resign every 30 days',
                      color: 'text-amber-400',
                      border: 'border-amber-500/30 bg-amber-950/20',
                    },
                    {
                      label: 'Average Handle Time',
                      val: '14.0 min',
                      sub: '5–6 min is avoidable 4-tool lookup',
                      color: 'text-amber-300',
                      border: 'border-slate-800 bg-slate-900/70',
                    },
                    {
                      label: 'Reported FRT & CSAT',
                      val: '6m med / 71%',
                      sub: 'P90 FRT: 48m (Masks 11.1% Ent CSAT!)',
                      color: 'text-emerald-400',
                      border: 'border-slate-800 bg-slate-900/70',
                    },
                  ].map((m, i) => (
                    <div key={i} className={`p-3.5 rounded-xl border ${m.border}`}>
                      <div className="text-[11px] font-mono text-slate-400">{m.label}</div>
                      <div className={`text-xl font-bold mt-1 ${m.color}`}>{m.val}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{m.sub}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 3-Column Breakdown: Broken Today vs Constraints vs The Pilot Mystery */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Column 1: How the System Works Today */}
              <div className="rounded-xl bg-[#0d1322] border border-slate-800 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-rose-400 font-mono text-xs uppercase font-bold">
                    <AlertTriangle className="w-4 h-4" />
                    <span>1. How the System Works Today</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-2">
                    Unrouted Queue &amp; 4-System Fragmentation
                  </h3>
                  <ul className="mt-4 space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="text-rose-400 font-bold mt-0.5">•</span>
                      <span>
                        <strong>Zero Routing or Auto-Assignment:</strong> All 1,200 tickets/day land in one
                        general queue. Agents manually cherry-pick tickets; $50K+ ARR Enterprise accounts sit
                        behind free-trial users.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-rose-400 font-bold mt-0.5">•</span>
                      <span>
                        <strong>4 External Tools Beyond Zendesk:</strong> Agents manually alt-tab across (1){' '}
                        <em>Canvasly Admin Portal</em>, (2) <em>Salesforce CRM</em>, (3) a{' '}
                        <em>stale November Google Sheet</em> for pricing/refund policies, and (4){' '}
                        <em>Slack</em> (where escalations take 15m to 4+ hours).
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-rose-400 font-bold mt-0.5">•</span>
                      <span>
                        <strong>3 Brittle Zapier Automations:</strong> (1) Every ticket fires to a muted
                        Slack channel; (2) Closed tickets append to a slow 200K-row Google Sheet; (3) CSAT
                        Slack alerts fail due to Zapier rate limits.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-rose-400 font-bold mt-0.5">•</span>
                      <span>
                        <strong>No After-Hours Tier 2:</strong> Team is staffed 8am–6pm EST (3pm PST!) with
                        zero Tier 2 rotation or SLA tracking.
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800/80 text-xs text-slate-400 font-mono">
                  Annualized ARR Risk: $960K – $2.87M/yr in preventable Enterprise churn
                </div>
              </div>

              {/* Column 2: Strict Operational Constraints */}
              <div className="rounded-xl bg-[#0d1322] border border-sky-500/30 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-sky-400 font-mono text-xs uppercase font-bold">
                    <Lock className="w-4 h-4" />
                    <span>2. Hard Case Constraints (Must Obey)</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-2">
                    Why Generic AI Solutions Disqualify Themselves
                  </h3>
                  <ul className="mt-4 space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                      <span>
                        <strong>$2,500/Month Incremental Budget:</strong> Must exploit unused features already
                        paid for in <em>Zendesk Suite Professional ($89/seat/mo)</em> + lightweight AWS
                        serverless (&lt;$50/mo) + PagerDuty ($385/mo).
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                      <span>
                        <strong>Read-Only APIs &amp; No Stripe API:</strong> We have{' '}
                        <code className="text-sky-300">Zendesk API (R/W)</code>,{' '}
                        <code className="text-amber-300">Salesforce API (READ-ONLY)</code>,{' '}
                        <code className="text-amber-300">Admin Portal API (READ-ONLY)</code>, and{' '}
                        <code className="text-sky-300">Slack API</code>. Proposing direct write-back to
                        Stripe or Salesforce violates the prompt!
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                      <span>
                        <strong>No Internal Tools Team (One Operator in Week 1):</strong> Core product
                        changes take 6–8 weeks. Week 1 must ship via low-risk AWS Lambda + native Zendesk
                        config.
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800/80 text-xs text-sky-300 font-mono">
                  Our Spend: $435/mo SaaS/AWS + $1,500/mo Shift Stipend = $1,935/mo
                </div>
              </div>

              {/* Column 3: The Two-Week Pilot Paradox */}
              <div className="rounded-xl bg-[#0d1322] border border-amber-500/30 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-amber-400 font-mono text-xs uppercase font-bold">
                    <HelpCircle className="w-4 h-4" />
                    <span>3. The Central Diagnostic Mystery</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-2">
                    Why Did 2 Major Accounts Churn During the Pilot?
                  </h3>
                  <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                    A team lead spent <strong>2.5 hrs/day</strong> manually triaging Enterprise tickets to 8
                    dedicated agents for two weeks:
                  </p>
                  <div className="mt-3 space-y-2 text-xs bg-slate-900/90 p-3.5 rounded-lg border border-slate-800">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Daytime Enterprise FRT:</span>
                      <span className="text-emerald-400 font-mono font-bold">11 min → 3 min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Enterprise Pilot CSAT:</span>
                      <span className="text-emerald-400 font-mono font-bold">68% → 88%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">General Queue FRT Impact:</span>
                      <span className="text-rose-400 font-mono font-bold">+5 min worse</span>
                    </div>
                    <div className="pt-2 border-t border-slate-800 text-rose-300 font-medium">
                      ❌ Yet 2 major Enterprise accounts STILL churned citing &ldquo;support
                      responsiveness&rdquo;!
                    </div>
                  </div>
                  <p className="mt-3 text-xs sm:text-sm text-amber-200/90 leading-relaxed">
                    <strong>Our Core Finding:</strong> The pilot optimized <em>time-to-hello (FRT)</em> on
                    daytime chat, while Zendesk timers hid <strong>70-hour Design Curation waits</strong>,{' '}
                    <strong>100% failing Email tickets</strong>, and <strong>3:15pm PST SSO lockouts</strong>.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('diagnosis')}
                  className="mt-6 w-full py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition"
                >
                  <span>See the Proof in the 30-Ticket CSV</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 2: WHAT THE PROBLEM WAS (FORENSIC DATA DIAGNOSIS & 30-TICKET CSV)
           ===================================================================== */}
        {activeTab === 'diagnosis' && (
          <div className="space-y-8">
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <div className="text-xs font-mono uppercase text-sky-400 font-bold">
                  Part 1: Forensic Diagnosis from the 30-Ticket Dataset (T-4801 – T-4830)
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                  Five Non-Obvious Root Causes Hidden Inside the Data
                </h2>
              </div>
              <button
                onClick={() => setActiveTab('solutions')}
                className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs flex items-center gap-1.5 cursor-pointer transition"
              >
                <span>Jump to Our Architecture &amp; Solutions</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Finding 1 & Finding 2 Side-by-Side with Embedded Analytical Figures */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Finding 1 Card */}
              <div className="rounded-2xl bg-[#0d1322] border border-slate-800 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded bg-rose-500/20 border border-rose-500/40 text-rose-300 font-mono text-xs font-bold">
                    FINDING #1 · SIMPSON&apos;S PARADOX
                  </span>
                  <span className="text-xs font-mono text-slate-400">11.1% vs 71.4% Top-2-Box CSAT</span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  71.4% Non-Enterprise CSAT Masks an Active Enterprise Collapse (1.78 / 5.0 CSAT)
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  In the 30-ticket sample, <strong>Non-Enterprise tickets (N=21)</strong> achieve a{' '}
                  <strong className="text-emerald-400">71.4% Top-2-Box CSAT (avg 4.10)</strong> and a{' '}
                  <strong className="text-emerald-400">4.0m median FRT</strong>—matching the company&apos;s
                  reported 71% CSAT and 6m median FRT. High volumes of trivial Non-Enterprise chats completely
                  mask that <strong>Confirmed Enterprise tickets (N=9)</strong> suffer an{' '}
                  <strong className="text-rose-400">11.1% Top-2-Box CSAT (avg 1.78)</strong>, a{' '}
                  <strong className="text-rose-400">41.0m median FRT (10.3x slower)</strong>, and skew{' '}
                  <strong>55.6% to Email</strong>. Worse, Luma&apos;s downgrade (<code>T-4810</code>),
                  Meridian&apos;s Miro threat (<code>T-4824</code>), and DataForge&apos;s cancellation (
                  <code>T-4828</code>) were all assigned <strong>Low priority</strong>.
                </p>
                <div className="rounded-xl overflow-hidden border border-slate-800 bg-white p-1">
                  <img
                    src="./charts/chart1_enterprise_vs_general_gap.png"
                    alt="Figure 1: Enterprise vs Non-Enterprise Bifurcation"
                    className="w-full h-auto rounded-lg"
                  />
                </div>
              </div>

              {/* Finding 2 Card */}
              <div className="rounded-2xl bg-[#0d1322] border border-slate-800 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold">
                    FINDING #2 · WHY THE 2-WEEK PILOT FAILED
                  </span>
                  <span className="text-xs font-mono text-slate-400">3.5x – 118x Timer Distortion</span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  &ldquo;Fast Hello, Slow Fix&rdquo;: Corrupt Zendesk Timers Hide 13h to 70h Customer Waits
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Cross-referencing <code>resolution_min</code> against <code>agent_internal_notes</code>{' '}
                  proves why 2 Enterprise accounts churned during the pilot despite 3m daytime FRT and 88%
                  CSAT: agents mark <code>Magic Import - Quality</code> tickets &ldquo;Solved&rdquo; in{' '}
                  <strong>34–45m</strong> when handing off to a <strong>67–70+ hour Design Curation</strong>{' '}
                  queue while quoting a fictional <strong>2–3h SLA</strong> (<code>T-4811, T-4816</code>). In{' '}
                  <code>T-4804</code>, Meridian Health (450 seats) gave <strong>CSAT=4</strong> on the 6m chat
                  handoff—inflating pilot CSAT—and 26h later (<code>T-4824</code>) threatened to switch to{' '}
                  <strong>Miro</strong>!
                </p>
                <div className="rounded-xl overflow-hidden border border-slate-800 bg-white p-1">
                  <img
                    src="./charts/chart2_pilot_paradox_and_clock_gap.png"
                    alt="Figure 2: The Fast Hello Slow Fix Illusion"
                    className="w-full h-auto rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Finding 3 & Finding 4 Side-by-Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Finding 3 Card */}
              <div className="rounded-2xl bg-[#0d1322] border border-slate-800 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded bg-purple-500/20 border border-purple-500/40 text-purple-300 font-mono text-xs font-bold">
                    FINDING #3 · CHERRY-PICKING &amp; 11%/MO ATTRITION
                  </span>
                  <span className="text-xs font-mono text-slate-400">Maria S. (4.71★) vs James K. (2.00★)</span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  Manual Ticket Picking Leaves James K. Alone on 100% of Emails (0% CSAT &ge; 4)
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  With no auto-assignment, <strong>Maria S.</strong> cherry-picks 100% easy daytime chats (0%
                  escalations, 16.7m mean resolution, <strong>4.71 CSAT</strong>), while{' '}
                  <strong>James K.</strong> is left alone handling <strong>100% of Email tickets (7/7)</strong>
                  —where 55.6% of Enterprise requests arrive—averaging <strong>200.9m resolution</strong> and{' '}
                  <strong className="text-rose-400">2.00 CSAT (0% Top-2-Box)</strong>. Meanwhile,{' '}
                  <strong>26.7% of all volume (~320 tickets/day)</strong> is transient{' '}
                  <code>Magic Import - Error</code> retries and an undocumented <code>&gt;50MB</code> limit (
                  <code>T-4826</code>). Note that <code>T-4830</code> (8pm EST light load) disproves{' '}
                  <code>T-4818</code>&apos;s morning batch hypothesis!
                </p>
                <div className="rounded-xl overflow-hidden border border-slate-800 bg-white p-1">
                  <img
                    src="./charts/chart3_agent_cherry_picking_and_volume.png"
                    alt="Figure 3: Agent Cherry-Picking and Preventable Volume"
                    className="w-full h-auto rounded-lg"
                  />
                </div>
              </div>

              {/* Finding 4 & 5 Card */}
              <div className="rounded-2xl bg-[#0d1322] border border-slate-800 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold">
                    FINDING #4 &amp; #5 · WORKFORCE INSOLVENCY &amp; 3PM PST BLIND SPOT
                  </span>
                  <span className="text-xs font-mono text-slate-400">137% True Net Occupancy</span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  Shrinkage + Weekend Volume = 137% Occupancy; 6pm EST Cutoff Drops West Coast at 3pm PST
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  The CSV spans <strong>Friday Jan 2</strong> and <strong>Saturday Jan 3</strong>. Accounting
                  for 11%/mo attrition vacancies (~5 seats), 7-day coverage (~34 scheduled weekday agents), and
                  25% shrinkage leaves only <strong>~204 productive hours/day</strong> against{' '}
                  <strong>280 handle-hours/day</strong> of demand (<strong>137% net occupancy</strong>). Plus,
                  ending Tier 2 at <code>6:00 PM EST</code> leaves West Coast Enterprise customers unstaffed at{' '}
                  <strong>3:00 PM PST</strong> (causing Ridgeline&apos;s <code>3:15pm PST</code> live
                  presentation lockout in <code>T-4829</code>, even while Tier 1 agent <code>Devon R.</code>{' '}
                  works an unbacked evening shift until 8:15pm EST!).
                </p>
                <div className="rounded-xl overflow-hidden border border-slate-800 bg-white p-1">
                  <img
                    src="./charts/chart4_capacity_and_scaling_model.png"
                    alt="Figure 4: Operational Capacity Model"
                    className="w-full h-auto rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Interactive 30-Ticket Forensic Explorer */}
            <div className="rounded-2xl bg-[#0d1322] border border-slate-800 p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Database className="w-5 h-5 text-sky-400" />
                    <span>Interactive 30-Ticket Sample Forensic Explorer (T-4801 – T-4830)</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Filter by segment, channel, or agent to inspect the exact CSV records and our forensic
                    timer/churn annotations.
                  </p>
                </div>

                {/* Filter Controls */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex rounded-lg bg-slate-900 p-1 border border-slate-800 text-xs">
                    {[
                      { id: 'all', label: 'All (30)' },
                      { id: 'enterprise', label: 'Confirmed Ent (9)' },
                      { id: 'anomalies', label: 'Timer/Churn Anomalies (11)' },
                      { id: 'general', label: 'General (21)' },
                    ].map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setSegmentFilter(f.id as typeof segmentFilter)}
                        className={`px-2.5 py-1 rounded font-medium cursor-pointer transition ${
                          segmentFilter === f.id
                            ? 'bg-sky-500 text-slate-950 font-semibold'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  <select
                    value={channelFilter}
                    onChange={(e) => setChannelFilter(e.target.value as typeof channelFilter)}
                    className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 outline-none"
                  >
                    <option value="all">All Channels</option>
                    <option value="email">Email (7 - 100% James K.)</option>
                    <option value="chat">Chat (20)</option>
                    <option value="voice">Voice (3)</option>
                  </select>

                  <select
                    value={agentFilter}
                    onChange={(e) => setAgentFilter(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 outline-none"
                  >
                    <option value="all">All Agents (4)</option>
                    <option value="James K.">James K. (Email Scapegoat - 2.00★)</option>
                    <option value="Maria S.">Maria S. (Chat Cherry-Picker - 4.71★)</option>
                    <option value="Devon R.">Devon R. (Evening Shift / Hard Esc - 3.40★)</option>
                    <option value="Priya M.">Priya M. (Voice &amp; Curation - 3.50★)</option>
                  </select>

                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Miro, SSO, DataForge..."
                    className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none w-44"
                  />
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-900/90 text-slate-400 font-mono text-[11px] border-b border-slate-800">
                      <th className="p-3">Ticket / Time (EST)</th>
                      <th className="p-3">Segment &amp; Account</th>
                      <th className="p-3">Channel &amp; Category</th>
                      <th className="p-3">ZD Priority</th>
                      <th className="p-3">FRT / ZD Res</th>
                      <th className="p-3">Actual Customer Wait</th>
                      <th className="p-3">Agent &amp; CSAT</th>
                      <th className="p-3">Raw Agent Internal Notes &amp; Forensic Finding</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/70">
                    {filteredTickets.map((t) => {
                      const isEnt = CONFIRMED_ENTERPRISE_IDS.has(t.ticket_id);
                      const anomaly = ACTUAL_WAIT_MAP[t.ticket_id];
                      return (
                        <tr
                          key={t.ticket_id}
                          className={`hover:bg-slate-800/40 transition ${
                            isEnt ? 'bg-rose-950/10' : ''
                          }`}
                        >
                          <td className="p-3 font-mono whitespace-nowrap">
                            <div className="font-bold text-sky-300">{t.ticket_id}</div>
                            <div className="text-[11px] text-slate-500">{t.created_at}</div>
                          </td>
                          <td className="p-3 whitespace-nowrap">
                            {isEnt ? (
                              <span className="px-2 py-0.5 rounded bg-rose-500/20 border border-rose-500/40 text-rose-300 font-mono text-[10px] font-bold">
                                ENTERPRISE VIP
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono text-[10px]">
                                General Queue
                              </span>
                            )}
                            <div className="font-semibold text-slate-200 mt-1">{t.account_name}</div>
                            {isEnt && (
                              <div className="text-[10px] text-slate-400 font-mono">
                                {t.seats} seats · ${(t.arr / 1000).toFixed(0)}K ARR
                              </div>
                            )}
                          </td>
                          <td className="p-3 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono text-[10px] uppercase ${
                                t.channel === 'email'
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                  : t.channel === 'voice'
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                              }`}
                            >
                              {t.channel}
                            </span>
                            <div className="text-slate-200 font-medium mt-1">{t.category}</div>
                          </td>
                          <td className="p-3 font-mono whitespace-nowrap">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                t.priority_assigned === 'High'
                                  ? 'bg-rose-500/20 text-rose-300'
                                  : t.priority_assigned === 'Medium'
                                  ? 'bg-amber-500/20 text-amber-300'
                                  : 'bg-slate-800 text-slate-300'
                              }`}
                            >
                              {t.priority_assigned}
                            </span>
                            {isEnt && t.priority_assigned === 'Low' && (
                              <div className="text-[10px] text-rose-400 font-bold mt-1">
                                ⚠️ Priority Inverted!
                              </div>
                            )}
                          </td>
                          <td className="p-3 font-mono whitespace-nowrap">
                            <div className="text-slate-200">FRT: {t.first_response_min}m</div>
                            <div className="text-slate-400">ZD Res: {t.resolution_min}m</div>
                          </td>
                          <td className="p-3 font-mono whitespace-nowrap">
                            {anomaly ? (
                              <div>
                                <div className="text-rose-400 font-bold">
                                  {anomaly.actualWaitHrs} hrs actual
                                </div>
                                <div className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-200 inline-block mt-0.5">
                                  {anomaly.distortion}
                                </div>
                              </div>
                            ) : (
                              <span className="text-slate-400">{t.resolution_min}m (accurate)</span>
                            )}
                          </td>
                          <td className="p-3 whitespace-nowrap">
                            <div className="font-medium text-slate-200">{t.agent_name}</div>
                            <div
                              className={`font-mono text-xs font-bold mt-0.5 ${
                                t.csat_score >= 4
                                  ? 'text-emerald-400'
                                  : t.csat_score === 3
                                  ? 'text-amber-400'
                                  : 'text-rose-400'
                              }`}
                            >
                              {'★'.repeat(t.csat_score)} ({t.csat_score}/5)
                            </div>
                          </td>
                          <td className="p-3 max-w-md">
                            <p className="text-slate-300 leading-relaxed">{t.agent_internal_notes}</p>
                            {anomaly && (
                              <div className="mt-1.5 p-2 rounded bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-200">
                                <strong>Forensic Note ({anomaly.categoryTag}):</strong> {anomaly.note}
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 3: WHAT SOLUTIONS WE SUGGEST (ARCHITECTURE & LIVE SIMULATORS)
           ===================================================================== */}
        {activeTab === 'solutions' && (
          <div className="space-y-8">
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <div className="text-xs font-mono uppercase text-emerald-400 font-bold">
                  Part 2: Operational Technology Architecture &amp; Interactive Simulators
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                  What We Build, How It Respects Read-Only APIs, and How the Math Works
                </h2>
              </div>
              <button
                onClick={() => setActiveTab('roadmap')}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs flex items-center gap-1.5 cursor-pointer transition"
              >
                <span>See Week 1 vs. Days 8–60 Execution Plan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Interactive Simulator A: Day-1 Internal Note Injector vs Week-2 ZAF Sidebar App */}
            <div className="rounded-2xl bg-[#0d1322] border border-sky-500/30 p-6 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <span className="px-2.5 py-0.5 rounded bg-sky-500/20 border border-sky-500/40 text-sky-300 font-mono text-xs font-bold">
                    INTERACTIVE SIMULATOR A · SOLVING THE 4-TOOL TAX &amp; ROUTING BLINDNESS
                  </span>
                  <h3 className="text-xl font-bold text-white mt-2">
                    Day-1 Zero-Frontend Internal Note Injector → Week-2 Custom ZAF Ticket Sidebar
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
                    Because you are a single operator in Week 1 with <strong>read-only</strong> Salesforce and
                    Admin Portal APIs (and no Stripe API), we ship a <strong>3-hour AWS Lambda webhook on Day 1</strong>{' '}
                    that resolves identity in two tiers and injects a Private Context Note in &lt;2s—then
                    upgrade to an interactive <strong>Zendesk Apps Framework (ZAF) Sidebar</strong> in Week 2.
                  </p>
                </div>

                {/* Mode Switcher */}
                <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-700 text-xs">
                  <button
                    onClick={() => setSimMode('day1_note')}
                    className={`px-3 py-2 rounded-lg font-semibold cursor-pointer transition ${
                      simMode === 'day1_note'
                        ? 'bg-sky-500 text-slate-950'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Day 1–2: Auto-Injected Private Note (3h Build)
                  </button>
                  <button
                    onClick={() => setSimMode('week2_zaf')}
                    className={`px-3 py-2 rounded-lg font-semibold cursor-pointer transition ${
                      simMode === 'week2_zaf'
                        ? 'bg-indigo-500 text-white'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Week 2–3: Interactive ZAF Sidebar + Slack Modals
                  </button>
                </div>
              </div>

              {/* Ticket Selector Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono text-slate-400 mr-1">Select Sample Ticket:</span>
                {[
                  { id: 'T-4824', label: 'T-4824 · Meridian (450 seats · Miro Threat)' },
                  { id: 'T-4805', label: 'T-4805 · 80-Seat Ent Onboarding (<100 Seat Edge Case)' },
                  { id: 'T-4820', label: 'T-4820 · Duplicate Charge (4 Systems / No Stripe API)' },
                  { id: 'T-4829', label: 'T-4829 · Ridgeline (3:15pm PST SSO Lockout)' },
                  { id: 'T-4802', label: 'T-4802 · Invoice Lookup (25m Manual Gathering)' },
                  { id: 'T-4823', label: 'T-4823 · NovaTech (500-Seat Onboarding)' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSimTicketId(item.id);
                      setSlackModalSent(null);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono cursor-pointer transition border ${
                      simTicketId === item.id
                        ? 'bg-sky-500/20 border-sky-400 text-sky-200 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Simulator Split View */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: AWS Lambda Two-Tier Identity & Routing Execution Pipeline */}
                <div className="lg:col-span-5 rounded-xl bg-slate-950 border border-slate-800 p-5 space-y-4 font-mono text-xs">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-sky-400 font-bold flex items-center gap-1.5">
                      <Server className="w-4 h-4" />
                      AWS API Gateway + Lambda Execution
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px]">
                      Latency: 310ms
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
                      <div className="text-slate-400 text-[10px]">STEP 1 · TWO-TIER IDENTITY RESOLUTION</div>
                      <div className="text-emerald-300 font-bold mt-1">
                        ✓ Tier 1 Exact User Email Match: {activeSimTicket.requester_email}
                      </div>
                      <div className="text-slate-300 text-[11px] mt-1">
                        Mapped via Read-Only Admin Portal API → Workspace{' '}
                        <span className="text-sky-300">{activeSimTicket.workspace_id}</span> (
                        {activeSimTicket.account_name}, {activeSimTicket.seats} seats, $
                        {(activeSimTicket.arr / 1000).toFixed(0)}K ARR).
                      </div>
                      {activeSimTicket.ticket_id === 'T-4805' && (
                        <div className="mt-1.5 text-[11px] text-amber-300 bg-amber-500/10 p-1.5 rounded border border-amber-500/30">
                          ⚡ <strong>&lt;100 Seat Rule Triggered:</strong> Seats=80 (&lt;100), but{' '}
                          <code>contract_tier == &apos;Enterprise&apos;</code> &amp;{' '}
                          <code>onboarding_active == true</code> → Tagged <code>vip_enterprise = true</code>!
                        </div>
                      )}
                    </div>

                    <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
                      <div className="text-slate-400 text-[10px]">
                        STEP 2 · DETERMINISTIC ZENDESK PRIORITY &amp; POD ROUTING
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-rose-400 line-through">
                          Legacy Priority: {activeSimTicket.priority_assigned}
                        </span>
                        <span className="text-emerald-400 font-bold">
                          → Overridden to: {activeSimTicket.ai_true_priority}
                        </span>
                      </div>
                      <div className="text-slate-300 text-[11px] mt-1">
                        Omnichannel Auto-Assigned to: <strong>{activeSimTicket.assigned_pod}</strong> (No manual
                        cherry-picking).
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
                      <div className="text-slate-400 text-[10px]">
                        STEP 3 · PAGERDUTY &amp; SLACK ESCALATION WEBHOOKS
                      </div>
                      <div className="text-sky-200 text-[11px] mt-1">
                        {activeSimTicket.category.includes('Access') ? (
                          <span>
                            🚨 <strong>PagerDuty P1 Fired:</strong> Paged On-Call Tier-2 &amp; Eng Rotation
                            (15m Ack SLA) + posted to <code>#incident-tier2-eng</code>.
                          </span>
                        ) : activeSimTicket.ticket_id === 'T-4824' ||
                          activeSimTicket.ticket_id === 'T-4828' ||
                          activeSimTicket.ticket_id === 'T-4810' ? (
                          <span>
                            🔥 <strong>P0 Churn Save Alert:</strong> Tagged CSM ({activeSimTicket.csm_owner})
                            &amp; VP CS in <code>#vip-churn-saves</code> + slotted #1 in Enterprise Design
                            Curation Fast-Track (&lt;4h SLA).
                          </span>
                        ) : (
                          <span>
                            ✓ Context hydrated from Read-Only Salesforce + Admin Portal + S3 Policy Store.
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: What the Agent Sees in Zendesk (Day 1 Internal Note vs Week 2 ZAF Sidebar) */}
                <div className="lg:col-span-7 rounded-xl bg-slate-900 border border-slate-700 p-5 flex flex-col justify-between">
                  {simMode === 'day1_note' ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold">
                            ZENDESK PRIVATE INTERNAL NOTE (AUTO-INJECTED IN 1.4s)
                          </span>
                        </div>
                        <span className="text-xs text-emerald-400 font-mono">
                          0 Frontend Code · Ships Day 1
                        </span>
                      </div>

                      <div className="rounded-lg bg-amber-950/25 border border-amber-500/30 p-4 font-mono text-xs space-y-3 text-amber-100">
                        <div className="font-bold text-amber-300 border-b border-amber-500/20 pb-1.5">
                          🤖 [TECHOPS AUTO-CONTEXT BOT] — DO NOT ALT-TAB TO EXTERNAL SYSTEMS
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px]">
                          <div>
                            <span className="text-slate-400">Account &amp; Tier:</span>{' '}
                            <strong>
                              {activeSimTicket.account_name} ({activeSimTicket.account_tier})
                            </strong>
                          </div>
                          <div>
                            <span className="text-slate-400">Contract ARR &amp; Seats:</span>{' '}
                            <strong>
                              ${activeSimTicket.arr.toLocaleString()}/yr ({activeSimTicket.seats_active}/
                              {activeSimTicket.seats} active)
                            </strong>
                          </div>
                          <div>
                            <span className="text-slate-400">Renewal Date &amp; CSM:</span>{' '}
                            <strong>
                              {activeSimTicket.renewal_date} · {activeSimTicket.csm_owner}
                            </strong>
                          </div>
                          <div>
                            <span className="text-slate-400">Workspace &amp; SSO:</span>{' '}
                            <strong>
                              {activeSimTicket.workspace_id} · {activeSimTicket.sso_provider} (
                              {activeSimTicket.sso_status})
                            </strong>
                          </div>
                        </div>

                        <div className="p-2.5 rounded bg-slate-950/70 border border-slate-800 text-[11px] space-y-1">
                          <div className="text-sky-300 font-bold">
                            📡 Live Admin Portal &amp; Curation Telemetry (Read-Only API):
                          </div>
                          <div>• Last Magic Import Diagnostics: {activeSimTicket.magic_import_last_error}</div>
                          <div>
                            • Live Design Curation Queue ETA:{' '}
                            <strong className="text-emerald-400">
                              Enterprise Fast-Track Lane: ~2.5 hrs
                            </strong>{' '}
                            (General Queue: 70.5 hrs — <em>DO NOT quote 2–3h to Non-Enterprise!</em>)
                          </div>
                        </div>

                        <div className="p-2.5 rounded bg-slate-950/70 border border-slate-800 text-[11px] space-y-1">
                          <div className="text-emerald-300 font-bold">
                            📜 Verified S3 Policy &amp; Pricing Rule (Replaces Nov Google Sheet):
                          </div>
                          <div>• {activeSimTicket.policy_rule_applied}</div>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
                          <span className="text-slate-400">1-Click Deep Links:</span>
                          <span className="underline text-sky-300 cursor-pointer">
                            [Open Salesforce Account ↗]
                          </span>
                          <span className="underline text-sky-300 cursor-pointer">
                            [Open Admin Workspace ↗]
                          </span>
                          <span className="underline text-sky-300 cursor-pointer">
                            [Open Stripe Customer ↗]
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <span className="px-2 py-0.5 rounded bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 font-mono text-xs font-bold">
                          WEEK 2 UPGRADE · CUSTOM ZAF SIDEBAR + 1-CLICK SLACK MODALS
                        </span>
                        <span className="text-xs text-emerald-400 font-mono">
                          Works Around Read-Only APIs
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2.5 text-xs font-mono">
                        <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                          <div className="text-[10px] text-slate-400">SALESFORCE (READ)</div>
                          <div className="text-white font-bold mt-0.5">
                            ${(activeSimTicket.arr / 1000).toFixed(0)}K ARR · {activeSimTicket.seats} Seats
                          </div>
                          <div className="text-[10px] text-sky-400">Renews {activeSimTicket.renewal_date}</div>
                        </div>
                        <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                          <div className="text-[10px] text-slate-400">ADMIN PORTAL (READ)</div>
                          <div className="text-white font-bold mt-0.5">{activeSimTicket.sso_provider}</div>
                          <div className="text-[10px] text-amber-400 truncate">
                            {activeSimTicket.sso_status}
                          </div>
                        </div>
                        <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                          <div className="text-[10px] text-slate-400">CURATION SLA</div>
                          <div className="text-emerald-400 font-bold mt-0.5">VIP Lane: &lt;4h</div>
                          <div className="text-[10px] text-slate-400">Ticket Locked On-Hold</div>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2.5">
                        <div className="text-xs font-semibold text-white">
                          1-Click Structured Action Modals (Via Slack &amp; PagerDuty APIs):
                        </div>
                        <p className="text-[11px] text-slate-400">
                          Because Salesforce &amp; Admin APIs are read-only and we have no Stripe API access,
                          clicking an action below dispatches a pre-populated Slack approval card with 1-click
                          deep-links to Finance, Curation, or On-Call Engineering:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() =>
                              setSlackModalSent(
                                `Dispatched pre-filled Duplicate Charge Refund Card for ${activeSimTicket.account_name} (${activeSimTicket.stripe_invoice_id}) to #finance-approvals with 1-click Stripe deep-link (60s total handle time vs 52m in T-4820).`
                              )
                            }
                            className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-200 text-xs font-medium cursor-pointer transition"
                          >
                            💳 Request Finance Stripe Refund (#finance-approvals)
                          </button>
                          <button
                            onClick={() =>
                              setSlackModalSent(
                                `Slotted ${activeSimTicket.account_name} (${activeSimTicket.seats} seats) into Priority #1 Enterprise Design Curation Lane (<4h SLA) and locked Zendesk ticket On-Hold until delivery.`
                              )
                            }
                            className="px-3 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-sky-200 text-xs font-medium cursor-pointer transition"
                          >
                            🎨 Fast-Track to VIP Design Curation (&lt;4h SLA)
                          </button>
                          <button
                            onClick={() =>
                              setSlackModalSent(
                                `Triggered PagerDuty P1 Incident for ${activeSimTicket.account_name} (${activeSimTicket.workspace_id}) -> 15m Engineering Ack Timer started!`
                              )
                            }
                            className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-200 text-xs font-medium cursor-pointer transition"
                          >
                            🚨 Page On-Call Tier-2 / Eng (15m Ack SLA)
                          </button>
                        </div>

                        {slackModalSent && (
                          <div className="p-2.5 rounded bg-emerald-950/50 border border-emerald-500/40 text-emerald-200 text-xs font-mono">
                            ✓ {slackModalSent}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400">
                      Want to test the full interactive Agent Workspace on this ticket?
                    </span>
                    <button
                      onClick={() => {
                        onSelectTicketInAgent(activeSimTicket);
                        onNavigate('agent');
                      }}
                      className="text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <span>Open {activeSimTicket.ticket_id} in Full Agent Console</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Simulator B: Workforce Capacity, Shrinkage & 6-Month Scaling Model */}
            <div className="rounded-2xl bg-[#0d1322] border border-emerald-500/30 p-6 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold">
                    INTERACTIVE SIMULATOR B · WORKFORCE CAPACITY, SHRINKAGE &amp; 800-ACCOUNT SCALING MATH
                  </span>
                  <h3 className="text-xl font-bold text-white mt-2">
                    Unlocking 144 Agent-Hours/Day (~22 FTEs) to Fund Dedicated Pods Without Starving General Queue
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setSimAccounts(800);
                    setSimAhtSaved(5.5);
                    setSimImportDeflectPct(75);
                    setSimShrinkagePct(25);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-mono cursor-pointer"
                >
                  Reset to Target Plan Defaults
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Sliders Column */}
                <div className="lg:col-span-5 space-y-4 bg-slate-950 p-5 rounded-xl border border-slate-800">
                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span className="text-slate-300">1. Target Enterprise Accounts (6-Mo Goal: 800):</span>
                      <span className="text-sky-400 font-bold">{simAccounts} accounts</span>
                    </div>
                    <input
                      type="range"
                      min={300}
                      max={1000}
                      step={50}
                      value={simAccounts}
                      onChange={(e) => setSimAccounts(Number(e.target.value))}
                      className="w-full accent-sky-400 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span className="text-slate-300">2. Avoidable Lookup AHT Removed (0–6m):</span>
                      <span className="text-emerald-400 font-bold">-{simAhtSaved.toFixed(1)} min/ticket</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={6}
                      step={0.5}
                      value={simAhtSaved}
                      onChange={(e) => setSimAhtSaved(Number(e.target.value))}
                      className="w-full accent-emerald-400 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span className="text-slate-300">
                        3. Magic Import Error Deflection (26.7% of Vol):
                      </span>
                      <span className="text-emerald-400 font-bold">{simImportDeflectPct}% deflected</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={90}
                      step={5}
                      value={simImportDeflectPct}
                      onChange={(e) => setSimImportDeflectPct(Number(e.target.value))}
                      className="w-full accent-emerald-400 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span className="text-slate-300">4. Operational Shrinkage (Breaks/PTO/Training):</span>
                      <span className="text-amber-400 font-bold">{simShrinkagePct}% shrinkage</span>
                    </div>
                    <input
                      type="range"
                      min={15}
                      max={35}
                      step={5}
                      value={simShrinkagePct}
                      onChange={(e) => setSimShrinkagePct(Number(e.target.value))}
                      className="w-full accent-amber-400 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Live Computed Outputs */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                      <div className="text-[11px] font-mono text-slate-400">Daily Handle Load (300 Ent)</div>
                      <div className="text-xl font-bold text-emerald-400 mt-1">
                        {capacityMath.optimizedDailyHoursAt300.toFixed(0)} hrs/day
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Down from {capacityMath.baselineDailyHours.toFixed(0)} hrs/day
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-sky-950/30 border border-sky-500/30">
                      <div className="text-[11px] font-mono text-sky-300">Capacity Freed Immediately</div>
                      <div className="text-xl font-bold text-sky-400 mt-1">
                        +{capacityMath.freedHoursPerDay.toFixed(0)} hrs/day
                      </div>
                      <div className="text-[11px] text-sky-200/80">
                        ≈ {capacityMath.freedFteEquivalent.toFixed(1)} FTEs (~$75K/mo labor)
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                      <div className="text-[11px] font-mono text-slate-400">
                        Net Occupancy (vs {capacityMath.totalNetProductiveHours.toFixed(0)}h Net)
                      </div>
                      <div
                        className={`text-xl font-bold mt-1 ${
                          capacityMath.optimizedNetOccupancyAt300 <= 80
                            ? 'text-emerald-400'
                            : 'text-rose-400'
                        }`}
                      >
                        {capacityMath.optimizedNetOccupancyAt300.toFixed(1)}%
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Was {capacityMath.baselineNetOccupancy.toFixed(0)}% (Insolvent!)
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                      <div className="text-[11px] font-mono text-slate-400">
                        Load at {simAccounts} Ent Accounts
                      </div>
                      <div className="text-xl font-bold text-white mt-1">
                        {capacityMath.scaledDailyHours.toFixed(0)} hrs/day
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {capacityMath.scaledDailyVolume.toLocaleString()} tickets/day @{' '}
                        {capacityMath.effectiveAht.toFixed(1)}m
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                      <div className="text-[11px] font-mono text-slate-400">
                        Occupancy at {simAccounts} Accounts
                      </div>
                      <div
                        className={`text-xl font-bold mt-1 ${
                          capacityMath.scaledNetOccupancy <= 88 ? 'text-emerald-400' : 'text-amber-400'
                        }`}
                      >
                        {capacityMath.scaledNetOccupancy.toFixed(1)}%
                      </div>
                      <div className="text-[11px] text-slate-400">Handled by existing 45 agents</div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
                      <div className="text-[11px] font-mono text-emerald-300">Avoided Linear Hiring</div>
                      <div className="text-xl font-bold text-emerald-400 mt-1">
                        ${(capacityMath.annualSavingsUsd / 1000000).toFixed(2)}M / yr
                      </div>
                      <div className="text-[11px] text-emerald-200/80">
                        45 agents vs {capacityMath.statusQuoAgentsNeeded} status-quo
                      </div>
                    </div>
                  </div>

                  {/* 4-Pod Reallocation Bar */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="text-xs font-semibold text-white flex justify-between">
                      <span>How We Reallocate the 45 Agents Across 4 Specialized Pods (08:00–22:00 EST + 24/7 P1):</span>
                      <span className="font-mono text-sky-400">Total = 45 Agents ($0 New Headcount)</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                      <div className="p-2.5 rounded bg-rose-500/15 border border-rose-500/30">
                        <div className="font-bold text-rose-300">10 Agents · Enterprise VIP</div>
                        <div className="text-[11px] text-slate-300 mt-0.5">
                          Covers Email (55.6%!) + Chat + Voice &amp; Onboarding (08:00–22:00 EST)
                        </div>
                      </div>
                      <div className="p-2.5 rounded bg-purple-500/15 border border-purple-500/30">
                        <div className="font-bold text-purple-300">5 Agents · Tier-2 Specialist</div>
                        <div className="text-[11px] text-slate-300 mt-0.5">
                          SSO/SAML, Jira API, PagerDuty 15m Ack &amp; Evening/Weekend On-Call
                        </div>
                      </div>
                      <div className="p-2.5 rounded bg-amber-500/15 border border-amber-500/30">
                        <div className="font-bold text-amber-300">6 Agents · Billing &amp; Admin</div>
                        <div className="text-[11px] text-slate-300 mt-0.5">
                          Ends James K.&apos;s solo Email bottleneck; handles refunds &amp; contracts
                        </div>
                      </div>
                      <div className="p-2.5 rounded bg-sky-500/15 border border-sky-500/30">
                        <div className="font-bold text-sky-300">24 Agents · General Velocity</div>
                        <div className="text-[11px] text-slate-300 mt-0.5">
                          Auto-assigned Non-Enterprise tickets (more capacity per ticket than today!)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 4: EXECUTION PLAN, BUDGET & STRATEGIC QUESTIONS (WEEK 1 -> DAY 60)
           ===================================================================== */}
        {activeTab === 'roadmap' && (
          <div className="space-y-8">
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <div className="text-xs font-mono uppercase text-amber-400 font-bold">
                  Part 3 &amp; 4: Sequenced Execution Plan, Budget Governance &amp; Challenging Assumptions
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                  What We Ship in Week 1 to Stop the Bleeding vs. Days 8–60
                </h2>
              </div>
              <button
                onClick={() => setActiveTab('memo')}
                className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs flex items-center gap-1.5 cursor-pointer transition"
              >
                <BookOpen className="w-4 h-4" />
                <span>View Complete Written Case Study Document</span>
              </button>
            </div>

            {/* 3-Phase Execution Roadmap */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Phase 1: Week 1 */}
              <div className="rounded-2xl bg-[#0d1322] border-2 border-rose-500/40 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono text-xs font-bold">
                    PHASE 1 · WEEK 1 (DAYS 1–7)
                  </span>
                  <span className="text-xs font-mono text-slate-400">Zero Core-Eng Dependency</span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  Stop the Bleeding (Scoped for 1 Operator in 7 Days)
                </h3>
                <ul className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  <li>
                    <strong className="text-sky-300">Days 1–2 (Identity &amp; Day-1 Context Note):</strong>{' '}
                    Deploy AWS Lambda Two-Tier Identity Sync (exact user email from Admin/SFDC APIs + domain
                    fallback + <code>T-4805</code> 80-seat onboarding rule). Ship 3-hour Lambda{' '}
                    <strong>Private Internal Note Injector</strong> (-80% lookup waste on Day 2 with 0 frontend
                    risk). Turn on Zendesk Omnichannel Auto-Routing &amp; P0–P3 Priority Triggers.
                  </li>
                  <li>
                    <strong className="text-sky-300">Days 3–4 (4 Pods + West Coast Coverage):</strong> Split 45
                    agents into <strong>Enterprise VIP (10, Email+Chat+Voice)</strong>,{' '}
                    <strong>Tier-2 (5)</strong>, <strong>Billing (6)</strong>, and{' '}
                    <strong>General (24)</strong>. Use <code>$1,500/mo</code> budget for voluntary{' '}
                    <code>13:30–22:00 EST</code> (until <code>7pm PST</code>) shift differentials + deploy{' '}
                    <strong>PagerDuty ($385/mo)</strong> with a 15-min Ack SLA for P1 SSO outages.
                  </li>
                  <li>
                    <strong className="text-sky-300">Days 5–7 (Gate Curation &amp; Churn Saves):</strong> Cut
                    Design Curation inflow ($\lambda$) by ~60% by gating free/unsupported uploads (
                    <code>T-4811, T-4816</code>) to self-serve guides; create an{' '}
                    <strong>Enterprise Curation Fast-Track (&lt;4h SLA)</strong>; lock tickets{' '}
                    <code>On-Hold</code> until delivery; and personally call all 6 at-risk Enterprise accounts.
                  </li>
                </ul>
              </div>

              {/* Phase 2: Weeks 2–4 */}
              <div className="rounded-2xl bg-[#0d1322] border border-sky-500/30 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono text-xs font-bold">
                    PHASE 2 · WEEKS 2–4 (DAYS 8–30)
                  </span>
                  <span className="text-xs font-mono text-slate-400">Unlock Full 144 hrs/day</span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  ZAF Sidebar, Import Deflection &amp; Onboarding Runbook
                </h3>
                <ul className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  <li>
                    <strong className="text-emerald-300">1. Interactive ZAF Ticket Sidebar App:</strong>{' '}
                    Upgrade the Day-1 Internal Note into a persistent right-hand ZAF app featuring 1-click
                    Slack approval modals for duplicate-charge Stripe refunds (<code>T-4820</code>) and Tier-2
                    engineering escalations.
                  </li>
                  <li>
                    <strong className="text-emerald-300">
                      2. Deflect 75% of <code>Magic Import - Error</code> (~240/day):
                    </strong>{' '}
                    Pre-ticket bot checks last failed upload via Admin API: instantly flags{' '}
                    <code>&gt;50MB</code> files (<code>T-4826</code>) and triggers 1-click retry on transient
                    timeouts. Deliver data packet (<code>T-4830</code> 8pm proof) to sponsor core Eng auto-retry.
                  </li>
                  <li>
                    <strong className="text-emerald-300">
                      3. Pre-Launch Enterprise Onboarding Runbook:
                    </strong>{' '}
                    To handle <strong>~3.8 onboardings/day</strong> (500 accounts in 6m), trigger an automated
                    SSO + Custom Domain + Data Residency checklist at Salesforce <code>Closed Won</code> (7
                    days pre-launch, fixing <code>T-4823</code>).
                  </li>
                  <li>
                    <strong className="text-emerald-300">4. Retire Zapier &amp; Fix KB:</strong> Replace
                    200K-row Sheet Zap with Zendesk Explore + S3/Athena; publish v2 Jira API docs (
                    <code>T-4819</code>) and Cursor Sync guide (<code>T-4812</code>).
                  </li>
                </ul>
              </div>

              {/* Phase 3: Weeks 5–8 */}
              <div className="rounded-2xl bg-[#0d1322] border border-emerald-500/30 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold">
                    PHASE 3 · WEEKS 5–8 (DAYS 31–60)
                  </span>
                  <span className="text-xs font-mono text-slate-400">Scale to 800 Accounts</span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  Proactive Telemetry Intercept &amp; Core Product Fixes
                </h3>
                <ul className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  <li>
                    <strong className="text-purple-300">1. Proactive Pre-Ticket Enterprise Intercept:</strong>{' '}
                    AWS EventBridge poller checks Admin Portal API every 5m: if an Enterprise workspace hits{' '}
                    <code>&ge;2</code> Magic Import failures or <code>&ge;3</code> SSO errors in 60m,
                    auto-opens a proactive P1 outreach ticket <em>before</em> the customer threatens to switch
                    to Miro.
                  </li>
                  <li>
                    <strong className="text-purple-300">2. Core Engineering Fixes Go Live (Weeks 6–8):</strong>{' '}
                    Backend exponential-backoff retry wrapper and explicit <code>&gt;50MB</code> UI validation
                    ship in core product, permanently eliminating ~250–300 tickets/day.
                  </li>
                  <li>
                    <strong className="text-purple-300">3. Sustainable 800-Account Operations:</strong> All 800
                    Enterprise accounts supported by the existing 45-agent roster at ~67%–78% net occupancy,
                    cutting monthly agent attrition from <code>11%</code> to <code>&le;4%</code> and saving{' '}
                    <strong>$3.14M/year</strong>.
                  </li>
                </ul>
              </div>
            </div>

            {/* Budget & Challenging Assumptions Split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Budget Table */}
              <div className="lg:col-span-6 rounded-2xl bg-[#0d1322] border border-slate-800 p-6 space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center justify-between">
                  <span>Monthly Incremental Budget Governance</span>
                  <span className="text-xs font-mono px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300">
                    $1,935 / $2,500 Cap ($565 Buffer)
                  </span>
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-mono">
                        <th className="py-2">Line Item</th>
                        <th className="py-2">Scope</th>
                        <th className="py-2 text-right">Monthly Cost</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      <tr>
                        <td className="py-2.5 font-semibold text-white">Zendesk Suite Pro Native Features</td>
                        <td className="py-2.5 text-slate-300">
                          Omnichannel Routing, Custom Fields, ZAF Hosting, Webhooks, Explore Pro
                        </td>
                        <td className="py-2.5 text-right font-mono text-emerald-400 font-bold">$0 / mo</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-semibold text-white">AWS Serverless Glue Stack</td>
                        <td className="py-2.5 text-slate-300">
                          API Gateway, Lambda (~2M calls), EventBridge, S3 Policy/Archive, Athena
                        </td>
                        <td className="py-2.5 text-right font-mono text-emerald-400 font-bold">~$50 / mo</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-semibold text-white">PagerDuty / Opsgenie (11 Seats)</td>
                        <td className="py-2.5 text-slate-300">
                          5 Tier-2 + 6 Eng On-Call rotation (24/7 P1 paging &amp; 15m Ack SLA)
                        </td>
                        <td className="py-2.5 text-right font-mono text-sky-300 font-bold">$385 / mo</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-semibold text-white">
                          Voluntary Evening &amp; P1 On-Call Stipends
                        </td>
                        <td className="py-2.5 text-slate-300">
                          Covers 13:30–22:00 EST (until 7pm PST) shift differential + 24/7 P1 standby
                        </td>
                        <td className="py-2.5 text-right font-mono text-amber-300 font-bold">$1,500 / mo</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-semibold text-slate-400">Unallocated Contingency Reserve</td>
                        <td className="py-2.5 text-slate-400">
                          22.6% buffer below the $2,500/mo ceiling
                        </td>
                        <td className="py-2.5 text-right font-mono text-slate-400">$565 / mo</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Challenging Assumptions */}
              <div className="lg:col-span-6 rounded-2xl bg-[#0d1322] border border-amber-500/30 p-6 space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <span>Challenging Assumptions &amp; Questions for Leadership</span>
                </h3>
                <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
                  <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
                    <strong className="text-amber-300">
                      1. &ldquo;Support Responsiveness&rdquo; Masks a 4-Month Product Regression (T-4810,
                      T-4824, T-4828):
                    </strong>{' '}
                    100% of Enterprise downgrade, cancellation, and Miro churn threats in the CSV explicitly
                    pair support responsiveness with <em>&ldquo;Magic Import quality regression since 4 months
                    ago.&rdquo;</em> Support cannot triage its way out of a broken core AI feature if human
                    Design Curation has a 70+ hour backlog. <em>What changed in Magic Import 4 months ago, and
                    who owns the Design Curation team&apos;s capacity today?</em>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
                    <strong className="text-amber-300">
                      2. Duplicate Stripe Billing Idempotency Bug (T-4820):
                    </strong>{' '}
                    Devon R. notes that double-charging customers for the same billing period has happened{' '}
                    <strong>3 times this month</strong>. While our Slack workflow speeds up refunds, we must
                    deliver the 3 duplicate charge IDs to Engineering on Day 2 to fix the Stripe webhook
                    idempotency key.
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
                    <strong className="text-amber-300">
                      3. Gating Sales-to-Support Handoffs for 3.8 Onboardings/Day (T-4805, T-4823):
                    </strong>{' '}
                    Complex Enterprise requirements (SSO, custom domains, data residency) must be provisioned
                    via an automated checklist at Salesforce <code>Closed Won</code>—never discovered via a
                    reactive email after 80–500 users are already locked out.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 5: FULL WRITTEN CASE STUDY MEMO & ANALYTICAL CHARTS
           ===================================================================== */}
        {activeTab === 'memo' && (
          <div className="space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <div className="text-xs font-mono uppercase text-sky-400 font-bold">
                  Complete Executive Deliverable (Written in Complete Narrative Sentences)
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                  Canvasly Technical Operations Case Study Submission
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="./Canvasly_Case_Study_Submission.md"
                  download="Canvasly_Case_Study_Submission.md"
                  className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs flex items-center gap-1.5 transition"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Markdown (.md)</span>
                </a>
              </div>
            </div>

            {/* Rendered Executive Memo Article */}
            <article className="rounded-2xl bg-[#0d1322] border border-slate-800 p-6 sm:p-10 space-y-8 text-slate-200 leading-relaxed text-sm sm:text-base max-w-5xl mx-auto shadow-2xl">
              <div className="border-b border-slate-800 pb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  Canvasly Technical Operations Case Study: Stopping Enterprise Churn and Scaling from 300 to
                  800 Accounts
                </h1>
                <p className="text-xs font-mono text-slate-400 mt-2">
                  Author: Head of Technical Operations · Scope: Root-Cause Diagnosis, Operational Technology
                  Architecture, Workforce &amp; Queuing Math, and Sequenced Execution Plan (Week 1 vs. Days
                  8–60)
                </p>
              </div>

              <section className="space-y-4">
                <h2 className="text-xl font-bold text-sky-400">Executive Summary</h2>
                <p>
                  Canvasly&apos;s support organization does not suffer from a frontline chat speed problem; it
                  suffers from an <strong>Enterprise outcome, routing, and visibility crisis</strong> that is
                  statistically masked by a high volume of trivial Non-Enterprise tickets. Over the past two
                  quarters, quarterly Enterprise churn has more than doubled from <strong>1.8% to 4.2%</strong>{' '}
                  (<code>12.6</code> churned Enterprise accounts per quarter, with <code>38%</code>—or{' '}
                  <code>~4.8</code> accounts per quarter—directly citing support responsiveness). At an average
                  Enterprise contract value of <code>$50,000</code> to <code>$150,000+</code> ARR across{' '}
                  <code>100–500</code> seats, support-driven churn alone is destroying{' '}
                  <strong>$960,000 to $2.87M+ in annualized recurring revenue</strong>. At the same time,
                  Canvasly plans to onboard <strong>500 additional Enterprise accounts over the next 6
                  months</strong> (<code>300 → 800</code> accounts, a <code>2.67x</code> expansion requiring{' '}
                  <strong>~3.8 Enterprise onboardings every business day</strong>). Under the current operating
                  model, scaling headcount linearly would require hiring <strong>+75 net new agents</strong>{' '}
                  (plus <code>5 to 13</code> replacement hires every month to offset the{' '}
                  <strong>11% monthly agent attrition</strong>), adding <strong>$3.14M per year</strong> in
                  payroll and licensing while leaving the underlying drivers of Enterprise churn untouched.
                </p>
                <p>
                  Cross-referencing the 30-ticket sample (<code>T-4801</code> through <code>T-4830</code>)
                  against the company&apos;s baseline metrics explains why the recent two-week manual triage
                  pilot failed to prevent two major Enterprise accounts from churning despite cutting daytime
                  Enterprise First Response Time (FRT) from <code>11 minutes</code> to <code>3 minutes</code>{' '}
                  and lifting Enterprise CSAT from <code>68%</code> to <code>88%</code>.{' '}
                  <strong>
                    Canvasly measures and optimizes the speed of the initial hello, whereas Enterprise
                    customers churn over the speed and reliability of the outcome.
                  </strong>
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-bold text-sky-400">
                  Part 1: Diagnosis — The Highest-Leverage Problems in the Data
                </h2>
                <h3 className="text-lg font-semibold text-white">
                  1. Simpson&apos;s Paradox: High-Volume Trivial Chats Mask an Active Enterprise Collapse
                </h3>
                <p>
                  In the 30-ticket sample, Non-Enterprise tickets (<code>N = 21</code>) achieve a{' '}
                  <strong>71.4% Top-2-Box CSAT (score &ge; 4, mean 4.10)</strong> and a{' '}
                  <strong>4.0-minute median FRT</strong>, which closely mirrors the company&apos;s reported{' '}
                  <code>71%</code> CSAT and <code>6-minute</code> median FRT. Because <code>70%</code> of the
                  queue consists of fast Non-Enterprise interactions, aggregate reporting conceals the fact
                  that <strong>Confirmed Enterprise tickets (N = 9 across 7 named accounts)</strong> average a{' '}
                  <strong>1.78 / 5.0 CSAT (11.1% Top-2-Box)</strong>, a <strong>41.0-minute median FRT (10.3x
                  slower)</strong>, and a <strong>142.0-minute median reported resolution time (6.5x
                  slower)</strong>. Moreover, while Non-Enterprise volume is <code>76.2%</code> Chat,
                  Enterprise volume is <strong>55.6% Email (5/9)</strong> and <strong>44.4% Chat (4/9)</strong>.
                  Worst of all, Luma Analytics&apos; 200-seat downgrade (<code>T-4810</code>), Meridian
                  Health&apos;s 450-seat threat to switch to Miro (<code>T-4824</code>), and DataForge&apos;s
                  175-seat formal cancellation (<code>T-4828</code>) were all assigned{' '}
                  <strong>Low priority</strong>.
                </p>
                <div className="rounded-xl overflow-hidden bg-white p-2 border border-slate-700">
                  <img
                    src="./charts/chart1_enterprise_vs_general_gap.png"
                    alt="Figure 1"
                    className="w-full h-auto"
                  />
                </div>

                <h3 className="text-lg font-semibold text-white pt-4">
                  2. Why the Two-Week Pilot Failed: Corrupt Zendesk Timers (3.5x–118x Distortion), Design
                  Curation Queuing Collapse (&lambda; &gt; &mu;), and the 3:00 PM PST Blind Spot
                </h3>
                <p>
                  Comparing <code>resolution_min</code> against <code>agent_internal_notes</code> proves that
                  Zendesk&apos;s timers systematically hide real customer wait times:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Handoff Gaming &amp; Unstable Design Curation Backlog (T-4804, T-4811, T-4816,
                    T-4824):</strong> Frontline agents reply in <code>3–6 minutes</code>, quote a static{' '}
                    <code>2–3 hour</code> SLA, hand off the PDF to Design Curation, and mark the Zendesk ticket
                    &ldquo;Solved&rdquo; in <code>34–45 minutes</code>. In <code>T-4804</code>, Meridian Health
                    (450 seats) gave a <code>CSAT = 4</code> on the polite chat handoff—inflating the
                    pilot&apos;s 88% CSAT—while waiting in a <strong>67-hour Curation backlog</strong> for the
                    third time that week, before threatening to switch to Miro 26 hours later (
                    <code>T-4824</code>). Furthermore, between <code>T-4811</code> (Jan 2 16:40, queue = 67h)
                    and <code>T-4816</code> (Jan 3 08:15, queue = 70+h), the backlog grew by{' '}
                    <strong>+3 hours overnight</strong>, proving by Little&apos;s Law that arrival rate
                    (&lambda; &approx; 160/day) exceeds service capacity (&mu;).
                  </li>
                  <li>
                    <strong>The &ldquo;6:00 PM EST = 3:00 PM PST&rdquo; West Coast Blind Spot &amp; Evening
                    Shift Contradiction (T-4813, T-4829):</strong> Ending Tier 2 coverage at 6:00 PM EST leaves
                    West Coast Enterprise customers unprotected at <strong>3:00 PM PST</strong>. Ridgeline Corp
                    (250 seats, <code>T-4829</code>) was locked out during a live client presentation at 6:15
                    PM EST (3:15 PM PST), and CoreVista (300 seats, <code>T-4813</code>) was locked out at 7:45
                    PM EST (4:45 PM PST). The CSV also reveals that Tier 1 agent <code>Devon R.</code> is
                    working an evening shift until 8:15 PM EST without Tier 2 backing, leaving P1 SSO outages
                    stranded overnight for 13–15 hours (logged as 187–195m).
                  </li>
                  <li>
                    <strong>The &lt;100 Seat Enterprise Onboarding Edge Case (T-4805):</strong> While the
                    summary table defines Enterprise as <code>100+ seats</code>, <code>T-4805</code> is an{' '}
                    <strong>80-seat Enterprise onboarding</strong> whose CEO emailed Canvasly&apos;s CEO after
                    a 3.5-hour Engineering Slack stall (logged as 67m).
                  </li>
                </ul>
                <div className="rounded-xl overflow-hidden bg-white p-2 border border-slate-700">
                  <img
                    src="./charts/chart2_pilot_paradox_and_clock_gap.png"
                    alt="Figure 2"
                    className="w-full h-auto"
                  />
                </div>

                <h3 className="text-lg font-semibold text-white pt-4">
                  3. Manual Queue Cherry-Picking (Maria S. vs. James K.), True Workforce Occupancy (137%), and
                  the 144-Hour/Day Capacity Unlock
                </h3>
                <p>
                  Because tickets sit in an unrouted manual queue, <code>Maria S.</code> cherry-picks 100% easy
                  daytime chats (<code>16.7m</code> mean resolution, <code>0%</code> escalations,{' '}
                  <code>4.71</code> CSAT), leaving <code>James K.</code> alone on <strong>100% of Email tickets
                  (7/7)</strong> with a <code>200.9m</code> mean resolution and <code>2.00</code> CSAT (0%
                  Top-2-Box). Accounting for 7-day volume (Friday Jan 2 + Saturday Jan 3 in the CSV), ~5 vacant
                  seats from 11%/mo attrition, and 25% operational shrinkage leaves only{' '}
                  <strong>~204 net productive hours/day</strong> against <strong>280 handle-hours/day</strong>{' '}
                  (<strong>137% net occupancy</strong>). Eliminating <code>5.5m</code> of avoidable 4-tool
                  lookup time (<code>-110 hrs/day</code>) and deflecting 75% of transient{' '}
                  <code>Magic Import - Error</code> retries (<code>26.7%</code> of sample volume;{' '}
                  <code>-34 hrs/day</code>) reduces workload from <code>280 hrs/day</code> to{' '}
                  <code>136 hrs/day</code>—freeing <strong>144 agent-hours/day (~22 FTEs)</strong>.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-xl overflow-hidden bg-white p-2 border border-slate-700">
                    <img
                      src="./charts/chart3_agent_cherry_picking_and_volume.png"
                      alt="Figure 3"
                      className="w-full h-auto"
                    />
                  </div>
                  <div className="rounded-xl overflow-hidden bg-white p-2 border border-slate-700">
                    <img
                      src="./charts/chart4_capacity_and_scaling_model.png"
                      alt="Figure 4"
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              </section>
            </article>
          </div>
        )}
      </main>
    </div>
  );
};
