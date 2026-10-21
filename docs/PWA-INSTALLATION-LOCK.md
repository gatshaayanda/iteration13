# Installation Lock — Protected PWA Infrastructure

This contract is mandatory for Iteration 13 and every project cloned from it. Installation is a proven, customer-facing capability, not a design surface to reinvent during routine development.

## The only allowed adaptation

For a new brand, change the app name, artwork/icons, manifest identity, theme colours, and visual styling around the existing install action. Keep the installation state machine and browser integration intact. Do not change install behavior to make a brand look different.

Protected runtime responsibilities:
- Capture `beforeinstallprompt` as early as possible, retain the one-shot event, and call `prompt()` directly in the user's explicit branded Install click.
- Render the desktop/Android install action only while a valid retained native prompt is available. Do not render an install help modal, generic browser-menu instructions, or a dead button when it is unavailable.
- iOS/iPadOS Safari gets platform-specific Share → Add to Home Screen guidance; do not show this guidance to desktop or Android users.
- Respect installed/standalone state. Do not trap visitors in a modal, auto-open install instructions, or replace the native prompt with a simulated prompt.
- Keep exactly one authoritative install controller. Do not add competing listeners, duplicate install buttons, or parallel install modals.
- Preserve embedded-browser handoff only where the product requires it; it must not become a generic installation fallback.
- Keep service-worker registration, update handling, cache namespacing, offline behavior, manifest and icon declarations coherent. If a stale install screen is suspected, inspect the deployed commit and service-worker caches before changing the install state machine.

## Forbidden regressions

These are release blockers:
- “If your browser provides a native install prompt”
- “Chrome install option”
- “If neither option appears, Chrome has not marked this site installable”
- generic Chrome/Edge menu instructions presented as a replacement for the native install prompt
- custom desktop/Android install explainer screens when the native prompt is unavailable
- fake native prompts, auto-opening install dialogs, or buttons that do nothing
- rewriting install runtime code as part of icon, colour, typography, layout, copy or catalogue work

## Required verification on every clone/change

1. Read this file and inspect the current source implementation before touching PWA files.
2. Keep the install invariant checks in `scripts/verify-identity.mjs`; extend them if the controller or UI architecture changes. Do not delete or weaken the guard to pass a build.
3. Run `npm run verify:identity`, lint and build. Inspect the actual served manifest and icon URLs.
4. Verify desktop Chromium with the native prompt available and unavailable, Android Chrome, and iPhone/iPad Safari separately. Confirm the branded click opens the browser-owned prompt directly where supported.
5. If the wrong screen appears despite clean source checks, compare the deployed commit to GitHub `main`, inspect the active service worker/cache and hard-reload/update behavior. Do not assume a source edit reached production.
6. Report source commit, build/deployment state, and physical-device QA separately. Never claim browser/device verification without evidence.

The golden branch remains a recovery snapshot. Do not move it during ordinary work; promote a new golden baseline only after explicit owner review.


---

## Product-owner mandated installation standard — permanent, non-negotiable

**Reference implementation:** The currently approved Africhiko PWA installation experience in `gatshaayanda/africhiko`, as verified against its actual repository state.

### 1. The rule

Reproduce the approved Africhiko installation experience in each project, changing only the brand identity, application name, icons, colours and other genuinely project-specific assets.

**The installation mechanism, behaviour, lifecycle and user experience are protected. They are not to be redesigned, rewritten, replaced, simplified, “improved”, refactored or removed unless the product owner explicitly authorizes that specific change.**

This instruction applies to every developer, AI coding agent, automated tool, dependency update and future feature implementation.

### 2. Required installation experience

- Provide a compact, branded, dismissible installation card.
- Use a clear, project-branded **Install [App Name]** action.
- On supported browsers, retain the native `beforeinstallprompt` event and invoke its native installation prompt directly from the user's click on the installation button.
- Keep the existing install function, event handling, prompt lifecycle and state management intact. Do not replace a working native prompt with an imitation modal, custom instructions screen or unrelated installation mechanism.
- Let users dismiss the card without obstructing their normal customer journey. Do not force installation, repeatedly interrupt users or introduce a permanent, intrusive installation banner.
- On iPhone and iPad, support the appropriate Safari **Share → Add to Home Screen** pathway. Do not assume Chromium's `beforeinstallprompt` event is available on iOS. Provide accurate platform-specific guidance when necessary.
- Account for mobile safe areas, responsive layouts, existing bottom navigation and other important customer actions.
- Preserve the working manifest, service-worker registration, caching, offline behaviour, metadata and installation assets. Change project identity and asset references carefully without breaking installation eligibility or existing behaviour.
- Do not introduce duplicate installation prompts, stale branding, inherited project icons, dead install buttons, JavaScript alerts or fake native prompts.
- Do not claim installation works on every browser or device without verifying the relevant platform behaviour.

### 3. Protected implementation rule

Before changing any part of the application:

1. Inspect the actual repository, current branch, latest commit, working tree and relevant project instructions.
2. Locate and understand the existing installation implementation, including the install component, CSS, manifest, metadata, icons, service worker and any platform-specific guidance.
3. Preserve the existing approved installation implementation. Treat it as protected infrastructure, not ordinary feature code.
4. Make unrelated application changes without modifying the installation implementation.
5. If a requested change genuinely requires touching protected installation files, isolate the smallest necessary change and explain the reason before proceeding. Do not make that change without the product owner's explicit authorization.
6. After authorized changes, compare the installation implementation with the approved baseline and verify that the protected behaviour has not regressed.

Do not assume that a new framework, reference repository, copied component, code-generation tool or future developer's preferences justify changing this standard.

### 4. Project identity may change; installation behaviour may not

For each new project, replace inherited identity references with the correct project identity, including:

- Application name and short name.
- Brand mark, favicon, manifest icons and Apple installation assets.
- Theme colours and branded installation-card presentation.
- Manifest metadata, page metadata and social preview assets.
- Service-worker cache namespaces and application-specific asset paths.
- Any inherited names, icons, routes or copy from the source project.

Do not copy another client's branding or infrastructure. Do not change protected installation logic merely to accommodate new branding.

### 5. Verification and reporting

Verify the actual code and run the relevant checks. Where feasible, test the production build and installation eligibility in supported Chromium browsers, plus the appropriate iOS Safari pathway.

Report separately what was changed, committed, pushed, build-verified and production-verified. Never claim that a native prompt appeared on a physical device unless that behaviour was actually tested.

### Final instruction

**Africhiko's approved installation experience is the permanent default for Iteration 13 and every project based on it. Preserve it exactly in behaviour and user experience. Rebrand it for each project, leave its protected implementation alone, and make no exceptions unless the product owner explicitly authorizes otherwise.**
