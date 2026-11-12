# Firestore business profile slots

> **Implementation status (12 November 2026):** this is the approved design contract, not an implemented feature. The current entry chooser can restore the single legacy setup saved in the same browser. Three-slot Firestore persistence and the owner-wide inbox must not be described as available until a dedicated Iteration13 Firebase project, its Auth provider and security rules are configured and verified.

## Purpose

Persist the business identity configured in Iteration13 so the owner can find and inspect each setup from the separate Iteration13 inbox. This is not a customer-record sync or a full cloud migration of the local demo.

## Profile lifecycle

- When a visitor completes the first business setup (business name, brand colours, first service and its industry), save that business profile to Cloud Firestore as part of the transition into the storefront.
- Keep the storefront and the rest of the demo journey local-first. Customer requests, customer account activity, messages, owner notes and demo analytics remain browser-local unless separately approved.
- In business settings, edits to the active profile update the same saved slot in Firestore.
- Support a maximum of three saved business-profile slots per owner/browser identity.
- When a new profile is saved, use the next empty slot. If all three are occupied, require the owner to choose which slot to replace. Never silently overwrite an existing profile.
- The owner can find profiles in the Iteration13 inbox by business name, with a stable profile ID as the reliable identifier when names collide or change.

## Profile fields

Store only the business setup needed for discovery and review: stable profile ID, exact business name, brand colours, currency, service names, each service's industry, prices and descriptions, plus created/updated timestamps and slot number. Do not copy customer names, emails, requests, messages, receipts or other browser-local customer activity into these profile documents.

## Offline and feedback behaviour

The existing Firestore client is configured with persistent multi-tab local caching. Firestore can queue supported writes while offline and synchronize when connectivity returns. The interface must distinguish a locally queued save from a server-confirmed save; it must not say a profile is synced until the write is confirmed. Show clear saved, syncing, offline/pending and error states.

## Security and identity requirements

Do not expose a public read/write Firestore collection. Each profile must be scoped to a verified owner identity, and rules must enforce that boundary. A lightweight anonymous Firebase Auth identity may avoid a forced sign-up during setup, but it is browser/device scoped unless the user later links a durable credential. The private inbox that lists all submitted profiles must be protected separately for the owner/admin; never grant public collection listing. Validate profile shape, allowed slot numbers (1–3), and field sizes at the security boundary.

## Out of scope

No automatic transfer into Admin Hub Global, no automatic creation of an Admin Hub project, no public enquiry/lead form, no cloud sync of customer activity, and no migration of the rest of the prototype's local storage in this phase.
