# Iteration 13 — Reusable PWA Foundation Contract

## Fast handoff for future implementation chats
- **Golden baseline:** [GOLDEN-BASELINE.md](./GOLDEN-BASELINE.md) records protected behavior, recovery policy and new-project adaptation steps. Do not casually move or develop on the golden reference branch.
- **Installation lock:** [docs/PWA-INSTALLATION-LOCK.md](./docs/PWA-INSTALLATION-LOCK.md) is mandatory before any PWA/install change and must be carried into every clone. Installation behavior is frozen during routine identity, styling and feature work.
- **Cloning default:** this repository now supersedes The Plug as the default starting point for new customer-first PWA projects in this portfolio, unless the product owner explicitly chooses another foundation. Existing projects must be inspected and improved in place.
- **Mandatory first read:** [START-HERE.md](./START-HERE.md). Every new implementation chat must start there and follow its reading order; never ask the product owner which docs to inspect.
- Then read FOUNDATION-BLUEPRINT.md, README.md, and CLONING.md as directed by START-HERE. These files serve different purposes; do not substitute chat summaries for them.
- Read CHAT-WIDGET-RESEARCH.md before adding a chat helper. The current deterministic adaptation lives in src/app/ServiceGuide.tsx; that file separates the Sparkle Legacy reference from research-backed recommendations.
- Before claiming a fix is complete, run the repository's available checks, inspect their actual output, and verify the exact commit/deployment state. A GitHub edit or merge alone is not a build verification. Never weaken or remove install regression checks to make a build pass.
- README is the customer/admin demo walkthrough. Do not assume an earlier conversation summary is newer than the repository.
## Purpose
Iteration 13 is the reusable, customer-first PWA prototype and candidate foundation for future projects. It demonstrates responsive customer journeys, browser-local demo workflows, installation, iPhone guidance, offline behavior, and staff/admin patterns. The service catalogue is sample content, not a real business offering.

## Source of truth and workflow
- Product owner / final reviewer: the user. Implementation: ChatGPT.
- GitHub is the source of truth. Inspect the actual branch, latest commit, working tree, instructions, routes, service worker, install code and tests before changing them.
- Existing project workflow: START → INSPECT → BUILD → VERIFY → CHECKPOINT. Keep inspection proportional; do not endlessly re-audit a repository whose context is established.
- Unexpected result: STOP → inspect actual state → identify the first failure → fix → verify.
- Preserve successful behavior. Prefer focused changes over rewrites. Never claim a test, deployment, device test, offline write or Firebase workflow passed without evidence.
- When authorized, push changes to `main`. The user handles Vercel deployments unless explicitly delegated.

## Reusable product principles
- Customer action first. Make the next step obvious, reduce unnecessary navigation, and keep copy concise.
- Mobile-first, accessible, legible UI; WCAG 2.2 AA contrast is the baseline. Verify keyboard focus, narrow layouts, empty/error/loading states and touch targets.
- Real workflows over decorative controls. Validate forms, persist state, expose useful feedback, and make admin changes visible to the customer view. Use visible press/focus states and accessible, dismissible toasts for meaningful outcomes; never claim a local write succeeded unless localStorage accepted it. Avoid JavaScript alert/confirm for routine UX.
- Keep account creation proportionate. Let customers explore before requesting credentials unless a real product requirement demands otherwise.
- Minimize Firebase reads/writes. Do not change Firebase config, rules, collections or production data without explicit instruction.
- Keep demo data, project-specific requirements and unverified ideas distinct. Local browser storage is not shared persistence, authenticated access, a server database or cloud synchronization.

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
- Preserve conservative dismissible teaser behavior, mobile safe areas/dynamic viewport, keyboard/Escape support, reduced-motion styles, session-only history and truthful local/offline wording.
- In a new project, replace demo labels and actions with project-specific workflows, verify authorization for admin actions, and only add network/AI/human handoff integrations when explicitly designed and genuinely implemented.


## Customer account workspace adaptation contract

- The reusable account implementation is `src/app/AccountWorkspace.tsx`, integrated with `src/app/page.tsx`. Preserve and build on its useful account-holder capabilities: request/order history and status, email filtering, project-specific progress/gamification, a lightweight journal, a per-request customer ↔ admin conversation, and image/video/PDF attachments where the target project's upload rules allow them.
- For every new project and every existing project whose account is being improved, inspect that project's real customer journey, data model, authentication, staff/admin workflow, upload endpoints, offline strategy and privacy/security rules first. Then research the target product and audience online before choosing account extras, interaction metaphors, terminology, hierarchy or visual treatment. Use primary product sources and credible UX research (for example, Baymard's account/dashboard consistency guidance) where relevant; cite/record useful findings in project docs. Replace Iteration 13 labels, sample services, journal prompts, status names and helper copy with the target project's own context. Do not transplant a spa garden, game, prices, treatments, customer messages or business-specific content unchanged. Theme-specific extras are optional: choose something genuinely useful for this product, or omit gamification entirely.
- The account should help a customer take the next useful step: see their own history, understand status versus confirmation, message the responsible team on a specific request, share relevant files, and return to supported project-specific extras. Keep sign-in proportionate and never reveal another customer's records.
- In this prototype, request data, conversation messages, statuses, garden progress and journal notes are browser-local. Customer and admin communication is a same-browser demo thread only; it is not email, live chat, a remote inbox, or cross-device sync. File attachments upload to UploadThing only while online (images/PDFs max 4 MB; videos max 16 MB); they are not queued offline. Never claim otherwise.
- When adapting to a real production app, replace local-only account state with a verified authenticated data path, enforce ownership and staff authorization at the server/security-rule boundary, and connect messages/notifications to a real team inbox only when the backend and delivery path are implemented and tested. Do not weaken security rules or expose all requests to make the UI work.
- Keep optional account extras and their data collection proportionate. Gamification should be playful and project-specific, never a misleading health, performance or customer-worth score. Journal privacy and retention must be stated truthfully.
- Verify customer-created messages/files are visible to the authorized staff workflow, staff replies/status changes return to the correct customer view, invalid/oversized files fail clearly, and offline text/local-state behavior is distinct from online upload or remote delivery. Update `README.md` and `CLONING.md` with any project-specific limits.
