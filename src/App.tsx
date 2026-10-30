import React, { useEffect, useState } from 'react';
import {
  Activity,
  ArrowLeft,
  Command,
  Headphones,
  Layers,
  LayoutGrid,
  Search,
  Users,
  X,
} from 'lucide-react';
import {
  EnterpriseAccount,
  INITIAL_TICKETS,
  TicketRecord,
} from './data/caseData';
import { BusinessHomePage } from './components/BusinessHomePage';
import { DatadogCommandCenter } from './components/DatadogCommandCenter';
import { AgentWorkspace } from './components/AgentWorkspace';
import { CanvaslyStudio } from './components/CanvaslyStudio';
import { WfmAndRoiConsole } from './components/WfmAndRoiConsole';

export default function App() {
  const [surface, setSurface] = useState<'home' | 'datadog' | 'agent' | 'canvas' | 'wfm'>('home');
  const [tickets, setTickets] = useState<TicketRecord[]>(INITIAL_TICKETS);
  const [selectedTicket, setSelectedTicket] = useState<TicketRecord>(INITIAL_TICKETS[23]);
  const [statusBannerActive, setStatusBannerActive] = useState<boolean>(true);
  const [commandOpen, setCommandOpen] = useState<boolean>(false);
  const [commandQuery, setCommandQuery] = useState<string>('');
  const [toastAlert, setToastAlert] = useState<{ title: string; body: string; level: 'p1' | 'ok' } | null>(null);

  const [logs, setLogs] = useState([
    {
      id: 'l-1',
      ts: '12:14:02.114',
      level: 'ALERT' as const,
      service: 'n8n-worker',
      message: 'WF-03 correlated T-4804 + T-4824 (Meridian Health $135K ARR) -> Competitor "Miro" detected -> P1 Fast-Lane (38m)',
    },
    {
      id: 'l-2',
      ts: '12:14:04.408',
      level: 'ALERT' as const,
      service: 'ntfy-pager',
      message: 'Dispatched after-hours P1 SSO alert for T-4813 (CoreVista 300 seats) & T-4829 (Ridgeline 250 seats) -> Acked in 75s',
    },
    {
      id: 'l-3',
      ts: '12:14:07.892',
      level: 'OK' as const,
      service: 'groq-lpu',
      message: 'Hydrated 30 CSV tickets via llama-3.3-70b-versatile (avg 154ms/ticket) + pgvector KB citations attached',
    },
    {
      id: 'l-4',
      ts: '12:14:10.015',
      level: 'WARN' as const,
      service: 'n8n-worker',
      message: 'WF-02 detected >=7 Magic Import 504 timeouts -> Auto-healed in 1.2s & opened Engineering Bug ENG-904',
    },
  ]);

  // Global Cmd+K listener
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandOpen((o) => !o);
      } else if (e.key === 'Escape') {
        setCommandOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const appendLog = (level: 'INFO' | 'WARN' | 'ALERT' | 'OK', service: string, message: string) => {
    const now = new Date();
    const ts = now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');
    setLogs((prev) => [{ id: `l-${Date.now()}-${Math.random()}`, ts, level, service, message }, ...prev.slice(0, 49)]);
  };

  const triggerBackendWebhook = async (eventType: string, payload: unknown) => {
    try {
      await fetch('./api/webhook/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventType, payload }),
      });
    } catch {
      // Optional backend fallback
    }
  };

  const handleTriggerScenario = (type: 'sso_outage' | 'magic_timeout' | 'miro_churn' | 'dup_charge' | 'replay_all') => {
    const nextNum = 4831 + (tickets.length - 30);
    const id = `T-${nextNum}`;

    if (type === 'sso_outage') {
      const newT: TicketRecord = {
        ...INITIAL_TICKETS[12],
        ticket_id: id,
        created_at: 'LIVE NOW (After-Hours Sim)',
        account_name: 'CoreVista',
        customer_message: `[LIVE P1 SIMULATION] SAML 2.0 IDP Certificate Expired across 300 Enterprise seats at CoreVista!`,
        n8n_execution_id: `exec-${Date.now().toString().slice(-5)}`,
      };
      setTickets((prev) => [newT, ...prev]);
      setSelectedTicket(newT);
      appendLog('ALERT', 'ntfy-pager', `${id}: P1 Enterprise SSO Lockout (CoreVista $90K ARR) -> Ntfy On-Call Paged & Grace Cert Applied in 1.1s!`);
      setToastAlert({
        title: `🚨 Ntfy P1 Pager Fired (${id} // CoreVista 300 Seats)`,
        body: 'n8n WF-03 paged On-Call Tier-2 SRE & applied 24h SAML grace certificate fallback in 1.1s.',
        level: 'p1',
      });
      triggerBackendWebhook('sso_outage', newT);
    } else if (type === 'magic_timeout') {
      const newT: TicketRecord = {
        ...INITIAL_TICKETS[0],
        ticket_id: id,
        created_at: 'LIVE NOW',
        account_name: 'PulseWave Tech',
        customer_message: `[LIVE 504 TIMEOUT] Uploaded architecture whiteboard PNG -> Hit batch worker timeout.`,
        n8n_execution_id: `exec-${Date.now().toString().slice(-5)}`,
      };
      setTickets((prev) => [newT, ...prev]);
      setSelectedTicket(newT);
      appendLog('OK', 'n8n-worker', `${id}: WF-02 auto-retried Magic Import job #MI-${nextNum} on isolated worker -> Healed in 1.2s (0 agent touch)`);
      setToastAlert({
        title: `⚡ Magic Import 504 Auto-Healed (${id})`,
        body: 'n8n WF-02 re-ran upload on backup worker in 1.2s and updated Engineering Bug ENG-904.',
        level: 'ok',
      });
      triggerBackendWebhook('magic_timeout', newT);
    } else if (type === 'miro_churn') {
      const newT: TicketRecord = {
        ...INITIAL_TICKETS[23],
        ticket_id: id,
        created_at: 'LIVE NOW',
        n8n_execution_id: `exec-${Date.now().toString().slice(-5)}`,
      };
      setTickets((prev) => [newT, ...prev]);
      setSelectedTicket(newT);
      appendLog('ALERT', 'groq-lpu', `${id}: Competitor threat "Miro" + 2nd friction in 26h on Meridian Health ($135K ARR) -> Slotted #1 Curation Fast-Lane (38m)`);
      setToastAlert({
        title: `🔥 Multi-Touch Churn Intercepted (${id} // Meridian Health $135K ARR)`,
        body: 'Groq LPU overridden Low -> P1-Critical, routed to 38m Enterprise Curation Fast-Lane & paged CSM Elena Vance.',
        level: 'p1',
      });
      triggerBackendWebhook('miro_churn', newT);
    } else if (type === 'dup_charge') {
      const newT: TicketRecord = {
        ...INITIAL_TICKETS[19],
        ticket_id: id,
        created_at: 'LIVE NOW',
        n8n_execution_id: `exec-${Date.now().toString().slice(-5)}`,
      };
      setTickets((prev) => [newT, ...prev]);
      setSelectedTicket(newT);
      appendLog('OK', 'n8n-worker', `${id}: WF-04 verified duplicate Stripe charge ($6,000) -> Executed atomic refund #re_99812A + synced Salesforce CRM`);
      setToastAlert({
        title: `💳 1-Click Atomic Stripe Refund Executed (${id})`,
        body: 'n8n WF-04 refunded $6,000 duplicate charge, logged credit in Salesforce, and notified Finance in 3.2s.',
        level: 'ok',
      });
      triggerBackendWebhook('dup_charge', newT);
    }
  };

  const handleExecuteAgentAction = (ticketId: string, actionLabel: string, logMsg: string) => {
    appendLog('OK', 'n8n-worker', `[${ticketId}] ${logMsg}`);
    setToastAlert({
      title: `✓ ${actionLabel} (${ticketId})`,
      body: logMsg,
      level: 'ok',
    });
    triggerBackendWebhook('agent_macro', { ticketId, actionLabel, logMsg });
  };

  const handleCreateLiveCanvasTicket = (payload: {
    account: EnterpriseAccount;
    category: string;
    channel: 'chat' | 'email' | 'voice';
    message: string;
    rootCause: string;
    autoHealed: boolean;
    priority: 'P1-Critical' | 'P2-High' | 'P4-AutoDeflected';
  }) => {
    const nextNum = 4831 + (tickets.length - 30);
    const id = `T-${nextNum}`;
    const newT: TicketRecord = {
      ...INITIAL_TICKETS[3],
      ticket_id: id,
      created_at: 'LIVE FROM CANVASLY STUDIO',
      channel: payload.channel,
      category: payload.category,
      account_name: payload.account.name,
      account_tier: 'Enterprise',
      arr: payload.account.arr,
      seats: payload.account.seats,
      seats_active: payload.account.seats,
      csm_owner: payload.account.csm,
      customer_message: payload.message,
      ai_true_priority: payload.priority,
      root_cause_code: payload.rootCause,
      auto_healed: payload.autoHealed,
      new_frt_min: payload.autoHealed ? 0.1 : 0.9,
      new_resolution_min: payload.autoHealed ? 0.3 : 12.0,
      n8n_execution_id: `exec-${Date.now().toString().slice(-5)}`,
    };
    setTickets((prev) => [newT, ...prev]);
    setSelectedTicket(newT);
    appendLog('OK', 'n8n-worker', `${id} ingested from Canvasly Studio (${payload.account.name}) -> ${payload.rootCause}`);
    triggerBackendWebhook('canvas_studio_event', newT);
  };

  // Render full-bleed Business Website when on Homepage
  if (surface === 'home') {
    return <BusinessHomePage onNavigate={(nextView) => setSurface(nextView)} />;
  }

  return (
    <div className="min-h-screen bg-[#0b0e14] text-zinc-100 flex flex-col">
      {/* Sub-App Header Bar with Back to Business Website Link */}
      <header className="h-[52px] bg-[#111621] border-b border-zinc-800 px-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSurface('home')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-medium text-zinc-200 transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-indigo-400" />
            <span>Canvasly.io Home</span>
          </button>

          <div className="h-4 w-[1px] bg-zinc-800" />

          {/* Workspace Switcher Tabs */}
          <nav className="flex items-center gap-1 bg-[#0b0e14] p-1 rounded border border-zinc-800">
            <button
              onClick={() => setSurface('canvas')}
              className={`px-2.5 py-1 rounded text-[11px] font-medium flex items-center gap-1.5 transition cursor-pointer ${
                surface === 'canvas'
                  ? 'bg-indigo-600 text-white font-semibold shadow'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              Canvasly Studio
            </button>

            <button
              onClick={() => setSurface('agent')}
              className={`px-2.5 py-1 rounded text-[11px] font-medium flex items-center gap-1.5 transition cursor-pointer ${
                surface === 'agent'
                  ? 'bg-indigo-600 text-white font-semibold shadow'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Headphones className="w-3.5 h-3.5" />
              Support Console
            </button>

            <button
              onClick={() => setSurface('datadog')}
              className={`px-2.5 py-1 rounded text-[11px] font-medium flex items-center gap-1.5 transition cursor-pointer ${
                surface === 'datadog'
                  ? 'bg-indigo-600 text-white font-semibold shadow'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              Datadog &amp; n8n Engine
            </button>

            <button
              onClick={() => setSurface('wfm')}
              className={`px-2.5 py-1 rounded text-[11px] font-medium flex items-center gap-1.5 transition cursor-pointer ${
                surface === 'wfm'
                  ? 'bg-indigo-600 text-white font-semibold shadow'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              WFM &amp; ROI
            </button>
          </nav>
        </div>

        {/* Right Controls: Command Palette (Cmd+K) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCommandOpen(true)}
            className="px-2.5 py-1 rounded bg-[#0b0e14] hover:bg-zinc-900 border border-zinc-700 text-zinc-300 font-mono text-[11px] flex items-center gap-2 cursor-pointer"
          >
            <Search className="w-3 h-3 text-zinc-400" />
            <span className="hidden md:inline">Jump to Ticket / Account</span>
            <kbd className="px-1.5 py-0.2 rounded bg-zinc-800 text-[10px] text-zinc-400">⌘K</kbd>
          </button>
        </div>
      </header>

      {/* Live Toast Notification Banner */}
      {toastAlert && (
        <div
          className={`fixed bottom-4 right-4 z-50 max-w-md rounded-lg border p-3 shadow-2xl backdrop-blur-md flex items-start justify-between gap-3 ${
            toastAlert.level === 'p1'
              ? 'bg-red-950/90 border-red-500 text-red-100'
              : 'bg-emerald-950/90 border-emerald-500 text-emerald-100'
          }`}
        >
          <div>
            <div className="font-mono text-xs font-bold">{toastAlert.title}</div>
            <div className="text-[11px] mt-0.5 text-zinc-200">{toastAlert.body}</div>
          </div>
          <button onClick={() => setToastAlert(null)} className="text-zinc-400 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Command Palette Modal (Cmd+K) */}
      {commandOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-start justify-center pt-20 p-4">
          <div className="w-full max-w-xl bg-[#111621] border border-zinc-700 rounded-lg shadow-2xl overflow-hidden">
            <div className="p-3 border-b border-zinc-800 flex items-center gap-2">
              <Command className="w-4 h-4 text-indigo-400" />
              <input
                type="text"
                autoFocus
                value={commandQuery}
                onChange={(e) => setCommandQuery(e.target.value)}
                placeholder="Type ticket ID (T-4801..T-4830), Enterprise account (Meridian, DataForge), or command..."
                className="w-full bg-transparent text-xs text-zinc-100 outline-none font-mono"
              />
              <button onClick={() => setCommandOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto divide-y divide-zinc-800/60 text-xs font-mono">
              {tickets
                .filter(
                  (t) =>
                    !commandQuery ||
                    t.ticket_id.toLowerCase().includes(commandQuery.toLowerCase()) ||
                    t.account_name.toLowerCase().includes(commandQuery.toLowerCase()) ||
                    t.category.toLowerCase().includes(commandQuery.toLowerCase()),
                )
                .slice(0, 12)
                .map((t) => (
                  <div
                    key={t.ticket_id}
                    onClick={() => {
                      setSelectedTicket(t);
                      setSurface('agent');
                      setCommandOpen(false);
                    }}
                    className="p-2.5 hover:bg-indigo-950/40 cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <span className="text-indigo-300 font-bold mr-2">{t.ticket_id}</span>
                      <span className="text-zinc-200">{t.account_name}</span>
                      <span className="text-zinc-500 ml-2">— {t.category}</span>
                    </div>
                    <span className="text-[10px] text-emerald-400">{t.ai_true_priority}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Active Surface */}
      <main className="flex-1">
        {surface === 'datadog' && (
          <DatadogCommandCenter
            tickets={tickets}
            selectedTicket={selectedTicket}
            onSelectTicket={(t) => setSelectedTicket(t)}
            onSwitchSurface={(s) => setSurface(s)}
            logs={logs}
            onTriggerScenario={handleTriggerScenario}
            n8nLiveStatus="connected"
            statusBannerActive={statusBannerActive}
            onToggleStatusBanner={() => setStatusBannerActive((v) => !v)}
          />
        )}

        {surface === 'agent' && (
          <AgentWorkspace
            tickets={tickets}
            selectedTicket={selectedTicket}
            onSelectTicket={(t) => setSelectedTicket(t)}
            onExecuteAction={handleExecuteAgentAction}
          />
        )}

        {surface === 'canvas' && (
          <CanvaslyStudio
            statusBannerActive={statusBannerActive}
            onCreateLiveTicket={handleCreateLiveCanvasTicket}
          />
        )}

        {surface === 'wfm' && <WfmAndRoiConsole />}
      </main>
    </div>
  );
}
