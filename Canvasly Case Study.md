# **Canvasly Case Study // v3 5.04.26**

Clipboard's team tackles interesting operational technology challenges daily. The below case study was selected to give you a feel for the degree of difficulty — and fun — of the types of projects the team works on.

---

## Company Context

You are the new Head of Technical Operations at **Canvasly**, a rapidly growing B2B SaaS company whose flagship product is a collaborative "infinite canvas" design tool. The company has grown from 50 enterprise accounts to 300 over the past year, with plans to onboard another 500 in the next 6 months. Your customer base is mid-market and enterprise teams (100-500 seats each) who use Canvasly for everything from product design to strategic planning.

## The Scenario: Support Operations at a Breaking Point

Canvasly's customer support team has grown from 8 to 45 agents in 12 months to keep pace with customer growth. The support stack was originally configured by an operations manager who left 9 months ago. Since then, no one has owned the system architecture. You've been hired to fix this — and to build the operational technology foundation that scales with the company.

### How the System Works Today

The team uses **Zendesk** as its primary support platform, handling **\~1,200 tickets per day** across chat (55%), email (30%), and voice (15%).

**Routing:** All tickets land in a single general queue regardless of channel, issue type, or customer tier. Agents manually pick tickets. There is no skill-based routing, no priority logic tied to customer data, and no auto-assignment. Enterprise customers generating $50K+ ARR sit in the same queue as free-trial users.

**Agent tooling:** To resolve a typical ticket, agents check **4 separate systems** beyond Zendesk:

- The Canvasly admin portal (customer account data, feature flags, usage metrics)  
- Salesforce (contract tier, renewal date, account owner, ARR)  
- A Google Sheet (exception policies, pricing matrices, updated sporadically)  
- Slack (escalations to Tier 2 specialists and engineering — response times range from 15 minutes to 4+ hours)

**Automation:** Three Zapier automations exist:

1. New ticket → Slack notification (fires for every ticket; the channel is muted by most people)  
2. Ticket closed → row appended to a Google Sheet (200K+ rows, loads slowly, used for ad-hoc reporting)  
3. CSAT survey response → Slack message (intermittent — Zapier has hit rate limits twice this month)

There are no Zendesk triggers or automations configured natively. Five generic macros exist. All tickets use a single default form regardless of issue type. There is no SLA tracking, no queue health monitoring, and no alerting.

**Tier 2 / After-Hours Coverage:** The 45-agent team is staffed 8am–6pm EST. There is no formal Tier 2 rotation and no after-hours coverage. Complex issues that arrive after 6pm sit in queue until the next morning.

### The Numbers

| Metric | Value |
| :---- | :---- |
| Daily ticket volume | \~1,200 |
| Agents | 45 |
| Average Handle Time (AHT) | 14 minutes |
| Estimated avoidable AHT (tool switching, manual lookups) | 5-6 minutes per ticket |
| First Response Time — median | 6 minutes |
| First Response Time — 90th percentile | 48 minutes |
| CSAT (trailing 30 days) | 71% |
| Monthly agent attrition | 11% |
| Cost per agent (fully loaded, monthly) | $3,400 |
| Zendesk license cost (per agent/month) | $89 (Suite Professional) |
| Enterprise accounts (100+ seats) | 300 |
| Enterprise churn rate (trailing quarter) | 4.2% — up from 1.8% two quarters ago |
| Cancellation requests citing "support responsiveness" | 38% of all cancellation reasons |

### The Data

