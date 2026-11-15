# Iteration 13 — Reusable PWA Foundation Contract

## Fast handoff for future implementation chats
- **Golden baseline:** [GOLDEN-BASELINE.md](./GOLDEN-BASELINE.md) records protected behavior, recovery policy and new-project adaptation steps. Do not casually move or develop on the golden reference branch.
- **Installation lock:** [docs/PWA-INSTALLATION-LOCK.md](./docs/PWA-INSTALLATION-LOCK.md) is mandatory before any PWA/install change and must be carried into every clone. Installation behavior is frozen during routine identity, styling and feature work.
- **Portfolio handoff:** [docs/ITERATION13-PORTFOLIO-HANDOFF.md](./docs/ITERATION13-PORTFOLIO-HANDOFF.md) is the canonical guide for using this repository when creating a new portfolio project or updating an existing one. Read it alongside the target repository's own instructions; apply standards selectively and never clone its demo architecture blindly.
- **Repository role:** Iteration 13 is the portfolio's engineering standards, architecture and SOP reference. It is not the default cloning source. New-project source selection is governed by `CLONING.md` and `docs/ADMIN-HUB-APP-FACTORY-SOP.md`: use `gatshaayanda/africhiko` by default unless the product owner names or approves another source. Existing projects are improved in place.
- **Mandatory first read:** [START-HERE.md](./START-HERE.md). Every new implementation or QA chat must start there and follow its reading order; never ask the product owner which docs to inspect.
- **Documentation map:** [docs/README.md](./docs/README.md) explains which document owns each policy and which task-specific files to read. Do not make the user repeat repository rules already documented there.
- **Mandatory change discipline:** [docs/CHANGE-SAFETY-STANDARD.md](./docs/CHANGE-SAFETY-STANDARD.md) governs every change. A request to fix one thing is not permission to break adjacent working behavior. Diagnose the first proven cause, make the smallest change, review the full diff and verify both the fix and neighboring behavior.
- **Visual direction (mandatory):** read [docs/VISUAL-DIRECTION-STANDARD.md](./docs/VISUAL-DIRECTION-STANDARD.md) AND open `docs/assets/washride-home-reference.jpeg` before planning, implementing or reviewing any visual/page design. The image is the canonical persistent reference; do not ask the product owner to re-upload it or rely on prose summaries. Apply its composition, hierarchy and finish—not its car-wash branding or literal styling—to the target product.
- **Operational transparency (mandatory):** read [docs/OPERATIONAL-TRANSPARENCY-STANDARD.md](./docs/OPERATIONAL-TRANSPARENCY-STANDARD.md) before implementing or reviewing meaningful loading, search, booking, order, enquiry, upload, payment, messaging, account, admin, background-job or handover workflows. Show genuine activity and outcomes; never fake progress or expose sensitive internals.
- Then read FOUNDATION-BLUEPRINT.md, README.md, and CLONING.md as directed by START-HERE. These files serve different purposes; do not substitute chat summaries for them.
- Read CHAT-WIDGET-RESEARCH.md before adding a chat helper. The current deterministic adaptation lives in src/app/ServiceGuide.tsx; that file separates the Sparkle Legacy reference from research-backed recommendations.
- Before claiming a fix is complete, run the repository's available checks, inspect their actual output, and verify the exact commit/deployment state. A GitHub edit or merge alone is not a build verification. Never weaken or remove install regression checks to make a build pass.
- README is the customer/admin demo walkthrough. Do not assume an earlier conversation summary is newer than the repository.
## Purpose
Iteration 13 is the standards/reference repository and a working prototype that demonstrates responsive customer journeys, browser-local demo workflows, protected PWA installation, iPhone guidance, offline behavior, and staff/admin patterns. It is not the mandatory cloning source for new projects. The service catalogue is sample content, not a real business offering.

## Portfolio source-selection contract

- The product owner chooses the source repository for each new project. Use the exact repository they name; inspect it and recommend changes only after evidence-based comparison. Never silently substitute Iteration 13 or another repository.
- If no source is named, `gatshaayanda/africhiko` is the default starting point for new customer-facing PWAs and Admin Hub applications. Confirm the current repository state before cloning.
- Iteration 13 is the standards, architecture and SOP reference—not the default cloning source. Apply its reusable standards without assuming its demo architecture or features belong in every client app.
- If the product owner asks for a source recommendation, compare relevant portfolio repositories by industry, customer journey, admin workflows, architecture, integrations, protected behavior, visual quality and adaptation risk. State the recommended source and material risks before cloning.
- Existing projects are improved in place. Never reclone or replace an established implementation merely to adopt a different foundation.
- Clone only into the intended empty local directory, connect the new working copy to the new client remote, and establish a clean baseline safely. Inspect a non-empty destination/remote; never force-push or overwrite it.

## Source of truth and workflow
- Product owner / final reviewer: the user. Implementation: ChatGPT.
- GitHub is the source of truth. Inspect the actual branch, latest commit, working tree, instructions, routes, service worker, install code and tests before changing them.
- Existing project workflow: START → INSPECT → BUILD → VERIFY → CHECKPOINT. Keep inspection proportional; do not endlessly re-audit a repository whose context is established.
- Unexpected result: STOP → inspect actual state → identify the first failure → fix → verify.
- Preserve successful behavior. Prefer focused changes over rewrites. Never claim a test, deployment, device test, offline write or Firebase workflow passed without evidence.
- When authorized, push changes to `main`. The user handles Vercel deployments unless explicitly delegated.

## New-project documentation handoff

Every new client repository must receive a project-specific `AGENTS.md` before substantial implementation. It must describe the actual source lineage, product identity, architecture and data flows, customer/admin journeys, authentication and authorization boundaries, integrations, setup requirements, known limitations, protected features/files, PWA installation and chatbot locks, verification commands and the latest verified checkpoint. Carry forward only protections that exist in the selected source or are explicitly required by the product owner; do not falsely claim that a feature exists. Update the file when material decisions or verified behavior change. The client repo's own code and instructions then become its source of truth.

For any requested one-word staff/owner login, follow the mandatory **One-word staff/admin access** and **Owner entry affordance — briefcase only** sections in `docs/ADMIN-HUB-APP-FACTORY-SOP.md`. Before coding, inspect the target's existing env files, docs and login references; reuse the exact existing server-only one-word secret variable (for example `ADMIN_PASSWORD` when that is what the repository already uses). Never invent or rename it to a project-specific alternative, add a second secret variable, or create new Vercel setup requirements. If the correct existing variable cannot be proven from the repository, stop and ask instead of guessing. The public admin entry is one tappable 💼 briefcase symbol only—no visible Login/Admin text, label, arrow, logo block or duplicate entry point. One-word means one access-word field at the UI; preserve the selected source's proven auth/session implementation unless explicitly directed otherwise. Never invent email/username fields, token systems, provider dependencies or extra Firebase requirements.

## Business identity and restrained colour system (mandatory)

