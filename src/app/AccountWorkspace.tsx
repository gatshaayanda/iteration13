"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import ReceiptDocument, { type ReceiptProfile } from "@/app/ReceiptDocument";
import { generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

const { useUploadThing } = generateReactHelpers<OurFileRouter>();

export type AccountAttachment = { name: string; url: string; type: string; size: number };
export type AccountMessage = { id: string; from: "customer" | "studio"; text: string; createdAt: string; attachment?: AccountAttachment };
export type WorkspaceOrder = { id: string; serviceId: string; serviceName: string; serviceItems?: { id: string; name: string; price: number }[]; whatsapp?: string; notificationOptIn?: boolean; price: number; quotedPrice?: number; originalPrice?: number; discountAmount?: number; discountCode?: string; receiptNo?: string; paidAmount?: number; paidAt?: string; paymentStatus?: "Unpaid" | "Partially paid (demo)" | "Paid (demo)"; dueDate: string; customerName: string; email: string; brief: string; status: string; createdAt: string; statusUpdatedAt?: string; messages?: AccountMessage[] };

type DiscountClaim = { id: string; email: string; code: string; amount: number; lapTime: number; createdAt: string; status: "Available" | "Redeemed" };
type Props = {
  businessName: string;
  orders: WorkspaceOrder[];
  discountClaims: DiscountClaim[];
  receiptProfile?: ReceiptProfile;
  accentColor: string;
  email: string;
  setEmail: (email: string) => void;
  online: boolean;
  announcement: string;
  onBrowse: () => void;
  onUpdateOrder: (orderId: string, update: (order: WorkspaceOrder) => WorkspaceOrder, notice: string) => void;
  children?: ReactNode;
  requestForm?: ReactNode;
  onNewRequest: () => void;
};

const getBusinessCurrency = () => { if (typeof window === "undefined") return "BWP"; try { return window.localStorage.getItem("iteration13:business-currency:v1") || "BWP"; } catch { return "BWP"; } };
const money = (amount: number) => new Intl.NumberFormat("en", { style: "currency", currency: getBusinessCurrency(), maximumFractionDigits: 2 }).format(amount);
const prettyDate = (value: string) => { try { return new Date(value).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }); } catch { return value; } };
const deadlineAt = (value: string) => new Date(`${value}T23:59:59`).getTime();
const countdownLabel = (value: string, now: number) => { const delta = deadlineAt(value) - now; if (!Number.isFinite(delta)) return "Date not set"; if (delta < 0) return "Target date passed"; const totalMinutes = Math.floor(delta / 60000); const days = Math.floor(totalMinutes / 1440); const hours = Math.floor((totalMinutes % 1440) / 60); const minutes = totalMinutes % 60; return [days ? `${days}d` : "", `${hours}h`, `${minutes}m`].filter(Boolean).join(" "); };