Here is a data set: [**Canvasly Support Ticket Sample**](https://docs.google.com/spreadsheets/d/1mW26extgeZoIDSoNLos3n_rxDwBAVH3hWCemSByuSk8/edit?gid=1887305048#gid=1887305048) — a sample of 30 recent tickets including timestamp, channel, category, assigned priority, response times, agent name, escalation status, CSAT score, and the agent's internal notes.

You should use this data to inform your analysis and recommendations. 

### Your Constraints

| Constraint | Value |
| :---- | :---- |
| Incremental tooling budget | **$2,500/month** beyond current Zendesk \+ Zapier costs |
| Engineering support | No dedicated internal tools engineering team. You have AWS access (Lambda, API Gateway, EventBridge, S3) and can build lightweight services yourself. Core product engineering changes require a 6-8 week lead time and executive sponsorship. |
| Timeline | The company is actively losing enterprise accounts this week. Leadership doesn't want a long-term roadmap—they want to know what you can build and ship in your first week to immediately stop the bleeding, followed by what you will tackle next. |
| API access | Zendesk Suite Professional API, Salesforce API (read), Canvasly admin portal REST API (read), Slack API. |
|  |  |

### One Experiment That's Been Run

A team lead manually triaged enterprise tickets into a separate Zendesk view for a two-week pilot with 8 dedicated agents. During the pilot:

- Enterprise first response time dropped from a median of **11 minutes to 3 minutes**  
- Enterprise CSAT rose from **68% to 88%**  
- But general queue FRT increased by 5 minutes since 8 agents were pulled from the main pool  
- The team lead spent **\~2.5 hours/day** on manual triage and couldn't sustain it  
- Crucially, despite the improved daytime metrics, two major Enterprise accounts still churned during this pilot due to support responsiveness.

## Your Task

You are the end decision-maker and have the authority to make all hiring, tooling, architecture, and process decisions required to fix this.

Design the operational technology architecture for Canvasly's support organization and a plan to build it. Your goal is to **maximize the reduction in enterprise churn risk driven by support experience, while staying within your resource constraints.**

Specifically:

1. **Diagnosis:** What are the highest leverage problems? Use the data  
2. **Solution:** What do you build and/or implement and in what order? Why?

## Output

The ideal output is a **written document with complete sentences backed by analysis** — the type of deliverable our team produces regularly. We do not think longer cases are "better" and value clarity far more than length.

## A Note on AI/LLMs: Beat the Baseline

Modern AI can comfortably handle standard operational strategy. We are explicitly hiring for the skills an algorithm lacks: nuanced judgment, complex pattern recognition, and creative problem-solving. If your strategic output is indistinguishable from a $20-a-month software tool, this isn't the right role for you. We want candidates whose critical thinking makes standard AI look elementary.

You are welcome to use any resources at your disposal—LLMs, web research, or peers.

We have already run this exact case study through AI to establish our baseline expectation. If you simply feed this prompt into an AI and submit the result, your work will only match the answer key we already possess (as well as many other candidates). Tying the AI baseline is an automatic disqualification. Show us the human delta.

## The Interview Process

First of all, thank you for applying to Clipboard Health. We’re very excited at the prospect of you joining our team and want to provide visibility into our process. We also recommend that you poke around [the blog here](https://www.clipboardworks.com/resources/blog) to get an idea of how the company works and our standards.

We recognize that this is a time intensive process. We have found this as the best way to assess whether there is a mutual fit. If you're looking for room to grow problem-solving skills in a feedback-rich environment where your thinking will be challenged, we think you'll have fun in both our interview process as well as if you join full-time.

Note that we don’t always follow the same process exactly and sometimes we’ll move stages around depending on the candidate and what we think is best, but in all scenarios you should expect at least 1 case study (starting with the above), sometimes 2, with the possibility of feedback and request for an update, and 3-4 conversations with members of our team. We have found that cases are the strongest indicators of performance within our team and weigh them heavily during the process. We do not use the case studies outside of our recruiting process.

As a general rule, we do not give rejection reasons or feedback for case studies that do not progress to the interview stage. We unfortunately have limits to how many candidates we can interview and get to know, and the members of our team who evaluate case study submissions are unable to provide individualized feedback on every case. Of course, we’re continuously evolving our process to improve the candidate experience and welcome your feedback.

We’re excited for you to get started\!  
