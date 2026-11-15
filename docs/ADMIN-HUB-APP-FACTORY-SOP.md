# Admin Hub App Factory SOP

**Purpose:** govern how a new Admin Hub/customer-facing PWA is selected, cloned, reset, adapted, verified and handed off. This SOP is reusable across industries; it does not prescribe one visual theme or one source application.

## 1. Authority and source selection

The product owner is the final decision-maker and chooses the source repository for each new project.

1. **Explicit source wins.** If the product owner names a repository or an existing portfolio app, use that exact source. Do not silently substitute another source.
2. **Default only when unspecified.** If no source is named, use `gatshaayanda/africhiko` as the default starting point for new customer-facing PWAs and Admin Hub apps.
3. **Recommend only when asked.** Inspect relevant accessible repositories and compare industry fit, customer journey, staff/admin workflows, architecture, data model, authentication, uploads, integrations, protected behavior, visual quality and adaptation effort. State the recommendation and material risks before cloning.
4. **Iteration 13 is the standards reference.** Use this repository for engineering standards, protected PWA rules, accessibility, verification, recovery and documentation patterns. Do not clone it by default.
5. **Existing app means in-place work.** Inspect and improve the existing repository. Do not reclone or replace it merely to obtain a different foundation.

The product owner’s latest explicit instruction overrides portfolio defaults. If a source is named but appears unsuitable, explain the evidence and ask before substituting it.

## 2. Required workflow

### New project

`START → INSPECT SELECTED SOURCE → INSPECT TARGET → CLONE → CONNECT NEW REMOTE → PUSH CLEAN BASELINE → READ SOP → RESET IDENTITY/INFRASTRUCTURE → VERIFY → IMPLEMENT BRIEF → VERIFY → CHECKPOINT`

### Existing project

`START → INSPECT → UNDERSTAND → IMPLEMENT IN PLACE → VERIFY → CHECKPOINT`

### Unexpected result

`STOP → INSPECT ACTUAL STATE → IDENTIFY FIRST PROVEN FAILURE → FIX → VERIFY`

Do not skip source inspection, target-remote inspection, protected-feature inventory or the baseline checkpoint. Keep investigation proportional; do not repeat checks already established unless state has changed.

## 3. Start and inspect

Before cloning or editing:

- Confirm whether the task is a new project or an existing project.
- Identify the exact source repository, default branch and current commit.
- Read source `AGENTS.md`, README, cloning/setup docs and relevant SOPs.
- Inspect the actual route tree, customer journey, staff/admin journey, authentication, data model, uploads, integrations, service worker, PWA install flow, chatbot, offline behavior, tests and deployment configuration as relevant.
- Identify protected files/features and known limitations. A feature described in documentation must be confirmed in code before it is promised.
- Inspect the target repository and local destination. Never overwrite an existing implementation or a non-empty remote.
- Record what should be reused, what must be replaced, what must be omitted and what requires a product-owner decision.

Use other portfolio repositories only as targeted references for a relevant proven capability. Do not turn reference inspection into an unnecessary full-portfolio audit.

## 4. Clone and establish a clean baseline

- Clone the selected source into the intended empty local directory.
- Verify the checked-out branch and source commit.
- Change the working copy's remote to the new client repository.
- Inspect the target remote before pushing. If it contains commits or files, stop and reconcile; never force-push or overwrite.
- Push the clean inherited baseline to the target `main` only after confirming the destination is safe.
- Record source repository/commit, target repository, target branch and baseline commit in the target project's documentation.

Preserving source history is normally preferred. Do not remove history or rewrite it unless explicitly approved and safely justified.

## 5. Create the target project's operating contract

Before substantial feature work, create or update the target root `AGENTS.md`. It must describe the actual target, not generic aspirations:

- Product identity, audience and source lineage.
- Current branch/repository and latest verified checkpoint.
- Architecture, routes, important components and data flows.
- Customer journey and staff/admin workflows.
- Authentication, authorization, ownership and privacy boundaries.
- Persistence model, uploads, notifications and external integrations.
- Environment variables and setup/configuration still required.
- PWA installation behavior and protected implementation files.
- Chatbot/assistant behavior and protected implementation files, if present.
- Offline/service-worker/cache behavior and protected files, if present.
- Known limitations, unfinished workflows and explicit non-goals.
- Commands for focused verification and release reporting.
- Golden/protected features that must not be changed without authorization.

