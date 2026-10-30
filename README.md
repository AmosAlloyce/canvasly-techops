# Canvasly — Enterprise Visual Workspace & Open-Source AI TechOps Platform

**Canvasly** is a real-time B2B SaaS collaborative infinite canvas, spatial AI diagramming (`Magic Import™`), and **100% Open-Source Technical Operations & AI Automation Platform** architected to scale from **300 to 800+ Enterprise accounts** at **$0/month incremental infrastructure cost**.

---

## Architecture & Open-Source Stack

| Layer | Legacy Commercial Stack (Retired) | Canvasly Open-Source Stack |
| :--- | :--- | :--- |
| **Compute & Hosting** | AWS Paid EC2 / Lambda / API Gateway | **Oracle Cloud (OCI) Always Free ARM64** (`4 OCPUs`, `24GB RAM`) + Docker Compose + Caddy |
| **Workflow Orchestration** | Zapier (Rate-limited, 3 brittle Zaps) | **n8n Community Edition** (Self-Hosted in **Redis 7 BullMQ Queue Mode**) |
| **AI Triage & Vector RAG** | Commercial LLM Add-ons ($50/agent/mo) | **Groq Cloud LPU (`llama-3.3-70b-versatile`)** + **PostgreSQL 16 `pgvector`** + **FastEmbed (`BAAI/bge-small-en-v1.5`)** |
| **Support & Agent UI** | Zendesk Suite Pro ($4,005/mo) + 4 External Tabs | **Canvasly OpsOS Zero-Tab Unified Agent Console** / Chatwoot OSS |
| **Telemetry & Policy DB** | 200K-Row Google Sheet + Stale Nov Policy Sheet | **PostgreSQL 16** + **Redis 7 Idempotency/DLQ** + **Datadog-Styled APM Console** |
| **Incident Paging & Status** | Unmonitored Slack Channels (`#eng`, `#customer-health`) | **Ntfy.sh Self-Hosted Push Pager** + **`status.canvasly.io` Auto-Suppressor** |

---

## 5 Automated n8n Workflows (`/n8n/workflows/`)

1. **`wf_01_ticket_ingestion_hydration.json`** (`POST /webhook/ticket-created`): Parallel HTTP context hydration from Salesforce CRM, Canvasly Admin Portal, and Stripe Billing/Policy DB (`<95ms`) + Groq LPU semantic triage & `pgvector` RAG whisper generation.
2. **`wf_02_magic_import_self_healer.json`** (`POST /webhook/magic-import-triage`): Client-side pre-flight `>50MB` interception (`T-4826`), automated background worker retry for transient `504` timeouts (`T-4801`, `T-4818`, `T-4821`), and `#1 Enterprise Curation Fast-Lane (38m SLA vs. 70h general backlog)` routing (`T-4804`, `T-4811`, `T-4824`).
3. **`wf_03_escalation_sla_and_p1_pager.json`** (`POST /webhook/escalation-watchdog`): 48-hour Multi-Touch Account Friction Velocity correlator (*Meridian Health*, *DataForge*, *Luma Analytics*) + **Ntfy.sh** 24/7 after-hours P1 SAML SSO lockout pager (`T-4813`, `T-4829`) + 15-minute Engineering ack watchdog (`T-4805`).
4. **`wf_04_billing_one_click_refund.json`** (`POST /webhook/billing-refund`): 1-click atomic duplicate Stripe charge refund (`T-4820`) with Redis idempotency lock and PostgreSQL Financial Audit Ledger.
5. **`wf_05_enterprise_onboarding_orchestrator.json`** (`POST /webhook/enterprise-onboarding`): Automated 500-seat Enterprise onboarding provisioning across Okta SAML 2.0/SCIM, Custom TLS Domain, and EU Data Residency (`T-4823` NovaTech).

---

## Quick Start

```bash
# Install dependencies & build frontend
npm install
npm run build

# Start unified production server (Frontend + TechOps Microservices API)
npm start

# Or launch full multi-container stack (App + n8n + PostgreSQL 16 pgvector + Redis 7 + Ntfy.sh)
docker compose up -d --build
```
