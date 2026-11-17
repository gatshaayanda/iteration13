# Business OS Commercial Transparency Standard

**Status: proposed portfolio standard — owner review required before it becomes a client contract or an automated billing rule.**

**Purpose:** make the ongoing relationship between a business owner and Admin Hub understandable, evidence-led and adaptable. Explain what it costs to operate the digital service, what business activity the system helps make visible, and how an owner may choose to reinvest in the system—without confusing infrastructure costs, business outcomes and discretionary growth investment.

This standard complements:
- [Operational Transparency Standard](./OPERATIONAL-TRANSPARENCY-STANDARD.md) — truthful activity and outcomes.
- [Objective-to-System Design Standard](./OBJECTIVE-TO-SYSTEM-DESIGN-STANDARD.md) — connect capabilities to business objectives and acceptance evidence.
- [Iteration 13 Portfolio Handoff](./ITERATION13-PORTFOLIO-HANDOFF.md) — adapt shared practices to each existing or new project.

It is a product and operating-model proposal, not legal, tax, accounting or investment advice. Each client agreement, tax treatment, service level, price and payment obligation must be reviewed and agreed separately.

## 1. The three things that must never be conflated

Keep these as separate concepts in the product, reports and conversations:

1. **Operational evidence** — what infrastructure and integrations actually consumed or processed, over a defined period.
2. **Business value evidence** — what happened in the business, and what the system can reasonably show it helped with.
3. **Commercial agreement** — what the owner has agreed to pay Admin Hub, when it is due, and what is optional.

A dashboard metric is not automatically a sale. A sale is not automatically attributable to the app. A marketing allocation is not an infrastructure bill. A hosting allowance is not measured consumption. Keep these distinctions visible.

## 2. Proposed commercial arrangement

The proposed model has two independently explained parts. The actual terms are agreed with each business; there is no universal price, percentage, commission or contract.

### A. Digital infrastructure contribution

The owner and Admin Hub agree how the cost of maintaining the business's digital service is covered. Depending on the project, this may include an agreed share of hosting, database, storage, bandwidth, backups, monitoring, domains or other required providers.

- State what the contribution covers, its billing period, currency, amount or calculation method, payment timing and what happens if usage changes.
- Prefer actual provider usage and invoices where available. If a shared platform serves multiple businesses, disclose the allocation method and distinguish measured values from estimates.
- If the amount is a fixed agreed contribution rather than a usage pass-through, call it a fixed contribution. Do not describe it as exact metered cost.
- Explain included allowances and overage handling before they occur. Never imply unlimited usage.
- Do not charge the same provider cost twice through multiple categories.
- Do not describe server infrastructure as electricity or airtime consumed by individual customer interactions.

This contribution is a separately agreed operating cost. It is not a percentage of sales unless a specific client agreement explicitly and lawfully says otherwise.

### B. Owner-directed growth investment

After reviewing the business's own results and marketing allocation, the owner may choose how much of the next period's marketing budget they want to invest in improving, promoting or expanding their Business OS.

- The owner decides whether to make this investment and the amount or percentage.
- The basis may be a portion of the marketing budget the owner has already chosen—not an automatic commission on gross revenue.
- Show the chosen amount, what work or capacity it is intended to support, the period it applies to and whether it is one-off or recurring.
- Ask for explicit approval before recording a new commitment or initiating payment.
- If the owner chooses zero, the system must show zero; never silently convert a recommendation into a charge.
- The owner can adjust the next period's investment to reflect seasonality, cash flow, capacity and observed value, subject to any existing agreement.

This is a discretionary growth decision, not a substitute for the infrastructure agreement and not a claim that Admin Hub caused all business revenue.

### Example — illustrative only

Assume a business records **P100,000** in revenue for a month and its owner sets a **5% marketing allocation (P5,000)**. After reviewing the evidence, the owner might choose to direct **10% of that marketing allocation (P500)** toward the next month's Business OS improvements.

The P500 is an owner-selected example, not an automatic 0.5% revenue charge, commission, recommended rate or universal price. Any separately agreed infrastructure contribution remains visible as its own line. The owner may choose a different amount or none.

## 3. Business evidence: activity, assistance and confirmed outcomes

Present business evidence in layers. Label the evidence source and avoid overstating attribution.