Carry forward the selected source's actual protected behavior and the product owner's permanent requirements. If the selected source lacks an approved installation or chatbot pattern, do not claim that it has one or silently graft in another project's implementation. Flag the mismatch and obtain approval before replacing protected behavior. Update the target AGENTS file when architecture, protected behavior, decisions or verified checkpoints materially change.

## 6. Reset identity and infrastructure

Use `docs/CLONE-RESET-CHECKLIST.md` as the execution checklist. Reset all inherited business identity and project-specific infrastructure consistently, including:

- Names, logos, icons, favicons, Apple assets, manifest and theme colors.
- Page metadata, canonical/base URLs, social cards, visible copy, alt text and contact details.
- Routes, seeded/demo content, prices, services/products, testimonials and media.
- Service-worker cache names, local/session-storage keys and app-specific namespaces.
- Firebase project identifiers, OAuth domains, API endpoints, upload endpoints, analytics IDs, push configuration and deployment identifiers.
- Environment examples, scripts, tests, identity assertions, README and project documentation.

Never carry another business's credentials, private data, customer records, secrets, production database, Firebase project, UploadThing token, analytics identifier or Vercel project into the new client. Do not make storage/database public to bypass configuration errors.

Use UploadThing when required by the brief or existing approved architecture. Do not introduce Firebase Storage rules or migrate uploads to Firebase Storage as an assumption. The product owner configures Firebase with assistance; identify the required variables, collections, rules and console steps without derailing implementation with premature setup.

## 7. Preserve protected capabilities

### PWA installation

The approved Africhiko installation experience is the permanent reference standard for new projects: compact branded dismissible card, native `beforeinstallprompt` lifecycle and user-triggered native prompt, correct embedded-browser handling, iOS Share → Add to Home Screen guidance, and non-blocking behavior.

For projects that already carry this approved pattern, preserve its actual implementation and behavior. Change identity and assets only unless the product owner explicitly authorizes a specific mechanics change. Do not fake a native prompt, show dead install CTAs, add generic desktop/Android browser-menu instructions, duplicate listeners, or replace a working flow.

Before copying this pattern into a source that does not have it, inspect both implementations and ask for approval if it means replacing or materially changing existing protected behavior. Preserve service-worker/cache/offline behavior and run the target's actual invariant checks.

### Chatbot / guided assistant

Preserve the selected source's existing chatbot implementation and behavior. For a new project based on Africhiko, adapt branding, copy and project-specific actions without replacing its behavior or removing capabilities. Connect actions to real target handlers; do not invent AI, live-agent, remote inbox or backend capabilities. If the chosen source has no chatbot or has a materially different protected assistant, document that fact and ask before grafting or replacing one.

### One-word staff/admin access

When the product owner requests one-word staff/owner login, the required environment variable is **always exactly `ADMIN_PASSWORD`**. This is permanent across Iteration13 and every app/chat following this SOP. Never invent, substitute, rename, alias or reuse another key (including `THE_PLUG_OPERATIONS_WORD`, project-specific names or any variant). Never make the product owner troubleshoot a newly invented environment variable.

The sole public admin entry point is **one clickable 💼 briefcase icon only**, in the footer. It opens the owner access screen. Do not add Login/Admin/Staff navigation, text labels, arrows, extra buttons or alternate admin entry points. Give the icon an accessible name/title and a working click handler. The access screen contains one access-word field and one submit action—no email, username, second credential, invitation or customer account journey.