- Show the business identity setup form immediately when the **owner deliberately enters the setup workflow**; do not put a marketing/choice landing page or flagship promotion in front of owner setup. This owner-only setup must not intercept visitors: ordinary customer/visitor entry opens the Store directly. The Junk Park BW flagship example belongs in a separate examples/discovery area, not inside the identity form. Ask for a business name (real or fictional) and let the owner choose **one, two or three brand colours maximum**; one or two colours are complete choices, not incomplete states.
- Present this as one coupled identity: **Store · Account · Briefcase**. Show a live preview and update all three surfaces together immediately. Persist the identity using the target project's real persistence boundary; label browser-local demo persistence honestly.
- Use the headline **“Your business in your pocket.”** Example helper copy: “Example: Metsi Wellness. Use a real or fictional name. Your Store, Account and Briefcase rebrand together instantly.”
- In the owner workspace use the clear identity marker **“ADMIN HUB / PRIVATE BRIEFCASE”**, the same “Your business in your pocket” proposition, and a context-aware greeting based on the owner's local time. Follow it with a compact operational summary such as “Owner operations · customer requests · money”. Do not let a greeting displace urgent work or create fake activity.
- The brand palette is capped at three intentional hues: primary, secondary and optional highlight. Neutral text, backgrounds, borders and semantic status colours are system tokens, not extra brand accents. Avoid rainbow status systems; status must also have a label/icon/shape.
- Keep readable foreground/surface pairs independent from brand choices. Automatically derive or choose foregrounds and surface tints, and test every rendered text/control pairing. Normal text needs WCAG AA 4.5:1; qualifying large text 3:1. If a brand colour cannot safely carry text, use it as a decorative/accent surface with a compliant neutral foreground instead.
- Apply the selected identity consistently to the public Store, customer Account, owner Briefcase, receipts and previews. Never let each area drift into its own unrelated palette.
- This is a portfolio-wide default for all future projects unless the product owner explicitly chooses a different onboarding model. If adapting an existing app or a close industry match, preserve its proven identity and customer journey while applying the same restrained palette and contrast rules; do not force the generic 13Studio look.

Read [docs/BUSINESS-IDENTITY-AND-COLOUR-STANDARD.md](./docs/BUSINESS-IDENTITY-AND-COLOUR-STANDARD.md) for the complete implementation and QA contract.

## Objective-to-system design (mandatory)

- Read [docs/OBJECTIVE-TO-SYSTEM-DESIGN-STANDARD.md](./docs/OBJECTIVE-TO-SYSTEM-DESIGN-STANDARD.md) before substantial product design, screen redesign, feature planning, architecture decisions or project adaptation. It is mandatory for Iteration 13 and portfolio work; do not treat it as an optional workshop.
- Start with the business objective in approximately three or four plain-language words, then trace the human problem, desired journey, required capability, interface, technical implementation and acceptance test. Keep objective-to-screen-to-test traceability throughout development.
- During screen-by-screen QA, evaluate purpose, audience, orientation, hierarchy, affordances, complete content, states/feedback, recovery, accessibility/responsiveness, system truth and evidence. Apply this now to the active Iteration 13 Store/Briefcase redesign; do not wait for a future project or require the product owner to repeat the instruction.
- For substantial products/redesigns, maintain linked Business Understanding, Experience & Functional, and Technical & Verification maps in project documentation. For small changes, use a compact traceability checklist. Keep the objective visible as complexity increases.
- Adopt the agent-native inspection lessons documented from Expo Exact: inspect rendered screens, accessibility/layout/state/logs where tooling supports it, drive real interactions, make critical journeys repeatable, control time in tests where practical and tie evidence to the tested build. Do not replace the existing PWA stack with Exact; it is pre-1.0 and an isolated experiment only unless separately evaluated and approved.

## Design intelligence and experience quality (mandatory)

- Read [docs/DESIGN-INTELLIGENCE-AND-EXPERIENCE-QUALITY-STANDARD.md](./docs/DESIGN-INTELLIGENCE-AND-EXPERIENCE-QUALITY-STANDARD.md) alongside the Visual Direction and Objective-to-System standards before substantial visual planning, screen redesign, design-system work or visual QA. It is mandatory for Iteration 13 and portfolio projects; do not treat it as optional inspiration.
- Select a dominant visual genre (Quiet, Character, Atmosphere, Data or Loud) with a reason tied to the product, audience and task. Use secondary expressions deliberately; never impose one visual style on every screen or copy a reference product.
- Research relevant real products and complete task flows when the decision warrants it. Translate findings into the target business context and distinguish evidence from assumptions.
- Inspect the existing theme/component system before changing it. Maintain one source of truth for tokens and shared components; do not add competing libraries or duplicate design systems.
- For substantial products, provide a rendered development-only design-system showcase where practical, covering foundations, contrast pairs, component variants/states, realistic content and representative compositions. Keep it out of customer navigation and do not expose private data.
- Review real screenshots and interactions at narrow mobile and desktop widths; check hierarchy, surfaces, text, overflow, accessibility, state feedback, motion and cross-screen consistency. Screenshot-only acceptance is insufficient.
- Expo design-system and shadcn DESIGN.md/showcase workflows are transferable references, not instructions to migrate stacks or install dependencies. Rive and motion galleries are optional; use them only when they improve the product.
- Apply this standard immediately during Iteration 13's active Store/Briefcase redesign and screen-by-screen QA. The detailed contract is the linked standard; future chats must read it rather than relying on chat summaries.

### Mandatory project genre decision and design-direction brief

Every new app and every material visual/experience redesign must have an explicit, project-specific design-direction decision **before substantial screen implementation**. This is a workflow gate, not optional inspiration and not a request to apply a generic theme.

- Understand the actual business, audience, positioning, customer/staff tasks and operating context first. Use the supplied brief and verified repository evidence; do not invent business details.
- Select one dominant genre from **Quiet, Character, Atmosphere, Data or Loud**, with a concise reason tied to that project's audience, business objective and primary tasks. These are practical art-direction lenses, not an exhaustive taxonomy or rigid templates.
- Record deliberate secondary genre influences and where they belong in the journey (for example, Quiet for customer account, Data for operations, Loud for a launch campaign). Do not force every route into one treatment or let adjacent screens feel like unrelated products.
- Translate the decision into a compact project-specific direction brief: brand/positioning, visual principles, typography and hierarchy, colour/surface approach, imagery, density/composition, motion/interaction, accessibility/performance constraints, and references/research findings where useful.
- For a new project, put the decision in its project `AGENTS.md` and `DESIGN.md` (or equivalent) before substantial UI work. For an existing project, inspect its current design system and proven journey first; preserve the established direction unless the brief or evidence warrants a change, then record any confirmed refinement in the project docs.
- Apply the direction across the complete experience—Store/landing, customer request and Account, staff/admin/Briefcase, receipts and important states—not just the homepage. Genre can vary by task/screen while shared identity, tokens and components remain coherent.
- For every visual update, check whether the change remains consistent with the project's recorded genre and task purpose. Do not restart genre selection for a small correction; revisit it only when product positioning, audience or primary use materially changes.
- Use the canonical [Design Intelligence & Experience Quality Standard](./docs/DESIGN-INTELLIGENCE-AND-EXPERIENCE-QUALITY-STANDARD.md) for definitions, research, design-system practice and QA. A genre label alone is not a design brief and does not prove quality.

**Stop/go rule:** do not begin substantial visual implementation until the project genre and its business rationale are recorded. If the brief is insufficient to choose safely, make the best evidence-based recommendation and ask only for the one decision that genuinely requires the product owner.

## Interaction clarity and feedback (mandatory)

