# New Project Clone and Identity Reset Checklist

Use this checklist with [CLONING.md](../CLONING.md) and [ADMIN-HUB-APP-FACTORY-SOP.md](./ADMIN-HUB-APP-FACTORY-SOP.md). Check only what applies, but do not skip source/target safety, identity, protected behavior or checkpoint documentation.

## A. Project and source decision

- [ ] Confirm this is a genuinely new project; if an existing app, work in its current repository.
- [ ] Record the exact target repository and intended local directory.
- [ ] Record the exact source repository selected by the product owner.
- [ ] Select Iteration 13 for Business OS or Iteration 14 for Personal OS; do not use a finished client project as an implicit default.
- [ ] If asked to recommend a source, compare relevant portfolio apps and document industry/workflow/architecture/integration/protection trade-offs before cloning.
- [ ] Treat Iteration 13 as the maintained Business OS foundation and Iteration 14 as the maintained Personal OS foundation.
- [ ] Inspect source branch, latest commit, AGENTS, README, SOPs, package scripts, routes, customer/admin flows and relevant implementation.
- [ ] Inventory source architecture, data model, auth, uploads, integrations, PWA install, chatbot, service worker/offline behavior, tests and protected features.
- [ ] Inspect the target GitHub remote and local destination. Confirm both are safe/empty before baseline push; stop if either contains work.

## B. Clone and baseline

- [ ] Clone the selected source into the intended empty local directory.
- [ ] Verify source branch and commit.
- [ ] Set the new client repository as the working copy's `origin`.
- [ ] Confirm target remote contents and branch before pushing.
- [ ] Never force-push, delete remote history or overwrite an existing project.
- [ ] Push the clean baseline to target `main` when safe.
- [ ] Record source lineage and baseline commit in the target `AGENTS.md`.

## C. Target AGENTS and documentation

- [ ] Create/update root `AGENTS.md` before substantial implementation.
- [ ] Record product identity, audience and selected source lineage.
- [ ] Record actual architecture, routes, components and data flows.
- [ ] Record customer journey and staff/admin workflows.
- [ ] Record auth, authorization, customer ownership and privacy boundaries.
- [ ] Record database/persistence, upload, notification and integration design.
- [ ] Record required environment variables and manual configuration.
- [ ] Record actual PWA install behavior and protected files, if present.
- [ ] Record actual chatbot/guided assistant behavior and protected files, if present.
- [ ] Record service-worker, cache, offline and update behavior, if present.
- [ ] Record golden features, known limitations, unfinished workflows and non-goals.
- [ ] Record focused verification commands and current checkpoint.
- [ ] Do not claim inherited features that source inspection did not verify.

## D. Product genre and visual direction gate

- [ ] Understand the actual product, audience, positioning and primary customer/staff tasks before selecting a direction.
- [ ] Select one dominant genre: Quiet, Character, Atmosphere, Data or Loud, and record the project-specific rationale.
- [ ] Select secondary stylistic influences deliberately and assign them to the customer and operational journey.
- [ ] Record typography, hierarchy, colour/surface, imagery, density/composition, motion, interaction and accessibility/performance constraints in target `AGENTS.md` and `DESIGN.md` before substantial UI work.
- [ ] Apply the direction across landing/store, request/account, owner/staff workspace, receipts and important states—not just the homepage.
- [ ] Inspect the rendered mobile and desktop experience for readability, contrast, CTA clarity and state feedback.

## E. Business and visual identity reset

- [ ] Business/product name, short name and descriptions.
- [ ] Logos, brand marks, favicon, app icons and Apple touch assets.
- [ ] Manifest name/short_name, theme/background colors, start URL, scope and icon paths.
- [ ] Page title/description, metadata, canonical URL and Open Graph/social preview.
- [ ] Visible copy, headings, CTA labels, contact details, email/phone/WhatsApp and legal links.
- [ ] Image/video assets, alt text, placeholders and media fallbacks.
- [ ] Routes, navigation labels, breadcrumbs and deep links.
- [ ] Seeded services/products, categories, prices, testimonials, announcements and demo records.
- [ ] Remove source business names, client-specific content and misleading sample claims.
- [ ] Update README, AGENTS, setup docs, scripts, tests and identity-verification assertions.