| Evidence level | Examples | What the system may say |
| --- | --- | --- |
| Activity | Store visits, product views, searches, saved items, enquiry starts | “Customers viewed…” or “There were…” |
| Intent / demand | Submitted enquiries, sourcing requests, quote requests, bookings awaiting confirmation | “Customers requested…”; not a completed sale |
| Assisted progress | Customer returned, quote opened, payment link clicked, job moved through workflow | “The system recorded/assisted…”; not proof of causation |
| Confirmed outcome | Payment verified by the payment provider, completed order/job under the business's configured rules | “A confirmed payment/completed job was recorded…” with the source and rule |
| Repeat relationship | Returning customer with linked, distinct completed transactions | “A returning customer completed…” only when identity matching and transaction evidence support it |

For The Plug or a sourcing marketplace, useful measures may include:
- Product and model demand, including requested sizes, variants or specifications.
- Sourcing requests submitted, reviewed, fulfilled, declined or still open.
- Enquiries converted into verified purchases, where the transaction record supports that link.
- Repeat customers and repeat completed purchases.
- Demand that could not be fulfilled, including reasons when recorded.

For a service business, useful measures may include:
- Service views and enquiries.
- Booking or quote requests and their actual status.
- Jobs accepted, in progress and completed.
- Payments verified and receipts issued.
- Repeat customers and time between completed visits.

Never count impressions, views, clicks, enquiries, quotations, pending payments or projected jobs as completed revenue. Keep gross sales, collected payments, refunds, balances, projections and costs distinct. State the time window, currency, filters and counting rule.

### Attribution language

Use “recorded through”, “associated with” or “the system helped manage” unless there is a defensible attribution method. Do not claim “generated”, “caused”, “saved” or “increased” revenue based only on visits, clicks or temporal correlation. If attribution is unavailable, say so plainly.

## 4. Infrastructure reporting and integration fit

Build reporting from the actual providers and project architecture. An integration is not present merely because the platform supports it or a tracking snippet exists.

| Area | Useful evidence when connected | Important boundary |
| --- | --- | --- |
| Hosting / edge platform (for example Vercel) | Requests, bandwidth/transfer, function or compute usage, deployment/runtime health, plan allowance and invoice data where accessible | Page-view analytics do not equal infrastructure billing or full usage metering |
| Database (for example Firebase / Firestore) | Reads, writes, deletes, stored bytes, egress or billed operation metrics where the selected plan exposes them | Application event counts are not necessarily provider-billed operation counts |
| File/media storage (for example UploadThing or object storage) | Stored bytes, upload/download transfer, file counts and provider charges where exposed | Upload count alone does not reveal storage duration or transfer volume |
| Payments | Provider-confirmed payment, refund, fee and settlement records | A submitted form or clicked payment button is not proof of payment |
| Messaging / communications | Provider-reported messages, delivery states and costs where available | An in-app message is not proof of WhatsApp/SMS/email delivery |
| Product analytics | Visits, journeys, events and conversion funnels | Analytics events are behavioral evidence, not financial records |

For every reported value, record:
- Provider and metric name.
- Reporting period and timezone.
- Unit and currency.
- Actual, estimated, allocated, sampled or unavailable status.
- Data freshness / last successful sync.
- Included allowance and the source of that allowance.
- Allocation method for shared infrastructure.
- Known exclusions, gaps and plan/API access limitations.

Use a clear “Not connected”, “Not available from this plan/API” or “Last updated…” state when appropriate. Do not fill gaps with estimates that look like actual measurements. Do not infer actual cost from a page-view count.

### Capacity claims and the 25 GB reference

A 25 GB monthly allowance is a capacity/plan reference only when the relevant provider plan and the meaning of “GB” are verified. It is not automatically 25 GB of database storage, file storage, bandwidth, combined provider usage or actual consumption. Keep storage, transfer, database operations, compute, backups, messaging and AI usage separate.

BoardSignal observations may be used as a workload reference when the underlying measurement and assumptions are available. They are not a universal guarantee that every app, payload, integration, provider region or traffic pattern will fit the same allowance. Do not promise thousands of interactions, unlimited use or a day-off operating outcome without representative load testing and a real workflow that supports it.

## 5. Monthly owner review

Use a short, repeatable review. The owner should be able to understand it without learning provider terminology.

### 1. What it took to operate

- Agreed infrastructure contribution and what it covers.
- Actual provider usage/cost evidence where connected.
- Shared-cost allocation and estimates clearly labelled.
- Any unusual usage, plan limits or upcoming changes.