- Read [docs/INTERACTION-CLARITY-AND-FEEDBACK-STANDARD.md](./docs/INTERACTION-CLARITY-AND-FEEDBACK-STANDARD.md) before implementing or reviewing customer-facing interactions, forms, navigation, account workspaces, status feedback, notifications or error/success states.
- Every action must look actionable before hover, use the correct semantic control, expose visible focus/pressed/disabled/loading states and provide truthful contextual feedback. Toasts must never be the sole record of important outcomes.
- Apply the standard's contrast, touch-target, mobile-first, account-workspace and end-to-end QA requirements to all new and existing projects. Project-specific `AGENTS.md` files should link to the canonical standard rather than inventing competing rules.

## Evidence-led change and regression-prevention protocol

Apply [docs/CHANGE-SAFETY-STANDARD.md](./docs/CHANGE-SAFETY-STANDARD.md) to every feature, bug report, visual complaint, install issue, and project adaptation. That document is the canonical cross-project method; the summary below is an implementation reminder, not a competing policy.

1. **Observed behavior beats assumptions.** A product owner's report that a feature works on a real device is evidence to preserve and verify in context—not an invitation to rewrite it. Record what was observed, on which version/device/path when known, separately from any suspected cause.
2. **A complaint starts diagnosis, not automatic repair.** Before changing code, compare the deployed version/commit with the current source and recent commit history. Reproduce or inspect the relevant browser/device behavior when possible. Identify the first proven failure and the smallest affected surface; do not treat a proposed cause as a fact.
3. **Protect unrelated functionality by default.** Define the task's scope and mark protected/working behavior before editing. A product-card task does not authorize install, authentication, service-worker, offline, persistence, upload, or routing changes unless evidence demonstrates a dependency or the product owner explicitly authorizes them.
4. **Review the proposed diff before pushing.** Inspect changed files and behavior against the task and approved baseline. Check protected files, event lifecycles, identity/configuration, and side effects. Any unexplained protected-file change is a stop-release condition: revert or justify it with evidence before continuing.
5. **Verify the actual result.** Run focused tests and the available type/lint/build/CI checks; inspect their actual outputs. Check the deployed commit and status when accessible. Report separately: code changed and commit created; changes pushed/merged; checks actually run and results; deployment status; and browser/device/offline QA still required. A commit, green CI, or successful push is not proof of live deployment or real-device behavior.
6. **Unexpected result: stop and find the first failure.** Do not stack speculative fixes. Compare source, commit, deployment/cache state, protected implementation and browser evidence; repair the first proven cause, then rerun relevant checks.
7. **Keep the release focused.** Bundle related changes into one reviewed commit where practical. Never force-push or rewrite history without explicit authorization. The product owner handles Vercel deployment unless they delegate it.

These rules complement—not replace—the PWA installation lock and other project-specific protected contracts. Preserve known-good installation and chatbot behavior unless an explicit authorized task and evidence require a narrowly scoped change.

## Iteration 13 Business OS product contract

- Iteration 13 demonstrates one business product: **Store → Briefcase → Login**. Store is customer-facing; Briefcase is the owner's Business OS; Login is the one-word owner entry. The **Admin Hub B.O.S. Briefcase symbol is the product mark and PWA icon**; use the existing briefcase artwork consistently to identify the owner workspace. Keep it a discreet owner-workspace affordance in customer-facing navigation; never add a public "Admin" navigation destination.
- The owner Briefcase owns Store CRUD (services/products, prices, media, visibility, announcements), business theme, customer records, jobs/orders, receipts/BUR-ready exports, calendar, custom priorities, insights/projections, settings and My Notes. Expose only functions that are implemented; label prototype/local behavior clearly.
- Business theme means a selectable accent colour/palette and custom colour, not only light/dark. Apply it consistently and preserve accessible contrast.
- Demonstrate the BoardSignal-derived 25 GB monthly capacity benchmark and high-volume customer-day use case as supplied by the product owner. Explain that provider plan, file storage, bandwidth, database operations, API calls, messaging and AI usage are distinct. Never imply unlimited capacity or live metering without telemetry.
- Keep actual receipts/confirmed sales separate from quotes, unpaid work and projected sales. Owner-defined job priorities must be based on persisted preferences and actual job states. WhatsApp invitations must be customer-scoped, revocable and tied to the correct customer/domain.
- The current demo remains browser-local. No real Gmail owner authentication, shared server records, live 25 GB metering, cross-device sync, customer WhatsApp delivery or BUR compliance is implied until implemented and verified. Never enter real customer records into this demo.

## i13 B.O.S. opening experience and symbol

- The first screen is the **business identity setup form itself**: “ITERATION13 / BUSINESS OS”, “YOUR BRIEFCASE STARTS HERE”, business name, currency, one-to-three brand colours, first customer offer, media option and live Store / Account / Briefcase preview. Do not insert a separate generic landing or choice screen before it.
- The first screen must offer a prominent but secondary **Flagship experience** invitation before the visitor enters any details. It opens the working Junk Park BW example at `https://iteration13.vercel.app/` in a new tab, preserving the visitor's in-progress setup in the original tab. Label it clearly as an example, not the visitor's saved business.
- The visitor can inspect the example first, return to the still-empty setup form, and then enter their own details. Do not silently prefill or overwrite their setup with example data. If a future, verified share-snapshot import is added, it must be a separate explicit action and preserve the visitor's own saved data.
- The live identity preview updates Store, Customer Account and Owner Briefcase together as the visitor types/selects. The Admin Hub B.O.S. Briefcase symbol is the actual artwork already used by the PWA icon; reuse it to identify the owner workspace and installed app. Do not substitute a generic emoji, unrelated illustration or text-only mark.
- Only show controls that perform the advertised action. Keep explanatory labels and journey stages non-interactive unless wired to a real action. The primary action creates the visitor's Business OS; the flagship link explores Junk Park BW in a new tab; when a saved business exists, retain a separate explicit **“Continue saved business: [business name]”** action without auto-opening it.
- The sample/example must never be confused with the visitor's saved business. Do not overwrite, rename or merge the visitor's saved business, orders, customer data or owner workspace when opening an example.
- Screen-by-screen redesign is the release workflow: implement one agreed screen, push it to `main`, report the exact commit and checks, then stop for product-owner QA. Do not redesign the next screen until the product owner reviews the current checkpoint and supplies feedback.
- Opening-screen QA must include 320, 360, 390, 430 and desktop widths; keyboard operation of the flagship link and setup controls; opening the example in a separate tab; returning to the untouched setup form; first-time setup; existing saved-business safety; horizontal text and no clipping/overflow.


## Mandatory Business OS adaptation contract

When the product owner asks to look at Iteration 13, adopt Iteration 13, or use it as the OS template for a new or existing project, apply the Portfolio Product & Engineering Handoff and the focused visual/accessibility/operational standards. Do not treat that request as permission to copy 13Studio branding or demo architecture.

Preserve these cross-project capabilities unless the product owner explicitly removes them:
- A compact customer-facing Store/catalogue with the complete service/product description, a visible full price (or honest "From" / "Price on request"), and a direct action on every card.
- A useful customer account with customer-scoped order history, accurate status, price/payment balance and a receipt/payment record that can be opened and printed/saved.
- The matching owner/admin order record with the same price, status, payment and receipt information. Customer and owner views must use the same underlying record and authorized data path.
- A concise, operational owner Briefcase for CRUD, customer work, receipts/records and business settings, adapted to the actual business.
- The compact WashRide-inspired composition and information density across Store, booking, account and admin—not only the homepage.