export default function AccountWorkspace({ businessName, orders, discountClaims, receiptProfile, accentColor, email, setEmail, online, announcement, onBrowse, onUpdateOrder, children, requestForm, onNewRequest }: Props) {
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [uploadingOrder, setUploadingOrder] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadNotice, setUploadNotice] = useState("");
  const [openThread, setOpenThread] = useState<string | null>(null);
  const [clockNow, setClockNow] = useState(() => Date.now());
  const [testNotificationState, setTestNotificationState] = useState("");
  useEffect(() => { const timer = window.setInterval(() => setClockNow(Date.now()), 60000); return () => window.clearInterval(timer); }, []);
  const normalizedEmail = email.trim().toLowerCase();
  const filteredOrders = useMemo(() => normalizedEmail ? orders.filter(order => order.email.trim().toLowerCase() === normalizedEmail) : [], [orders, normalizedEmail]);
  const matchingRewards = useMemo(() => normalizedEmail ? discountClaims.filter(claim => claim.email.trim().toLowerCase() === normalizedEmail) : [], [discountClaims, normalizedEmail]);
  const totalMessages = filteredOrders.reduce((total, order) => total + (order.messages?.length || 0), 0);
  const openOrders = filteredOrders.filter(order => !["Completed", "Declined"].includes(order.status)).length;
  const fileCount = filteredOrders.reduce((total, order) => total + (order.messages || []).filter(message => Boolean(message.attachment)).length, 0);
  const nextDeadlineOrder = filteredOrders.filter(order => order.dueDate && !["Completed", "Declined", "Cancelled"].includes(order.status)).sort((a,b) => deadlineAt(a.dueDate)-deadlineAt(b.dueDate))[0];
  const accountUpdates = useMemo(() => filteredOrders.flatMap(order => [
    { id: order.id + ":status", title: order.serviceName + " · " + order.status, detail: order.status === "New request" ? "Your request has been received on this device and is awaiting review." : "Current request status", createdAt: order.statusUpdatedAt || order.createdAt, kind: "status" as const },
    ...(order.messages || []).filter(message => message.from === "studio").map(message => ({ id: message.id, title: "Message from " + businessName, detail: message.text || (message.attachment ? "A file was shared with your request." : "A new request message is available."), createdAt: message.createdAt, kind: "message" as const }))
  ]).sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()).slice(0, 6), [filteredOrders, businessName]);
  const monogram = businessName.trim().split(/\\s+/).slice(0, 2).map(part => part[0]).join("").toUpperCase() || "B";

  const { startUpload, isUploading } = useUploadThing("fileUploader", {
    onUploadProgress: progress => setUploadProgress(Math.max(0, Math.min(100, Math.round(progress)))),
    onUploadError: error => { setUploadNotice(error.message || "Upload failed. Your message has not been sent."); setUploadingOrder(null); setUploadProgress(0); },
  });

  async function sendTestNotification() {
    if (!nextDeadlineOrder) { setTestNotificationState("Add a request with a target date to preview a deadline reminder."); return; }
    if (!("Notification" in window) || !("serviceWorker" in navigator)) { setTestNotificationState("This browser does not support persistent app notifications."); return; }
    try {
      let permission = Notification.permission;
      if (permission === "default") permission = await Notification.requestPermission();
      if (permission !== "granted") { setTestNotificationState(permission === "denied" ? "Notifications are blocked in browser settings." : "Notification permission was not granted."); return; }
      const registration = await navigator.serviceWorker.getRegistration();
      if (!registration) { setTestNotificationState("The app notification worker is not active yet. Reopen the installed app and try again."); return; }
      const remaining = countdownLabel(nextDeadlineOrder.dueDate, Date.now());
      await registration.showNotification("Test update · " + businessName, {
        body: nextDeadlineOrder.serviceName + " · target date in " + remaining + ". This is a test notification.",
        icon: "/iteration13-icon-192.png",
        badge: "/iteration13-icon-192.png",
        tag: "iteration13-account-test",
        data: { link: "/?view=account" }
      });
      setTestNotificationState("Test notification sent to this device.");
    } catch {
      setTestNotificationState("Could not send the test notification. Check app notification permission and try again.");
    }
  }

  function sendMessage(order: WorkspaceOrder, attachment?: AccountAttachment) {
    const messageText = (drafts[order.id] || "").trim();
    if (!messageText && !attachment) { setUploadNotice("Write a message or attach a file before sending."); return; }
    const message: AccountMessage = { id: "MSG-" + Date.now().toString(36), from: "customer", text: messageText, createdAt: new Date().toISOString(), ...(attachment ? { attachment } : {}) };
    onUpdateOrder(order.id, current => ({ ...current, messages: [...(current.messages || []), message] }), "Message saved in this browser's demo thread. The business can see it in the Admin demo on this device.");
    setDrafts(current => ({ ...current, [order.id]: "" }));
    setUploadNotice("Message added to this local demo conversation.");
    setOpenThread(order.id);
  }

  async function attachFile(order: WorkspaceOrder, event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const accepted = file.type.startsWith("image/") || file.type.startsWith("video/") || file.type === "application/pdf";
    if (!accepted) { setUploadNotice("Choose an image, video or PDF file."); event.target.value = ""; return; }
    const max = file.type.startsWith("video/") ? 16 * 1024 * 1024 : 4 * 1024 * 1024;
    if (file.size > max) { setUploadNotice(file.type.startsWith("video/") ? "Videos must be 16 MB or smaller." : "Images and PDFs must be 4 MB or smaller."); event.target.value = ""; return; }
    if (!online || !navigator.onLine) { setUploadNotice("Offline: text messages can still be saved locally, but file uploads need internet. Nothing was uploaded."); event.target.value = ""; return; }
    setUploadingOrder(order.id); setUploadProgress(0); setUploadNotice("Uploading attachment. Keep this page open.");
    try {
      const uploaded = await startUpload([file]);
      const result = uploaded?.[0];
      const url = result?.ufsUrl || result?.url;
      if (!url) { setUploadNotice("Upload completed without a file link. Please try again."); setUploadingOrder(null); return; }
      sendMessage(order, { name: file.name, url, type: file.type, size: file.size });
      setUploadNotice("Attachment uploaded and added to the local demo conversation.");
    } catch {
      setUploadNotice("Upload failed. Check your connection and try again; the message was not sent.");
    } finally {
      setUploadingOrder(null); setUploadProgress(0); event.target.value = "";
    }
  }

  return <section className="sd-account sd-account-inside sd-wrap" style={{ "--account-brand": accentColor } as React.CSSProperties}>
    <header className="sd-account-masthead">
      <div className="sd-account-brand-lockup">
        <span className="sd-account-brand-mark" aria-hidden="true">{monogram}</span>
        <div><span className="sd-account-overline">{businessName}</span><strong>Customer space</strong></div>
      </div>
      <span className="sd-account-view-label">CUSTOMER ACCOUNT</span>
    </header>

    <div className="sd-account-welcome sd-account-welcome-compact">
      <div className="sd-account-welcome-copy">
        <span className="sd-kicker">YOUR CUSTOMER ACCOUNT</span>
        <h1>Your requests, updates & rewards.</h1>
        <p>Your work with {businessName} — status, messages, receipts and customer perks in one place.</p>
      </div>
      <button className="sd-account-store-link" onClick={onBrowse}>← Back to the Store</button>
    </div>

    <nav className="sd-account-actions" aria-label="Customer account sections"><button type="button" onClick={() => document.getElementById("account-overview")?.scrollIntoView({behavior:"smooth",block:"start"})}>⌂ <span>Overview</span></button><button type="button" disabled={!filteredOrders.length} onClick={() => document.getElementById("account-requests")?.scrollIntoView({behavior:"smooth",block:"start"})}>▤ <span>My requests</span></button><button type="button" disabled={!filteredOrders.length} onClick={() => { if(filteredOrders[0]) setOpenThread(filteredOrders[0].id); window.setTimeout(() => document.getElementById("account-messages")?.scrollIntoView({behavior:"smooth",block:"start"}),80); }}>✉ <span>Messages</span></button><button type="button" disabled={!filteredOrders.length} onClick={() => document.getElementById("account-receipts")?.scrollIntoView({behavior:"smooth",block:"start"})}>▧ <span>Receipts</span></button><button type="button" disabled={!matchingRewards.length} onClick={() => document.getElementById("account-rewards")?.scrollIntoView({behavior:"smooth",block:"start"})}>✦ <span>Rewards</span></button><button type="button" className="is-primary" onClick={onNewRequest}>＋ <span>New request</span></button></nav>
    {requestForm}

    <div className="sd-account-workspace" id="account-overview">
      <div className="sd-account-section-heading">
        <div><span className="sd-kicker">YOUR ACTIVITY</span><h2>Requests & updates</h2></div>
        <span className="sd-account-local-tag">YOUR ACTIVITY</span>
      </div>

      <div className="sd-account-lookup">
        <label htmlFor="account-email">Find your requests</label>
        <div className="sd-account-lookup-row">
          <input id="account-email" type="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="Enter the email used on your request" autoComplete="email" />
          <span>{normalizedEmail ? `${filteredOrders.length} found` : "Email lookup"}</span>
        </div>
        <p>Use the same email address you entered when you sent your request on this browser.</p>
      </div>

      {normalizedEmail && <div className="sd-account-summary" aria-live="polite">
        <article><span>In progress</span><strong>{openOrders}</strong></article>
        <article><span>Messages</span><strong>{totalMessages}</strong></article>
        <article><span>Shared files</span><strong>{fileCount}</strong></article>
      </div>}

      {normalizedEmail && <section className="sd-account-notifications" aria-labelledby="account-updates-title">
        <div className="sd-account-notifications-head"><div><span className="sd-kicker">NOTIFICATION CENTRE</span><h3 id="account-updates-title">Your updates</h3></div><span>{accountUpdates.length} {accountUpdates.length === 1 ? "update" : "updates"}</span></div>
        {accountUpdates.length ? <ol>{nextDeadlineOrder && <li key="deadline-countdown"><span className="is-status" aria-hidden="true">◷</span><div><strong>Deadline countdown · {nextDeadlineOrder.serviceName}</strong><p>Requested date in {countdownLabel(nextDeadlineOrder.dueDate, clockNow)}.</p></div></li>}{accountUpdates.map(update => <li key={update.id}><span className={update.kind === "message" ? "is-message" : "is-status"} aria-hidden="true">{update.kind === "message" ? "✉" : "↗"}</span><div><strong>{update.title}</strong><p>{update.detail}</p>{update.createdAt && <time>{prettyDate(update.createdAt)}</time>}</div></li>)}</ol> : <p className="sd-account-notification-empty">No request updates yet. Status changes and business replies will appear here when they are saved in this browser.</p>}
        <div className="sd-account-test-notification"><div><strong>Example reminder</strong><p>{nextDeadlineOrder ? `${nextDeadlineOrder.serviceName} · target date in ${countdownLabel(nextDeadlineOrder.dueDate, clockNow)}.` : "A message can include a live countdown to your requested date."}</p>{testNotificationState && <small role="status">{testNotificationState}</small>}</div><button type="button" onClick={sendTestNotification}>Send test notification</button></div><p className="sd-account-notification-boundary">The test sends immediately to this device. Automatic deadline reminders require an active notification service and a scheduled backend.</p>
      </section>}

      {!normalizedEmail ? <div className="sd-account-empty" id="account-requests">
        <span className="sd-account-empty-mark" aria-hidden="true">⌕</span>
        <h3>Let’s find your activity.</h3>
        <p>Enter your email above to look up requests saved in this browser.</p>
        <button className="sd-button sd-primary" onClick={onBrowse}>Explore the Store</button>
      </div> : filteredOrders.length === 0 ? <div className="sd-account-empty">
        <span className="sd-account-empty-mark" aria-hidden="true">↗</span>
        <h3>No requests found for that email.</h3>
        <p>Check the spelling, or return to the Store to send a new product / service request using this email.</p>
        <button className="sd-button sd-primary" onClick={onBrowse}>Browse products / services</button>
      </div> : <div className="sd-account-orders" id="account-requests">
        {filteredOrders.map(order => {
          const messages = order.messages || [];
          const expanded = openThread === order.id;
          const studioReplies = messages.filter(message => message.from === "studio").length;
          return <article className="sd-account-order" key={order.id}>
            <div className="sd-account-order-top"><span>REQUEST · {order.id}</span><b>{order.status}</b></div>
            <div className="sd-account-order-main">
              <div><h3>{order.serviceName}</h3><p className="sd-account-order-date">Sent {prettyDate(order.createdAt)}</p></div>
              <strong className="sd-account-order-price">{order.quotedPrice ? money(order.quotedPrice) : order.serviceItems?.some(item => item.price === 0) ? "Quote required" : money(order.price)}</strong>
            </div>
            {order.serviceItems?.length ? <p className="sd-account-detail"><strong>Selected:</strong> {order.serviceItems.map(item => `${item.name} · ${item.price > 0 ? money(item.price) : order.quotedPrice ? "included in quote" : "price to be confirmed"}`).join(", ")}</p> : null}
            {order.whatsapp ? <p className="sd-account-detail"><strong>WhatsApp:</strong> {order.whatsapp}</p> : null}
            <p className="sd-account-detail"><strong>Requested date:</strong> {order.dueDate}</p><div className="sd-account-deadline"><span>Time until target date</span><strong>{countdownLabel(order.dueDate, clockNow)}</strong></div>
            {order.brief && <p className="sd-account-brief">{order.brief}</p>}
            {order.discountAmount ? <p className="sd-account-reward-line">Store reward · {money(order.discountAmount)} off</p> : null}
            <div className="sd-account-order-actions">
              <span>{messages.length} {messages.length === 1 ? "message" : "messages"} · {studioReplies ? "Business replied" : "Awaiting reply"}</span>
              <button className="sd-account-secondary-action" type="button" aria-expanded={expanded} onClick={() => setOpenThread(expanded ? null : order.id)}>{expanded ? "Close conversation" : "Open conversation →"}</button>
            </div>
            <div id="account-receipts"><ReceiptDocument businessName={businessName} accentColor={accentColor} receiptProfile={receiptProfile} order={order} /></div>
            {expanded && <section className="sd-account-conversation" id="account-messages" aria-label={`Conversation for ${order.serviceName}`}>
              <div className="sd-account-conversation-heading"><div><span className="sd-kicker">REQUEST CONVERSATION</span><h4>{order.serviceName}</h4></div><span className="sd-account-local-tag">LOCAL THREAD</span></div>
              <p className="sd-account-demo-explainer">Messages are saved in this browser and appear in the business Admin demo on this device. They are not emailed or sent to a remote team.</p>
              <div className="sd-account-messages" aria-live="polite">{messages.length ? messages.map(message => <article key={message.id} className={`sd-account-message is-${message.from}`}><div><strong>{message.from === "customer" ? "You" : businessName}</strong><time>{prettyDate(message.createdAt)}</time></div>{message.text && <p>{message.text}</p>}{message.attachment && <a href={message.attachment.url} target="_blank" rel="noreferrer">↗ {message.attachment.name} · Open attachment</a>}</article>) : <p className="sd-account-message-empty">No messages yet. Send a question to start the conversation in this demo.</p>}</div>
              <form className="sd-account-composer" onSubmit={event => { event.preventDefault(); sendMessage(order); }}>
                <label htmlFor={`account-message-${order.id}`}>Write a message<textarea id={`account-message-${order.id}`} rows={3} maxLength={1200} value={drafts[order.id] || ""} onChange={event => setDrafts(current => ({ ...current, [order.id]: event.target.value }))} placeholder="Ask a question about this request…" /></label>
                <div className="sd-account-composer-actions"><label className="sd-account-attach">＋ Attach file<input type="file" accept="image/*,video/*,application/pdf" disabled={isUploading || !online} onChange={event => attachFile(order, event)} /></label><button className="sd-button sd-primary" type="submit" disabled={isUploading || !(drafts[order.id] || "").trim()}>Send message</button></div>
                {uploadingOrder === order.id && <div className="sd-media-progress" role="status"><div className="sd-media-progress-copy"><strong>Uploading attachment</strong><span>{uploadProgress}%</span></div><div className="sd-media-progress-track" role="progressbar" aria-label="Attachment upload progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={uploadProgress}><span style={{ width: uploadProgress + "%" }} /></div></div>}
              </form>
            </section>}
          </article>;
        })}
      </div>}

      {matchingRewards.length > 0 && <section className="sd-account-rewards" id="account-rewards">
        <div><span className="sd-kicker">STORE REWARDS</span><h2>Your discounts</h2><p>Rewards earned in the Store are linked to this email.</p></div>
        <div className="sd-account-reward-list">{matchingRewards.map(claim => <article key={claim.id}><strong>{claim.code}</strong><b>{money(claim.amount)} off</b><span>{claim.status}</span></article>)}</div>
      </section>}

      {announcement.trim() && <aside className="sd-account-announcement"><span className="sd-kicker">FROM {businessName.toUpperCase()}</span><h3>Business update</h3><p>{announcement}</p></aside>}
      {uploadNotice && <p className="sd-account-feedback" role="status">{uploadNotice}</p>}
      <p className="sd-account-boundary">This is a browser-local demo, not a secure sign-in or shared customer account. Requests and messages are stored on this device. Attachments upload to the configured file service when online; they are not queued offline.</p>
    </div>
    {children}
  </section>;
}