## E. Infrastructure and isolation reset

- [ ] Inspect and replace Firebase project IDs/configuration only with the approved target project's values.
- [ ] Verify OAuth authorized domains, redirect URLs and provider settings.
- [ ] Review Firestore collections, rules, indexes and customer/staff authorization boundaries.
- [ ] Preserve UploadThing architecture when required; configure new project credentials/endpoints, never reuse another project's tokens.
- [ ] Do not add Firebase Storage rules or migrate to Firebase Storage by assumption.
- [ ] Replace analytics IDs, monitoring DSNs, push/messaging identifiers and notification endpoints.
- [ ] Replace API base URLs, webhook destinations, calendar/payment/email integrations and callback URLs.
- [ ] Replace Vercel project/deployment identifiers and domain configuration; do not inherit another project's deployment target.
- [ ] Replace service-worker cache namespaces and app-specific localStorage/sessionStorage/IndexedDB keys.
- [ ] Review package scripts, GitHub Actions, scheduled jobs and external service hooks.
- [ ] Remove secrets from tracked files; use documented environment variables and least privilege.
- [ ] Confirm no source customer's records, credentials, private assets or production data remain.

## F. Protected functionality and feature adaptation

- [ ] Compare source install behavior with the selected foundation's protected installation baseline.
- [ ] Preserve the selected source's existing approved install runtime; rebrand only unless a specific change is authorized.
- [ ] If source lacks the approved install pattern or has a conflicting protected implementation, stop and obtain approval before replacing/grafting.
- [ ] Preserve the selected foundation's chatbot/assistant behavior and adapt only identity and real project actions without replacing its behavior.
- [ ] If the source has no chatbot or a materially different protected assistant, document the mismatch and ask before grafting/replacing.
- [ ] Preserve proven customer journey, admin CRUD, authentication, uploads, offline behavior, games and other golden features.
- [ ] Remove unrelated source features only after confirming they are not dependencies or protected behavior.
- [ ] Confirm every new feature has a real handler, persistence path and truthful feedback; no dead buttons or fake CRUD.

## G. Verification

- [ ] Review the complete diff and investigate all protected-file changes.
- [ ] Search all tracked files for source names, slogans, domains, URLs, Firebase IDs, storage paths, notification secrets, icon names, sample products/prices, contact details and source-specific scheduled workflows.
- [ ] Run relevant type, lint, test, identity and build checks; record actual output.
- [ ] Inspect the built/served manifest and referenced icon/media paths when PWA identity changes.
- [ ] Verify customer flow and staff/admin flow end to end.
- [ ] If staff access is one-word, verify the single-field experience, server-only secret, proven session mechanism, expiry, rules/handler authorization and failure cases against the One-word staff/admin access SOP.
- [ ] Verify authorization and customer record isolation.
- [ ] Verify upload success, rejection, size/type limits and offline messaging.
- [ ] Verify loading, empty, error, pending, success and offline states.
- [ ] Verify responsive mobile/tablet/desktop, keyboard focus, contrast and reduced motion.
- [ ] Verify install behavior on supported browsers/devices when physical QA is available.
- [ ] Verify chatbot actions reach real target workflows and remain optional.
- [ ] Check CI and deployment separately; do not infer deployment from push/build.

## H. Handoff and checkpoint

- [ ] Record source repo/commit and target repo/branch/commit.
- [ ] Record changed files and implemented customer/admin workflows.
- [ ] Record checks actually run and results.
- [ ] Record push status and deployment status separately.
- [ ] List outstanding Firebase/UploadThing/domain/third-party configuration.
- [ ] List physical-device, browser, payment, notification and offline QA still required.
- [ ] Give exact concise QA steps.
- [ ] Update target `AGENTS.md` with the latest verified checkpoint.
