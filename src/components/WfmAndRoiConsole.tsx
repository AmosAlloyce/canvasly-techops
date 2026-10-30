import React, { useState } from 'react';
import {
  AlertOctagon,
  Award,
  BarChart3,
  Calculator,
  CalendarClock,
  CheckCircle2,
  Clock,
  DollarSign,
  Flame,
  ShieldCheck,
  TrendingUp,
  UserCheck,
  Users,
  Zap,
} from 'lucide-react';
import { AGENT_PROFILES, ENTERPRISE_ACCOUNTS } from '../data/caseData';

export const WfmAndRoiConsole: React.FC = () => {
  const [targetEnterpriseAccounts, setTargetEnterpriseAccounts] = useState<number>(800);
  const [lookupSavedMin, setLookupSavedMin] = useState<number>(5.3);
  const [aiDeflectionPct, setAiDeflectionPct] = useState<number>(28);
  const [saveDeskTriggered, setSaveDeskTriggered] = useState<Record<string, boolean>>({});

  // Unit economics calculations grounded in case.pdf
  const currentAgents = 45;
  const agentMonthlyCost = 3400;
  const zendeskMonthlyCost = 45 * 89; // $4,005/mo
  const projectedDailyTickets = Math.round(1200 * (targetEnterpriseAccounts / 300) * 0.65 + 420);
  const deflectedTicketsPerDay = Math.round((projectedDailyTickets * aiDeflectionPct) / 100);
  const humanTicketsPerDay = projectedDailyTickets - deflectedTicketsPerDay;
  const newAhtMin = Math.max(6.5, 14 - lookupSavedMin);

  const legacyAgentMinutesNeeded = projectedDailyTickets * 14;
  const newAgentMinutesNeeded = humanTicketsPerDay * newAhtMin;
  const minutesSavedPerDay = legacyAgentMinutesNeeded - newAgentMinutesNeeded;
  const fteEquivalentSaved = Math.round((minutesSavedPerDay / (6.5 * 60)) * 10) / 10;
  const monthlyHiringAvoidedUsd = Math.round(fteEquivalentSaved * agentMonthlyCost);

  return (
    <div className="p-3 bg-[#0b0e14] min-h-[calc(100vh-52px)] space-y-3 text-xs">
      {/* Row 1: Workforce Management (WFM) Cherry-Picking & Burnout Diagnosis (Fixes 11% Monthly Attrition) */}
      <div className="bg-[#111621] border border-zinc-800 rounded p-3 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-2">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-400" />
            <span className="font-bold text-zinc-100 text-sm">
              WFM Agent Load Balancer &amp; Cherry-Picking Diagnosis (Why Monthly Attrition Hit 11%)
            </span>
          </div>
          <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            Capacity-Weighted Push Routing + Staggered 13:30–22:00 EST Shift Active ($0 Extra Headcount)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2.5">
          {AGENT_PROFILES.map((ag) => (
            <div
              key={ag.name}
              className="bg-[#0b0e14] border border-zinc-800 rounded p-2.5 flex flex-col justify-between space-y-2"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-zinc-100 text-sm">{ag.name}</div>
                    <div className="text-[10px] text-zinc-400">{ag.role}</div>
                  </div>
                  <span
                    className={`font-mono text-[10px] px-1.5 py-0.5 rounded font-bold ${
                      ag.burnoutRiskOld === 'CRITICAL'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                        : ag.burnoutRiskOld === 'HIGH'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-400'
                    }`}
                  >
                    Old Burnout: {ag.burnoutRiskOld}
                  </span>
                </div>

                {/* CSV Empirical Evidence Table */}
                <div className="grid grid-cols-3 gap-1.5 my-2 p-2 rounded bg-[#111621] border border-zinc-800/80 font-mono text-[10px]">
                  <div>
                    <span className="text-zinc-500 block">CSV MIX</span>
                    <span className="text-zinc-200">
                      {ag.csvChatCount}C / {ag.csvEmailCount}E / {ag.csvVoiceCount}V
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">AVG RES</span>
                    <span className={ag.csvAvgResMin > 100 ? 'text-red-400 font-bold' : 'text-zinc-200'}>
                      {ag.csvAvgResMin}m
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">CSV CSAT</span>
                    <span className={ag.csvAvgCsat <= 2.5 ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                      {ag.csvAvgCsat.toFixed(2)} ★
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-zinc-300 leading-snug bg-zinc-900/70 p-2 rounded border border-zinc-800">
                  <strong className="text-amber-300 font-mono text-[10px] block mb-0.5">
                    CSV ROOT-CAUSE FINDING:
                  </strong>
                  {ag.behavioralDiagnosis}
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-800 space-y-1 font-mono text-[10px]">
                <div className="flex items-center justify-between text-zinc-400">
                  <span>New Shift:</span>
                  <span className="text-emerald-300">{ag.shiftNew}</span>
                </div>
                <div className="flex items-center justify-between text-zinc-400">
                  <span>Push-Router Load Cap:</span>
                  <span className="text-purple-300">
                    {ag.capacityPointsUsed}/{ag.capacityPointsMax} pts
                  </span>
                </div>
                <div className="w-full h-1.5 bg-zinc-800 rounded overflow-hidden">
                  <div
                    style={{ width: `${ag.capacityPointsUsed}%` }}
                    className="h-full bg-gradient-to-r from-purple-500 to-emerald-400"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 2: Staggered After-Hours Tier-2 Coverage + CFO Scale-to-800 Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Left 6 Cols: Interactive CFO / Scale-to-800 Enterprise Accounts Simulator */}
        <div className="lg:col-span-6 bg-[#111621] border border-zinc-800 rounded p-3 space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-zinc-100 text-sm">
                CFO Unit Economics &amp; Scale-to-800 Enterprise Accounts Simulator
              </span>
            </div>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
              6-Month Growth Target
            </span>
          </div>

          <div className="space-y-2.5 bg-[#0b0e14] border border-zinc-800 rounded p-3">
            <div>
              <div className="flex justify-between font-mono text-[11px] mb-1">
                <span className="text-zinc-300">Enterprise Accounts (Current: 300 ➔ Target: 800 in 6m):</span>
                <span className="text-purple-300 font-bold">{targetEnterpriseAccounts} Enterprise Orgs</span>
              </div>
              <input
                type="range"
                min={300}
                max={1000}
                step={50}
                value={targetEnterpriseAccounts}
                onChange={(e) => setTargetEnterpriseAccounts(Number(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between font-mono text-[11px] mb-1">
                <span className="text-zinc-300">Avoidable Lookup Tax Eliminated (Baseline: 5–6m/ticket):</span>
                <span className="text-emerald-400 font-bold">{lookupSavedMin} mins saved / ticket</span>
              </div>
              <input
                type="range"
                min={1}
                max={6}
                step={0.1}
                value={lookupSavedMin}
                onChange={(e) => setLookupSavedMin(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between font-mono text-[11px] mb-1">
                <span className="text-zinc-300">n8n + Edge SDK Auto-Deflection (Magic Import 504s &amp; &gt;50MB):</span>
                <span className="text-cyan-400 font-bold">{aiDeflectionPct}% zero-touch</span>
              </div>
              <input
                type="range"
                min={10}
                max={45}
                step={1}
                value={aiDeflectionPct}
                onChange={(e) => setAiDeflectionPct(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Financial Output Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono">
            <div className="bg-[#0b0e14] border border-zinc-800 rounded p-2.5">
              <div className="text-[10px] text-zinc-400">PROJECTED DAILY VOLUME</div>
              <div className="text-lg font-bold text-zinc-100 mt-0.5">{projectedDailyTickets} / day</div>
              <div className="text-[10px] text-emerald-400">{deflectedTicketsPerDay} auto-healed by n8n</div>
            </div>

            <div className="bg-[#0b0e14] border border-zinc-800 rounded p-2.5">
              <div className="text-[10px] text-zinc-400">CAPACITY RECLAIMED</div>
              <div className="text-lg font-bold text-emerald-400 mt-0.5">+{fteEquivalentSaved} FTEs</div>
              <div className="text-[10px] text-zinc-300">45 agents perform like {Math.round(currentAgents + fteEquivalentSaved)}</div>
            </div>

            <div className="bg-[#0b0e14] border border-zinc-800 rounded p-2.5">
              <div className="text-[10px] text-zinc-400">AVOIDED PAYROLL EXPENSE</div>
              <div className="text-lg font-bold text-emerald-400 mt-0.5">
                ${monthlyHiringAvoidedUsd.toLocaleString()}/mo
              </div>
              <div className="text-[10px] text-zinc-400">@ $3,400/mo per agent</div>
            </div>

            <div className="bg-[#0b0e14] border border-zinc-800 rounded p-2.5">
              <div className="text-[10px] text-zinc-400">SAAS LICENSING SAVED</div>
              <div className="text-lg font-bold text-purple-300 mt-0.5">$48,060/yr</div>
              <div className="text-[10px] text-zinc-400">Replaces $4,005/mo Zendesk + Zapier</div>
            </div>

            <div className="bg-[#0b0e14] border border-zinc-800 rounded p-2.5">
              <div className="text-[10px] text-zinc-400">OCI + GROQ INFRA COST</div>
              <div className="text-lg font-bold text-emerald-400 mt-0.5">$0 / mo</div>
              <div className="text-[10px] text-zinc-400">100% under $2,500/mo cap</div>
            </div>

            <div className="bg-[#0b0e14] border border-zinc-800 rounded p-2.5">
              <div className="text-[10px] text-zinc-400">ARR PROTECTED (CHURN ↓)</div>
              <div className="text-lg font-bold text-amber-300 mt-0.5">$1.84M / yr</div>
              <div className="text-[10px] text-zinc-400">Churn 4.2% ➔ 1.4% target</div>
            </div>
          </div>
        </div>

        {/* Right 6 Cols: Multi-Touch Revenue Save Desk & Why the Pilot Still Lost 2 Enterprise Accounts */}
        <div className="lg:col-span-6 bg-[#111621] border border-zinc-800 rounded p-3 space-y-3 flex flex-col justify-between">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-red-400" />
                <span className="font-bold text-zinc-100 text-sm">
                  Why the 8-Agent Daytime Pilot Still Lost 2 Enterprise Accounts
                </span>
              </div>
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-300">
                Case Study Mystery Solved
              </span>
            </div>

            <div className="bg-[#0b0e14] border border-zinc-800 rounded p-2.5 space-y-2 text-[11px] text-zinc-300 leading-relaxed">
              <div>
                <strong className="text-purple-300 font-mono">1. The Hidden 70-Hour Design Curation Backlog (Meridian Health — T-4804 &amp; T-4824):</strong>{' '}
                During the pilot, daytime chat FRT dropped to 3m—so agents answered Meridian Health in 4–6 minutes,
                only to dump their 30-page PDFs into a <strong>70-hour unprioritized Design Curation queue</strong> while
                quoting a fake 2–3h SLA! Fast first response means nothing when functional resolution takes 3 days.
              </div>
              <div>
                <strong className="text-amber-300 font-mono">2. After-Hours SSO Lockouts &amp; Overnight Emails (CoreVista T-4813, DataForge T-4815➔T-4828, Ridgeline T-4829):</strong>{' '}
                The pilot only triaged daytime tickets (8am–6pm EST) and had zero Tier-2 engineering coverage after
                6pm. Enterprise SSO lockouts at 6:15pm and 7:45pm and CFO invoice emails at 10:30pm sat dead until the
                next morning, triggering immediate cancellation requests (`T-4828`).
              </div>
            </div>

            {/* Active Save Desk Actions */}
            <div className="space-y-1.5">
              <div className="font-mono text-[10px] uppercase text-zinc-400">
                Active Revenue Save Desk Playbooks (n8n WF-03):
              </div>
              {ENTERPRISE_ACCOUNTS.slice(0, 4).map((acc) => (
                <div
                  key={acc.id}
                  className="bg-[#0b0e14] border border-zinc-800 rounded p-2 flex items-center justify-between gap-2"
                >
                  <div>
                    <div className="font-semibold text-zinc-100">
                      {acc.name}{' '}
                      <span className="font-mono text-[10px] text-emerald-400">
                        (${(acc.arr / 1000).toFixed(1)}K ARR • {acc.seats} seats)
                      </span>
                    </div>
                    <div className="text-[10px] text-zinc-400 font-mono">{acc.saveActionStatus}</div>
                  </div>
                  <button
                    onClick={() => setSaveDeskTriggered((p) => ({ ...p, [acc.id]: true }))}
                    className={`px-2.5 py-1 rounded font-mono text-[10px] font-semibold shrink-0 cursor-pointer ${
                      saveDeskTriggered[acc.id]
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-purple-600 hover:bg-purple-500 text-white'
                    }`}
                  >
                    {saveDeskTriggered[acc.id] ? '✓ Save Playbook Executed' : 'Trigger Exec Save + Credit'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-emerald-950/20 border border-emerald-500/30 rounded p-2 font-mono text-[10px] text-emerald-300 flex items-center justify-between">
            <span>All 6 At-Risk Enterprise Accounts ($562.5K ARR) Monitored by 48h Velocity Watchdog</span>
            <span>0 Unanswered #customer-health Flags</span>
          </div>
        </div>
      </div>

      {/* Row 3: WF-05 Automated 500-Seat Enterprise Onboarding Runbook (Fixes T-4823 NovaTech) + Status Page Ticket Storm Suppressor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        <div className="lg:col-span-7 bg-[#111621] border border-zinc-800 rounded p-3 space-y-2.5">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span className="font-bold text-zinc-100 text-sm">
                WF-05: Enterprise 100+ Seat Onboarding Orchestrator (NovaTech — 500 Seats / $150K ARR • Fixes T-4823)
              </span>
            </div>
            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300">
              340m Legacy Slack Chaos ➔ 18m Automated Provisioning
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-[10px]">
            <div className="bg-[#0b0e14] border border-zinc-800 rounded p-2.5">
              <div className="text-purple-300 font-bold">TASK 01 // SECURITY TEAM</div>
              <div className="text-zinc-200 font-semibold mt-0.5">Okta SAML 2.0 + SCIM Sync</div>
              <div className="text-zinc-400 mt-1">Auto-provisioned 500 seats + 24h IdP fallback cert</div>
              <div className="text-emerald-400 mt-1.5 font-bold">✓ COMPLETED (4m 12s)</div>
            </div>
            <div className="bg-[#0b0e14] border border-zinc-800 rounded p-2.5">
              <div className="text-cyan-300 font-bold">TASK 02 // INFRA TEAM</div>
              <div className="text-zinc-200 font-semibold mt-0.5">Custom Vanity Domain &amp; TLS</div>
              <div className="text-zinc-400 mt-1">Caddy auto-TLS issued for novatech.canvasly.io</div>
              <div className="text-emerald-400 mt-1.5 font-bold">✓ COMPLETED (6m 40s)</div>
            </div>
            <div className="bg-[#0b0e14] border border-zinc-800 rounded p-2.5">
              <div className="text-amber-300 font-bold">TASK 03 // COMPLIANCE TEAM</div>
              <div className="text-zinc-200 font-semibold mt-0.5">EU-Central Data Residency</div>
              <div className="text-zinc-400 mt-1">Pinned workspace shards to Frankfurt GDPR cluster</div>
              <div className="text-emerald-400 mt-1.5 font-bold">✓ COMPLETED (7m 05s)</div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 bg-[#111621] border border-zinc-800 rounded p-3 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-zinc-100 text-sm">
                status.canvasly.io &amp; Ticket Storm Suppressor (INC-2026-01)
              </span>
            </div>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
              34 Duplicate Tickets Deflected
            </span>
          </div>
          <p className="text-[11px] text-zinc-300 leading-relaxed">
            When n8n WF-02 detects &gt;=3 morning <code className="text-amber-300">Magic Import 504</code> timeouts or{' '}
            <code className="text-amber-300">Cursor Sync</code> errors within 15m, it automatically updates{' '}
            <strong className="text-white">status.canvasly.io</strong>, injects an in-app banner inside Canvasly Studio,
            links child tickets to <code className="text-purple-300">INC-2026-01</code>, and mass-resolves all linked
            tickets once Engineering clears the incident.
          </p>
          <div className="bg-[#0b0e14] border border-zinc-800 rounded p-2 font-mono text-[10px] text-emerald-400 flex items-center justify-between">
            <span>Linked CSV Cluster: T-4801, T-4806, T-4808, T-4814, T-4818, T-4821, T-4830</span>
            <span>ENG-904 Auto-Filed</span>
          </div>
        </div>
      </div>
    </div>
  );
};
