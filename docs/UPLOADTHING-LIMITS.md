# UploadThing file size limits

Iteration 13's UploadThing router is configured for one file per upload:
- **Images:** up to 4 MB
- **Videos:** up to 16 MB
- **PDFs:** up to 4 MB

Service and announcement media pickers support device-local offline staging through IndexedDB. Images (4 MB) and videos (16 MB) selected offline are stored as actual file objects on that device, shown as **Saved on this device · Pending Sync**, and uploaded to UploadThing when the matching media field is open and connectivity is available. If an online upload fails, the file is retained for retry. A successful UploadThing response replaces the local reference with its hosted URL.

The pending queue is capped at 64 MB and checks browser storage quota before saving. The app requests persistent storage where supported, but browser storage remains device-specific and can still be cleared by the user or operating system. Keep the app open with the matching media field available for foreground sync. This is not Background Sync, cross-device replication, or a guarantee that an upload will finish while the app is closed. A file marked Pending Sync has **not** been published to the cloud yet.

These are configured limits, not a guarantee about the connected UploadThing account's plan, environment configuration, or network throughput. If an upload is rejected despite meeting these limits, check deployment credentials, endpoint logs, network connection and provider plan/settings. Do not increase limits without confirming provider support.