Brand, business terminology, service catalogue, prices, visual assets, account extras and layout can change for project context. Existing project data/auth/security and protected features remain authoritative. Never copy sample prices, localStorage architecture, game mechanics, demo login or unsupported claims into production apps. For missing prices use "Price on request" until verified; never invent.

Readability is a release blocker: no clipped/truncated customer descriptions, no hidden prices, no faint text, no accent-colour contrast failures. Normal text/control labels ≥14 CSS px; supporting metadata generally ≥12 CSS px; WCAG 2.2 AA contrast ≥4.5:1 normal text and ≥3:1 qualifying large text. Never achieve compactness by shrinking or clipping text.

## Dynamic business example sharing and owner shifts

- The owner can generate a share link from the current Briefcase business identity. The link contains only customer-facing setup (name, currency, palette, catalogue, announcement and public reward settings); never include customer requests, contact details, messages, payment records, private receipt profile fields, owner notes or activity history.
- A shared link opens a business-specific choice: explore the named example or create a separate business. The example is copied into a visitor-specific browser-local namespace keyed by the share ID. Visitor edits persist in that browser and never overwrite the owner's local workspace. The URL carries the public example snapshot so a new visitor can open it without a backend; this is demo sharing, not secure cloud persistence or analytics.
- Keep the CTA explicit: **“Explore the [Business Name] example”**. Do not hard-code Lemonade Stand or another fixed sample business into the shared journey.
- Owner shift time measures the period the Briefcase screen is open. Successful owner entry starts a new shift; navigating between Briefcase tabs keeps it active; leaving the Briefcase, closing/reloading the page, idle lock, maximum duration or sign-out ends that shift. Signing in alone is not a shift and a previous shift must never resume on a later screen opening.
- Preserve the one-word demo access flow and existing 30-minute idle lock / configurable maximum duration. A visitor's shared example remains browser-local and is not a production customer-data boundary.

## Reusable product principles
- Customer action first. Make the next step obvious, reduce unnecessary navigation, and keep copy concise.
- Mobile-first, accessible, legible UI; WCAG 2.2 AA contrast is the baseline. Apply compact, task-focused information density across every surface—not only the homepage—including booking, customer account and admin pages. Avoid oversized headers/cards, redundant welcome/hero sections and unnecessary vertical whitespace; keep operational information scannable without making controls cramped. Verify keyboard focus, narrow layouts, empty/error/loading states and touch targets.
- For visual planning and QA, follow `docs/VISUAL-DIRECTION-STANDARD.md`; its compactness requirement applies to all routes and screen types, while visual identity remains industry-specific.
- Real workflows over decorative controls. Validate forms, persist state, expose useful feedback, and make admin changes visible to the customer view. Use visible press/focus states and accessible, dismissible toasts for meaningful outcomes; never claim a local write succeeded unless localStorage accepted it. Avoid JavaScript alert/confirm for routine UX.
- Keep account creation proportionate. Let customers explore before requesting credentials unless a real product requirement demands otherwise.
- Minimize Firebase reads/writes. Do not change Firebase config, rules, collections or production data without explicit instruction.
- Keep demo data, project-specific requirements and unverified ideas distinct. Local browser storage is not shared persistence, authenticated access, a server database or cloud synchronization.

## Operational transparency — show genuine work and outcomes

- Apply `docs/OPERATIONAL-TRANSPARENCY-STANDARD.md` to every relevant customer and staff/admin workflow. It complements the mandatory WashRide visual reference; both standards apply together.
- Make genuine work legible at the moment it matters: what is being searched, checked, saved, uploaded, reviewed, assigned, processed or completed; what actually happened; and what the next useful action is.
- Drive progress, statuses, timestamps and activity history from real handlers, persisted records or authoritative integration responses. Never invent stages, percentages, queue positions, completion estimates, payment confirmation, message delivery or background activity.
- Distinguish requested from confirmed, local from remote, cached from synced, pending from completed, and sent from delivered. State offline and integration limits honestly.
- Keep the experience compact and accessible. Customer views explain their own record and next step; admin views expose actionable operational context. Enforce privacy and role/record authorization before showing activity.
- For instant work, use concise confirmation instead of theatrical loading. Never slow a system down to make effort appear greater.

## Demo behavior
- The customer service-order demo on `/` uses localStorage intentionally so a reviewer can submit an order without Firebase credentials.
- Demo services, prices, media URLs, announcements, customer requests and statuses are editable locally. The admin demo is a prototype control surface, not a security boundary and not suitable for real customer data.
- The requested timeline date is a customer preference, not a confirmed delivery commitment. No payment is taken.
- Never describe local-only changes as synced to a server or shared with another device.
- Preserve the PWA pattern lab at `/patterns`, the iPhone installation guide at `/iphone-install`, and the existing offline guide.

## Installation — protected, do-not-touch-by-default behavior

### Regression stop rule — install UI is not up for redesign
- Never add a desktop/Android install explainer, browser-menu walkthrough, fake prompt, fallback modal, or “Continue on the website” install screen. That exact class of regression is prohibited.
- The only desktop/Android install UI is the branded CTA shown while a real, retained `beforeinstallprompt` event is available; its click must call the event's `prompt()` immediately. If the event is absent, show no install CTA. iOS Safari alone may show the Share → Add to Home Screen guide.
- For branding work, edit icon files and identity metadata only. Do not edit `src/app/pwa-register.tsx`, the early capture script in `src/app/layout.tsx`, or install visibility/event handling unless the product owner explicitly requests an install-mechanics change.
- The identity verifier must scan all active UI source files for forbidden generic install copy, not just the primary PWA component. A check that passes only because it scans one file is insufficient.
- If a user sees install UI that is absent from source, inspect the actual deployed commit and service-worker cache version first. Bump the app's cache namespace when a stale shell must be retired; do not rewrite a working prompt to mask stale deployment/cache state.
**The install flow is a protected foundation primitive, not a design component.** For branding, icon, color, typography, layout, copy, catalogue or account work, do not edit the install runtime or its event flow. Change only the relevant icon assets and metadata references. Any install-mechanics change requires an explicit product requirement, a focused diff, checks, and browser QA.

