# Business profile persistence — superseded Firestore proposal

> **Current product decision (12 November 2026):** Iteration 13 uses one business per browser/device. The owner can explicitly load the previous local setup or start a new one. Saving a new business over an existing setup requires confirmation and replaces the prior business data on that device. Firestore profile slots, anonymous authentication and cross-device business-profile sync are not part of the current product scope.

This document is retained as historical context only. Do not implement its former three-slot Firestore proposal unless the product owner explicitly reopens that decision.

## Current behaviour

- Business identity, currency, brand palette, services, demo enquiries, messages and owner notes are stored locally in the browser.
- The start screen presents **Create a new business** and **Load previous setup**.
- Returning owners explicitly load the existing setup; it is not auto-opened.
- Starting a new setup does not mutate the saved business while the owner is editing.
- If a saved business exists, completing a new setup requires explicit confirmation before replacing the existing business data.
- Overwriting clears the previous business's local service catalogue, customer enquiries, messages, owner notes and account extras on that device.
- No business profile is synced to Firebase or available on another device.

## Important boundaries

Browser-local storage is not a secure customer account, durable backup or cross-device sync. A customer can see the local enquiry history only in the same browser profile/device where it was submitted. Notifications are not delivered merely because a local preference is recorded. UploadThing uploads are remote file storage and require an internet connection; they do not make the enquiry record itself a cloud account.

If cross-device business profiles or private customer accounts are requested later, treat that as a new product/infrastructure decision. Select a dedicated backend, define owner/customer identity and access rules, and obtain explicit approval before introducing it. Never silently connect this prototype to an inherited Firebase project or expose customer records publicly.
