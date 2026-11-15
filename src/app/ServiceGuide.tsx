"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Check, ChevronDown, MessageCircle, Send, Sparkles, X } from "lucide-react";

type GuideService = { id: string; name: string; price: number; description: string; media: string; mediaType: "image" | "video"; active: boolean };
type View = "shop" | "account" | "admin";
type Message = { id: string; from: "guide" | "you"; text: string };

type Props = {
  view: View;
  screen: string;
  services: GuideService[];
  requestCount: number;
  onChooseService: (service: GuideService) => void;
  onOpenAccount: () => void;
  onOpenAdmin: (target?: "services" | "announcement" | "requests") => void;
  onOpenStorefront: () => void;
  onTrack: (event: string, details?: { screen?: string; serviceId?: string; serviceName?: string }) => void;
};

const HISTORY_KEY = "iteration13:guide-history:v1";

const screenTips: Record<string, string> = {
  store: "Browsing the Store? I can compare the available offers or take you to a request.",
  "customer-account": "Your Account keeps this browser’s requests, updates and receipts together.",
  "request-form": "Need help with the request? Your selected offer carries through to this form.",
  "briefcase-today": "Your Briefcase brings today's priorities and customer activity together.",
  "briefcase-work": "Here you can review incoming work and move each request to its next status.",
  "briefcase-money": "The Money area separates recorded payments from projected work.",
  "briefcase-store": "Manage the offers and customer notice shown in the Store.",
  "briefcase-notes": "Keep private working notes here; this demo saves them on this device.",
  "briefcase-insights": "These demo insights describe activity in this browser only."
};


function createMessage(from: Message["from"], text: string): Message {
  return { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, from, text };
}