- Preserve the early `beforeinstallprompt` capture in `src/app/layout.tsx`, the retained one-shot event, the `iteration13-open-install` click event, and the user-initiated call to the native browser prompt in `src/app/pwa-register.tsx`.
- **Native prompt first:** when the browser supplies `beforeinstallprompt`, retain it and invoke `prompt()` directly from the user's branded install click. Do not consume it during page load, defer the call behind another user interaction, or replace it with a custom imitation.
- **No generic install explainer/modal on desktop or Android.** The install CTA is visible only when a retained native prompt is available. If the browser has not offered a prompt, do not display a dead CTA or a modal telling users to use the Chrome/Edge menu.
- **iOS exception:** because iOS Safari does not provide `beforeinstallprompt`, show concise Share → Add to Home Screen guidance only in iOS Safari. Do not show that manual guide as a substitute on desktop or Android.
- Keep the blocking embedded-browser handoff and `/iphone-install` Safari guide, including referenced media assets. A social referrer alone is not proof that the page is inside an embedded browser.
- Inspect both `public/manifest.webmanifest` and `src/app/manifest.ts` before changing manifest output. Verify which manifest Next.js actually serves; do not assume similarly named files are interchangeable.
- Change icon artwork separately from install mechanics. Keep valid manifest icon paths, MIME types, purpose and supported sizes. Do not delete or rename an icon until every reference is updated and the built manifest/assets have been checked.
- Keep service-worker cache namespaces scoped to Iteration 13. Preserve update detection, the visible refresh action, offline fallback and existing privacy boundaries. Do not cache private Firebase responses as public content.
- `npm run verify:identity` guards install-flow invariants and runs as part of `npm run build`. After any PWA asset/metadata change, run identity verification, lint and build; inspect the served manifest/assets. State that real Chrome/Android and iPhone/Safari testing remains for the product owner unless it was actually performed.
- **If installation regresses, do not improvise a new install UI.** Stop and inspect `main`, the deployed commit, `src/app/layout.tsx`, `src/app/pwa-register.tsx`, `src/app/pwa.css`, `src/app/install-card.css`, both manifest declarations, icons, `public/sw.js`, and verifier output. Compare the native prompt/card behavior to the approved Africhiko implementation and Iteration 13's tested platform paths. Fix the first proven failure, strengthen the guard if it missed the regression, then run the full checks. Restore the last known-good behavior instead of adding another prompt, modal, fallback, or listener.

## Verification and reporting
Run `npm run verify:identity`, `npm run lint`, and `npm run build` when the available environment permits. Report the exact commit/branch, checks actually run, deployment status separately, and concise QA steps. A successful GitHub push does not prove a successful Vercel deployment.