### 2. What the system helped the business manage

- Customer activity and demand.
- Requests, jobs, orders and confirmed payments.
- Repeat relationships and unfulfilled demand.
- What is directly confirmed, merely associated, or not measurable.
- Operational friction or opportunities the owner may want to address.

### 3. What the owner wants to do next month

- Confirm, change or decline the next infrastructure arrangement if review is due.
- Choose whether to invest from the marketing allocation.
- Select the work/capacity that investment should support.
- Confirm the amount, period and approval before any commitment is recorded.

Keep the review factual and compact. Show the evidence behind each recommendation and allow the owner to correct inaccurate business records.

## 6. Product experience requirements

A reusable owner-facing experience may use three sections:

1. **Business Activity** — customer demand, requests, completed work, confirmed payments and repeat relationships.
2. **Digital Infrastructure** — provider connections, usage, allowances, cost basis, allocation and reporting freshness.
3. **Monthly Arrangement** — agreed contribution, optional owner-directed investment, approval history and next review.

The interface must:
- Distinguish actual, estimated, projected, optional and agreed amounts with text labels—not colour alone.
- Show period, currency, data source and last-updated time beside metrics.
- Keep infrastructure details understandable; reveal technical breakdown progressively.
- Show the owner the next decision and its consequence before asking for approval.
- Preserve an audit trail for changes to agreed amounts, optional investment choices and approvals.
- Never create a payment, subscription change or contract commitment from a passive dashboard view.
- Keep customer data private; use aggregated business reporting and role-appropriate access.
- Work honestly when a provider is disconnected, delayed or lacks reporting access.

## 7. Reuse across existing and new projects

Treat this as a shared reporting and commercial-transparency pattern, not a demand to install every integration in every project.

For each target project:

1. Inspect its current repository instructions, architecture, data model, authentication/authorization and provider configuration.
2. Identify which business outcomes matter for that industry and which records already prove them.
3. Inventory existing integrations and their actual accessible metrics. Reuse working connections; do not add duplicate analytics or a new database merely to fill a dashboard.
4. Map each proposed metric to its source, owner, update cadence, privacy boundary and acceptance test.
5. Classify each item:
   - **Reusable foundation improvement** — a verified pattern that can safely serve multiple projects.
   - **Project-specific requirement** — depends on that business's workflow, provider or agreement.
   - **Unverified idea** — requires discovery, access, provider/API confirmation or a proof of concept before being promised.
6. Implement only what is justified. Keep missing integrations visible as missing rather than fabricating data.
7. Verify the data path, permissions, metric definitions, failure states and owner review before calling it operational.

An integration should be adopted only when it improves a real owner decision and its ongoing cost, access, reliability, data quality and privacy implications are understood. A project may use only a subset of the pattern.

## 8. Acceptance checklist

- [ ] Infrastructure contribution and discretionary growth investment are separate.
- [ ] The client-specific agreement defines coverage, amount/calculation, timing and usage changes.
- [ ] No universal price, percentage, commission or guarantee is implied.
- [ ] Each metric has a source, unit, period, timezone and counting definition.
- [ ] Actual, estimated, allocated, projected and unavailable values are distinguishable.
- [ ] Business activity, intent, assisted progress and confirmed outcomes are not conflated.
- [ ] Revenue attribution claims match the available evidence.
- [ ] Provider allowances and usage categories are defined accurately.
- [ ] Shared infrastructure costs disclose the allocation method.
- [ ] Optional investment requires the owner's explicit choice and approval.
- [ ] No dashboard interaction silently creates a charge or contract commitment.
- [ ] Customer privacy, authorization, audit history and disconnected-provider states are respected.
- [ ] The pattern is adapted to the target project's existing architecture rather than copied wholesale.

## 9. Open decisions before contractual use

This proposal intentionally does not decide:
- Admin Hub's standard infrastructure contribution, minimum fee or support/service levels.
- Whether a particular provider cost is passed through, shared or included in a fixed fee.
- A default marketing-allocation percentage or investment recommendation.
- Contract term, notice, taxes, currency conversion, late payment, refunds or termination.
- The exact provider metrics and APIs available to each client project.

Those require explicit business decisions, current provider evidence and client-specific agreement. Do not turn this document into an automatic pricing engine until those decisions are approved and the corresponding billing/approval workflow is implemented and tested.
