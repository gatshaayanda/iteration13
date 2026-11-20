import Link from "next/link";

export default function OfflinePage() {
  return (
    <main className="orderPage">
      <div className="orderWrap">
        <div className="orderHeader">
          <Link href="/" className="logo"><span className="logoMark">P</span><span>Iteration 13</span></Link>
        </div>
        <section className="orderCard confirm">
          <div className="confirmIcon">📶</div>
          <span className="kicker">Offline mode</span>
          <h1>Iteration 13 is still here.</h1>
          <p>After the service worker has installed successfully while online, the current Store app shell—including its page markup, Next.js scripts and styles—and the offline screen are cached together. A newer shell is prepared in the background and waits for your Refresh choice before replacing the active version. Some previously viewed service images may also be retained when their host permits a size-checked download within the cache budget. Video streaming and playback are not cached for offline use; uncached or unsupported media still need internet. Cached content can be out of date, and the browser may clear it to free device storage.</p>
          <p>Customer requests, account text messages, service edits, announcement changes, Briefcase notes and demo payment/status changes save in this browser. Customer and owner views use the same local records on this device; nothing is uploaded or synced to another device.</p>
          <p>New UploadThing uploads can be staged locally: selected images (4 MB) and videos (16 MB) are stored in IndexedDB and marked Pending Sync. When you reconnect with the matching media field open, the app uploads them to UploadThing and replaces the local reference only after confirmation. Pending media is device-specific, capped at 64 MB, and is not guaranteed to sync while the app is closed. External links, remote Firebase features and other server-dependent actions still need internet. Offline text and admin changes remain browser-local and are not queued for server delivery.</p>
          <p><strong>Before going offline:</strong> open the Store while connected, browse the important service images, then reload once while still online so the latest app shell and eligible images can be prepared.</p>
          <div className="actions centered">
            <Link className="button buttonPrimary" href="/#service-order">Try customer journey</Link>
            <Link className="button buttonLight" href="/">Open home</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
