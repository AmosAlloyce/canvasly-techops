# Canvasly Technical Operations Case Study — Interactive Solution Hub & Executive Deliverable

**Live Interactive Deployment (Oracle Cloud Server):**
- **Primary Dedicated URL:** [https://canvasly.alloyce.duckdns.org](https://canvasly.alloyce.duckdns.org)
- **Ecosystem Subpath URL:** [https://alloyce.duckdns.org/canvasly/](https://alloyce.duckdns.org/canvasly/)

---

## Repository Contents & Case Study Deliverables

1. **[`Canvasly_Case_Study_Submission.md`](./Canvasly_Case_Study_Submission.md)** — The complete written executive case study memo (written in narrative prose backed by quantitative analysis of the 30-ticket dataset `T-4801`–`T-4830`), covering:
   - **Forensic Diagnosis:** Simpson's Paradox (`71.4%` Non-Enterprise Top-2-Box CSAT vs. `11.1%` Confirmed Enterprise Top-2-Box CSAT / `1.78` average), why two major Enterprise accounts churned during the 2-week pilot (`3.5x–118x` Zendesk timer distortion from premature handoff closures into the 70-hour Design Curation queue and paused escalation timers), the `6:00 PM EST = 3:00 PM PST` West Coast coverage blind spot (`T-4813`, `T-4829`), `Devon R.`'s unbacked evening shift contradiction, the `<100 seat` Enterprise onboarding loophole (`T-4805`), manual cherry-picking (`Maria S.` at `4.71` CSAT vs. `James K.` on 100% of Emails at `2.00` CSAT), and true workforce insolvency (`137%` net occupancy after accounting for Friday/Saturday 7-day volume, `11%/mo` attrition vacancies, and `25%` shrinkage).
   - **Operational Technology Architecture:** Exploiting unused native capabilities in **Zendesk Suite Professional (`$0` incremental license cost)** paired with a stateless **AWS Serverless Glue Layer (`API Gateway + Lambda + EventBridge + S3`, `<$50/mo`)** and **PagerDuty/Opsgenie (`$385/mo`)**, strictly honoring **read-only Salesforce and Admin Portal APIs** and the absence of Stripe API access.
   - **Sequenced Execution Plan:**
     - **Week 1 (Days 1–7 — Scoped for 1 Operator):** Two-Tier Identity Sync (exact registered user email from Admin/SFDC APIs + domain fallback), a **3-hour AWS Lambda Private Internal Note Injector** (`-80%` of lookup waste on Day 2 with zero frontend UI risk), native Zendesk Omnichannel Auto-Routing & `P0–P3` Priority Triggers, 4-Pod reorganization (`10` Enterprise VIP across Email+Chat+Voice, `5` Tier-2, `6` Billing, `24` General), voluntary evening shift differentials (`$1,500/mo` covering West Coast hours until `7:00 PM PST`) + PagerDuty 15-min Ack SLA, and Design Curation Intake Gating ($\lambda < \mu$) + `<4h` Enterprise Fast-Track Lane.
     - **Weeks 2–4 (Days 8–30):** Upgrading the Day-1 Note Injector into an interactive **Custom ZAF Ticket Sidebar App** with 1-click Slack approval modals (`#finance-approvals` for duplicate Stripe charges like `T-4820`), deflecting `75%` of `Magic Import - Error` volume (`~240 tickets/day`), launching the **Pre-Launch Enterprise Onboarding Runbook** (`~3.8 onboardings/day` for +500 accounts), and retiring all 3 brittle Zapier automations.
     - **Weeks 5–8 (Days 31–60):** Proactive telemetry intercept via EventBridge + core engineering backend auto-retry and `>50MB` validation fixes.
2. **[`Canvasly_EDA_and_Capacity_Model.ipynb`](./Canvasly_EDA_and_Capacity_Model.ipynb)** — Jupyter Notebook containing the reproducible Python statistical analysis, IQR outlier detection, segment cross-tabulations, timer distortion proofs, and capacity modeling.
3. **[`charts/`](./charts/)** — High-resolution analytical visualizations:
   - `chart1_enterprise_vs_general_gap.png` — Enterprise vs. Non-Enterprise Speed, CSAT & Channel Inversion
   - `chart2_pilot_paradox_and_clock_gap.png` — The "Fast Hello, Slow Fix" Illusion (FRT vs. Logged Resolution vs. Actual Customer Wait)
   - `chart3_agent_cherry_picking_and_volume.png` — Manual Queue Cherry-Picking (`Maria S.` vs. `James K.`) & Preventable Volume
   - `chart4_capacity_and_scaling_model.png` — Daily Workload Compression (`280h → 136h`, freeing `144 hrs/day`) & 6-Month Scaling (`300 → 800` Enterprise Accounts)
4. **Interactive Web Application (`src/components/CaseStudyInteractiveHub.tsx`)** — A 5-stage interactive executive walkthrough and live simulator suite hosted on our Oracle Cloud server:
   - **Stage 1:** What We Were Solving (Scenario, Constraints & The 2-Week Pilot Mystery)
   - **Stage 2:** What the Problem Was (Forensic Data Diagnosis & Filterable 30-Ticket Explorer)
   - **Stage 3:** What Solutions We Suggest (Live Day-1 Internal Note vs. Week-2 ZAF Sidebar Simulator + Interactive Workforce Capacity, Shrinkage & Scaling Modeler)
   - **Stage 4:** Execution Plan, Budget Governance (`$1,935/mo` vs. `$2,500/mo` cap) & Strategic Questions for Leadership
   - **Stage 5:** Full Written Case Study Memo Reader & Download Center (plus live prototypes for the Agent Workspace, Queue/SLA Monitor, and WFM Console)

---

## Local Development & Oracle Server Deployment

```bash
# Install dependencies & build production bundle
npm install
npm run build

# Start unified Express + Vite production server (port 4000)
npm start

# Deploy to Oracle Cloud Server
./deploy-oracle.sh ubuntu@84.13.155.211 /path/to/ssh-key
```
