import React, { useState } from 'react';
import {
  AlertCircle,
  BookOpen,
  Bot,
  Check,
  CheckCircle2,
  Clock,
  CreditCard,
  Database,
  FileCode,
  Flame,
  KeyRound,
  Mail,
  MessageSquare,
  Phone,
  RefreshCw,
  Search,
  Send,
  ShieldAlert,
  Sparkles,
  UserCheck,
  Wrench,
  Zap,
} from 'lucide-react';
import { TicketRecord } from '../data/caseData';

interface Props {
  tickets: TicketRecord[];
  selectedTicket: TicketRecord;
  onSelectTicket: (t: TicketRecord) => void;
  onExecuteAction: (ticketId: string, actionLabel: string, logMsg: string) => void;
}

export const AgentWorkspace: React.FC<Props> = ({
  tickets,
  selectedTicket,
  onSelectTicket,
  onExecuteAction,
}) => {
  const [queueFilter, setQueueFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [draftText, setDraftText] = useState<string>('');
  const [actionFeedback, setActionFeedback] = useState<Record<string, string>>({});
  const [upgradeSeats, setUpgradeSeats] = useState<number>(150);

  // Sync draft text when ticket changes
  React.useEffect(() => {
    setDraftText(selectedTicket.ai_draft_response);
  }, [selectedTicket]);

  const filteredTickets = tickets.filter((t) => {
    const matchesQueue =
      queueFilter === 'ALL' ||
      (queueFilter === 'P1' && t.ai_true_priority === 'P1-Critical') ||
      (queueFilter === 'ENT' && t.account_tier === 'Enterprise') ||
      (queueFilter === 'AUTO' && t.auto_healed) ||
      (queueFilter === 'GEN' && t.ai_queue === 'General Queue');

    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      t.ticket_id.toLowerCase().includes(q) ||
      t.account_name.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.agent_name.toLowerCase().includes(q) ||
      t.agent_internal_notes.toLowerCase().includes(q);

    return matchesQueue && matchesSearch;
  });

  const triggerQuickAction = (label: string, logMsg: string) => {
    setActionFeedback((prev) => ({
      ...prev,
      [selectedTicket.ticket_id]: `${label} executed in 190ms via n8n (${selectedTicket.n8n_workflow_id})`,
    }));
    onExecuteAction(selectedTicket.ticket_id, label, logMsg);
  };

  const getChannelIcon = (ch: string) => {
    if (ch === 'email') return <Mail className="w-3.5 h-3.5 text-amber-400" />;
    if (ch === 'voice') return <Phone className="w-3.5 h-3.5 text-cyan-400" />;
    return <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 h-[calc(100vh-52px)] bg-[#0b0e14] text-xs overflow-hidden">
      {/* LEFT RAIL: Tiered SLA & Skill Queues (3 Cols) */}
      <div className="lg:col-span-3 border-r border-zinc-800 bg-[#0e121a] flex flex-col h-full overflow-hidden">
        <div className="p-2.5 border-b border-zinc-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-zinc-200">
              OpsOS Omnichannel Queue
            </span>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400">
              Push-Routing Active
            </span>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter ID, account, Miro, SSO, agent..."
              className="w-full bg-[#090c10] border border-zinc-800 focus:border-purple-500 rounded pl-8 pr-2 py-1 text-[11px] text-zinc-200 outline-none font-mono"
            />
          </div>

          {/* Queue Pills */}
          <div className="grid grid-cols-5 gap-1 font-mono text-[10px]">
            {[
              { id: 'ALL', label: `ALL (${tickets.length})` },
              { id: 'P1', label: `🚨 P1 (${tickets.filter((t) => t.ai_true_priority === 'P1-Critical').length})` },
              { id: 'ENT', label: `💎 ENT (${tickets.filter((t) => t.account_tier === 'Enterprise').length})` },
              { id: 'AUTO', label: `⚡ AI (${tickets.filter((t) => t.auto_healed).length})` },
              { id: 'GEN', label: '📬 GEN' },
            ].map((q) => (
              <button
                key={q.id}
                onClick={() => setQueueFilter(q.id)}
                className={`py-1 rounded text-center transition cursor-pointer ${
                  queueFilter === q.id
                    ? 'bg-[#632CA6] text-white font-semibold'
                    : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                }`}
              >
                {q.label}
              </button>
            ))}
          </div>
        </div>

        {/* Ticket List */}
        <div className="flex-1 overflow-y-auto divide-y divide-zinc-800/70">
          {filteredTickets.map((t) => {
            const active = t.ticket_id === selectedTicket.ticket_id;
            return (
              <div
                key={t.ticket_id}
                onClick={() => onSelectTicket(t)}
                className={`p-2.5 cursor-pointer transition ${
                  active
                    ? 'bg-[#171d2b] border-l-2 border-l-purple-500'
                    : 'hover:bg-[#121722]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    {getChannelIcon(t.channel)}
                    <span className="font-mono font-bold text-zinc-100">{t.ticket_id}</span>
                    <span
                      className={`font-mono text-[10px] px-1.5 py-0.2 rounded ${
                        t.account_tier === 'Enterprise'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {t.account_name}
                    </span>
                  </div>
                  <span
                    className={`font-mono text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                      t.ai_true_priority === 'P1-Critical'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                        : t.ai_true_priority === 'P4-AutoDeflected'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {t.ai_true_priority}
                  </span>
                </div>

                <div className="text-[11px] text-zinc-200 font-medium truncate">{t.category}</div>
                <div className="text-[10px] text-zinc-400 line-clamp-1 mt-0.5">{t.customer_message}</div>

                <div className="flex items-center justify-between mt-1.5 font-mono text-[10px] text-zinc-400">
                  <span>Agent: {t.agent_name}</span>
                  <span className="text-emerald-400">
                    FRT: {t.first_response_min}m ➔ {t.new_frt_min}m
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CENTER PANE: Conversation Timeline + Groq AI Sidekick + Instrumented Macros (5 Cols) */}
      <div className="lg:col-span-5 border-r border-zinc-800 bg-[#0b0e14] flex flex-col h-full overflow-y-auto p-3 space-y-3">
        {/* Thread Header */}
        <div className="bg-[#111621] border border-zinc-800 rounded p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-purple-300">{selectedTicket.ticket_id}</span>
              <span className="font-semibold text-sm text-zinc-100">{selectedTicket.category}</span>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 uppercase">
                {selectedTicket.channel}
              </span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[10px]">
              <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-400">
                Legacy Priority: <strong className="text-red-400">{selectedTicket.priority_assigned}</strong>
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-semibold">
                Groq Override: {selectedTicket.ai_true_priority}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 mt-2.5 pt-2 border-t border-zinc-800 font-mono text-[10px]">
            <div>
              <span className="text-zinc-500 block">CREATED (EST)</span>
              <span className="text-zinc-200">{selectedTicket.created_at}</span>
            </div>
            <div>
              <span className="text-zinc-500 block">LEGACY FRT / RES</span>
              <span className="text-red-400">
                {selectedTicket.first_response_min}m / {selectedTicket.resolution_min}m
              </span>
            </div>
            <div>
              <span className="text-zinc-500 block">NEW OPSOS FRT / RES</span>
              <span className="text-emerald-400 font-bold">
                {selectedTicket.new_frt_min}m / {selectedTicket.new_resolution_min}m
              </span>
            </div>
            <div>
              <span className="text-zinc-500 block">LEGACY CSAT</span>
              <span className={selectedTicket.csat_score <= 2 ? 'text-red-400 font-bold' : 'text-amber-300'}>
                {selectedTicket.csat_score}.0 / 5.0 ★
              </span>
            </div>
          </div>
        </div>

        {/* Customer Inbound Message */}
        <div className="bg-[#111621] border border-zinc-800 rounded p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-purple-600/30 border border-purple-500 flex items-center justify-center font-mono font-bold text-purple-200 text-[11px]">
                {selectedTicket.account_name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="font-semibold text-zinc-100">
                  {selectedTicket.account_name}{' '}
                  <span className="font-mono text-[10px] text-zinc-400">
                    ({selectedTicket.seats} seats • ${(selectedTicket.arr / 1000).toFixed(1)}K ARR)
                  </span>
                </div>
              </div>
            </div>
            <span className="font-mono text-[10px] text-zinc-400">Inbound via {selectedTicket.channel}</span>
          </div>

          <div className="text-zinc-200 bg-[#0b0e14] border border-zinc-800/90 rounded p-2.5 leading-relaxed">
            "{selectedTicket.customer_message}"
          </div>

          {/* Inline Structured Telemetry Payload attached by Edge SDK */}
          <div className="bg-[#090c10] border border-zinc-800 rounded p-2 font-mono text-[10px] text-zinc-400">
            <div className="flex items-center justify-between text-cyan-400 mb-1">
              <span className="flex items-center gap-1">
                <FileCode className="w-3 h-3" /> Edge Pre-Flight Telemetry Payload (Zero-Lookup Context)
              </span>
              <span>n8n: {selectedTicket.n8n_execution_id}</span>
            </div>
            <div>
              root_cause_code: <span className="text-amber-300">"{selectedTicket.root_cause_code}"</span> | sso_state:{' '}
              <span className="text-emerald-300">"{selectedTicket.sso_status}"</span>
              {selectedTicket.file_size_mb ? ` | upload_size: ${selectedTicket.file_size_mb}MB` : ''}
              {selectedTicket.competitor_mentioned ? ` | competitor_threat: "${selectedTicket.competitor_mentioned}"` : ''}
            </div>
          </div>
        </div>

        {/* CSV Legacy Agent Internal Notes (What Failed Before) */}
        <div className="bg-amber-950/20 border border-amber-500/40 rounded p-2.5 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase font-bold text-amber-300 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> Legacy CSV Agent Note ({selectedTicket.agent_name}) — Why Old Stack Failed:
            </span>
            <span className="font-mono text-[10px] text-amber-400/80">Escalated: {selectedTicket.escalated}</span>
          </div>
          <p className="text-zinc-300 italic leading-snug">"{selectedTicket.agent_internal_notes}"</p>
        </div>

        {/* Groq LPU AI Co-Pilot + Local pgvector RAG Card */}
        <div className="bg-purple-950/20 border border-purple-500/50 rounded p-3 space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="font-semibold text-purple-200">
                Groq LPU Sidekick (llama-3.3-70b-versatile)
              </span>
              <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
                ⚡ {selectedTicket.ai_latency_ms}ms
              </span>
            </div>
            <span
              className={`font-mono text-[10px] px-2 py-0.5 rounded font-bold ${
                selectedTicket.churn_risk_score >= 75
                  ? 'bg-red-500/25 text-red-300 border border-red-500/40'
                  : 'bg-zinc-800 text-zinc-300'
              }`}
            >
              Churn Risk Score: {selectedTicket.churn_risk_score}/100
            </span>
          </div>

          {/* Cited RAG KB Article */}
          <div className="bg-[#0b0e14] border border-purple-500/30 rounded p-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <div>
                <div className="font-mono text-[10px] text-purple-300">
                  pgvector RAG Citation: <strong>[{selectedTicket.rag_kb_id}]</strong>
                </div>
                <div className="text-[11px] text-zinc-200 font-medium">{selectedTicket.rag_kb_title}</div>
              </div>
            </div>
            <span className="font-mono text-[10px] text-emerald-400 shrink-0">v2026.1 Verified</span>
          </div>

          {/* Editable AI Response Draft */}
          <div>
            <label className="block font-mono text-[10px] uppercase text-zinc-400 mb-1">
              AI Synthesized Response Draft (Ready to Send):
            </label>
            <textarea
              rows={3}
              value={draftText}
              onChange={(e) => setDraftText(e.target.value)}
              className="w-full bg-[#090c10] border border-zinc-700 focus:border-purple-500 rounded p-2 text-zinc-100 text-[11px] leading-relaxed outline-none"
            />
          </div>

          {/* Instrumented Smart Macros Bar */}
          <div className="space-y-1.5 pt-1">
            <div className="font-mono text-[10px] uppercase text-zinc-400">
              Instrumented n8n Smart Macros (Replaces Unofficial Macros &amp; Personal Tallies):
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() =>
                  triggerQuickAction(
                    'Send AI Response + Close Loop',
                    `Sent RAG-verified reply on ${selectedTicket.ticket_id} (${selectedTicket.account_name})`,
                  )
                }
                className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Send className="w-3 h-3" /> Send Verified Reply &amp; Sync
              </button>

              <button
                onClick={() =>
                  triggerQuickAction(
                    'Force Magic Import Worker Retry',
                    `n8n WF-02 retried Magic Import job for ${selectedTicket.ticket_id} & incremented ENG-904 counter`,
                  )
                }
                className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 font-mono text-[10px] flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3 text-cyan-400" /> Auto-Retry Import
              </button>

              <button
                onClick={() =>
                  triggerQuickAction(
                    'Slot into Enterprise Curation Fast-Lane (42m)',
                    `Routed ${selectedTicket.account_name} (${selectedTicket.ticket_id}) to #1 Enterprise Curation Fast-Lane`,
                  )
                }
                className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-purple-300 font-mono text-[10px] flex items-center gap-1 cursor-pointer"
              >
                <Zap className="w-3 h-3 text-purple-400" /> Fast-Track Curation (42m)
              </button>

              <button
                onClick={() =>
                  triggerQuickAction(
                    'Page On-Call Tier-2 SRE via Ntfy',
                    `Dispatched P1 Ntfy push alert for ${selectedTicket.ticket_id} with 15m ACK watchdog`,
                  )
                }
                className="px-2 py-1 rounded bg-red-500/15 hover:bg-red-500/25 border border-red-500/40 text-red-300 font-mono text-[10px] flex items-center gap-1 cursor-pointer"
              >
                <ShieldAlert className="w-3 h-3" /> Page Tier-2 On-Call
              </button>
            </div>

            {actionFeedback[selectedTicket.ticket_id] && (
              <div className="mt-1.5 p-2 rounded bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-mono text-[11px] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                {actionFeedback[selectedTicket.ticket_id]}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT SIDEBAR: Zero-Tab Unified Tenant Context (Salesforce + Admin Portal + Stripe + Policy DB) (4 Cols) */}
      <div className="lg:col-span-4 bg-[#0e121a] flex flex-col h-full overflow-y-auto p-3 space-y-2.5">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
          <span className="font-mono text-[11px] font-bold uppercase text-zinc-200">
            Unified Context Sidebar (0 Manual Lookups)
          </span>
          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">
            Hydrated in 95ms
          </span>
        </div>

        {/* 1. Salesforce CRM Block */}
        <div className="bg-[#111621] border border-zinc-800 rounded p-2.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase font-bold text-cyan-400 flex items-center gap-1">
              <Database className="w-3 h-3" /> 1. Salesforce CRM Context (Synced)
            </span>
            <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300">
              {selectedTicket.account_tier}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 font-mono text-[11px] bg-[#0b0e14] p-2 rounded border border-zinc-800/80">
            <div>
              <span className="text-zinc-500 text-[10px] block">ACCOUNT ARR</span>
              <span className="text-emerald-400 font-bold text-sm">
                ${selectedTicket.arr.toLocaleString()}/yr
              </span>
            </div>
            <div>
              <span className="text-zinc-500 text-[10px] block">SEAT UTILIZATION</span>
              <span className="text-zinc-100 font-bold text-sm">
                {selectedTicket.seats_active} / {selectedTicket.seats} seats
              </span>
            </div>
            <div>
              <span className="text-zinc-500 text-[10px] block">RENEWAL DATE</span>
              <span className="text-zinc-200">{selectedTicket.renewal_date}</span>
            </div>
            <div>
              <span className="text-zinc-500 text-[10px] block">DEDICATED CSM</span>
              <span className="text-purple-300">{selectedTicket.csm_owner}</span>
            </div>
          </div>
        </div>

        {/* 2. Canvasly Admin Portal + Live Design Curation Queue Block */}
        <div className="bg-[#111621] border border-zinc-800 rounded p-2.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase font-bold text-purple-400 flex items-center gap-1">
              <KeyRound className="w-3 h-3" /> 2. Canvasly Admin Portal &amp; Curation ETA
            </span>
            <span
              className={`font-mono text-[10px] px-1.5 py-0.2 rounded ${
                selectedTicket.sso_status.includes('ERR')
                  ? 'bg-red-500/20 text-red-400'
                  : 'bg-emerald-500/20 text-emerald-400'
              }`}
            >
              {selectedTicket.sso_status}
            </span>
          </div>

          {/* Honest Design Curation SLA Tracker (Fixes T-4804, T-4811, T-4816, T-4824) */}
          <div className="bg-[#0b0e14] border border-zinc-800 rounded p-2 space-y-1.5">
            <div className="flex items-center justify-between font-mono text-[10px]">
              <span className="text-zinc-400">LIVE DESIGN CURATION BACKLOG:</span>
              <span className="text-emerald-400 font-semibold">Truth-Synced (No Fake 2-3h Quotes)</span>
            </div>
            <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
              <div className="p-1.5 rounded bg-purple-950/30 border border-purple-500/40">
                <div className="text-[10px] text-purple-300">ENTERPRISE FAST-LANE</div>
                <div className="text-sm font-bold text-white">38 mins ETA</div>
                <div className="text-[10px] text-emerald-400">3 jobs ahead • SLA &lt;45m</div>
              </div>
              <div className="p-1.5 rounded bg-zinc-900 border border-zinc-800">
                <div className="text-[10px] text-zinc-400">GENERAL QUEUE</div>
                <div className="text-sm font-bold text-amber-400">68.5 hrs ETA</div>
                <div className="text-[10px] text-zinc-500">Auto-OCR Pre-Filter Active</div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Stripe Billing & 1-Click Atomic Refund Block (Fixes T-4820) */}
        <div className="bg-[#111621] border border-zinc-800 rounded p-2.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1">
              <CreditCard className="w-3 h-3" /> 3. Stripe Billing &amp; 1-Click Refund (WF-04)
            </span>
            <span className="font-mono text-[10px] text-zinc-400">Replaces 4 Manual Tabs</span>
          </div>

          {selectedTicket.duplicate_charge_amount ? (
            <div className="bg-red-950/25 border border-red-500/40 rounded p-2 space-y-1.5">
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span className="text-red-300 font-bold">DUPLICATE CHARGE DETECTED</span>
                <span className="text-white font-bold">${selectedTicket.duplicate_charge_amount.toLocaleString()}</span>
              </div>
              <div className="text-[10px] text-zinc-300 font-mono">
                Stripe ID: ch_3Q9912 • Collision with ch_3Q9911 (Same Period)
              </div>
              <button
                onClick={() =>
                  triggerQuickAction(
                    `Atomic Refund ($${selectedTicket.duplicate_charge_amount.toLocaleString()})`,
                    `Executed WF-04 Atomic Stripe Refund + Salesforce Credit Log for ${selectedTicket.account_name}`,
                  )
                }
                className="w-full py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-[11px] font-semibold cursor-pointer"
              >
                ⚡ Execute 1-Click Refund + Sync Salesforce + Notify Finance
              </button>
            </div>
          ) : (
            <div className="bg-[#0b0e14] border border-zinc-800 rounded p-2 font-mono text-[10px] text-zinc-400 flex items-center justify-between">
              <span>Last Invoice: PAID (${Math.round(selectedTicket.arr / 12).toLocaleString()}/mo)</span>
              <span className="text-emerald-400">0 Duplicate Charges</span>
            </div>
          )}
        </div>

        {/* 4. Codified Policy & Pricing Engine (Replaces Stale Nov Google Sheet in T-4807 & T-4827) */}
        <div className="bg-[#111621] border border-zinc-800 rounded p-2.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase font-bold text-amber-400 flex items-center gap-1">
              <Wrench className="w-3 h-3" /> 4. Live Pricing &amp; Exception Engine (POL-201)
            </span>
            <span className="font-mono text-[10px] text-emerald-400">Sheet Retired</span>
          </div>

          <div className="bg-[#0b0e14] border border-zinc-800 rounded p-2 space-y-1.5 font-mono text-[10px]">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Target Enterprise Annual Seats:</span>
              <input
                type="number"
                value={upgradeSeats}
                onChange={(e) => setUpgradeSeats(Math.max(50, Number(e.target.value)))}
                className="w-20 bg-zinc-900 border border-zinc-700 rounded px-1.5 py-0.5 text-right text-zinc-100"
              />
            </div>
            <div className="flex items-center justify-between text-zinc-300">
              <span>Annual Rate ($25/seat/mo • 20% off):</span>
              <span className="text-emerald-400 font-bold">${(upgradeSeats * 300).toLocaleString()}/yr</span>
            </div>
            <div className="text-[10px] text-zinc-400 pt-1 border-t border-zinc-800">
              • Mid-Cycle Unused Seats: <strong className="text-zinc-200">100% Renewal Credit Rollover</strong>
              <br />• Enterprise MSA Renewal Uplift Cap: <strong className="text-zinc-200">5.0% Max (Auto-Enforced)</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