- Configure and read the server-only `ADMIN_PASSWORD` exactly. Document that exact key in `.env.example` with an empty value and in setup instructions. Never commit the secret or expose it in client code or a `NEXT_PUBLIC_` variable.
- Validate the submitted word server-side against `process.env.ADMIN_PASSWORD`. Fail closed with a clear configuration error if it is missing. Never fall back to a hard-coded word or another environment key.
- Do not create/provision a staff Firebase email/password account, deterministic internal email identity, invitation, custom token or second credential. Do not require Firebase Auth provider setup or a staff email unless the product owner explicitly changes the requirement.
- Reuse the target app's existing customer/session identity mechanism where compatible, keeping customer access and staff authorization separate. After validation, grant staff access through the smallest secure, expiring session/authorization mechanism supported by the actual architecture.
- Enforce staff authorization at server handlers and database security-rule boundaries; hiding admin UI is not authorization. Sessions must expire and invalid/expired sessions must fail closed. Do not weaken data ownership or customer access rules.
- Inspect the actual login route, session lifecycle, authorization checks, security rules and environment configuration before changing them. Keep `ADMIN_PASSWORD` unchanged when adapting another app. If the target architecture cannot safely validate it server-side, explain the concrete blocker and ask before changing authentication design—never silently substitute another key or mechanism.
- Initialize Firebase Admin only if the target's actual server-side operations require it. Never reuse another project's credentials or add unrelated mandatory infrastructure.
- Test correct/incorrect word, missing `ADMIN_PASSWORD`, expired session, unauthorized access and the complete staff workflow. Never claim login works until the actual flow is verified.

**Required outcome:** one 💼 footer icon → one access-word field → authorized owner workspace. The only environment key for one-word login is `ADMIN_PASSWORD`.
### Other protected functionality

Preserve proven customer journeys, authentication, booking/order flows, uploads, offline behavior, games, admin CRUD and other golden features unless the brief explicitly authorizes a change. A branding-only task does not authorize workflow rewrites.

## 7A. Design intelligence handoff

Before substantial visual implementation or redesign, read [docs/DESIGN-INTELLIGENCE-AND-EXPERIENCE-QUALITY-STANDARD.md](./DESIGN-INTELLIGENCE-AND-EXPERIENCE-QUALITY-STANDARD.md) from Iteration 13 and apply it within the target project's own `AGENTS.md` and design system. Select a justified dominant visual genre, research relevant task flows, inspect existing tokens/components before changes, and verify the rendered result at mobile and desktop sizes. For substantial products, provide a development-only rendered design-system showcase where practical. Adapt the standard to the target stack; do not add shadcn, Expo, Rive or other dependencies solely because they are referenced. Preserve proven source behavior and existing design direction unless evidence supports a change.

## 7B. Mandatory design genre and project direction gate

This checkpoint applies to **every new app** and every **material visual/experience update** to an existing app. It must be completed before substantial screen implementation; do not treat it as optional inspiration or leave it to be inferred from screenshots after the UI is built.

### Required decision

1. Understand the supplied business brief: what the business does, who it serves, its positioning, the customer's primary journey, staff/owner tasks and real operating constraints. Verify what is already established in the target repository.
2. Choose one dominant genre from the five canonical art-direction lenses:
   - **Quiet** — restrained, calm, legible confidence.
   - **Character** — distinctive personality, warmth and expressive interaction.
   - **Atmosphere** — immersive imagery, depth, lighting and emotional composition.
   - **Data** — operational precision, information hierarchy and useful density.
   - **Loud** — high-impact promotional energy and strong visual statements.
3. Write a short rationale connecting the dominant genre to the business, audience and primary tasks. Name any secondary genre expressions and the specific surfaces/tasks where they belong. These five lenses are useful and consistent vocabulary, not an exhaustive taxonomy or fixed templates.
4. Translate the decision into a concise project-specific design-direction brief covering identity/positioning, typography and hierarchy, colour/surfaces, imagery, composition/density, motion/interaction, accessibility/performance constraints, and relevant product/task-flow references.
5. Record the decision in the target project's `AGENTS.md` and `DESIGN.md` (or an equivalent existing design-system document) before substantial UI work. Do not create duplicate competing design systems.

### New app versus existing app

- **New app:** complete the business understanding and genre decision after inspecting the selected source/foundation but before designing/building substantial customer or admin screens. The direction must be specific to the new business, not inherited blindly from the foundation.
- **Existing app / update:** inspect its current visual direction, tokens, components and proven customer/staff journeys. Preserve the established direction for local fixes. For a material redesign or changed audience/positioning, deliberately confirm or revise the genre and document why. Never redesign an existing app merely because another genre is fashionable.
- **Every update:** check the affected screen and adjacent journeys against the recorded direction. A small copy, spacing or defect fix does not require a new genre workshop; it must still respect the established design system.

### Apply it across the whole product

