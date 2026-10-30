import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Cpu,
  Database,
  ExternalLink,
  Filter,
  Flame,
  GitBranch,
  Layers,
  Play,
  Radio,
  RefreshCw,
  Server,
  ShieldAlert,
  Sparkles,
  Terminal,
  TrendingDown,
  Zap,
} from 'lucide-react';
import {
  ENTERPRISE_ACCOUNTS,
  N8N_WORKFLOWS,
  TicketRecord,
} from '../data/caseData';

interface LogEntry {
  id: string;
  ts: string;
  level: 'INFO' | 'WARN' | 'ALERT' | 'OK';
  service: string;
  message: string;
  ticketId?: string;
}

interface Props {
  tickets: TicketRecord[];
  selectedTicket: TicketRecord;
  onSelectTicket: (t: TicketRecord) => void;
  onSwitchSurface: (s: 'datadog' | 'agent' | 'canvas' | 'wfm') => void;
  logs: LogEntry[];
  onTriggerScenario: (type: 'sso_outage' | 'magic_timeout' | 'miro_churn' | 'dup_charge' | 'replay_all') => void;
  n8nLiveStatus: 'connected' | ' embedded-active';
  statusBannerActive: boolean;
  onToggleStatusBanner: () => void;
}

export const DatadogCommandCenter: React.FC<Props> = ({
  tickets,
  selectedTicket,
  onSelectTicket,
  onSwitchSurface,
  logs,
  onTriggerScenario,
  statusBannerActive,
  onToggleStatusBanner,
}) => {
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>(N8N_WORKFLOWS[0].id);
  const [logFilter, setLogFilter] = useState<string>('ALL');
  const [compareMode, setCompareMode] = useState<'after' | 'before'>('after');

  const activeWorkflow = N8N_WORKFLOWS.find((w) => w.id === selectedWorkflowId) || N8N_WORKFLOWS[0];

  const autoHealedCount = tickets.filter((t) => t.auto_healed).length;
  const deflectionPct = Math.round((autoHealedCount / tickets.length) * 100);
  const p1Tickets = tickets.filter((t) => t.ai_true_priority === 'P1-Critical');

  const filteredLogs = logFilter === 'ALL' ? logs : logs.filter((l) => l.service === logFilter || l.level === logFilter);

  return (
    <div className="space-y-3 p-3 bg-[#0b0e14] min-h-[calc(100vh-52px)] text-xs">
      {/* Top Action & Chaos Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-[#111621] border border-zinc-800/90 rounded px-3 py-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider px-2 py-0.5 rounded bg-[#632CA6]/20 text-purple-300 border border-[#632CA6]/50">
            <Radio className="w-3 h-3 text-purple-400 animate-pulse" />
            DATADOG APM + REAL n8n ENGINE (:5678)
          </span>
          <span className="text-zinc-400 hidden md:inline">
            Host: <strong className="text-zinc-200 font-mono">oci-ampere-a1-4ocpu-24gb (Oracle Always Free)</strong>
          </span>
          <span className="text-zinc-400 hidden lg:inline">
            Inference: <strong className="text-emerald-400 font-mono">Groq LPU llama-3.3-70b (540 tok/s)</strong>
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <div className="flex items-center bg-zinc-900 border border-zinc-700 rounded p-0.5 mr-2">
            <button
              onClick={() => setCompareMode('before')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
                compareMode === 'before'
                  ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Legacy Baseline (Broken)
            </button>
            <button
              onClick={() => setCompareMode('after')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
                compareMode === 'after'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Live Open-Source Stack (Fixed)
            </button>
          </div>

          <button
            onClick={() => onTriggerScenario('sso_outage')}
            className="px-2 py-1 rounded bg-red-500/15 hover:bg-red-500/25 border border-red-500/40 text-red-300 font-mono text-[11px] flex items-center gap-1 cursor-pointer"
          >
            <ShieldAlert className="w-3 h-3" />
            Sim P1 After-Hours SSO
          </button>
          <button
            onClick={() => onTriggerScenario('magic_timeout')}
            className="px-2 py-1 rounded bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-mono text-[11px] flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            Sim Magic Import 504
          </button>
          <button
            onClick={() => onTriggerScenario('miro_churn')}
            className="px-2 py-1 rounded bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/40 text-purple-300 font-mono text-[11px] flex items-center gap-1 cursor-pointer"
          >
            <Flame className="w-3 h-3" />
            Sim Miro Churn Threat
          </button>
          <button
            onClick={() => onTriggerScenario('dup_charge')}
            className="px-2 py-1 rounded bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 font-mono text-[11px] flex items-center gap-1 cursor-pointer"
          >
            <Zap className="w-3 h-3" />
            Sim Duplicate Charge
          </button>
        </div>
      </div>

      {/* Row 1: 6 Dense Datadog SLO Monitors */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2.5">
        {/* Tile 1 */}
        <div className="bg-[#111621] border border-zinc-800 rounded p-2.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-zinc-400">ENT FRT (p90 / MEDIAN)</span>
            <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${compareMode === 'after' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
              {compareMode === 'after' ? 'SLO OK' : 'BREACH'}
            </span>
          </div>
          <div className="my-1.5 flex items-baseline gap-2">
            <span className="text-xl font-bold font-mono text-zinc-100">
              {compareMode === 'after' ? '1.4m' : '48.0m'}
            </span>
            <span className="text-[11px] font-mono text-emerald-400">
              {compareMode === 'after' ? '↓ 97% vs 48m p90' : 'T-4815: 412m overnight'}
            </span>
          </div>
          <div className="text-[10px] text-zinc-400 flex items-center justify-between border-t border-zinc-800/80 pt-1">
            <span>Overnight Ent Drops:</span>
            <span className="font-mono text-zinc-200">{compareMode === 'after' ? '0 (24/7 Pager)' : '3 / wk (DataForge)'}</span>
          </div>
        </div>

        {/* Tile 2 */}
        <div className="bg-[#111621] border border-zinc-800 rounded p-2.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-zinc-400">AVOIDABLE AHT TAX</span>
            <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${compareMode === 'after' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
              {compareMode === 'after' ? '-5.3m SAVED' : '4-TAB SWIVEL'}
            </span>
          </div>
          <div className="my-1.5 flex items-baseline gap-2">
            <span className="text-xl font-bold font-mono text-zinc-100">
              {compareMode === 'after' ? '0.2m' : '5.5m'}
            </span>
            <span className="text-[11px] font-mono text-emerald-400">
              {compareMode === 'after' ? 'Total AHT: 8.1m' : 'Total AHT: 14.0m'}
            </span>
          </div>
          <div className="text-[10px] text-zinc-400 flex items-center justify-between border-t border-zinc-800/80 pt-1">
            <span>Capacity Reclaimed:</span>
            <span className="font-mono text-emerald-300">{compareMode === 'after' ? '+110 hrs/day (20 FTEs)' : '0 hrs/day'}</span>
          </div>
        </div>

        {/* Tile 3 */}
        <div className="bg-[#111621] border border-zinc-800 rounded p-2.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-zinc-400">DESIGN CURATION QUEUE</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-purple-500/20 text-purple-300">
              FAST-LANE
            </span>
          </div>
          <div className="my-1.5 flex items-baseline gap-2">
            <span className="text-xl font-bold font-mono text-zinc-100">
              {compareMode === 'after' ? '38m' : '70.4h'}
            </span>
            <span className="text-[11px] font-mono text-purple-300">
              {compareMode === 'after' ? 'Ent SLA (<45m)' : 'Quoted fake 2-3h!'}
            </span>
          </div>
          <div className="text-[10px] text-zinc-400 flex items-center justify-between border-t border-zinc-800/80 pt-1">
            <span>General Queue ETA:</span>
            <span className="font-mono text-amber-300">Synced Live in UI</span>
          </div>
        </div>

        {/* Tile 4 */}
        <div className="bg-[#111621] border border-zinc-800 rounded p-2.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-zinc-400">AI + n8n AUTO-HEALED</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-400">
              ZERO-TOUCH
            </span>
          </div>
          <div className="my-1.5 flex items-baseline gap-2">
            <span className="text-xl font-bold font-mono text-zinc-100">
              {compareMode === 'after' ? `${deflectionPct}%` : '0%'}
            </span>
            <span className="text-[11px] font-mono text-emerald-400">
              {compareMode === 'after' ? `${autoHealedCount}/${tickets.length} tickets` : 'Manual retry macros'}
            </span>
          </div>
          <div className="text-[10px] text-zinc-400 flex items-center justify-between border-t border-zinc-800/80 pt-1">
            <span>Magic Import 504s:</span>
            <span className="font-mono text-zinc-200">Auto-retried in 1.2s</span>
          </div>
        </div>

        {/* Tile 5 */}
        <div className="bg-[#111621] border border-zinc-800 rounded p-2.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-zinc-400">ENT CHURN RADAR</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300">
              6 ACCOUNTS
            </span>
          </div>
          <div className="my-1.5 flex items-baseline gap-2">
            <span className="text-xl font-bold font-mono text-zinc-100">$562.5K</span>
            <span className="text-[11px] font-mono text-emerald-400">
              {compareMode === 'after' ? '100% Intercepted' : '4.2% Qtr Churn'}
            </span>
          </div>
          <div className="text-[10px] text-zinc-400 flex items-center justify-between border-t border-zinc-800/80 pt-1">
            <span>48h Multi-Touch Save:</span>
            <span className="font-mono text-zinc-200">Meridian + DataForge</span>
          </div>
        </div>

        {/* Tile 6 */}
        <div className="bg-[#111621] border border-zinc-800 rounded p-2.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-zinc-400">NET TOOLING RUN-RATE</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-400">
              OCI + GROQ FREE
            </span>
          </div>
          <div className="my-1.5 flex items-baseline gap-2">
            <span className="text-xl font-bold font-mono text-emerald-400">
              {compareMode === 'after' ? '$0/mo' : '$4,005/mo'}
            </span>
            <span className="text-[11px] font-mono text-zinc-400">
              Cap: $2,500/mo
            </span>
          </div>
          <div className="text-[10px] text-zinc-400 flex items-center justify-between border-t border-zinc-800/80 pt-1">
            <span>Zendesk + Zapier Saved:</span>
            <span className="font-mono text-emerald-300">$48,060 / yr</span>
          </div>
        </div>
      </div>

      {/* Row 2: Live Microservices Topology Map + APM Waterfall Trace Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Left 7 Cols: Live Service Map & n8n Pipeline Controller */}
        <div className="lg:col-span-7 bg-[#111621] border border-zinc-800 rounded p-3 space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <div className="flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-purple-400" />
              <span className="font-semibold text-zinc-100">
                Live Service Topology &amp; Real n8n Workflow Controller
              </span>
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                5 WORKFLOWS ACTIVE
              </span>
            </div>
            <a
              href="http://localhost:5678"
              target="_blank"
              rel="noreferrer"
              className="text-[11px] font-mono text-purple-300 hover:text-purple-200 flex items-center gap-1 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/30"
            >
              Open Live n8n (:5678) <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Interactive Service Map Diagram */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 bg-[#0b0e14] border border-zinc-800/80 rounded p-2.5 items-center">
            {/* Stage 1: Ingress */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-mono uppercase text-zinc-500">1. INGRESS &amp; EDGE SDK</div>
              <div className="p-2 rounded bg-[#141926] border border-zinc-700/80">
                <div className="font-mono text-[11px] text-zinc-200 font-semibold">Canvasly Studio App</div>
                <div className="text-[10px] text-zinc-400">Chat (55%) • Email (30%) • Voice (15%)</div>
                <div className="mt-1 text-[10px] font-mono text-emerald-400">Pre-Flight &gt;50MB SDK Active</div>
              </div>
              <div className="p-2 rounded bg-[#141926] border border-zinc-700/80">
                <div className="font-mono text-[11px] text-zinc-200 font-semibold">status.canvasly.io</div>
                <div className="flex items-center justify-between mt-1">
                  <span className={`text-[10px] font-mono ${statusBannerActive ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {statusBannerActive ? 'BANNER: DEGRADED' : 'ALL SYSTEMS OK'}
                  </span>
                  <button
                    onClick={onToggleStatusBanner}
                    className="text-[10px] font-mono underline text-zinc-400 hover:text-white cursor-pointer"
                  >
                    Toggle
                  </button>
                </div>
              </div>
            </div>

            {/* Stage 2: n8n + Redis */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-mono uppercase text-purple-400">2. n8n ORCHESTRATOR</div>
              <div className="p-2.5 rounded bg-purple-950/25 border border-purple-500/50 shadow-inner">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] text-purple-200 font-bold">n8n Queue Mode</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                </div>
                <div className="text-[10px] text-purple-300/80 mt-0.5">Replaces 3 fragile Zapier Zaps</div>
                <div className="mt-1.5 pt-1.5 border-t border-purple-500/30 font-mono text-[10px] text-zinc-300 space-y-0.5">
                  <div>• Redis-7 Idempotency &amp; DLQ</div>
                  <div>• 0 Rate Limits ($0/mo)</div>
                  <div>• 1,607 Executions Today</div>
                </div>
              </div>
            </div>

            {/* Stage 3: Parallel Hydration + Groq LPU */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-mono uppercase text-emerald-400">3. AI &amp; CONTEXT (&lt;250ms)</div>
              <div className="p-1.5 rounded bg-[#141926] border border-emerald-500/40">
                <div className="font-mono text-[11px] text-emerald-300 font-semibold flex items-center justify-between">
                  <span>Groq LPU (Llama-3.3-70B)</span>
                  <span>164ms</span>
                </div>
                <div className="text-[10px] text-zinc-400">Semantic Priority + Churn Score</div>
              </div>
              <div className="p-1.5 rounded bg-[#141926] border border-zinc-700/80">
                <div className="font-mono text-[11px] text-zinc-200">Salesforce + Admin + Stripe</div>
                <div className="text-[10px] text-zinc-400">Parallel HTTP hydration (95ms)</div>
              </div>
              <div className="p-1.5 rounded bg-[#141926] border border-zinc-700/80">
                <div className="font-mono text-[11px] text-zinc-200">PostgreSQL 16 + pgvector</div>
                <div className="text-[10px] text-zinc-400">Replaces 200K-row Sheet (&lt;4ms)</div>
              </div>
            </div>

            {/* Stage 4: Action Sinks */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-mono uppercase text-amber-400">4. ACTION &amp; SLA SINKS</div>
              <div className="p-1.5 rounded bg-[#141926] border border-zinc-700/80">
                <div className="font-mono text-[11px] text-zinc-200">OpsOS Agent Workspace</div>
                <div className="text-[10px] text-emerald-400">Zero-Tab Sidebar + RAG Draft</div>
              </div>
              <div className="p-1.5 rounded bg-[#141926] border border-zinc-700/80">
                <div className="font-mono text-[11px] text-zinc-200">Ntfy.sh 24/7 P1 Pager</div>
                <div className="text-[10px] text-red-300">After-Hours SSO &amp; 15m Watchdog</div>
              </div>
              <div className="p-1.5 rounded bg-[#141926] border border-zinc-700/80">
                <div className="font-mono text-[11px] text-zinc-200">Enterprise Curation Lane</div>
                <div className="text-[10px] text-purple-300">42m SLA (Bypasses 70h queue)</div>
              </div>
            </div>
          </div>

          {/* Workflow Selector Tabs */}
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1">
              {N8N_WORKFLOWS.map((wf) => (
                <button
                  key={wf.id}
                  onClick={() => setSelectedWorkflowId(wf.id)}
                  className={`px-2 py-1 rounded font-mono text-[11px] transition cursor-pointer ${
                    selectedWorkflowId === wf.id
                      ? 'bg-[#632CA6] text-white font-semibold'
                      : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                  }`}
                >
                  {wf.id.replace('wf_', 'WF-').slice(0, 5)}
                </button>
              ))}
            </div>

            <div className="bg-[#0b0e14] border border-zinc-800 rounded p-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div>
                  <div className="font-mono text-xs font-bold text-purple-300">{activeWorkflow.name}</div>
                  <div className="text-[11px] text-zinc-400">{activeWorkflow.replacesLegacy}</div>
                </div>
                <div className="flex items-center gap-3 font-mono text-[11px]">
                  <span className="text-zinc-400">
                    Endpoint: <strong className="text-zinc-200">{activeWorkflow.webhookPath}</strong>
                  </span>
                  <span className="text-emerald-400">{activeWorkflow.avgExecutionMs}ms avg</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-1.5">
                {activeWorkflow.nodes.map((node, idx) => (
                  <div
                    key={node.id}
                    className="bg-[#111621] border border-zinc-800 hover:border-purple-500/50 rounded p-2 transition"
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono text-purple-400 mb-0.5">
                      <span>STEP {idx + 1}</span>
                      <span>{node.latencyMs}ms</span>
                    </div>
                    <div className="font-semibold text-[11px] text-zinc-100 leading-tight mb-1">{node.name}</div>
                    <div className="text-[10px] text-zinc-400 leading-snug">{node.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Datadog APM Waterfall Trace for Selected Ticket */}
        <div className="lg:col-span-5 bg-[#111621] border border-zinc-800 rounded p-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-2.5">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold text-zinc-100">
                  Datadog APM Trace Waterfall // {selectedTicket.ticket_id}
                </span>
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">
                  {selectedTicket.account_name} (${(selectedTicket.arr / 1000).toFixed(1)}K ARR)
                </span>
              </div>
              <button
                onClick={() => onSwitchSurface('agent')}
                className="text-[11px] font-mono text-emerald-400 hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                Inspect in Agent Console <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>

            {/* Trace Header Summary */}
            <div className="bg-[#0b0e14] border border-zinc-800 rounded p-2 mb-2.5 font-mono text-[11px] space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">n8n Execution ID: <strong className="text-purple-300">{selectedTicket.n8n_execution_id}</strong></span>
                <span className="text-zinc-400">Root Cause: <strong className="text-amber-300">{selectedTicket.root_cause_code}</strong></span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">
                  Priority Override: <span className="line-through text-zinc-500">{selectedTicket.priority_assigned}</span>{' '}
                  ➔ <strong className="text-emerald-400">{selectedTicket.ai_true_priority}</strong>
                </span>
                <span className="text-zinc-400">
                  FRT: <span className="line-through text-red-400">{selectedTicket.first_response_min}m</span> ➔{' '}
                  <strong className="text-emerald-400">{selectedTicket.new_frt_min}m</strong>
                </span>
              </div>
            </div>

            {/* Flame Graph Spans */}
            <div className="space-y-1.5">
              {selectedTicket.apm_spans.map((span, i) => {
                const totalMs = 430;
                const leftPct = Math.min(82, Math.round((span.startMs / totalMs) * 100));
                const widthPct = Math.max(12, Math.min(100 - leftPct, Math.round((span.durationMs / totalMs) * 100)));
                return (
                  <div key={i} className="bg-[#0b0e14] border border-zinc-800/80 rounded p-1.5">
                    <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                      <span className="text-zinc-200 font-semibold">
                        [{span.service}] <span className="text-zinc-400 font-normal">{span.operation}</span>
                      </span>
                      <span className={span.status === 'WARN' ? 'text-amber-400' : 'text-emerald-400'}>
                        {span.durationMs}ms
                      </span>
                    </div>
                    <div className="w-full h-2 bg-zinc-900 rounded overflow-hidden relative">
                      <div
                        style={{ marginLeft: `${leftPct}%`, width: `${widthPct}%` }}
                        className={`h-full rounded ${
                          span.service.includes('n8n')
                            ? 'bg-purple-500'
                            : span.service.includes('groq')
                            ? 'bg-emerald-500'
                            : 'bg-cyan-500'
                        }`}
                      />
                    </div>
                    <div className="text-[10px] text-zinc-400 mt-1 font-mono truncate">{span.meta}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Automated Action Outcome Box */}
          <div className="mt-2.5 bg-emerald-950/20 border border-emerald-500/30 rounded p-2">
            <div className="text-[10px] font-mono uppercase text-emerald-400 font-semibold">
              n8n Automated Action Executed:
            </div>
            <div className="text-[11px] text-zinc-200 mt-0.5">{selectedTicket.n8n_action_taken}</div>
          </div>
        </div>
      </div>

      {/* Row 3: Enterprise Churn Radar & 30-Ticket Live Telemetry Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Left 5 Cols: Enterprise Churn Radar ($562.5K ARR at Risk in CSV) */}
        <div className="lg:col-span-5 bg-[#111621] border border-zinc-800 rounded p-3">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span className="font-semibold text-zinc-100">
                Enterprise Churn Radar &amp; Multi-Touch Velocity
              </span>
            </div>
            <button
              onClick={() => onSwitchSurface('wfm')}
              className="text-[11px] font-mono text-purple-300 hover:underline cursor-pointer"
            >
              Open Save Desk ➔
            </button>
          </div>

          <div className="space-y-2 max-h-[290px] overflow-y-auto pr-1">
            {ENTERPRISE_ACCOUNTS.map((acc) => (
              <div
                key={acc.id}
                className="bg-[#0b0e14] border border-zinc-800 hover:border-zinc-700 rounded p-2 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-zinc-100">{acc.name}</span>
                    <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300">
                      {acc.seats} seats • ${(acc.arr / 1000).toFixed(1)}K ARR
                    </span>
                  </div>
                  <span
                    className={`font-mono text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                      acc.churnRiskLevel === 'CRITICAL'
                        ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}
                  >
                    {acc.frictionEvents48h}x Touch / 48h • {acc.churnRiskLevel}
                  </span>
                </div>
                <div className="text-[11px] text-zinc-400 mt-1 leading-snug">{acc.primaryIssue}</div>
                <div className="flex items-center justify-between mt-1.5 pt-1 border-t border-zinc-800/80 text-[10px] font-mono">
                  <span className="text-emerald-400 truncate max-w-[75%]">{acc.saveActionStatus}</span>
                  <div className="flex gap-1">
                    {acc.relatedTickets.map((tid) => {
                      const found = tickets.find((t) => t.ticket_id === tid);
                      return (
                        <button
                          key={tid}
                          onClick={() => found && onSelectTicket(found)}
                          className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 hover:bg-purple-500/40 cursor-pointer"
                        >
                          {tid}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 7 Cols: Live 30-Ticket Telemetry Stream & Datadog Log Tail */}
        <div className="lg:col-span-7 bg-[#111621] border border-zinc-800 rounded p-3 flex flex-col justify-between space-y-2.5">
          <div>
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-2">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span className="font-semibold text-zinc-100">
                  Live Ticket Telemetry Stream ({tickets.length} Case Study + Live Events)
                </span>
              </div>
              <span className="text-[10px] font-mono text-zinc-400">
                Click any row to inspect APM Trace &amp; Agent Sidebar
              </span>
            </div>

            <div className="max-h-[165px] overflow-y-auto border border-zinc-800 rounded">
              <table className="w-full text-left border-collapse font-mono text-[11px]">
                <thead className="bg-[#0b0e14] text-zinc-400 sticky top-0">
                  <tr className="border-b border-zinc-800">
                    <th className="py-1.5 px-2">ID</th>
                    <th className="py-1.5 px-2">Account</th>
                    <th className="py-1.5 px-2">Category</th>
                    <th className="py-1.5 px-2">Old ➔ AI Priority</th>
                    <th className="py-1.5 px-2">Old ➔ New FRT</th>
                    <th className="py-1.5 px-2">n8n Outcome</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {tickets.map((t) => {
                    const isSelected = t.ticket_id === selectedTicket.ticket_id;
                    return (
                      <tr
                        key={t.ticket_id}
                        onClick={() => onSelectTicket(t)}
                        className={`cursor-pointer transition ${
                          isSelected ? 'bg-purple-950/40 text-white' : 'hover:bg-zinc-900/80 text-zinc-300'
                        }`}
                      >
                        <td className="py-1 px-2 font-bold text-purple-300">{t.ticket_id}</td>
                        <td className="py-1 px-2 truncate max-w-[120px]">{t.account_name}</td>
                        <td className="py-1 px-2 truncate max-w-[140px] text-zinc-400">{t.category}</td>
                        <td className="py-1 px-2">
                          <span className="text-zinc-500">{t.priority_assigned}</span> ➔{' '}
                          <span
                            className={
                              t.ai_true_priority === 'P1-Critical'
                                ? 'text-red-400 font-semibold'
                                : t.ai_true_priority === 'P4-AutoDeflected'
                                ? 'text-emerald-400'
                                : 'text-amber-300'
                            }
                          >
                            {t.ai_true_priority}
                          </span>
                        </td>
                        <td className="py-1 px-2">
                          <span className="text-red-400/80">{t.first_response_min}m</span> ➔{' '}
                          <span className="text-emerald-400 font-semibold">{t.new_frt_min}m</span>
                        </td>
                        <td className="py-1 px-2">
                          {t.auto_healed ? (
                            <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[10px]">
                              AUTO-HEALED
                            </span>
                          ) : t.curation_fast_track ? (
                            <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 text-[10px]">
                              42m FAST-LANE
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 text-[10px]">
                              HYDRATED + RAG
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Datadog Live Tail Log Explorer */}
          <div className="bg-[#0b0e14] border border-zinc-800 rounded p-2">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2 font-mono text-[11px]">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-zinc-200 font-semibold">Datadog Live Log Tail (tail -f /var/log/n8n-opsos.json)</span>
              </div>
              <div className="flex gap-1">
                {['ALL', 'n8n-worker', 'groq-lpu', 'ntfy-pager', 'ALERT'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setLogFilter(f)}
                    className={`px-1.5 py-0.2 rounded font-mono text-[10px] cursor-pointer ${
                      logFilter === f ? 'bg-purple-600 text-white' : 'bg-zinc-900 text-zinc-400'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-[92px] overflow-y-auto font-mono text-[10px] space-y-1 pr-1">
              {filteredLogs.map((l) => (
                <div key={l.id} className="flex items-start gap-2 leading-tight">
                  <span className="text-zinc-500 shrink-0">{l.ts}</span>
                  <span
                    className={`px-1 rounded shrink-0 ${
                      l.level === 'ALERT'
                        ? 'bg-red-500/20 text-red-400'
                        : l.level === 'WARN'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-emerald-500/20 text-emerald-400'
                    }`}
                  >
                    {l.level}
                  </span>
                  <span className="text-purple-300 shrink-0">[{l.service}]</span>
                  <span className="text-zinc-300">{l.message}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 4: Redis 7 Idempotency & Dead-Letter Queue (DLQ) + Closed-Loop pgvector KB Drift Auto-Authoring */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Left 6 Cols: Redis 7 Zero-Drop Webhook Idempotency & DLQ (Fixes Zap #3 Rate-Limit Drops & Duplicate Refunds) */}
        <div className="lg:col-span-6 bg-[#111621] border border-zinc-800 rounded p-3 space-y-2">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400" />
              <span className="font-semibold text-zinc-100">
                Redis 7 BullMQ Queue, Idempotency Locks &amp; Dead-Letter Queue (Replaces Failing Zap #3)
              </span>
            </div>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
              0 Dropped Webhooks
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-[10px]">
            <div className="bg-[#0b0e14] border border-zinc-800 rounded p-2">
              <div className="text-purple-300 font-bold">idem:wf04:re_99812A:T-4820</div>
              <div className="text-zinc-300 mt-0.5">Beacon Financial ($6,000 Refund)</div>
              <div className="text-emerald-400 mt-1">COMMITTED_ONCE • Audit Logged</div>
            </div>
            <div className="bg-[#0b0e14] border border-zinc-800 rounded p-2">
              <div className="text-purple-300 font-bold">idem:wf03:ntfy_p1:T-4813</div>
              <div className="text-zinc-300 mt-0.5">CoreVista (300-Seat SSO Outage)</div>
              <div className="text-emerald-400 mt-1">NTFY_PAGED • 24h Grace Cert</div>
            </div>
            <div className="bg-[#0b0e14] border border-zinc-800 rounded p-2">
              <div className="text-amber-300 font-bold">dlq:zap3:csat_burst_recovered</div>
              <div className="text-zinc-300 mt-0.5">Legacy Zapier 429 Throttle Catch</div>
              <div className="text-emerald-400 mt-1">AUTO_REPLAYED • 0 Data Loss</div>
            </div>
          </div>
        </div>

        {/* Right 6 Cols: Closed-Loop AI Knowledge Base (KB) Drift Detector (Fixes T-4819 v1->v2 Jira API & T-4812) */}
        <div className="lg:col-span-6 bg-[#111621] border border-zinc-800 rounded p-3 space-y-2">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="font-semibold text-zinc-100">
                Closed-Loop pgvector + FastEmbed (bge-small) KB Drift Detector &amp; Auto-Authoring
              </span>
            </div>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">
              3 Drift Patches Live
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-[10px]">
            <div className="bg-[#0b0e14] border border-zinc-800 rounded p-2">
              <div className="text-amber-300 font-bold">[T-4819] Jira v1 ➔ v2 OAuth2</div>
              <div className="text-zinc-400 mt-0.5">Deprecated v1 token doc replaced with v2 3LO scope guide</div>
              <div className="text-emerald-400 mt-1">✓ Indexed in pgvector</div>
            </div>
            <div className="bg-[#0b0e14] border border-zinc-800 rounded p-2">
              <div className="text-amber-300 font-bold">[T-4812] Cursor CRDT Flush</div>
              <div className="text-zinc-400 mt-0.5">Synthesized missing KB article + 1-click WebSocket cache macro</div>
              <div className="text-emerald-400 mt-1">✓ Indexed in pgvector</div>
            </div>
            <div className="bg-[#0b0e14] border border-zinc-800 rounded p-2">
              <div className="text-amber-300 font-bold">[T-4807] Nov Sheet Retired</div>
              <div className="text-zinc-400 mt-0.5">Codified 14-day seat overage waiver in PostgreSQL 16</div>
              <div className="text-emerald-400 mt-1">✓ Indexed in pgvector</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