export default function ServiceGuide({ view, screen, services, requestCount, onChooseService, onOpenAccount, onOpenAdmin, onOpenStorefront, onTrack }: Props) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [historyReady, setHistoryReady] = useState(false);
  const [lastChoice, setLastChoice] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const onTrackRef = useRef(onTrack);
  onTrackRef.current = onTrack;
  const previousScreen = useRef(screen);
  const activeServices = useMemo(() => services.filter(service => service.active), [services]);


  useEffect(() => {
    try {
      const saved = window.sessionStorage.getItem(HISTORY_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Message[];
        if (Array.isArray(parsed)) setMessages(parsed.filter(item => item && (item.from === "guide" || item.from === "you") && typeof item.text === "string").slice(-20));
      }
    } catch { /* Chat history is optional; the guide still works without storage. */ }
    setHistoryReady(true);
  }, []);

  useEffect(() => {
    if (!screen || previousScreen.current === screen) return;
    previousScreen.current = screen;
    try {
      const key = "iteration13:guide-events:v1";
      const previous = JSON.parse(window.sessionStorage.getItem(key) || "[]") as { event: string; screen: string; at: string; serviceId?: string; serviceName?: string }[];
      window.sessionStorage.setItem(key, JSON.stringify([...previous, { event: "screen-change", screen, at: new Date().toISOString() }].slice(-60)));
    } catch { /* local funnel measurement must never block navigation */ }
    onTrackRef.current("screen-change", { screen });
  }, [screen]);
  useEffect(() => {
    if (!historyReady) return;
    try { window.sessionStorage.setItem(HISTORY_KEY, JSON.stringify(messages.slice(-20))); } catch { /* history is optional */ }
  }, [messages, historyReady]);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    // Move focus to the dialog's close control for keyboard accessibility, never to
    // the composer; the mobile keyboard stays closed until the visitor taps the field.
    const focusTimer = window.setTimeout(() => panelRef.current?.querySelector<HTMLElement>('button:not([disabled])')?.focus(), 0);
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); launcherRef.current?.focus(); return; }
      if (event.key !== "Tab") return;
      const focusable = panelRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]),input:not([disabled]),a[href]');
      if (!focusable?.length) return;
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", handleKey);
    return () => { window.clearTimeout(focusTimer); window.removeEventListener("keydown", handleKey); if (previous?.isConnected) previous.focus(); else launcherRef.current?.focus(); };
  }, [open]);

  function track(event: string, details: { serviceId?: string; serviceName?: string } = {}) {
    onTrackRef.current(event, { screen, ...details });
    try {
      const key = "iteration13:guide-events:v1";
      const previous = JSON.parse(window.sessionStorage.getItem(key) || "[]") as { event: string; screen: string; at: string; serviceId?: string; serviceName?: string }[];
      window.sessionStorage.setItem(key, JSON.stringify([...previous, { event, screen, at: new Date().toISOString(), ...details }].slice(-60)));
    } catch { /* local funnel measurement must never block navigation */ }
  }
  function say(text: string) {
    setMessages(current => [...current, createMessage("guide", text)].slice(-20));
    track("guide-reply");
  }
  function chooseService(service: GuideService) {
    setLastChoice(service.id);
    let previousSelections = 0;
    try {
      const events = JSON.parse(window.sessionStorage.getItem("iteration13:guide-events:v1") || "[]") as { event: string; serviceId?: string }[];
      previousSelections = events.filter(item => item.event === "offer-selected" && item.serviceId === service.id).length;
    } catch { /* repeat detection is optional */ }
    track("offer-selected", { serviceId: service.id, serviceName: service.name });
    say(`${service.name} starts at P${service.price.toLocaleString("en-BW")}. ${service.description} Choose “Request this service” to continue in the existing form; your requested date is a preference, not a confirmed delivery promise.`);
    if (previousSelections > 0) say(`You’ve revisited ${service.name}. Want to compare it with another offer before requesting?`);
  }
  function runAction(action: string) {
    track(`action:${action}`);
    switch (action) {
      case "help": say("I can guide you to a service or a real page in this demo. Choose a service below, view your requests, or browse without chat. I’m a scripted guide, not a live person or AI assistant."); break;
      case "browse": say("No problem. You can keep browsing; the service menu and order form remain available without chat."); setOpen(false); break;
      case "account": say(`Opening My account. This demo currently has ${requestCount} request(s) in this browser. Use the same browser profile to see local demo records.`); onOpenAccount(); break;
      case "storefront": say("Taking you back to the customer storefront."); onOpenStorefront(); break;
      case "admin-services": say("Opening the service menu tools. You can add, edit, hide or remove demo services here."); onOpenAdmin("services"); break;
      case "admin-announcement": say("Opening the announcement editor. Publish or clear a storefront note; it stays on this device."); onOpenAdmin("announcement"); break;
      case "admin-requests": say(requestCount ? `Opening ${requestCount} local request(s). Status changes are visible to the customer view on this same device.` : "There are no requests yet. Switch to the storefront and submit a sample request first."); onOpenAdmin("requests"); break;
      default: {
        const service = activeServices.find(item => item.id === action);
        if (service) {
          chooseService(service);
          return;
        }
      }
    }
  }
  function continueWithService() {
    const service = activeServices.find(item => item.id === lastChoice);
    if (!service) { say("Choose a visible service first, then I can take you to its request form."); return; }
    say(`Taking you to the ${service.name} request form. Your service selection will be carried across.`);
    track("request-started", { serviceId: service.id, serviceName: service.name });
    setOpen(false);
    onChooseService(service);
  }
  function sendText(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = input.trim();
    if (!text) return;
    setMessages(current => [...current, createMessage("you", text)].slice(-20)); track("visitor-message-submitted");
    setInput("");
    const normalized = text.toLowerCase();
    if (/admin|manage|edit service|add service/.test(normalized)) { runAction("admin-services"); return; }
    if (/announcement|promotion|special|publish/.test(normalized)) { runAction("admin-announcement"); return; }
    if (/request|order|track|status|account/.test(normalized)) { runAction(view === "admin" ? "admin-requests" : "account"); return; }
    if (/support|maintenance|update/.test(normalized)) {
      const service = activeServices.find(item => /support/i.test(item.name));
      if (service) { chooseService(service); return; }
    }
    const match = activeServices.find(item => normalized.includes(item.name.toLowerCase()) || (item.id === "phaser" && /game|phaser/.test(normalized)));
    if (match) { chooseService(match); return; }
    if (/website|web page|site/.test(normalized)) { const service = activeServices.find(item => /website/i.test(item.name)); if (service) { chooseService(service); return; } }
    if (/app|mobile/.test(normalized)) { const service = activeServices.find(item => /^app$/i.test(item.name)); if (service) { chooseService(service); return; } }
    say("I can help with the options this demo actually supports. Pick one of the quick actions below, or choose a service from the menu. I won’t pretend to know something this guide hasn’t been configured to answer.");
  }

  const customerActions = [
    { key: "services", label: "Help me choose", icon: "✳" },
    { key: "account", label: `My requests (${requestCount})`, icon: "↗" },
    { key: "browse", label: "Just browsing", icon: "↓" },
  ];
  const adminActions = [
    { key: "admin-services", label: "Manage services", icon: "＋" },
    { key: "admin-requests", label: `Review requests (${requestCount})`, icon: "↗" },
    { key: "admin-announcement", label: "Announcement", icon: "✳" },
    { key: "storefront", label: "Customer storefront", icon: "↓" },
  ];

  return <div className="sd-guide-root">
    {open && <div className="sd-guide-backdrop" onClick={() => setOpen(false)} aria-hidden="true"/>}
    {open && <section ref={panelRef} className="sd-guide-panel" role="dialog" aria-modal="true" aria-labelledby="sd-guide-title">
      <header className="sd-guide-head"><div className="sd-guide-avatar"><Sparkles size={18}/></div><div><span className="sd-guide-eyebrow">ITERATION 13 · SERVICE GUIDE</span><h2 id="sd-guide-title">{view === "admin" ? "Studio sidekick" : "Find your next step"}</h2><p><span/> Guided demo · {view === "admin" ? "Admin tools" : "Customer journey"}</p></div><button type="button" aria-label="Close guide" onClick={() => { setOpen(false); launcherRef.current?.focus(); }}><ChevronDown size={19}/></button></header>
      <div className="sd-guide-intro"><strong>{view === "admin" ? "What are you working on?" : "What would you like to do?"}</strong><p>{screenTips[screen] || (view === "admin" ? "I’ll take you to the right local demo tool." : "Choose a service or jump to your requests. You can always continue without me.")}</p></div>
      <div className="sd-guide-actions">{(view === "admin" ? adminActions : customerActions).map(item => <button key={item.key} type="button" onClick={() => item.key === "services" ? say("Choose a service below to see its starting price and fit. I’ll take you to the existing form when you’re ready.") : runAction(item.key)}><span>{item.icon}</span>{item.label}<ArrowRight size={15}/></button>)}</div>
      {view !== "admin" && <div className="sd-guide-services"><span className="sd-guide-section-label">SERVICE SHORTCUTS</span>{activeServices.map(service => <button key={service.id} type="button" onClick={() => chooseService(service)} aria-pressed={lastChoice === service.id}><span className="sd-guide-service-thumb" aria-hidden="true"><img src={service.media} alt="" loading="lazy" onError={event => { event.currentTarget.style.visibility = "hidden"; }}/></span><span className="sd-guide-service-copy"><strong>{service.name}</strong><small>{service.description}</small></span><b>P{service.price.toLocaleString("en-BW")}</b></button>)}</div>}
      {lastChoice && view !== "admin" && <button type="button" className="sd-guide-continue" onClick={continueWithService}>Request this service <ArrowRight size={16}/></button>}
      <div className="sd-guide-thread" aria-live="polite" aria-relevant="additions text">{messages.slice(-4).map(message => <p key={message.id} className={`sd-guide-message is-${message.from}`}>{message.text}</p>)}</div>
      <form className="sd-guide-composer" onSubmit={sendText}><input ref={inputRef} value={input} onChange={event => setInput(event.target.value)} aria-label="Ask the service guide" aria-describedby="sd-guide-type-hint" placeholder="Tap here to type a question…" maxLength={300}/><button type="submit" disabled={!input.trim()} aria-label="Send message"><Send size={17}/></button></form>
      <p id="sd-guide-type-hint" className="sd-guide-type-hint">Tap the message box above to type. Your keyboard opens only when you choose to type.</p>
      <p className="sd-guide-footnote"><Check size={12}/> Scripted guide · Actions tracked in this tab only · No message content stored in analytics</p>
    </section>}
    <button ref={launcherRef} type="button" className={`sd-guide-launcher${open ? " is-open" : ""}`} aria-expanded={open} aria-haspopup="dialog" aria-label={open ? "Close service guide" : "Need a hand? Open the guide"} title="Need a hand?" onClick={() => { track(open ? "guide-minimized" : "guide-opened"); setOpen(value => !value); if (!messages.length) say("Hi! I’m the Service Studio guide. I can point you to the right action, but I’m not a live person or an AI assistant."); }}>
      {open ? <X size={21}/> : <MessageCircle size={22}/>}<span>{open ? "Close" : "Need a hand?"}</span>{!open && requestCount > 0 && view === "admin" && <b>{requestCount}</b>}
    </button>
  </div>;
}
