import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  CloudUpload,
  Cpu,
  FileSpreadsheet,
  FileText,
  GitCommit,
  Globe,
  Image,
  KeyRound,
  Layers,
  Lock,
  MousePointer,
  Plus,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Users,
  Wand2,
  Zap,
} from 'lucide-react';
import { ENTERPRISE_ACCOUNTS, EnterpriseAccount } from '../data/caseData';

interface Props {
  statusBannerActive: boolean;
  onCreateLiveTicket: (payload: {
    account: EnterpriseAccount;
    category: string;
    channel: 'chat' | 'email' | 'voice';
    message: string;
    rootCause: string;
    autoHealed: boolean;
    priority: 'P1-Critical' | 'P2-High' | 'P4-AutoDeflected';
  }) => void;
}

export const CanvaslyStudio: React.FC<Props> = ({
  statusBannerActive,
  onCreateLiveTicket,
}) => {
  const [activeTenant, setActiveTenant] = useState<EnterpriseAccount>(ENTERPRISE_ACCOUNTS[0]);
  const [connectorBugMode, setConnectorBugMode] = useState<boolean>(false);
  const [cursorDesyncMode, setCursorDesyncMode] = useState<boolean>(false);
  const [showMagicImportModal, setShowMagicImportModal] = useState<boolean>(true);
  const [importStatus, setImportStatus] = useState<{
    step: 'idle' | 'preflight' | 'healed' | 'fastlane';
    title: string;
    detail: string;
    code: string;
  }>({
    step: 'idle',
    title: 'Edge Pre-Flight SDK v3.5 Active',
    detail: 'Select a test upload scenario from the CSV dataset below to watch Pre-Flight + n8n WF-02 handle it live.',
    code: 'READY_FOR_UPLOAD',
  });
  const [zoom, setZoom] = useState<number>(100);

  const handleTestUpload = (type: 'size_64mb' | 'timeout_504' | 'complex_pdf') => {
    if (type === 'size_64mb') {
      setImportStatus({
        step: 'preflight',
        title: 'Pre-Flight Intercepted >50MB Payload (Fixes T-4826)',
        detail:
          'Legacy system threw useless "processing failed". Edge SDK detected 64.2MB PDF (>50MB worker cap), auto-compressed raster layers to 34.1MB on client, and imported cleanly in 1.1s (0 agent tickets!).',
        code: 'PREFLIGHT_COMPRESSED_64MB_TO_34MB',
      });
      onCreateLiveTicket({
        account: activeTenant,
        category: 'Magic Import - Error',
        channel: 'chat',
        message: `[Auto-Deflected via Edge SDK] 64.2MB Blueprint PDF intercepted before failure and lossless-compressed to 34.1MB.`,
        rootCause: 'ERR_PAYLOAD_64MB_AUTO_COMPRESSED',
        autoHealed: true,
        priority: 'P4-AutoDeflected',
      });
    } else if (type === 'timeout_504') {
      setImportStatus({
        step: 'healed',
        title: 'Transient 504 Worker Timeout Auto-Healed by n8n WF-02 (Fixes T-4801, T-4818, T-4821)',
        detail:
          'Primary batch worker timed out at 900ms. n8n WF-02 automatically re-queued job #MI-9942 on isolated high-memory worker -> Succeeded in 1.2s and incremented Datadog anomaly counter (ENG-904).',
        code: 'N8N_WF02_AUTO_RETRY_OK_1200MS',
      });
      onCreateLiveTicket({
        account: activeTenant,
        category: 'Magic Import - Error',
        channel: 'chat',
        message: `[n8n Self-Healed] Whiteboard PNG upload encountered transient 504 timeout -> Auto-recovered on backup worker in 1.2s.`,
        rootCause: 'ERR_BATCH_TIMEOUT_504_RECOVERED',
        autoHealed: true,
        priority: 'P4-AutoDeflected',
      });
    } else {
      setImportStatus({
        step: 'fastlane',
        title: `Slotted into #1 Enterprise Curation Fast-Lane — 38m ETA (Fixes T-4804, T-4811, T-4824)`,
        detail: `Verified ${activeTenant.name} ($${(activeTenant.arr / 1000).toFixed(0)}K ARR). Bypassed the 70-hour general backlog, applied Orthogonal Vector Pre-Pass, and synced live 38-min SLA directly to customer & agent UI.`,
        code: 'ENT_CURATION_FASTLANE_SLA_38M',
      });
      setConnectorBugMode(false);
      onCreateLiveTicket({
        account: activeTenant,
        category: 'Magic Import - Quality',
        channel: 'chat',
        message: `30-page clinical flowchart imported by ${activeTenant.name} (${activeTenant.seats} seats) -> Routed via n8n WF-02 to Enterprise Fast-Lane (38m ETA).`,
        rootCause: 'ENT_CURATION_FAST_TRACK_ROUTED',
        autoHealed: false,
        priority: 'P2-High',
      });
    }
  };

  return (
    <div className="relative h-[calc(100vh-52px)] w-full dot-grid-canvas overflow-hidden flex flex-col select-none text-xs">
      {/* Live Status Page Banner (Fixes T-4812 & Ticket Storms) */}
      {statusBannerActive && (
        <div className="bg-amber-500/20 border-b border-amber-500/50 px-4 py-1.5 flex items-center justify-between text-[11px] backdrop-blur-md z-30">
          <div className="flex items-center gap-2 text-amber-200">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>
              <strong>status.canvasly.io Live Telemetry Banner:</strong> Intermittent morning batch latency detected on
              Magic Import (Incident <code>INC-904</code>). Automated n8n Worker Failover is active—no manual retries
              needed.
            </span>
          </div>
          <span className="font-mono text-[10px] text-amber-300">Ticket Storm Suppression Active</span>
        </div>
      )}

      {/* Top Product Bar (Figma / Miro Enterprise Header) */}
      <div className="h-12 bg-[#111621]/95 border-b border-zinc-800 px-4 flex items-center justify-between z-20 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center font-bold text-white">
              C
            </div>
            <span className="font-bold text-zinc-100 text-sm">Canvasly Studio</span>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">
              Enterprise Infinite Canvas v4.2
            </span>
          </div>

          <span className="text-zinc-600">|</span>

          {/* Active Tenant Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-zinc-400">Tenant Workspace:</span>
            <select
              value={activeTenant.id}
              onChange={(e) => {
                const found = ENTERPRISE_ACCOUNTS.find((a) => a.id === e.target.value);
                if (found) setActiveTenant(found);
              }}
              className="bg-[#0b0e14] border border-zinc-700 rounded px-2 py-1 text-[11px] font-mono text-zinc-100 outline-none"
            >
              {ENTERPRISE_ACCOUNTS.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.seats} Seats • ${(a.arr / 1000).toFixed(0)}K ARR)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right: Multiplayer Presence Roster & SSO Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-[#0b0e14] border border-zinc-800 px-2.5 py-1 rounded">
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-mono text-[10px] text-zinc-300">
              {activeTenant.seats} Seats • {activeTenant.ssoProvider}
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>

          <button
            onClick={() => setConnectorBugMode((v) => !v)}
            className={`px-2.5 py-1 rounded font-mono text-[11px] border transition cursor-pointer ${
              connectorBugMode
                ? 'bg-red-500/20 border-red-500 text-red-300'
                : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:text-white'
            }`}
          >
            {connectorBugMode ? '⚠️ Bug T-4824 Active: Connectors Mangled' : 'Test T-4824 Mangled Connectors'}
          </button>

          <button
            onClick={() => setCursorDesyncMode((v) => !v)}
            className={`px-2.5 py-1 rounded font-mono text-[11px] border transition cursor-pointer ${
              cursorDesyncMode
                ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:text-white'
            }`}
          >
            {cursorDesyncMode ? '⚠️ Bug T-4812 Active: Cursor Desync' : 'Test T-4812 Cursor Desync'}
          </button>
        </div>
      </div>

      {/* Main Spatial Infinite Canvas Area */}
      <div className="flex-1 relative overflow-hidden">
        {/* Interactive Vector Flowchart Nodes & SVG Orthogonal/Mangled Splines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <marker id="arrow-ok" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" fill="#8b5cf6" />
            </marker>
            <marker id="arrow-err" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" fill="#ef4444" />
            </marker>
          </defs>

          {connectorBugMode ? (
            <>
              {/* Mangled chaotic connector lines reproducing T-4824 */}
              <path
                d="M 210 150 C 480 40, 90 360, 410 190"
                stroke="#ef4444"
                strokeWidth="2.5"
                strokeDasharray="5,4"
                fill="none"
                markerEnd="url(#arrow-err)"
              />
              <path
                d="M 410 150 C 120 390, 620 20, 320 310"
                stroke="#ef4444"
                strokeWidth="2.5"
                fill="none"
                markerEnd="url(#arrow-err)"
              />
              <text x="275" y="135" fill="#fca5a5" className="font-mono text-[11px]">
                [OCR COLLISION: LABEL OVERLAP #ERR-4824]
              </text>
            </>
          ) : (
            <>
              {/* Clean Orthogonal Vector Connectors */}
              <path
                d="M 250 155 L 360 155"
                stroke="#8b5cf6"
                strokeWidth="2"
                fill="none"
                markerEnd="url(#arrow-ok)"
              />
              <path
                d="M 550 155 L 640 155"
                stroke="#10b981"
                strokeWidth="2"
                fill="none"
                markerEnd="url(#arrow-ok)"
              />
              <path
                d="M 455 200 L 455 280"
                stroke="#8b5cf6"
                strokeWidth="2"
                fill="none"
                markerEnd="url(#arrow-ok)"
              />
            </>
          )}
        </svg>

        {/* Canvas Nodes (Left Side of Screen) */}
        <div
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}
          className="relative w-full h-full p-8"
        >
          {/* Node 1 */}
          <div className="absolute left-[60px] top-[110px] w-[190px] bg-[#141a29]/95 border-2 border-purple-500/70 rounded-lg p-3 shadow-xl">
            <div className="flex items-center justify-between text-[10px] font-mono text-purple-300 mb-1">
              <span>STEP 01 // INTAKE</span>
              <span>VECTOR OK</span>
            </div>
            <div className="font-semibold text-zinc-100 text-xs">
              {activeTenant.name} Triage Protocol
            </div>
            <div className="text-[10px] text-zinc-400 mt-1">
              Imported from 30-page PDF via Magic Import v3.5
            </div>
          </div>

          {/* Node 2 */}
          <div
            className={`absolute left-[360px] top-[110px] w-[190px] bg-[#141a29]/95 border-2 rounded-lg p-3 shadow-xl transition ${
              connectorBugMode ? 'border-red-500 rotate-3' : 'border-emerald-500/70'
            }`}
          >
            <div className="flex items-center justify-between text-[10px] font-mono text-emerald-300 mb-1">
              <span>STEP 02 // ROUTING</span>
              <span>{connectorBugMode ? 'OCR GARBLED' : 'ALIGNED'}</span>
            </div>
            <div className="font-semibold text-zinc-100 text-xs">
              {connectorBugMode ? '##@@_STRUCT_TEXT_ERR' : 'Clinical Allocation Matrix'}
            </div>
            <div className="text-[10px] text-zinc-400 mt-1">
              {connectorBugMode
                ? 'T-4824 Bug: Connector splines tangled across labels'
                : 'Orthogonal splines verified by Fast-Lane Curation'}
            </div>
          </div>

          {/* Node 3 */}
          <div className="absolute left-[360px] top-[280px] w-[200px] bg-amber-400/10 border border-amber-400/50 rounded-lg p-3 shadow-lg">
            <div className="font-mono text-[10px] text-amber-300 mb-1">📌 STICKY NOTE // VP PRODUCT</div>
            <div className="text-[11px] text-amber-100 leading-snug">
              "With Enterprise Curation Fast-Lane down to 38m (from 70h), our 450 seats are staying on Canvasly instead
              of switching to Miro!"
            </div>
          </div>

          {/* Live Animated Multiplayer Ghost Cursors */}
          <div
            className={`absolute transition-all duration-700 ${
              cursorDesyncMode ? 'left-[290px] top-[230px] animate-ping' : 'left-[560px] top-[210px]'
            }`}
          >
            <div className="flex items-center gap-1">
              <MousePointer className="w-4 h-4 text-emerald-400 fill-emerald-400" />
              <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-black font-mono text-[10px] font-bold shadow">
                Sarah Chen ({activeTenant.name}) {cursorDesyncMode ? '[WS DESYNC LAG 1,840ms]' : '[60fps SYNC]'}
              </span>
            </div>
          </div>

          <div className="absolute left-[180px] top-[320px] transition-all duration-500">
            <div className="flex items-center gap-1">
              <MousePointer className="w-4 h-4 text-purple-400 fill-purple-400" />
              <span className="px-2 py-0.5 rounded-full bg-purple-500 text-white font-mono text-[10px] font-bold shadow">
                Elena Vance (Dedicated CSM)
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT OVERLAY: Interactive Magic Import AI + Enterprise Onboarding Control Drawer */}
        {showMagicImportModal && (
          <div className="absolute right-4 top-4 bottom-16 w-[430px] bg-[#111621]/95 border border-zinc-700/90 rounded-lg shadow-2xl p-3.5 flex flex-col justify-between overflow-y-auto backdrop-blur-md z-20">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <div className="flex items-center gap-2">
                  <Wand2 className="w-4 h-4 text-purple-400" />
                  <span className="font-bold text-zinc-100 text-xs">
                    ✨ Magic Import AI Studio + Pre-Flight SDK
                  </span>
                </div>
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                  n8n WF-02 Linked
                </span>
              </div>

              <div className="text-[11px] text-zinc-400 leading-snug">
                Test the 3 failure modes from the case study CSV (`26.7%` of all support volume) and watch our
                Pre-Flight Edge SDK + n8n Self-Healer eliminate them in real time:
              </div>

              {/* 3 Interactive Upload Cards */}
              <div className="space-y-2">
                <div className="p-2.5 rounded bg-[#0b0e14] border border-zinc-800 hover:border-purple-500/50 transition">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-zinc-100 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-amber-400" />
                      1. Upload 64.2MB CAD Blueprint PDF (T-4826)
                    </span>
                    <button
                      onClick={() => handleTestUpload('size_64mb')}
                      className="px-2 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white font-mono text-[10px] font-semibold cursor-pointer"
                    >
                      Test &gt;50MB Intercept
                    </button>
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-1">
                    Old behavior: Useless <code>"processing failed"</code> toast. New: Edge SDK intercepts &gt;50MB &amp;
                    auto-compresses to 34.1MB on client.
                  </div>
                </div>

                <div className="p-2.5 rounded bg-[#0b0e14] border border-zinc-800 hover:border-purple-500/50 transition">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-zinc-100 flex items-center gap-1.5">
                      <Image className="w-3.5 h-3.5 text-cyan-400" />
                      2. Upload Morning Whiteboard PNG (T-4801 / T-4818)
                    </span>
                    <button
                      onClick={() => handleTestUpload('timeout_504')}
                      className="px-2 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-[10px] font-semibold cursor-pointer"
                    >
                      Test 504 Auto-Heal
                    </button>
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-1">
                    Old behavior: Agents sent "Sarah's retry macro" 15x/day. New: n8n WF-02 auto-retries on isolated
                    worker in 1.2s + logs to ENG-904.
                  </div>
                </div>

                <div className="p-2.5 rounded bg-[#0b0e14] border border-zinc-800 hover:border-purple-500/50 transition">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-zinc-100 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-emerald-400" />
                      3. Upload 30-Page Clinical Flowchart (T-4804 / T-4824)
                    </span>
                    <button
                      onClick={() => handleTestUpload('complex_pdf')}
                      className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-[10px] font-semibold cursor-pointer"
                    >
                      Test 38m Fast-Lane
                    </button>
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-1">
                    Old behavior: Buried behind 70-hour Curation backlog while quoting fake 2-3h SLA. New: Enterprise
                    Fast-Lane (&lt;45m SLA).
                  </div>
                </div>
              </div>

              {/* Live Telemetry Feedback Box */}
              <div className="p-2.5 rounded bg-purple-950/30 border border-purple-500/50 space-y-1">
                <div className="flex items-center justify-between font-mono text-[10px] text-purple-300">
                  <span>TELEMETRY STATUS</span>
                  <span>{importStatus.code}</span>
                </div>
                <div className="font-semibold text-zinc-100 text-[11px]">{importStatus.title}</div>
                <div className="text-[10px] text-zinc-300 leading-relaxed">{importStatus.detail}</div>
              </div>

              {/* NovaTech 500-Seat Automated Onboarding Runbook (Fixes T-4823) */}
              <div className="p-2.5 rounded bg-[#0b0e14] border border-zinc-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase font-bold text-emerald-400">
                    Enterprise Onboarding Runbook (WF-05 // T-4823)
                  </span>
                  <span className="font-mono text-[10px] text-zinc-400">{activeTenant.dataResidency}</span>
                </div>
                <div className="space-y-1 font-mono text-[10px] text-zinc-300">
                  <div className="flex items-center justify-between">
                    <span>[✓] SAML 2.0 + SCIM Group Sync ({activeTenant.ssoProvider})</span>
                    <span className="text-emerald-400">VERIFIED</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>[✓] Custom TLS Hostname (canvas.{activeTenant.name.toLowerCase().replace(/\s+/g, '')}.com)</span>
                    <span className="text-emerald-400">ACTIVE</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>[✓] Regional Storage Pinning ({activeTenant.dataResidency})</span>
                    <span className="text-emerald-400">LOCKED</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-800 flex items-center justify-between font-mono text-[10px] text-zinc-400">
              <span>Zero Core Eng Wait (Shipped via Edge + n8n)</span>
              <span className="text-emerald-400">CSAT Impact: 68% ➔ 94%</span>
            </div>
          </div>
        )}

        {/* Bottom-Center FigJam / Miro Floating Pill Toolbar */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#141a29]/95 border border-zinc-700 rounded-full px-4 py-1.5 shadow-2xl flex items-center gap-3 z-20 backdrop-blur">
          <button
            onClick={() => setZoom((z) => Math.max(75, z - 10))}
            className="font-mono text-[11px] text-zinc-300 hover:text-white cursor-pointer"
          >
            -
          </button>
          <span className="font-mono text-[11px] text-zinc-400">{zoom}%</span>
          <button
            onClick={() => setZoom((z) => Math.min(125, z + 10))}
            className="font-mono text-[11px] text-zinc-300 hover:text-white cursor-pointer"
          >
            +
          </button>
          <span className="text-zinc-700">|</span>
          <button
            onClick={() => setShowMagicImportModal((v) => !v)}
            className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-[11px] flex items-center gap-1.5 shadow cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {showMagicImportModal ? 'Hide Magic Import Studio' : 'Open Magic Import AI'}
          </button>
        </div>
      </div>
    </div>
  );
};