## Service Guide integration contract
- \`src/app/ServiceGuide.tsx\` is a scripted navigation assistant for this prototype, not AI or live support. Read \`CHAT-WIDGET-RESEARCH.md\` and the “Deterministic Service Guide” section in \`FOUNDATION-BLUEPRINT.md\` before adapting it.
- Keep its customer/admin actions wired to the existing page state and real handlers. Do not duplicate forms/data, invent completed actions, or make the guide required for the primary journey.
- Mount the guide outside the shared Store / Account header as a compact right-edge floating control; never place it inside primary navigation. Keep it closed until explicitly opened—no unsolicited teaser or contextual hint bubbles. The closed overlay root must use pointer-events:none so it cannot intercept page taps; only the launcher, open panel and backdrop may receive pointer input. Preserve mobile safe areas/dynamic viewport, keyboard/Escape support, reduced-motion styles, session-only history and truthful local/offline wording.
- In a new project, replace demo labels and actions with project-specific workflows, verify authorization for admin actions, and only add network/AI/human handoff integrations when explicitly designed and genuinely implemented.


## Customer account workspace adaptation contract

- The reusable account implementation is `src/app/AccountWorkspace.tsx`, integrated with `src/app/page.tsx`. Preserve and build on its useful account-holder capabilities: request/order history and status, email filtering, project-specific progress/gamification, a lightweight journal, a per-request customer ↔ admin conversation, and image/video/PDF attachments where the target project's upload rules allow them.
- For every new project and every existing project whose account is being improved, inspect that project's real customer journey, data model, authentication, staff/admin workflow, upload endpoints, offline strategy and privacy/security rules first. Then research the target product and audience online before choosing account extras, interaction metaphors, terminology, hierarchy or visual treatment. Use primary product sources and credible UX research (for example, Baymard's account/dashboard consistency guidance) where relevant; cite/record useful findings in project docs. Replace Iteration 13 labels, sample services, journal prompts, status names and helper copy with the target project's own context. Do not transplant a spa garden, game, prices, treatments, customer messages or business-specific content unchanged. Theme-specific extras are optional: choose something genuinely useful for this product, or omit gamification entirely.
- The account should help a customer take the next useful step: see their own history, understand status versus confirmation, message the responsible team on a specific request, share relevant files, and return to supported project-specific extras. Keep sign-in proportionate and never reveal another customer's records.
- Apply [Interaction Clarity & Feedback Standard](./docs/INTERACTION-CLARITY-AND-FEEDBACK-STANDARD.md) to every account control, navigation path, message composer, upload state, empty/loading/error state and confirmation. The dashboard must expose direct paths to supported account tasks; avoid deep navigation and transient-only feedback.
- For account structure, consult Baymard's [Accounts & Self-Service best practices](https://baymard.com/research-articles/current-state-accounts-selfservice) and [Account Dashboard research](https://baymard.com/ecommerce-design-examples/58-account-dashboard). Adapt findings to the actual product rather than copying ecommerce-only features.
- In this prototype, request data, conversation messages, statuses, garden progress and journal notes are browser-local. Customer and admin communication is a same-browser demo thread only; it is not email, live chat, a remote inbox, or cross-device sync. File attachments upload to UploadThing only while online (images/PDFs max 4 MB; videos max 16 MB); they are not queued offline. Never claim otherwise.
- When adapting to a real production app, replace local-only account state with a verified authenticated data path, enforce ownership and staff authorization at the server/security-rule boundary, and connect messages/notifications to a real team inbox only when the backend and delivery path are implemented and tested. Do not weaken security rules or expose all requests to make the UI work.
- Keep optional account extras and their data collection proportionate. Gamification should be playful and project-specific, never a misleading health, performance or customer-worth score. Journal privacy and retention must be stated truthfully.
- Verify customer-created messages/files are visible to the authorized staff workflow, staff replies/status changes return to the correct customer view, invalid/oversized files fail clearly, and offline text/local-state behavior is distinct from online upload or remote delivery. Update `README.md` and `CLONING.md` with any project-specific limits.


## First-run Business OS setup — minimum viable customer offer

- In the generic Iteration 13 Business OS onboarding, after business name and one-to-three brand colours, require the owner to create at least one service/product listing before entering the demo workspace. Require a name and price; description and image are optional.
- Reuse the existing UploadThing service media picker for optional images and show a clear branded placeholder when no image is supplied. Respect upload size, connectivity, progress, error and success states. Do not fake a completed upload.
- Preview the first listing in the Store identity preview. Save it into the same service collection used by the existing customer Store and owner service CRUD; do not create a separate onboarding-only record.
- Start a fresh demo with an empty catalogue rather than irrelevant inherited sample services. Existing saved demo catalogues must remain intact.
- Owner dashboard labels and explanatory text must be readable, with a 14 CSS px minimum for supporting copy and metric labels. Never let metric numbers remain visible while their labels/explanations disappear. Maintain strong contrast against each card surface.


## Iteration13 product identity and guided adoption
- Iteration13 is the reusable Business OS product, not merely a colourable storefront. The briefcase-in-your-pocket metaphor is the primary identity; the briefcase mark should recur in the app icon, owner entry and Briefcase workspace.
- First-run guidance should teach the connected Store · Account · Briefcase model through a live preview and a short optional journey. Explain the owner's keys as access to customers, jobs, money, records, store presentation and insights—not simply brand-colour controls.
- Preserve a generic, editable base. Niche-specific clones can be refined for a particular market while Iteration13 remains a flexible demonstration and template.
- Motion and signalers clarify real state changes, respect reduced motion and never replace persistent records or truthful operational status.


## Product-owner clarification — briefcase intent, shifts and compact account (2026-11-13)

This clarification overrides any interpretation that adds an unnecessary intermediate shift-start step:

- The single footer 💼 Briefcase click is explicit owner intent. It opens the owner access flow; once access is granted, that same journey automatically starts the work session/shift. There is no separate Start Shift button, no second confirmation, no extra navigation or repeated click. Do not ask the owner to click again to declare the intent already expressed by opening the Briefcase.
- Record the session/shift start automatically at successful access. Provide one clear End session / Sign out action. Apply the configured maximum session duration and automatically expire the session at its limit. Do not confuse browser inactivity with the owner's decision to start work. If a production backend exists, record timestamps server-side; browser-local timestamps in this prototype are illustrative only and must be labelled accordingly.
- Customers must never see private owner shift duration or staff attendance. Show only truthful business availability, the customer's request status, last update and a response estimate only when the business has actually set one.
- Keep the customer Account compact and action-led: one clear account heading, one activity lookup, selected items only when present, the request list as the durable status record, and direct access to messages/receipts/rewards. Remove repeated headings and duplicate status/notification summaries. Remove test-notification controls and demo reminder theatre from ordinary customer-facing Account UI.
- The chosen primary, secondary and optional highlight brand hues must all be visibly and purposefully represented across Store, Account and Briefcase, with a distinct visual treatment per surface. Do not collapse secondary/highlight into primary or use them as low-contrast text. Preserve neutral readable surfaces and WCAG AA contrast.
- Keep the public admin entry as one icon-only footer briefcase. The footer is reserved for this owner entry: never add a duplicate customer Account / “My account” link there; customer Account is accessed from the header. Do not add Admin/Staff/Login navigation or a second owner entry affordance. The one-word access field remains the only credential field. Production access must use server-side `ADMIN_PASSWORD`, fail closed when absent, and must not use the prototype's local demo word as production authentication.

## Product-owner clarification — Care, availability and palette roles (2026-11-13)

- The customer-facing counterpart to the owner's **Shift** is **Care**. Keep the word human and relationship-led; do not rename it to Request Journey, Progress or Turnaround.
- Care is the customer's view of the business relationship: request received, current status, latest genuine business update, conversation and the next useful action. It may use a heart motif integrated with the business monogram/logo so it feels like the business is caring for the customer, not like a generic unrelated icon. Prefer a small, recognizable brand-linked mark over a decorative illustration.
- The owner sees Shift duration and expiry. The customer must never see that private timer. The customer sees only their own request timestamps/age and real updates. Never invent response countdowns or claim work is happening continuously.
- Business Availability is a separate customer signal, controlled by the owner with three clear traffic-light states: green **Available**, amber **Limited**, red **Unavailable**. Use text labels as well as color so the meaning is accessible. An expected next operating period may be shown only when the business has actually configured one.
- Keep the clocks separate: owner Shift, customer Care/request age, business Availability, and an optional configured response estimate. They must not be conflated.
- For this browser-local prototype, owner Shift starts automatically after successful access through the single footer Briefcase flow. It measures the time the Briefcase screen is open, not time merely signed in. Moving between Briefcase tabs keeps the same shift; leaving the Briefcase, closing/reloading the page, the 30-minute idle lock, maximum duration or sign-out ends it. The next successful Briefcase opening starts a new shift; never restore or resume a prior shift. Default maximum duration is 12 hours and the owner may choose 1–24 hours. Manual end and automatic expiry are distinct recorded events.
- The customer Account stays compact and action-led. Remembered email lookup is secondary; selected items are a small expandable basket; older request details, receipts, messages and rewards stay available but collapsed; notifications and request status share one Care activity feed. No test notifications or example reminder theatre in ordinary customer UI. Optional racing/reward experiences stay collapsed.
- Use all distinct selected brand hues purposefully across Store, Account and Briefcase. Primary establishes identity/action, secondary supports Store/Account grouping, and highlight is a restrained signal/accent. If only one or two hues are selected, do not fabricate additional brand colors. Maintain neutral surfaces, readable text and WCAG AA contrast.

## Delivery checkpoint — Care and Shift implementation (2026-11-13)

Before considering this work complete in QA, verify on a fresh browser profile and a returning profile:

1. A customer with remembered details lands on a compact Account with one Care card, the correct request, actual received age and latest saved business update.
2. Customer availability reflects the owner's green Available, amber Limited, or red Unavailable setting; no owner shift duration or staff attendance is exposed.
3. The selection basket, older request details, conversations, receipts, rewards, and racing feature remain reachable but collapsed until requested. No customer test-notification button or sample reminder appears.
4. The one footer Briefcase click opens access. Successful access starts Shift automatically; there is no separate Start Shift control.
5. The owner sees elapsed Shift time and expiry, can configure 1–24 hours (12-hour default), manually end the shift, and is automatically expired at the limit. Manual end and automatic expiry are separate local events.
6. After 30 minutes idle, Briefcase access locks and the current screen-based Shift ends. Reopening the Briefcase after access is granted starts a new Shift; a previous Shift is never resumed.
7. Verify one-, two-, and three-color palettes across Store, Account and Briefcase. Distinct selected hues must remain visibly distinct, decorative use must not reduce text contrast, and functional text must remain readable.
8. Treat all timers and event records in this prototype as browser-local illustration, not secure authentication, authoritative attendance or cross-device synchronization. Production requires server-side session enforcement and timestamps.

## Current implementation state — 2026-11-13

The Care / Shift / Availability work is implemented in the prototype source on `main`:
- `src/app/AccountWorkspace.tsx`: compact customer account, Care card, business availability indicator, unified updates, expandable basket and secondary account details.
- `src/app/page.tsx`: owner Shift/session lifecycle, configurable maximum duration, inactivity lock, separate manual/automatic end events, and owner-controlled availability.
- `src/app/globals.css`: responsive Care and Shift styling plus intentional primary/secondary/highlight palette roles.
- This is still a browser-local prototype. The required acceptance checks above remain a human QA checkpoint; do not mark the experience production-secure or deployed until verified.
## Guided UI redesign and owner-QA release sequence (mandatory)

The product owner has approved a top-down, screen-by-screen redesign of the Iteration 13 opening experience. All future chats must follow this sequence and must not redesign multiple screens ahead of the owner's QA checkpoint.

### Product direction
- Design Iteration 13 as a guided, mobile-first **Business Operating System experience**, not a generic website builder, marketing site or conventional SaaS dashboard.
- Keep the product proposition plain-language: **“Your business in your pocket.”** The owner brings their business name, products/services and visual identity; the experience demonstrates how a connected Website, Web app and App can help customers discover, request and return.
- Keep the hierarchy clear: **Admin Hub** is the provider/company; **i13 B.O.S.** is the product; **Iteration 13** is the interactive configuration and exploration environment.
- The owner journey is **identity setup → Store → customer Account/request → optional promotion/game → owner Briefcase → Admin Hub handoff**. Ordinary visitors land directly in the Store and are never routed through owner identity setup. Make the next action obvious at every stage.
- Prefer a light, premium, calm customer-facing Store and Account, with a more focused owner Briefcase. All three share the business identity and restrained palette.

### Screen-by-screen delivery protocol
1. Inspect the current screen, its state/data dependencies, navigation, responsive behavior, existing design tokens/components and protected adjacent workflows.
2. Implement only the opening screen or next screen explicitly agreed for the current QA round. Do not pre-emptively redesign later screens.
3. Preserve working behavior and data contracts. Do not remove or fake setup persistence, service creation, customer requests, owner workflows, share isolation, media upload, offline behavior or PWA installation.
4. Review the actual diff and run available focused checks, typecheck, lint, identity verification and build where feasible. Report precisely what ran and what did not.
5. Push the completed screen to main when authorized. Give the owner the commit and a concise QA checklist. Stop and wait for their findings/approval before moving to the next screen.
6. When QA feedback arrives, inspect the actual deployed/source state, reproduce the first failure where possible, fix it, re-verify, and only then proceed.

### Global readability and layout acceptance — release blocker
- **No vertical text anywhere.** Do not use vertical writing modes, rotated labels, character-by-character wrapping, narrow grid tracks, forced word breaks or layout constraints that collapse words vertically. Keep all text horizontal.
- Use min-width: 0 only where it supports a healthy responsive layout; do not let it collapse content into unreadable columns. Use minmax(0,1fr) with sensible minimums and stack controls when necessary.
- Long business names, service names and labels must wrap naturally at word boundaries. Avoid word-break:break-all, overflow-wrap:anywhere on ordinary copy, fixed-height text containers, clipped text and line clamping for essential content.
- Normal body/control text must remain at least 14 CSS px; secondary metadata generally at least 12 CSS px. Maintain WCAG 2.2 AA contrast: 4.5:1 normal text, 3:1 qualifying large text and meaningful non-text controls.
- Keep touch controls approximately 44–48 CSS px high where practical. Preserve visible focus, semantic controls, keyboard access, reduced-motion support and truthful loading/empty/error/success states.
- Design mobile-first and verify at 320, 360, 390, 430, 768, 1024 and 1440 CSS px. Test unusually long names, empty and populated catalogues, one and multiple services, and all primary navigation actions.
- Compactness comes from removing redundant decoration and reorganising information—not shrinking text, hiding content or clipping it.

### Redesign architecture
- Establish/extend coherent design tokens and reusable components before broad screen styling. Avoid accumulating arbitrary CSS overrides or !important patches. When touching an existing screen, consolidate relevant rules and remove obsolete conflicting declarations where safe.
- Keep Store cards media-capable (image or short video), with full service/product name, complete description, fixed price or honest “Price on request”, and a clear action. An announcement may lead the visual composition when present, but its action must lead directly into the real catalogue and it must never obscure or replace product/service discovery.
- Keep Account focused on customer requests, status, next action and records. Keep the Briefcase focused on next actions, customers/jobs, money/records, Store controls and insights.
- Connectivity/offline status should be compact and collapsible; it must not dominate the screen. Preserve the protected PWA installation experience exactly unless the owner explicitly authorizes an install change.
- Treat weather as optional, collapsible contextual information only if a real supported data source and useful placement are verified. Never add decorative or non-functional weather controls.
- Distinguish browser-local demo behavior from real cloud persistence, analytics, messaging, payments, hosting entitlements and production security. Never imply cross-device sync or production readiness without evidence.

### Current redesign checkpoint
- Current customer-facing redesign target: the Store. Ordinary visitors enter the Store directly; owner identity setup remains a separate owner-only workflow.
- Delivery model: one screen at a time; owner QA between screens.
- Do not begin the next screen until the owner approves the current screen or supplies corrections.

## Storefront presentation guardrails — November 2026
- The Store header already carries the business identity. Do not repeat it as a breadcrumb such as “Business name / THE STORE”; use a simple section label without slash separators.
- Keep the Store introduction compact so the catalogue remains the primary customer action. Do not repeat availability in both the catalogue summary and every listing card.
- A single published listing is valid content, not a reason to fabricate a second offer. Present one item as a deliberate featured card; use a balanced grid only when multiple real listings exist.
- Announcements are optional and must never become a separate hero, campaign panel or introductory screen. When present, render the announcement as a slim, legible ribbon at the top of the first real product/service media area; keep the product image, name, full price and selection action visually dominant. If no announcement exists, render no empty announcement space. If announcement media fails, hide only the broken image while preserving the text; never expose browser alt-text fallback.
- The owner Briefcase is a persistent primary access point: keep its button fixed to the bottom edge of the customer Store on every viewport, above page content and browser safe-area insets. Reserve sufficient bottom content space so it never obscures product actions or customer content. Scrolling, notices, announcement content and responsive layout must never hide, cover or push it off-screen. Preserve its real owner-login action; do not replace it with a decorative preview.
- For storefront presentation changes that alter the offline shell, update the app-shell version in `src/app/page.tsx`, `public/sw.js`, and `scripts/verify-offline.mjs` together. Preserve the existing user-approved refresh lifecycle.


## Storefront art direction — November 2026
- Customer/visitor entry is the Store. Do not place a separate i13 welcome page, product introduction, onboarding screen or selection screen in front of the Store. Owner business-identity setup is a separate owner workflow; it must never intercept an ordinary visitor. Shared example URLs must carry the sample-launch flag so a first-time visitor is hydrated into the published example Store before rendering; test this in a clean browser profile.
- The business identity and real offering lead the customer experience. Keep i13 B.O.S. / Admin Hub attribution and technical/offline state as quiet supporting information, with clear wording when expanded. Do not make visitors decode “Business Preview” or confuse an app-shell cache status with cloud availability.
- Do not keep iterating the same generic hero + announcement strip + catalogue template when visual QA rejects it. Reconsider the composition, typography, image treatment, colour, depth, component language and motion—not just spacing and borders.
- The target is finished, art-directed product quality: confident editorial hierarchy, distinctive but readable typography, purposeful negative space, disciplined surfaces, high-quality real media, precise controls, meaningful micro-interactions and responsive composition. Do not equate premium with red/black colours, oversized gradients, excessive rounded cards, shadows or animation.
- The actual product/service is the Store's hero. Do not add generic marketing headlines, separate campaign heroes or introductory slogans. When an announcement exists, place it as a small supporting ribbon at the top of the first product image; never duplicate it elsewhere in the Store. If an announcement image fails, hide the broken image while retaining readable announcement text.
- When no announcement exists, let the collection lead immediately; do not insert a generic marketing headline just to fill space.
- The Store collection should foreground real service/product imagery, complete name, full price and the real next action. If no media is supplied, use a deliberate typographic/abstract brand treatment based on the actual item name, not repeated initials, emojis, indices or fake product photography.
- Keep internal/demo counters out of the customer storefront. Preserve selected-item persistence and the customer Account workflow; do not discard or reset a customer's selection merely to simplify the presentation.
- Keep the announcement and catalogue compact on mobile while giving the actual offer/product enough visual weight to feel intentionally art-directed. Respect reduced-motion and accessible contrast/focus states.
- Any storefront shell change must bump and synchronize the shell version in `src/app/page.tsx`, `public/sw.js`, and `scripts/verify-offline.mjs`; preserve the approved update/refresh lifecycle.


## Product-owner clarification — announcement control and Store banner placement (2026-11-15)
- The owner must have a clearly labelled, persistent **Show announcement in Store** toggle in Briefcase → Store controls. Turning it off hides the announcement without deleting its saved text or image; turning it on restores it. Saving edited announcement content and enabling/disabling publication are distinct operations. Existing saved announcements without the new flag remain visible on migration.
- In the customer Store, place an active announcement inside the existing **Available offerings** storefront banner, using that under-used banner space as a concise business notice. Do not overlay or obscure the first product/service image. Keep the offering image, full name, price and selection action visually dominant. When no announcement is active, render no announcement row or reserved blank space.
- Mirror the same active announcement placement in the Briefcase live Store preview. Treat it as a restrained editorial update row inside the Store collection heading: warm paper surface, subtle brand-tinted mark and separators, complete readable message, optional thumbnail. Do not render it as a detached pale card or let it compete with the offering. The announcement remains optional, local-demo persisted and excluded when inactive from customer-facing Store and shared example presentation.
- This clarification supersedes the earlier instruction to place the announcement as a ribbon over the first product image. Keep announcement content and image intact when toggled off.


## Product-owner clarification — Store banner placeholder and video sound (2026-11-15)
- The Store header always keeps the **Available now / Limited availability / Currently unavailable** status signal visible independently and persistently beside the Store heading. Its green signal dot remains the availability indicator and is not conditional on announcement publication.
- When an announcement is enabled and has text or an image, the announcement replaces **“Available offerings” in the Store heading area**. Do not show “Available offerings” above or below a published announcement, and do not render a second announcement block. When no announcement is active, show “Available offerings” in that same heading position.
- The announcement and its image remain one editorial heading treatment, with the persistent availability signal alongside it. Mirror the same single-slot replacement behaviour in the Briefcase live Store preview. Preserve saved announcement text and image when publication is disabled. Existing migration behaviour for saved announcements without an explicit publication flag remains intact.
- Mirror the same single-slot replacement behaviour in the Briefcase live Store preview. Preserve the saved announcement text and image when publication is disabled. The existing migration behaviour for saved announcements without an explicit publication flag remains intact.
- Store and live-preview videos autoplay muted, loop and play inline. The entire visible video/media frame—not only the speaker badge or its text—is the tap target. The hit area must cover the full media surface, including any overlaid placeholder text and labels; overlays must never intercept taps. A direct tap/click anywhere on the video toggles sound without pausing playback; tapping again mutes. Show a compact, legible sound-state indicator. Provide keyboard activation and preserve muted autoplay if audible playback is rejected by the browser. Do not expose native controls that turn a sound tap into a pause action.
- This is the active QA checkpoint: complete and verify Store banner replacement and video sound interaction first, then stop for product-owner QA. Do not start Setup (stage 3), Account or Briefcase until the owner approves this checkpoint. Setup is the next planned screen after approval.
- This clarification supersedes earlier instructions in this file that said to remove the announcement row when inactive or to leave no reserved banner space. The placeholder and published announcement occupy one shared slot, never two.
- Any Store shell change must synchronize the app-shell cache version across `src/app/page.tsx`, `public/sw.js`, and `scripts/verify-offline.mjs`; preserve the existing update/refresh lifecycle.


## Product-owner scope update — compact Setup before Account and Briefcase (2026-11-15)
- The owner has explicitly expanded the current implementation scope to include the previously planned Setup refinement. Complete the single Store announcement slot, full-frame video sound hit area, and compact owner Setup together, then push and stop for owner QA.
- Setup is a three-step, mobile-first flow: **01 Business identity** (business name, currency and up to three brand colours); **02 First customer offer** (required name, industry and fixed price); **03 Announcement** (optional and collapsed until opened).
- Description and product/service media are optional details inside a collapsed disclosure. Announcement copy and thumbnail controls are also collapsed until requested. Existing values remain in state and are indicated in the disclosure summary; collapsing never clears or omits saved values.
- Keep the form compact: no oversized marketing hero, excessive vertical gaps or second long-form app demonstration. The preview belongs in the collapsed disclosure attached to the saved-status / Continue row on both desktop and mobile; do not reserve a permanent preview column or move the form below a second app mockup. Keep required offer fields visible in one compact row where width permits.
- Keep required offer fields visible and compact. Keep the live preview to a concise identity strip, Store / Account / Briefcase labels, one first-listing preview and the brand palette. Place it inside a native, keyboard-operable disclosure in the same compact row as the saved-on-device status and Continue action; it is collapsed by default and must not occupy a permanent second column or push the form below a duplicate app mockup.
- Keep setup typography readable: the business name and “at work.” form one high-contrast headline independent of the chosen accent hue. Use the accent for a decorative underline/surface rather than low-contrast text. Keep ordinary labels and supporting copy at 14px or larger, inputs at 16px, and metadata secondary but legible. On mobile, let the status, preview disclosure and Continue action wrap without horizontal scrolling.
- Preserve currency choices, one-to-three colour selection/custom colour, service creation, UploadThing media flow, announcement draft/image flow, local save, edit and overwrite confirmation behavior. Do not weaken required-field validation or change the local-only data contract.
- Store heading and availability status share one header row at mobile widths. The announcement replaces the heading in that row; availability remains visible beside it. Do not render a second announcement row or stack the status beneath the heading.
- For video, the complete visible media frame is the interactive target. Overlay text, badges and placeholder layers pass pointer events through; keep muted autoplay, loop, inline playback and keyboard activation; do not add native controls.
- Setup visual direction: Quiet is dominant because owners are identifying their business and entering essential information; Data is the secondary influence for currency, pricing and the operationally connected Store / Account / Briefcase preview. Use a light neutral workspace, high-contrast ink typography, restrained borders, one brand-accent underline and clear selected states. Avoid oversized campaign styling, tiny uppercase labels and competing card stacks. The WashRide reference contributes immediate brand recognition, strong hierarchy and an obvious primary action, not its dark car-wash palette or literal hero composition.
- This scope ends after Setup. Customer Account and owner Briefcase redesign remain deferred until the owner has QA'd and approved this checkpoint.
- Synchronize app-shell cache version across `src/app/page.tsx`, `public/sw.js` and `scripts/verify-offline.mjs` whenever Store changes alter the shell.


## Owner setup completion and action hierarchy (2026-11-15)
- Keep the live Preview collapsed and attached to the saved-device / Continue row. Its Store, Account, Briefcase, first listing and palette remain inside the disclosure; do not turn it into a permanent tall panel.
- Show truthful live **x/4 ready** progress for four essentials: business name, pricing currency, at least one brand colour, and a valid first offer (name, industry and price). Announcement is optional and never blocks setup.
- Clearly mark each essential and explain what remains. The final Create my Business OS action is the single dominant, full-width primary action; disable it until all four essentials are ready. Keep browser-local persistence wording adjacent and honest.


## Opening choice and continue-business flow — November 2026
- Keep the existing opening-screen layout and **01 Build my Business OS** setup path.
- **02 Continue Your Business instead** resumes the owner's existing business from the original browser-local storage keys.
- Do not create, seed, route to, or substitute any invented sample business or alternate exploration workspace.
- Load the saved business identity, catalogue, uploaded media URLs, announcement, customer requests, Account records, owner Briefcase notes and activity from their existing keys without reseeding, replacing or resetting them.
- Continue must preserve the existing workspace and remove only obsolete launch query parameters from the URL; it must not migrate, clear or overwrite browser-local records.
- Verify the existing workspace resumes unchanged, new requests still appear in Account and owner Briefcase, and the setup path remains independent. Keep Setup as the current QA checkpoint; do not redesign Account or Briefcase.