The genre is not a homepage skin. Apply the project direction to the complete relevant journey: public Store/landing, service/product discovery, request/booking/order, customer Account, staff/owner Briefcase, records/receipts, notifications and meaningful states. Secondary expressions may vary by task (for example, Quiet customer details + Data operational queue + Loud campaign announcement) while shared identity, tokens, components, accessibility and interaction conventions remain coherent.

### Stop/go and verification

Do not begin substantial visual implementation until the dominant genre, rationale and secondary expressions are recorded. If the business brief lacks a genuinely essential decision, make an evidence-based recommendation and ask one focused question rather than inventing the answer. During QA, verify that the rendered screens and real interactions express the selected direction without sacrificing task clarity, readability, accessibility, performance or business truth. Follow [DESIGN-INTELLIGENCE-AND-EXPERIENCE-QUALITY-STANDARD.md](./DESIGN-INTELLIGENCE-AND-EXPERIENCE-QUALITY-STANDARD.md) for the full definitions, research method, design-system discipline and review checklist.

## 8. Product and visual implementation standard

Read [VISUAL-DIRECTION-STANDARD.md](./VISUAL-DIRECTION-STANDARD.md) before visual planning or visual QA, and open the canonical `docs/assets/washride-home-reference.jpeg` image itself. Read [OPERATIONAL-TRANSPARENCY-STANDARD.md](./OPERATIONAL-TRANSPARENCY-STANDARD.md) when designing meaningful workflows and their loading, progress, status, activity and outcome communication. Both standards apply together: visual craft makes the product inviting; operational transparency makes its real value understandable. Apply consistent craftsmanship, not a universal theme:

- Mobile-first responsive layout and industry-appropriate identity.
- Deliberate typography, hierarchy, spacing, imagery, icons and component consistency.
- One clear primary action per screen; secondary content progressively disclosed.
- Compactness across the entire product: homepage, booking/order flows, customer accounts and staff/admin workspaces. Use concise headers, compact task-focused cards/rows, grouped forms and scannable admin data. Do not reserve compactness for the homepage or make inner pages oversized and scroll-heavy.
- Accessible labels, readable contrast, visible keyboard focus, sensible touch targets and reduced-motion support; use WCAG 2.2 AA as the baseline.
- Real loading, empty, validation, error, pending, success and offline states.
- Genuine operational transparency across relevant journeys: show real searches/checks, saves, uploads, reviews, assignments, processing and outcomes; make customer and staff status views consistent and actionable.
- Working end-to-end customer and staff/admin actions, not decorative or fake CRUD. Progress and activity must be driven by actual operations, never staged or fabricated.
- Use modals, expandable details and truncation where they reduce clutter without hiding essential information.
- Do not invent business claims, testimonials, prices, availability, payment status, partners or social proof.
- Research the actual industry and audience before choosing navigation, account extras, interaction metaphors or content hierarchy. Record only decisions that materially affect the product.

## 9. Integrations and data integrity

- Preserve working integrations; configure only what the brief requires.
- Implement authentication and authorization at the correct server/security-rule boundary. UI hiding is not authorization.
- Enforce customer record ownership and staff/admin access.
- State whether data is browser-local, server-persisted, cross-device or offline-queued; never imply capabilities that are not implemented.
- Validate uploads, size/type limits, access policy and failure states.
- Do not reuse source environment values, IDs, credentials or production data.

## 10. Verification and checkpoint

Review the complete diff against the task and protected-feature inventory. Run only relevant checks, inspect actual output, and fix the first proven failure. Verify:

- Customer journey and all requested primary actions.
- Staff/admin CRUD and authorization.
- Mobile layout, keyboard access, focus, contrast and reduced motion.
- Loading, empty, error, pending, success and offline states, including meaningful progress and a clear outcome/next action.
- Operational transparency: verify visible stages against real handlers/data, truthful status transitions, customer ↔ staff consistency, activity history where consequential, privacy/authorization and honest local/offline/integration boundaries.
- Identity reset: no unintended source names, icons, IDs, domains or sample business content.
- Installation and chatbot behavior, where present, against the target's documented protected baseline.
- Data ownership, uploads and integration boundaries.
- Build/test/CI and deployment status separately.

Push focused changes only when authorized. The product owner handles Vercel unless explicitly delegated. A GitHub push is not proof of deployment. The target AGENTS/checkpoint must report repository, branch, commit, files changed, checks actually run, push/deployment status, remaining configuration and exact QA steps.
