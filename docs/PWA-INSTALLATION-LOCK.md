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
