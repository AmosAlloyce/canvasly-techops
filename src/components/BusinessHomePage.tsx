import React, { useState } from 'react';
import {
  Activity,
  ArrowRight,
  Check,
  Cpu,
  Database,
  FileCode2,
  Globe,
  Headphones,
  Layers,
  LayoutGrid,
  Lock,
  MousePointer2,
  Radio,
  Server,
  ShieldCheck,
  Sparkles,
  Users,
  Wand2,
  Workflow,
  Zap,
} from 'lucide-react';
import {
  CANVASLY_GLOBE_NODES,
  InteractiveBusinessGlobe,
} from './InteractiveBusinessGlobe';

interface BusinessHomePageProps {
  onNavigate: (view: 'home' | 'canvas' | 'agent' | 'datadog' | 'wfm') => void;
}

export const BusinessHomePage: React.FC<BusinessHomePageProps> = ({ onNavigate }) => {
  const [activeGlobeIndex, setActiveGlobeIndex] = useState<number>(0);
  const [heroTab, setHeroTab] = useState<'canvas' | 'magic-import' | 'enterprise'>('canvas');
  const [activeUseCase, setActiveUseCase] = useState<'engineering' | 'product' | 'operations'>('engineering');

  const currentGlobeNode = CANVASLY_GLOBE_NODES[activeGlobeIndex] || CANVASLY_GLOBE_NODES[0];

  return (
    <div className="min-h-screen bg-[#070d17] text-[#f1f7ff] selection:bg-[#7fd0ff] selection:text-[#06101d]">
      {/* Top SaaS Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-[#1f3149] bg-[#070d17]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          {/* Brand Logo */}
          <div className="flex items-center gap-10">
            <a href="#top" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#7fd0ff] to-[#4ea8ff] font-bold text-[#06101d] shadow-md shadow-[#7fd0ff]/20">
                <Layers className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                CANVASLY <span className="font-normal text-xs text-[#a9bad0] tracking-widest ml-1">ENTERPRISE</span>
              </span>
            </a>

            {/* Primary Nav Links */}
            <nav className="hidden items-center gap-7 text-sm font-medium text-[#a9bad0] md:flex">
              <a href="#what-we-do" className="transition hover:text-white">
                What We Build
              </a>
              <a href="#magic-import" className="transition hover:text-white">
                Magic Import™
              </a>
              <a href="#open-source-stack" className="transition hover:text-white">
                Open-Source Ops Stack
              </a>
              <a href="#live-surfaces" className="transition hover:text-white">
                Live Systems
              </a>
              <a href="#pricing" className="transition hover:text-white">
                Pricing
              </a>
            </nav>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onNavigate('datadog')}
              className="hidden rounded-lg border border-[#632CA6]/60 bg-[#632CA6]/20 px-3 py-2 font-mono text-xs font-medium text-purple-200 transition hover:bg-[#632CA6]/35 lg:inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Activity className="h-3.5 w-3.5 text-purple-300" />
              Datadog &amp; n8n (:5678)
            </button>
            <button
              onClick={() => onNavigate('agent')}
              className="hidden rounded-lg border border-[#1f3149] bg-[#0d1726] px-3.5 py-2 text-xs font-medium text-[#f1f7ff] transition hover:border-[#3a5676] hover:bg-[#13223a] sm:inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Headphones className="h-3.5 w-3.5 text-[#7fd0ff]" />
              0-Tab Agent Console
            </button>
            <button
              onClick={() => onNavigate('canvas')}
              className="inline-flex items-center gap-2 rounded-lg bg-[#eef5ff] px-4 py-2 text-xs font-semibold text-[#06101d] shadow-lg shadow-[#7fd0ff]/20 transition hover:bg-white cursor-pointer"
            >
              Launch Canvas Studio
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Asterion-Style Hero Stage with Interactive Spinning 3D Capability Globe in the Background */}
      <section
        id="top"
        className="relative min-h-[760px] overflow-hidden border-b border-[#1f3149] flex items-center py-20 lg:py-28"
      >
        {/* Ambient Horizon Glows */}
        <div className="pointer-events-none absolute top-12 right-[12%] -z-10 h-[520px] w-[520px] rounded-full bg-[#1d7fd4]/20 blur-[130px]" />
        <div className="pointer-events-none absolute bottom-0 left-[10%] -z-10 h-[380px] w-[620px] rounded-full bg-[#5a6cff]/10 blur-[120px]" />

        {/* Interactive Spinning 3D Globe Background Layer */}
        <InteractiveBusinessGlobe
          activeNodeIndex={activeGlobeIndex}
          onSelectNode={(idx) => setActiveGlobeIndex(idx)}
        />

        {/* Foreground Hero Content */}
        <div className="pointer-events-none relative z-10 mx-auto w-full max-w-7xl px-6">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            {/* Left Copy Column */}
            <div className="pointer-events-auto lg:col-span-7">
              <p className="font-mono text-xs font-medium uppercase tracking-widest text-[#7fd0ff] flex items-center gap-2">
                <span>Canvasly Inc.</span>
                <span className="text-[#3a5676]">/</span>
                <span className="text-[#a9bad0]">Infinite Canvas, Spatial AI &amp; Zero-Cost Open-Source TechOps</span>
              </p>

              <h1 className="mt-6 text-5xl font-semibold tracking-[-0.045em] text-[#f1f7ff] sm:text-6xl lg:text-[68px] leading-[1.02]">
                Visual systems built around{' '}
                <em className="font-serif italic font-normal text-[#7fd0ff]">how teams think.</em>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-relaxed text-[#a9bad0] sm:text-lg">
                Canvasly connects every stage of how enterprise teams design and ship: real-time architecture
                whiteboarding, <strong className="font-medium text-[#f1f7ff]">Magic Import™ AI</strong> that converts
                whiteboard photos into editable vector diagrams, human-verified Smart Curation, and autonomous
                operations powered by <strong className="font-medium text-[#8fe3b8]">n8n + Groq LPU on OCI Free</strong>.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onNavigate('canvas')}
                  className="inline-flex items-center gap-2.5 rounded-xl bg-[#eef5ff] px-5 py-3.5 text-sm font-semibold text-[#06101d] shadow-xl transition hover:bg-white cursor-pointer"
                >
                  1. Open Canvasly Studio
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onNavigate('agent')}
                  className="inline-flex items-center gap-2 rounded-xl border border-[#1f3149] bg-[#0d1726]/90 px-4 py-3.5 text-sm font-medium text-[#f1f7ff] backdrop-blur-md transition hover:border-[#7fd0ff] hover:bg-[#13223a] cursor-pointer"
                >
                  2. 0-Tab Agent Console
                </button>
                <button
                  onClick={() => onNavigate('datadog')}
                  className="inline-flex items-center gap-2 rounded-xl border border-[#632CA6]/60 bg-[#632CA6]/20 px-4 py-3.5 text-sm font-medium text-purple-200 backdrop-blur-md transition hover:bg-[#632CA6]/35 cursor-pointer"
                >
                  3. Datadog &amp; n8n Engine
                </button>
              </div>

              {/* Live Synchronized Globe Capability Spotlight Card */}
              <div className="mt-10 max-w-xl rounded-2xl border border-[#1f3149] bg-[#0d1726]/90 p-5 shadow-2xl backdrop-blur-xl">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1f3149] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#8fe3b8] animate-pulse" />
                    <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#7fd0ff]">
                      {currentGlobeNode.category}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-[#8fe3b8] bg-[#8fe3b8]/10 border border-[#8fe3b8]/30 px-2.5 py-0.5 rounded-full">
                    {currentGlobeNode.event}
                  </span>
                </div>

                <div className="mt-3.5 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span>{currentGlobeNode.label}</span>
                      <span className="font-mono text-xs font-normal text-[#a9bad0]">
                        — {currentGlobeNode.metric}
                      </span>
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-[#a9bad0]">
                      {currentGlobeNode.description}
                    </p>
                  </div>
                </div>

                {/* Interactive Globe Point Selector Pills */}
                <div className="mt-4 flex flex-wrap gap-1.5 pt-2 border-t border-[#1f3149]/70">
                  {CANVASLY_GLOBE_NODES.map((node, index) => {
                    const active = index === activeGlobeIndex;
                    return (
                      <button
                        key={node.id}
                        onClick={() => setActiveGlobeIndex(index)}
                        className={`rounded-lg px-2.5 py-1 font-mono text-[10px] font-medium transition cursor-pointer ${
                          active
                            ? 'bg-[#7fd0ff] text-[#06101d] font-bold shadow'
                            : 'bg-[#13223a]/70 text-[#a9bad0] hover:bg-[#13223a] hover:text-white'
                        }`}
                      >
                        {index + 1}. {node.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 flex items-center gap-4 text-xs text-[#a9bad0]">
                <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[#7fd0ff]">
                  <Globe className="h-3.5 w-3.5" />
                  Interactive 3D Globe:
                </span>
                <span>Move cursor, drag to spin, or click any orbital node on the globe to inspect.</span>
              </div>
            </div>

            {/* Right Column Spacer — Lets the 3D Globe shine unobstructed on desktop */}
            <div className="hidden lg:col-span-5 lg:block h-[520px]" />
          </div>
        </div>
      </section>

      {/* Enterprise Social Proof & Scale Metrics */}
      <section className="border-b border-[#1f3149] bg-[#0a1322] py-12">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-center font-mono text-xs font-semibold uppercase tracking-widest text-[#a9bad0]">
            Trusted by 800+ high-growth &amp; enterprise engineering organizations worldwide
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4 text-center sm:grid-cols-3 md:grid-cols-6 items-center">
            {[
              'Meridian Health',
              'DataForge',
              'NovaTech',
              'CoreVista',
              'Luma Analytics',
              'Ridgeline Corp',
            ].map((company) => (
              <div
                key={company}
                className="rounded-xl border border-[#1f3149] bg-[#0d1726]/70 py-3 px-4 text-sm font-semibold tracking-tight text-[#f1f7ff]"
              >
                {company}
              </div>
            ))}
          </div>

          <div className="mt-12 grid grid-cols-2 gap-8 border-t border-[#1f3149] pt-10 md:grid-cols-4">
            <div>
              <div className="text-3xl font-extrabold text-white">300 ➔ 800</div>
              <div className="mt-1 text-xs text-[#a9bad0]">Enterprise Accounts Scaled in 6 Months</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-[#7fd0ff]">1.4m FRT</div>
              <div className="mt-1 text-xs text-[#a9bad0]">Down from 48m p90 via Groq LPU + n8n Push Routing</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-[#8fe3b8]">38m SLA</div>
              <div className="mt-1 text-xs text-[#a9bad0]">Enterprise Smart Curation Fast-Lane (vs 70h General)</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-white">$0 / mo</div>
              <div className="mt-1 text-xs text-[#a9bad0]">Incremental Ops Stack Cost (Saves $48K/yr Zendesk)</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Live Product & Operational Surfaces Launcher (The Agreed 4-Surface Architecture) */}
      <section id="live-surfaces" className="py-24 border-b border-[#1f3149] bg-[#070d17]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl">
            <div className="font-mono text-xs font-semibold uppercase tracking-widest text-[#7fd0ff]">
              LIVE BUSINESS-IN-A-BOX ECOSYSTEM
            </div>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Explore all 4 live product &amp; technical operations surfaces.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#a9bad0]">
              A real $50M+ ARR SaaS business isn’t a single static dashboard—it is a living ecosystem of customer
              product studio, zero-tab support engineering, real n8n workflow orchestration, and Datadog APM telemetry.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Surface 1: Canvasly Studio */}
            <div className="group rounded-2xl border border-[#1f3149] bg-[#0d1726] p-7 transition hover:border-[#7fd0ff]/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#7fd0ff] bg-[#7fd0ff]/10 px-2.5 py-1 rounded">
                    Surface 01 • Customer Experience (Figma / FigJam + WorkOS Style)
                  </span>
                  <LayoutGrid className="h-5 w-5 text-[#7fd0ff]" />
                </div>
                <h3 className="mt-4 text-xl font-bold text-white">
                  Canvasly Studio, Magic Import™ &amp; Enterprise SSO Admin
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[#a9bad0]">
                  Interactive dot-grid infinite canvas with live ghost cursors (reproducing <code className="text-[#f1f7ff]">T-4812</code> cursor desync),
                  Client-Side Pre-Flight SDK intercepting <code className="text-[#f1f7ff]">&gt;50MB</code> uploads (<code className="text-[#f1f7ff]">T-4826</code>),
                  n8n 1.2s self-healing on <code className="text-[#f1f7ff]">504</code> timeouts (<code className="text-[#f1f7ff]">T-4801</code>), WorkOS Tenant Switcher,
                  and the 500-seat <strong className="text-white">NovaTech Onboarding Checklist (<code className="text-[#f1f7ff]">T-4823</code>)</strong>.
                </p>
              </div>
              <button
                onClick={() => onNavigate('canvas')}
                className="mt-6 inline-flex items-center justify-between w-full rounded-xl bg-[#13223a] px-4 py-3 text-xs font-semibold text-white transition group-hover:bg-[#7fd0ff] group-hover:text-[#06101d] cursor-pointer"
              >
                <span>Launch Canvasly Studio &amp; Magic Import</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* Surface 2: Plain/Linear 0-Tab Agent Console */}
            <div className="group rounded-2xl border border-[#1f3149] bg-[#0d1726] p-7 transition hover:border-[#8fe3b8]/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#8fe3b8] bg-[#8fe3b8]/10 px-2.5 py-1 rounded">
                    Surface 02 • Support Engineer Experience (Plain.com + Linear Style)
                  </span>
                  <Headphones className="h-5 w-5 text-[#8fe3b8]" />
                </div>
                <h3 className="mt-4 text-xl font-bold text-white">
                  OpsOS Zero-Tab Unified Support Console (Replaces Zendesk + 4 Tabs)
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[#a9bad0]">
                  Eliminates the 5–6 minute manual lookup tax. Features tiered SLA queues, inline JSON stack traces,
                  15-minute Engineering Escalation Watchdog (<code className="text-[#f1f7ff]">T-4805</code>), <strong className="text-white">Groq LPU (<code className="text-[#f1f7ff]">llama-3.3-70b</code>) Whisper Copilot</strong>,
                  Closed-Loop <code className="text-[#f1f7ff]">pgvector</code> KB Drift Patcher (<code className="text-[#f1f7ff]">T-4819</code> v1➔v2 Jira API), and 1-click Stripe Duplicate Charge Refund (<code className="text-[#f1f7ff]">T-4820</code>).
                </p>
              </div>
              <button
                onClick={() => onNavigate('agent')}
                className="mt-6 inline-flex items-center justify-between w-full rounded-xl bg-[#13223a] px-4 py-3 text-xs font-semibold text-white transition group-hover:bg-[#8fe3b8] group-hover:text-[#06101d] cursor-pointer"
              >
                <span>Open 0-Tab Support Engineer Console</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* Surface 3: Datadog APM & Real n8n Engine */}
            <div className="group rounded-2xl border border-[#1f3149] bg-[#0d1726] p-7 transition hover:border-purple-400/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-purple-300 bg-[#632CA6]/25 px-2.5 py-1 rounded">
                    Surface 03 • TechOps Observability (Datadog APM + Real n8n :5678)
                  </span>
                  <Activity className="h-5 w-5 text-purple-300" />
                </div>
                <h3 className="mt-4 text-xl font-bold text-white">
                  Datadog APM Flame Graphs, n8n Workflow DAG &amp; Redis DLQ Ledger
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[#a9bad0]">
                  Live SLO monitors, interactive <strong className="text-white">5-workflow n8n orchestration graph (<code className="text-[#f1f7ff]">WF-01..WF-05</code>)</strong> with
                  downloadable JSON definitions, millisecond APM waterfall traces, <code className="text-[#f1f7ff]">tail -f</code> log explorer, Redis 7 Idempotency &amp;
                  Dead-Letter Queue monitor, and 30-ticket Legacy vs. Open-Source replay.
                </p>
              </div>
              <button
                onClick={() => onNavigate('datadog')}
                className="mt-6 inline-flex items-center justify-between w-full rounded-xl bg-[#13223a] px-4 py-3 text-xs font-semibold text-white transition group-hover:bg-[#632CA6] group-hover:text-white cursor-pointer"
              >
                <span>Open Datadog APM &amp; n8n Control Center</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* Surface 4: WFM, Save Desk & CFO ROI */}
            <div className="group rounded-2xl border border-[#1f3149] bg-[#0d1726] p-7 transition hover:border-amber-400/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-amber-300 bg-amber-500/15 px-2.5 py-1 rounded">
                    Surface 04 • Workforce, Churn Save Desk &amp; Unit Economics (PagerDuty Style)
                  </span>
                  <Users className="h-5 w-5 text-amber-300" />
                </div>
                <h3 className="mt-4 text-xl font-bold text-white">
                  WFM Cherry-Picking Shield, Multi-Touch Save Desk &amp; Scale-to-800 ROI
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[#a9bad0]">
                  Fixes the 11% monthly agent attrition (stopping <code className="text-[#f1f7ff]">Maria S.</code> chat cherry-picking while <code className="text-[#f1f7ff]">James K.</code> drowns in email and <code className="text-[#f1f7ff]">Devon R.</code> works unscheduled nights),
                  tracks 48h Multi-Touch Account Friction (*Meridian Health*, *DataForge*, *Luma*), and models scaling from 300 to 800 Enterprise accounts.
                </p>
              </div>
              <button
                onClick={() => onNavigate('wfm')}
                className="mt-6 inline-flex items-center justify-between w-full rounded-xl bg-[#13223a] px-4 py-3 text-xs font-semibold text-white transition group-hover:bg-amber-400 group-hover:text-[#06101d] cursor-pointer"
              >
                <span>Open WFM Balancer, Save Desk &amp; CFO ROI</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Open-Source Zero-Cost Architecture Stack Comparison (From Early Conversation Step 10) */}
      <section id="open-source-stack" className="py-24 border-b border-[#1f3149] bg-[#0a1322]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <div className="font-mono text-xs font-semibold uppercase tracking-widest text-[#8fe3b8]">
                100% OPEN-SOURCE • $0/MO INCREMENTAL INFRASTRUCTURE
              </div>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Replacing fragile commercial SaaS with faster open-source infrastructure.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[#a9bad0]">
                Instead of spending the $2,500/month budget cap on rate-limited commercial tools, Canvasly’s Technical
                Operations runs co-located on <strong className="text-white">Oracle Cloud (OCI) Always Free ARM64</strong> with
                <strong className="text-white"> Self-Hosted n8n (Redis Queue Mode)</strong>, <strong className="text-white">Groq Free LPU Inference</strong>,
                and <strong className="text-white">PostgreSQL 16 + pgvector</strong>—retiring $48,060/year in Zendesk licensing.
              </p>
            </div>
            <div className="rounded-xl border border-[#8fe3b8]/40 bg-[#8fe3b8]/10 px-4 py-3 font-mono text-xs text-[#8fe3b8]">
              <div>Incremental Spend: $0 / mo</div>
              <div className="text-[11px] text-[#a9bad0]">Legacy Zendesk Retired: -$4,005 / mo</div>
            </div>
          </div>

          <div className="mt-10 overflow-x-auto rounded-2xl border border-[#1f3149] bg-[#0d1726]">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#1f3149] bg-[#13223a]/70 font-mono text-[11px] uppercase text-[#a9bad0]">
                  <th className="py-3.5 px-4">Capability Layer</th>
                  <th className="py-3.5 px-4 text-red-300">Legacy Commercial Stack (Replaced)</th>
                  <th className="py-3.5 px-4 text-[#8fe3b8]">Canvasly Open-Source Stack (Active)</th>
                  <th className="py-3.5 px-4 text-[#7fd0ff]">Performance &amp; Cost Advantage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1f3149]">
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">Compute &amp; Hosting</td>
                  <td className="py-3.5 px-4 text-[#a9bad0]">AWS Paid EC2 / Lambda / API Gateway</td>
                  <td className="py-3.5 px-4 font-mono text-[#8fe3b8]">
                    OCI Always Free Ampere A1 (4 ARM OCPUs, 24GB RAM) + Docker + Caddy
                  </td>
                  <td className="py-3.5 px-4 text-[#f1f7ff]">$0/mo, zero cold starts, &lt;1ms internal bridge latency</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">Workflow Orchestration</td>
                  <td className="py-3.5 px-4 text-[#a9bad0]">Zapier (Rate-limited, 3 brittle Zaps, Zap #3 failing)</td>
                  <td className="py-3.5 px-4 font-mono text-[#8fe3b8]">
                    n8n Self-Hosted Community Edition (Redis 7 BullMQ Queue Mode)
                  </td>
                  <td className="py-3.5 px-4 text-[#f1f7ff]">$0/mo, unlimited executions, 5 active workflows (WF-01..05)</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">AI Triage &amp; Vector RAG</td>
                  <td className="py-3.5 px-4 text-[#a9bad0]">Zendesk AI ($50/agent/mo) + Paid OpenAI API</td>
                  <td className="py-3.5 px-4 font-mono text-[#8fe3b8]">
                    Groq Free LPU (llama-3.3-70b-versatile) + pgvector + FastEmbed (bge-small)
                  </td>
                  <td className="py-3.5 px-4 text-[#f1f7ff]">$0/mo, ~540 tok/s (&lt;160ms triage), zero-hallucination local RAG</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">Support &amp; Agent Workspace</td>
                  <td className="py-3.5 px-4 text-[#a9bad0]">Zendesk Suite Pro ($4,005/mo) + 4 External Browser Tabs</td>
                  <td className="py-3.5 px-4 font-mono text-[#8fe3b8]">
                    Open-Source Unified 0-Tab Agent Console / Chatwoot OSS
                  </td>
                  <td className="py-3.5 px-4 text-[#f1f7ff]">Saves $48K/yr, eliminates 5.5m manual lookup tax per ticket</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">Telemetry &amp; Policy Engine</td>
                  <td className="py-3.5 px-4 text-[#a9bad0]">200K-Row Google Sheet (Zap #2) + Stale Nov Policy Sheet</td>
                  <td className="py-3.5 px-4 font-mono text-[#8fe3b8]">
                    PostgreSQL 16 + Redis 7 DLQ + Datadog-Styled APM Console
                  </td>
                  <td className="py-3.5 px-4 text-[#f1f7ff]">&lt;4ms SQL queries vs 30s sheet load, immutable financial audit log</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">Incident Paging &amp; Status</td>
                  <td className="py-3.5 px-4 text-[#a9bad0]">Muted Slack (#eng, #customer-health) + No Status Page</td>
                  <td className="py-3.5 px-4 font-mono text-[#8fe3b8]">
                    Ntfy.sh Self-Hosted Push Pager + status.canvasly.io Auto-Banner
                  </td>
                  <td className="py-3.5 px-4 text-[#f1f7ff]">$0/mo, 15m escalation watchdog &amp; 24/7 after-hours P1 SSO alerts</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Interactive Product Preview Section */}
      <section className="py-24 border-b border-[#1f3149]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-widest text-[#7fd0ff]">
                LIVE PLATFORM PREVIEW
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                From whiteboard snapshot to live multiplayer architecture.
              </h2>
            </div>

            {/* Preview Mode Switcher */}
            <div className="inline-flex rounded-xl border border-[#1f3149] bg-[#0d1726] p-1">
              <button
                onClick={() => setHeroTab('canvas')}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition cursor-pointer ${
                  heroTab === 'canvas'
                    ? 'bg-[#7fd0ff] text-[#06101d] shadow'
                    : 'text-[#a9bad0] hover:text-white'
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                Infinite Canvas
              </button>
              <button
                onClick={() => setHeroTab('magic-import')}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition cursor-pointer ${
                  heroTab === 'magic-import'
                    ? 'bg-[#7fd0ff] text-[#06101d] shadow'
                    : 'text-[#a9bad0] hover:text-white'
                }`}
              >
                <Wand2 className="h-3.5 w-3.5" />
                Magic Import™ AI
              </button>
              <button
                onClick={() => setHeroTab('enterprise')}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition cursor-pointer ${
                  heroTab === 'enterprise'
                    ? 'bg-[#7fd0ff] text-[#06101d] shadow'
                    : 'text-[#a9bad0] hover:text-white'
                }`}
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                Enterprise Governance
              </button>
            </div>
          </div>

          {/* Browser / Studio Window Mockup */}
          <div className="overflow-hidden rounded-2xl border border-[#1f3149] bg-[#0d1726] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#1f3149] bg-[#13223a]/70 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#3a5676]" />
                <span className="h-3 w-3 rounded-full bg-[#3a5676]" />
                <span className="h-3 w-3 rounded-full bg-[#3a5676]" />
                <span className="ml-3 font-mono text-xs text-[#a9bad0]">
                  app.canvasly.io / meridian-health / q4-platform-architecture
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#7fd0ff] text-[10px] font-bold text-[#06101d] ring-2 ring-[#0d1726]">
                    SC
                  </span>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#8fe3b8] text-[10px] font-bold text-[#06101d] ring-2 ring-[#0d1726]">
                    MK
                  </span>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#a9b4ff] text-[10px] font-bold text-[#06101d] ring-2 ring-[#0d1726]">
                    EV
                  </span>
                </div>
                <span className="rounded-md bg-[#8fe3b8]/15 px-2.5 py-1 text-[11px] font-medium text-[#8fe3b8]">
                  3 Collaborating Live
                </span>
              </div>
            </div>

            {heroTab === 'canvas' && (
              <div className="dot-grid-canvas relative h-[380px] w-full p-8 overflow-hidden flex items-center justify-center">
                <div className="relative w-full max-w-4xl h-full flex items-center justify-between gap-6">
                  <div className="w-60 rounded-xl border border-[#7fd0ff]/40 bg-[#0d1726]/95 p-4 shadow-xl">
                    <div className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#7fd0ff]">
                      Edge Gateway
                    </div>
                    <div className="mt-1 text-sm font-bold text-white">Global API Mesh</div>
                    <p className="mt-1.5 text-xs text-[#a9bad0]">
                      SAML 2.0 SSO &amp; rate-limiting across 450 enterprise seats.
                    </p>
                    <div className="mt-3 flex items-center justify-between border-t border-[#1f3149] pt-2.5 text-[11px] text-[#a9bad0]">
                      <span>Latency: 14ms</span>
                      <span className="text-[#8fe3b8]">Healthy</span>
                    </div>
                  </div>

                  <div className="hidden md:flex flex-1 items-center">
                    <div className="h-[2px] w-full bg-gradient-to-r from-[#7fd0ff] via-[#a9b4ff] to-[#8fe3b8] relative">
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 rounded bg-[#0d1726] px-2 py-0.5 font-mono text-[10px] text-[#f1f7ff] border border-[#1f3149]">
                        WebSocket 60fps Sync
                      </span>
                    </div>
                  </div>

                  <div className="w-64 rounded-xl border border-[#a9b4ff]/40 bg-[#0d1726]/95 p-4 shadow-xl">
                    <div className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#a9b4ff]">
                      Core Engine
                    </div>
                    <div className="mt-1 text-sm font-bold text-white">Canvasly Vector Graph</div>
                    <p className="mt-1.5 text-xs text-[#a9bad0]">
                      CRDT state synchronization, orthogonal connector routing &amp; version history.
                    </p>
                    <div className="mt-3 flex items-center justify-between border-t border-[#1f3149] pt-2.5 text-[11px] text-[#a9bad0]">
                      <span>CRDT Ops/sec: 12.4k</span>
                      <span className="text-[#7fd0ff]">Active</span>
                    </div>
                  </div>

                  <div className="hidden md:flex flex-1 items-center">
                    <div className="h-[2px] w-full bg-gradient-to-r from-[#a9b4ff] to-[#8fe3b8]" />
                  </div>

                  <div className="w-60 rounded-xl border border-[#8fe3b8]/40 bg-[#0d1726]/95 p-4 shadow-xl">
                    <div className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#8fe3b8]">
                      AI Pipeline
                    </div>
                    <div className="mt-1 text-sm font-bold text-white">Magic Import™ Worker</div>
                    <p className="mt-1.5 text-xs text-[#a9bad0]">
                      Converts whiteboard photos &amp; PDFs into editable diagram nodes.
                    </p>
                    <div className="mt-3 flex items-center justify-between border-t border-[#1f3149] pt-2.5 text-[11px] text-[#a9bad0]">
                      <span>Smart Curation</span>
                      <span className="text-[#8fe3b8]">Verified</span>
                    </div>
                  </div>

                  <div className="pointer-events-none absolute top-10 left-1/3 flex items-center gap-1.5">
                    <MousePointer2 className="h-4 w-4 text-[#7fd0ff] fill-[#7fd0ff]" />
                    <span className="rounded-md bg-[#7fd0ff] px-2 py-0.5 text-[11px] font-semibold text-[#06101d] shadow">
                      Sarah (Staff Architect)
                    </span>
                  </div>

                  <div className="pointer-events-none absolute bottom-10 right-1/4 flex items-center gap-1.5">
                    <MousePointer2 className="h-4 w-4 text-[#8fe3b8] fill-[#8fe3b8]" />
                    <span className="rounded-md bg-[#8fe3b8] px-2 py-0.5 text-[11px] font-semibold text-[#06101d] shadow">
                      Marcus (Product Lead)
                    </span>
                  </div>
                </div>
              </div>
            )}

            {heroTab === 'magic-import' && (
              <div className="grid h-[380px] grid-cols-1 gap-6 p-8 md:grid-cols-2 items-center bg-[#09111e]">
                <div className="rounded-xl border border-[#1f3149] bg-[#0d1726] p-6">
                  <div className="font-mono text-xs font-semibold uppercase tracking-wider text-[#7fd0ff]">
                    1. Source Input (Whiteboard Photo / PDF / Sketch)
                  </div>
                  <h3 className="mt-2 text-lg font-bold text-white">
                    Snap a photo after your architecture session
                  </h3>
                  <p className="mt-2 text-sm text-[#a9bad0]">
                    Upload raw meeting room whiteboard photos, legacy Visio/Lucidchart exports, or PDF specifications.
                    Magic Import™ detects boxes, handwriting, and directional arrows automatically.
                  </p>
                  <div className="mt-5 space-y-2.5 text-xs text-[#f1f7ff]">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-[#8fe3b8]" />
                      <span>Optical layout recognition &amp; handwriting-to-text OCR</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-[#8fe3b8]" />
                      <span>Automatic orthogonal connector snapping</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-[#8fe3b8]" />
                      <span>Optional human-in-the-loop Smart Curation for executive boards</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-[#7fd0ff]/30 bg-[#13223a]/50 p-6">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#7fd0ff]">
                      2. Editable Canvasly Output
                    </span>
                    <span className="rounded-full bg-[#8fe3b8]/20 px-2.5 py-0.5 text-[11px] font-medium text-[#8fe3b8]">
                      100% Vector Nodes
                    </span>
                  </div>
                  <div className="mt-4 space-y-3">
                    <div className="rounded-lg border border-[#1f3149] bg-[#0d1726] p-3.5 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-white">24 Architecture Nodes Extracted</div>
                        <div className="text-[11px] text-[#a9bad0]">Grouped into 3 VPC Swimlanes</div>
                      </div>
                      <span className="font-mono text-xs text-[#7fd0ff]">1.4s</span>
                    </div>
                    <div className="rounded-lg border border-[#1f3149] bg-[#0d1726] p-3.5 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-white">38 Smart Connectors Mapped</div>
                        <div className="text-[11px] text-[#a9bad0]">Auto-routed with zero overlapping edges</div>
                      </div>
                      <span className="font-mono text-xs text-[#8fe3b8]">Verified</span>
                    </div>
                    <button
                      onClick={() => onNavigate('canvas')}
                      className="mt-2 w-full rounded-lg bg-[#eef5ff] py-2.5 text-xs font-semibold text-[#06101d] transition hover:bg-white cursor-pointer"
                    >
                      Try Magic Import™ in Studio
                    </button>
                  </div>
                </div>
              </div>
            )}

            {heroTab === 'enterprise' && (
              <div className="grid h-[380px] grid-cols-1 gap-6 p-8 md:grid-cols-3 items-center bg-[#09111e]">
                <div className="rounded-xl border border-[#1f3149] bg-[#0d1726] p-5">
                  <Lock className="h-6 w-6 text-[#7fd0ff]" />
                  <h4 className="mt-3 text-base font-bold text-white">SAML 2.0 SSO &amp; SCIM</h4>
                  <p className="mt-2 text-xs leading-relaxed text-[#a9bad0]">
                    Zero-downtime Okta, Azure AD, and Ping Identity integration with automated seat provisioning and
                    instant certificate failover.
                  </p>
                </div>
                <div className="rounded-xl border border-[#1f3149] bg-[#0d1726] p-5">
                  <ShieldCheck className="h-6 w-6 text-[#8fe3b8]" />
                  <h4 className="mt-3 text-base font-bold text-white">SOC 2 Type II &amp; HIPAA Ready</h4>
                  <p className="mt-2 text-xs leading-relaxed text-[#a9bad0]">
                    End-to-end encryption at rest (AES-256) and in transit (TLS 1.3), granular board permissions, and
                    immutable audit logs.
                  </p>
                </div>
                <div className="rounded-xl border border-[#1f3149] bg-[#0d1726] p-5">
                  <Users className="h-6 w-6 text-[#a9b4ff]" />
                  <h4 className="mt-3 text-base font-bold text-white">Dedicated Enterprise SLA</h4>
                  <p className="mt-2 text-xs leading-relaxed text-[#a9bad0]">
                    99.99% uptime guarantee, priority Smart Curation fast-lane, and dedicated Customer Success
                    Engineering for 100+ seat organizations.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* What Canvasly Is & What It Does — Core Product Pillars */}
      <section id="what-we-do" className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl">
            <div className="font-mono text-xs font-semibold uppercase tracking-widest text-[#7fd0ff]">
              What Canvasly Does
            </div>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              The gaps between whiteboards, docs, and engineering tools add up. We close them.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#a9bad0]">
              Traditional diagramming tools slow teams down with manual box-drawing, broken connectors, and static
              exports. Canvasly combines a 60fps multiplayer canvas with spatial AI and automated workflows.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Pillar 1 */}
            <div className="rounded-2xl border border-[#1f3149] bg-[#0d1726] p-8 flex flex-col justify-between">
              <div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#7fd0ff]/15 text-[#7fd0ff]">
                  <LayoutGrid className="h-5 w-5" />
                </div>
                <h3 className="mt-6 text-xl font-bold text-white">1. Infinite Multiplayer Canvas</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#a9bad0]">
                  Collaborate with 500+ teammates simultaneously on a single board without lag. Built-in cloud
                  architecture stencils (AWS, GCP, OCI, Kubernetes), smart orthogonal connectors, and versioned
                  branches.
                </p>
              </div>
              <ul className="mt-6 space-y-2 border-t border-[#1f3149] pt-5 text-xs text-[#f1f7ff]">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#7fd0ff]" />
                  <span>Sub-50ms CRDT multiplayer cursor &amp; node sync</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#7fd0ff]" />
                  <span>Auto-routing connectors that never tangle</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#7fd0ff]" />
                  <span>2-way sync with Jira, Linear, GitHub &amp; Notion</span>
                </li>
              </ul>
            </div>

            {/* Pillar 2 */}
            <div
              id="magic-import"
              className="rounded-2xl border border-[#7fd0ff]/40 bg-gradient-to-b from-[#13223a] to-[#0d1726] p-8 flex flex-col justify-between"
            >
              <div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#a9b4ff]/20 text-[#a9b4ff]">
                  <Wand2 className="h-5 w-5" />
                </div>
                <h3 className="mt-6 text-xl font-bold text-white">2. Magic Import™ &amp; Smart Curation</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#a9bad0]">
                  Don’t waste hours redrawing meeting whiteboards or legacy PDFs. Upload any image or document—Canvasly
                  extracts every node, label, and connector into clean vector elements, backed by expert Smart Curation.
                </p>
              </div>
              <ul className="mt-6 space-y-2 border-t border-[#1f3149] pt-5 text-xs text-[#f1f7ff]">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#7fd0ff]" />
                  <span>Whiteboard photos, PDFs &amp; Lucidchart/Miro imports</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#7fd0ff]" />
                  <span>AI layout normalization &amp; theme styling</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#7fd0ff]" />
                  <span>Priority Enterprise Curation fast-lane (&lt;38m)</span>
                </li>
              </ul>
            </div>

            {/* Pillar 3 */}
            <div
              id="enterprise"
              className="rounded-2xl border border-[#1f3149] bg-[#0d1726] p-8 flex flex-col justify-between"
            >
              <div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#8fe3b8]/15 text-[#8fe3b8]">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="mt-6 text-xl font-bold text-white">3. Enterprise Control &amp; Governance</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#a9bad0]">
                  Purpose-built for regulated enterprises in healthcare, fintech, and cloud infrastructure. Manage
                  hundreds of workspaces with centralized identity, billing, and automated reliability safeguards.
                </p>
              </div>
              <ul className="mt-6 space-y-2 border-t border-[#1f3149] pt-5 text-xs text-[#f1f7ff]">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#8fe3b8]" />
                  <span>SAML 2.0 SSO &amp; SCIM automated directory sync</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#8fe3b8]" />
                  <span>Role-based access control &amp; guest domain rules</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#8fe3b8]" />
                  <span>24/7 enterprise support &amp; real-time status telemetry</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing & Plans Template */}
      <section id="pricing" className="py-24 border-t border-[#1f3149] bg-[#0a1322]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <div className="font-mono text-xs font-semibold uppercase tracking-widest text-[#7fd0ff]">Pricing</div>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Simple, transparent plans that scale with your team
            </h2>
            <p className="mt-3 text-sm text-[#a9bad0]">
              Start free with your team, or standardize across your entire organization with Enterprise governance.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Starter / Team */}
            <div className="rounded-2xl border border-[#1f3149] bg-[#0d1726] p-8 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Team</h3>
                <p className="mt-1 text-xs text-[#a9bad0]">For fast-moving startups and small product squads.</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">$12</span>
                  <span className="text-xs text-[#a9bad0]">/ user / month</span>
                </div>
                <ul className="mt-6 space-y-3 text-xs text-[#f1f7ff]">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#7fd0ff]" />
                    <span>Unlimited public &amp; private boards</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#7fd0ff]" />
                    <span>25 Magic Import™ AI conversions / mo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#7fd0ff]" />
                    <span>Core cloud architecture &amp; UX stencil packs</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => onNavigate('canvas')}
                className="mt-8 w-full rounded-xl border border-[#1f3149] bg-[#13223a]/60 py-2.5 text-xs font-semibold text-white transition hover:bg-[#13223a] cursor-pointer"
              >
                Start Free Trial
              </button>
            </div>

            {/* Business */}
            <div className="rounded-2xl border border-[#7fd0ff] bg-gradient-to-b from-[#13223a] to-[#0d1726] p-8 flex flex-col justify-between shadow-xl shadow-[#7fd0ff]/10">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">Business</h3>
                  <span className="rounded-full bg-[#7fd0ff]/20 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-[#7fd0ff]">
                    Most Popular
                  </span>
                </div>
                <p className="mt-1 text-xs text-[#a9bad0]">For scaling engineering &amp; cross-functional teams.</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">$24</span>
                  <span className="text-xs text-[#a9bad0]">/ user / month</span>
                </div>
                <ul className="mt-6 space-y-3 text-xs text-[#f1f7ff]">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#7fd0ff]" />
                    <span>Unlimited Magic Import™ AI vectorizations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#7fd0ff]" />
                    <span>2-way Jira, Linear, GitHub &amp; Notion integrations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#7fd0ff]" />
                    <span>Guest collaborator permissions &amp; version history</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => onNavigate('canvas')}
                className="mt-8 w-full rounded-xl bg-[#eef5ff] py-2.5 text-xs font-semibold text-[#06101d] transition hover:bg-white cursor-pointer"
              >
                Launch Business Workspace
              </button>
            </div>

            {/* Enterprise */}
            <div className="rounded-2xl border border-[#1f3149] bg-[#0d1726] p-8 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Enterprise</h3>
                <p className="mt-1 text-xs text-[#a9bad0]">For 100+ seat organizations requiring custom governance.</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">Custom</span>
                  <span className="text-xs text-[#a9bad0]">annual contract ($16–$22/seat)</span>
                </div>
                <ul className="mt-6 space-y-3 text-xs text-[#f1f7ff]">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#8fe3b8]" />
                    <span>SAML 2.0 SSO, SCIM provisioning &amp; SOC 2 Type II</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#8fe3b8]" />
                    <span>Priority Smart Curation SLA (&lt; 38m turnaround)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#8fe3b8]" />
                    <span>Dedicated Customer Success Manager &amp; 24/7 P1 support</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => onNavigate('agent')}
                className="mt-8 w-full rounded-xl border border-[#1f3149] bg-[#13223a]/60 py-2.5 text-xs font-semibold text-white transition hover:bg-[#13223a] cursor-pointer"
              >
                Contact Enterprise Sales / Support
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Clean Footer */}
      <footer className="border-t border-[#1f3149] bg-[#050a12] py-14">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
            <div className="col-span-2">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#7fd0ff] font-bold text-[#06101d]">
                  <Layers className="h-4 w-4" />
                </div>
                <span className="text-base font-bold text-white">Canvasly</span>
              </div>
              <p className="mt-3 max-w-xs text-xs leading-relaxed text-[#a9bad0]">
                The collaborative visual workspace and spatial AI diagramming platform for modern enterprise teams.
              </p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#8fe3b8]/30 bg-[#8fe3b8]/10 px-3 py-1 text-[11px] text-[#8fe3b8]">
                <span className="h-2 w-2 rounded-full bg-[#8fe3b8]" />
                <span>status.canvasly.io: All Systems Operational (99.99% SLA)</span>
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold text-white">Product</div>
              <ul className="mt-3 space-y-2 text-xs text-[#a9bad0]">
                <li>
                  <button onClick={() => onNavigate('canvas')} className="hover:text-white cursor-pointer">
                    Infinite Canvas Studio
                  </button>
                </li>
                <li>
                  <a href="#magic-import" className="hover:text-white">
                    Magic Import™ AI
                  </a>
                </li>
                <li>
                  <a href="#open-source-stack" className="hover:text-white">
                    Open-Source TechOps Stack
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <div className="text-xs font-semibold text-white">Live Operational Portals</div>
              <ul className="mt-3 space-y-2 text-xs text-[#a9bad0]">
                <li>
                  <button onClick={() => onNavigate('agent')} className="hover:text-white cursor-pointer">
                    0-Tab Support Console
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('datadog')} className="hover:text-white cursor-pointer">
                    Datadog APM &amp; n8n (:5678)
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('wfm')} className="hover:text-white cursor-pointer">
                    WFM, Save Desk &amp; CFO ROI
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <div className="text-xs font-semibold text-white">Infrastructure</div>
              <ul className="mt-3 space-y-2 font-mono text-[11px] text-[#a9bad0]">
                <li>OCI ARM64 Always Free</li>
                <li>n8n + Redis 7 BullMQ</li>
                <li>Groq Llama-3.3-70B LPU</li>
                <li>PostgreSQL 16 + pgvector</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#1f3149] pt-8 text-xs text-[#a9bad0] sm:flex-row">
            <div>© {new Date().getFullYear()} Canvasly Inc. All rights reserved.</div>
            <div className="flex gap-6">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>SOC 2 Type II &amp; HIPAA Security</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
