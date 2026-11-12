"use client";

import Link from "next/link";
import ServiceGuide from "@/app/ServiceGuide";
import ServiceMediaPicker from "@/app/ServiceMediaPicker";
import AnnouncementImagePicker from "@/app/AnnouncementImagePicker";
import AccountWorkspace, { type AccountMessage } from "@/app/AccountWorkspace";
import RacingWarmup from "@/app/games/racing-warmup";
import ReceiptDocument from "@/app/ReceiptDocument";
import { useEffect, useMemo, useState } from "react";

type Service = { id: string; name: string; industry?: string; price: number; description: string; media: string; mediaType: "image" | "video"; active: boolean };
type DemoOrder = { id: string; serviceId: string; serviceName: string; serviceItems?: { id: string; name: string; price: number }[]; price: number; dueDate: string; customerName: string; email: string; whatsapp?: string; notificationOptIn?: boolean; brief: string; status: string; createdAt: string; messages?: AccountMessage[]; paymentStatus?: "Unpaid" | "Partially paid (demo)" | "Paid (demo)"; originalPrice?: number; discountAmount?: number; discountCode?: string; paidAmount?: number; paidAt?: string; receiptNo?: string; isTest?: boolean; completedAt?: string };
type DemoEvent = { id: string; kind: "visit" | "service" | "account" | "request" | "completed" | "payment" | "reward"; label: string; at: string; test?: boolean };
type DiscountClaim = { id: string; email: string; code: string; amount: number; lapTime: number; createdAt: string; status: "Available" | "Redeemed" };
type DemoData = { services: Service[]; orders: DemoOrder[]; announcement: string; announcementImage?: string; views: number; events?: DemoEvent[]; discountAmount?: number; rewardTitle?: string; rewardDescription?: string; rewardImage?: string; rewardActive?: boolean; discountClaims?: DiscountClaim[]; receiptProfile?: { legalName: string; registration: string; address: string; phone: string; footer: string } };
const STORAGE_KEY = "iteration13:service-demo:v1";

const emptyData: DemoData = { services: [], orders: [], announcement: "", announcementImage: "", views: 0, events: [], discountAmount: 5, rewardTitle: "Race for a discount.", rewardDescription: "Drive for eight seconds. Keep it clean to unlock the published discount on your next request.", rewardImage: "", rewardActive: true, discountClaims: [], receiptProfile: { legalName: "Your Business", registration: "", address: "", phone: "", footer: "Thank you for your business." } };
const CURRENCY_KEY = "iteration13:business-currency:v1";
const supportedCurrencies = ["BWP", "USD", "GBP", "EUR", "ZAR", "INR"] as const;
const getBusinessCurrency = () => {
  if (typeof window === "undefined") return "USD";
  try { const value = window.localStorage.getItem(CURRENCY_KEY); return supportedCurrencies.includes(value as typeof supportedCurrencies[number]) ? value! : "USD"; }
  catch { return "USD"; }
};
const money = (amount: number) => new Intl.NumberFormat("en", { style: "currency", currency: getBusinessCurrency(), maximumFractionDigits: 2 }).format(amount);
const formatLocalBytes = (bytes: number | null) => bytes === null ? "Unavailable" : bytes < 1024 ? `${bytes} B` : bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
const serviceEmoji = (name: string) => {
  const label = name.toLowerCase();
  if (/website|web|site|digital|design/.test(label)) return "🌐";
  if (/app|mobile|software/.test(label)) return "📱";
  if (/support|maintenance|care|help/.test(label)) return "🛠️";
  if (/game|phaser|race/.test(label)) return "🎮";
  if (/product|shop|store|retail/.test(label)) return "🛍️";
  if (/consult|strategy|business|service/.test(label)) return "💼";
  return "✨";
};
const accentInk = (hex: string) => {
  const values = hex.match(/[0-9a-f]{2}/gi)?.map(value => parseInt(value, 16) / 255) || [0.3, 0.3, 0.3];
  const luminance = values.map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4).reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0);
  return luminance > 0.179 ? "#111827" : "#ffffff";
};
const accentText = (hex: string) => {
  const values = hex.match(/[0-9a-f]{2}/gi)?.map(value => parseInt(value, 16)) || [79, 140, 255];
  const luminance = (rgb: number[]) => rgb.map(value => value / 255).map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4).reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0);
  let rgb = values;
  while (luminance(rgb) > 0.179) rgb = rgb.map(value => Math.max(0, Math.round(value * 0.88)));
  return "#" + rgb.map(value => value.toString(16).padStart(2, "0")).join("");
};
const localDate = () => { const now = new Date(); return [now.getFullYear(), String(now.getMonth() + 1).padStart(2, "0"), String(now.getDate()).padStart(2, "0")].join("-"); };
const brandColorOptions = [
  { color: "#2458e8", label: "Cobalt" }, { color: "#16866a", label: "Emerald" },
  { color: "#b7791f", label: "Amber" }, { color: "#c04467", label: "Rose" },
  { color: "#6b4ed6", label: "Violet" }, { color: "#202b3c", label: "Midnight" },
];

export default function Home() {
  const [data, setData] = useState<DemoData>(emptyData);
  const [ready, setReady] = useState(false);
  const [online, setOnline] = useState(true);
  const [view, setView] = useState<"shop" | "account" | "login" | "admin">("shop");
  const [demoJourney, setDemoJourney] = useState<string[]>(["Storefront preview"]);

  function recordDemoJourney(action: string) {
    setDemoJourney(current => current.includes(action) ? current : [...current, action]);
  }
  function recordActivity(kind: "service" | "account", label: string) {
    const event: DemoEvent = { id: "EV-" + Date.now().toString(36), kind, label, at: new Date().toISOString() };
    setData(current => ({ ...current, events: [event, ...(current.events || [])].slice(0, 250) }));
  }
  const [adminTab, setAdminTab] = useState<"today" | "work" | "money" | "store" | "notes" | "insights">("today");
  const [promoAssignEmail, setPromoAssignEmail] = useState("");
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [adminPassphrase, setAdminPassphrase] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [orderFormOpen, setOrderFormOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [notificationOptIn, setNotificationOptIn] = useState(false);
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState("");
  const [brief, setBrief] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [notice, setNotice] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [serviceName, setServiceName] = useState("");
  const [serviceIndustry, setServiceIndustry] = useState("");
  const [servicePrice, setServicePrice] = useState("100");
  const [serviceDescription, setServiceDescription] = useState("");
  const [serviceMedia, setServiceMedia] = useState("");
  const [serviceMediaType, setServiceMediaType] = useState<"image" | "video">("image");
  const [serviceMediaUploading, setServiceMediaUploading] = useState(false);
  const [serviceActive, setServiceActive] = useState(true);
  const [announcementDraft, setAnnouncementDraft] = useState("");
  const [announcementImageDraft, setAnnouncementImageDraft] = useState("");
  const [announcementImageUploading, setAnnouncementImageUploading] = useState(false);
  const [rewardTitleDraft, setRewardTitleDraft] = useState(emptyData.rewardTitle || "Race for a discount.");
  const [rewardDescriptionDraft, setRewardDescriptionDraft] = useState(emptyData.rewardDescription || "Drive for eight seconds. Keep it clean to unlock the published discount on your next request.");
  const [rewardImageDraft, setRewardImageDraft] = useState("");
  const [rewardDiscountDraft, setRewardDiscountDraft] = useState("5");
  const [rewardImageUploading, setRewardImageUploading] = useState(false);
  const [adminReplyDrafts, setAdminReplyDrafts] = useState<Record<string, string>>({});
  const [paymentDrafts, setPaymentDrafts] = useState<Record<string, string>>({});
  const [pendingConfirm, setPendingConfirm] = useState<{ kind: "delete-service" | "reset-demo" | "overwrite-business"; serviceId?: string; serviceName?: string } | null>(null);
  const [ownerNotes, setOwnerNotes] = useState("");
  const [notesReady, setNotesReady] = useState(false);
  const [brandColors, setBrandColors] = useState<string[]>(["#2458e8"]);
  const themeColor = brandColors[0] || "#2458e8";
  const secondaryColor = brandColors[1] || themeColor;
  const highlightColor = brandColors[2] || secondaryColor;
  const [themeReady, setThemeReady] = useState(false);
  const [identityReady, setIdentityReady] = useState(false);
  const [identityComplete, setIdentityComplete] = useState(false);
  const [identityMode, setIdentityMode] = useState<"choice" | "setup">("choice");
  const [hasPreviousSetup, setHasPreviousSetup] = useState(false);
  const [identityEditing, setIdentityEditing] = useState(false);
  const [identityServiceId, setIdentityServiceId] = useState<string | null>(null);
  const [customBrandColor, setCustomBrandColor] = useState("#2458e8");
  const [businessName, setBusinessName] = useState("Your Business");
  const [businessCurrency, setBusinessCurrency] = useState("BWP");
  const [businessNameReady, setBusinessNameReady] = useState(false);

  useEffect(() => {
    try {
      const savedName = window.localStorage.getItem("iteration13:business-name:v1");
      if (savedName) setBusinessName(savedName.slice(0, 48));
    } catch { /* use the demo business name */ }
    setBusinessNameReady(true);
  }, []);

  useEffect(() => {
    if (!businessNameReady || !identityComplete) return;
    try { window.localStorage.setItem("iteration13:business-name:v1", businessName.trim().slice(0, 48) || "Your Business"); }
    catch { setNotice("Business name could not be saved on this device."); }
  }, [businessName, businessNameReady, identityComplete]);

  useEffect(() => {
    try { const savedCurrency = window.localStorage.getItem(CURRENCY_KEY); if (savedCurrency && supportedCurrencies.includes(savedCurrency as typeof supportedCurrencies[number])) setBusinessCurrency(savedCurrency); } catch { /* default to BWP */ }
    try {
      const savedPalette = window.localStorage.getItem("iteration13:business-palette:v1");
      const savedTheme = window.localStorage.getItem("iteration13:store-theme:v1");
      if (savedPalette) {
        const parsed = JSON.parse(savedPalette);
        if (Array.isArray(parsed)) {
          const valid = [...new Set(parsed.filter((value): value is string => typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value)))].slice(0, 3);
          if (valid.length) setBrandColors(valid);
        }
      } else if (savedTheme && /^#[0-9a-f]{6}$/i.test(savedTheme)) setBrandColors([savedTheme]);
      setHasPreviousSetup(window.localStorage.getItem("iteration13:identity-complete:v1") === "true");
      // Never auto-open an old business. Every visit starts with an explicit choice.
      setIdentityComplete(false);
      setIdentityMode("choice");
    } catch { /* identity remains at the accessible default */ }
    setThemeReady(true);
    setIdentityReady(true);
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty("--studio-accent", themeColor);
    document.documentElement.style.setProperty("--studio-accent-secondary", secondaryColor);
    document.documentElement.style.setProperty("--studio-accent-highlight", highlightColor);
    if (!themeReady || !identityComplete) return;
    try {
      window.localStorage.setItem("iteration13:business-palette:v1", JSON.stringify(brandColors));
      window.localStorage.setItem("iteration13:store-theme:v1", themeColor);
    } catch { setNotice("Brand colours could not be saved on this device."); }
  }, [brandColors, themeColor, secondaryColor, highlightColor, themeReady, identityComplete]);

  useEffect(() => {
    try { setOwnerNotes(window.localStorage.getItem("iteration13:owner-notes:v1") || ""); }
    catch { setNotice("My Notes could not be loaded from this browser."); }
    setNotesReady(true);
  }, []);

  useEffect(() => {
    if (!notesReady) return;
    try { window.localStorage.setItem("iteration13:owner-notes:v1", ownerNotes); }
    catch { setNotice("My Notes could not be saved on this device."); }
  }, [ownerNotes, notesReady]);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<DemoData>;
        setData({ ...emptyData, ...parsed, services: Array.isArray(parsed.services) ? parsed.services : [], orders: Array.isArray(parsed.orders) ? parsed.orders : [], announcement: typeof parsed.announcement === "string" ? parsed.announcement : "", views: (Number(parsed.views) || 0) + 1, events: [...(Array.isArray(parsed.events) ? parsed.events : []), { id: "EV-"+Date.now().toString(36), kind: "visit", label: "Store visited", at: new Date().toISOString() }], receiptProfile: { ...emptyData.receiptProfile!, ...(parsed.receiptProfile || {}) } });
        setAnnouncementDraft(typeof parsed.announcement === "string" ? parsed.announcement : "");
        setAnnouncementImageDraft(typeof parsed.announcementImage === "string" ? parsed.announcementImage : "");
        setRewardTitleDraft(typeof parsed.rewardTitle === "string" ? parsed.rewardTitle : emptyData.rewardTitle || "Take a quick lap.");
        setRewardDescriptionDraft(typeof parsed.rewardDescription === "string" ? parsed.rewardDescription : emptyData.rewardDescription || "Drive for eight seconds and keep it clean to unlock a discount code for your next request.");
        setRewardImageDraft(typeof parsed.rewardImage === "string" ? parsed.rewardImage : "");
        setRewardDiscountDraft(String(Number(parsed.discountAmount) > 0 ? Number(parsed.discountAmount) : 5));
      } else setData(current => ({ ...current, views: 1, events: [{ id: "EV-"+Date.now().toString(36), kind: "visit", label: "Store visited", at: new Date().toISOString() }] }));
    } catch { setNotice("Local demo storage is unavailable in this browser. You can explore, but changes may not persist."); }
    setReady(true);
    setOnline(navigator.onLine);
    const syncOnline = () => setOnline(navigator.onLine);
    window.addEventListener("online", syncOnline);
    window.addEventListener("offline", syncOnline);
    const params = new URLSearchParams(window.location.search);
    if (params.get("view") === "account") setView("account");
    if (window.location.hash === "#admin" || window.location.hash === "#login") setView("login");
    return () => { window.removeEventListener("online", syncOnline); window.removeEventListener("offline", syncOnline); };
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch { setNotice("The browser could not save this change locally. Check available storage."); }
  }, [data, ready]);

  useEffect(() => {
    if (!ready || !("serviceWorker" in navigator)) return;
    const mediaUrls = [
      ...data.services.map(service => service.media),
      data.announcementImage || "",
      data.rewardImage || "",
      ...data.orders.flatMap(order => (order.messages || []).map(message => message.attachment?.url || "")),
    ].filter((url): url is string => typeof url === "string" && /^https:\/\//i.test(url));
    const prepareOfflineMedia = () => {
      navigator.serviceWorker.controller?.postMessage({ type: "CACHE_MEDIA", urls: mediaUrls });
    };
    prepareOfflineMedia();
    navigator.serviceWorker.addEventListener("controllerchange", prepareOfflineMedia);
    void navigator.serviceWorker.ready.then(registration => {
      (navigator.serviceWorker.controller || registration.active)?.postMessage({ type: "CACHE_MEDIA", urls: mediaUrls });
    }).catch(() => {
      // Local demo actions remain available even when the browser blocks service workers.
    });
    return () => navigator.serviceWorker.removeEventListener("controllerchange", prepareOfflineMedia);
  }, [data.services, data.announcementImage, data.orders, ready]);

  useEffect(() => {
    if (!notice) return;
    const duration = /^(Choose|Add |Enter |The browser|Local demo storage|Could not save)/i.test(notice) ? 6500 : 4200;
    const timeout = window.setTimeout(() => setNotice(current => current === notice ? "" : current), duration);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  useEffect(() => {
    if (!pendingConfirm) return;
    const keepDialogAccessible = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setPendingConfirm(null); return; }
      if (event.key !== "Tab") return;
      const dialog = document.querySelector(".sd-confirm-dialog");
      const focusable = dialog?.querySelectorAll<HTMLElement>("button:not([disabled]),a[href],input,select,textarea");
      if (!focusable?.length) { event.preventDefault(); return; }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", keepDialogAccessible);
    return () => window.removeEventListener("keydown", keepDialogAccessible);
  }, [pendingConfirm]);

  useEffect(() => {
    if (!ready) return;
    if (view === "account") window.history.replaceState({}, "", "/?view=account");
    else if (view === "shop") window.history.replaceState({}, "", "/");
    else if (view === "login") window.history.replaceState({}, "", "/#login");
    else window.history.replaceState({}, "", "/#admin");
  }, [view, ready]);

  function commitData(update: (current: DemoData) => DemoData, successMessage: string) {
    const next = update(data);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      setNotice("Could not save that change on this device. Check browser storage and try again.");
      return false;
    }
    setData(next);
    setNotice(successMessage);
    return true;
  }

  function toggleService(service: Service) {
    return commitData(current => ({ ...current, services: current.services.map(item => item.id === service.id ? { ...item, active: !item.active } : item) }), `${service.name} ${service.active ? "hidden" : "visible"} in the demo.`);
  }

  const activeServices = data.services.filter(service => service.active);
  const featuredService = activeServices[0];
  const currentHour = new Date().getHours();
  const ownerGreeting = currentHour < 12 ? "Good morning" : currentHour < 17 ? "Good afternoon" : "Good evening";
  function toggleBrandColor(color: string) {
    setBrandColors(current => current.includes(color)
      ? current.length > 1 ? current.filter(item => item !== color) : current
      : current.length < 3 ? [...current, color] : current);
  }
  function addCustomBrandColor() {
    setBrandColors(current => current.includes(customBrandColor)
      ? current
      : current.length < 3 ? [...current, customBrandColor] : [...current.slice(0, 2), customBrandColor]);
  }
  function openBusinessSetup() {
    const firstService = data.services[0];
    setIdentityMode("setup");
    setServiceName(firstService?.name || "");
    setServiceIndustry(firstService?.industry || "");
    setServicePrice(String(firstService?.price ?? 100));
    setServiceDescription(firstService?.description || "");
    setServiceMedia(firstService?.media || "");
    setServiceMediaType(firstService?.mediaType || "image");
    setServiceActive(firstService?.active ?? true);
    setIdentityServiceId(firstService?.id || null);
    setIdentityEditing(true);
    setIdentityComplete(false);
    setNotice("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function startNewBusinessSetup() {
    setBusinessName("");
    setBusinessCurrency("BWP");
    setBrandColors(["#2458e8"]);
    setCustomBrandColor("#2458e8");
    setServiceName("");
    setServiceIndustry("");
    setServicePrice("100");
    setServiceDescription("");
    setServiceMedia("");
    setServiceMediaType("image");
    setServiceActive(true);
    setIdentityServiceId(null);
    setIdentityEditing(false);
    setIdentityMode("setup");
    setIdentityComplete(false);
    setNotice("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function loadPreviousBusinessSetup() {
    setIdentityComplete(true);
    setView("shop");
    setNotice(`Loaded ${businessName.trim() || "your previous business"} from this browser. You can continue where you left off.`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function completeBusinessIdentity(confirmedOverwrite = false) {
    if (hasPreviousSetup && !identityEditing && !confirmedOverwrite) {
      setPendingConfirm({ kind: "overwrite-business" });
      return;
    }
    const name = businessName.trim();
    const firstServiceName = serviceName.trim();
    const firstServicePrice = Number(servicePrice);
    if (!name) { setNotice("Enter your business name to continue."); return; }
    if (!firstServiceName) { setNotice("Add at least one service before creating your business space."); return; }
    if (!Number.isFinite(firstServicePrice) || firstServicePrice < 0) { setNotice("Enter a valid first service price in " + businessCurrency + "."); return; }
    if (serviceMediaUploading) { setNotice("Wait for the service image upload to finish before continuing."); return; }
    if (serviceMedia.trim()) {
      try { const parsed = new URL(serviceMedia.trim()); if (parsed.protocol !== "https:" && parsed.protocol !== "http:") throw new Error("Unsupported protocol"); }
      catch { setNotice("Enter a valid image URL or upload the image before continuing."); return; }
    }
    const firstService: Service = { id: identityEditing && identityServiceId ? identityServiceId : "service-" + Date.now().toString(36), name: firstServiceName, industry: serviceIndustry.trim(), price: firstServicePrice, description: serviceDescription.trim(), media: serviceMedia.trim(), mediaType: serviceMediaType, active: serviceActive };
    const nextServices = identityEditing && identityServiceId
      ? data.services.map(item => item.id === identityServiceId ? firstService : item)
      : [firstService];
    const nextData = identityEditing ? { ...data, services: nextServices } : { ...emptyData, services: nextServices, views: data.views };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextData));
      window.localStorage.setItem("iteration13:business-name:v1", name.slice(0, 48));
      window.localStorage.setItem("iteration13:business-palette:v1", JSON.stringify(brandColors.slice(0, 3)));
      window.localStorage.setItem("iteration13:store-theme:v1", themeColor);
      window.localStorage.setItem(CURRENCY_KEY, businessCurrency);
      window.localStorage.setItem("iteration13:identity-complete:v1", "true");
      if (!identityEditing && confirmedOverwrite) {
        window.localStorage.removeItem("iteration13:owner-notes:v1");
        window.localStorage.removeItem("iteration13:account-extras:v1");
        setOwnerNotes("");
      }
      setData(nextData);
      setBusinessName(name.slice(0, 48));
      setIdentityComplete(true);
      setHasPreviousSetup(true);
      setView(identityEditing ? "admin" : "shop");
      window.scrollTo({ top: 0, behavior: "smooth" });
      setNotice("Your business OS is ready. Your Store is open; Account and the private Briefcase are available from navigation.");
      resetServiceForm();
    } catch {
      setNotice("Your business setup could not be saved on this device. Check browser storage and try again.");
    }
  }
  const paidTotal = data.orders.reduce((sum, order) => sum + (order.paidAmount || 0), 0);
  const completedUnpaid = data.orders.filter(order => order.status === "Completed").reduce((sum, order) => sum + Math.max(0, order.price - (order.paidAmount || 0)), 0);
  
  const requestedValue = data.orders.filter(order => order.status !== "Declined").reduce((sum, order) => sum + order.price, 0);
  const projectedValue = data.orders.filter(order => ["Accepted", "In progress"].includes(order.status)).reduce((sum, order) => sum + order.price, 0);
  const completedValue = data.orders.filter(order => order.status === "Completed").reduce((sum, order) => sum + order.price, 0);
  const customerRecords = Array.from(new Map(data.orders.map(order => [order.email.toLowerCase(), { name: order.customerName, email: order.email, jobs: data.orders.filter(item => item.email.toLowerCase() === order.email.toLowerCase()) }] as const)).values());
  const selectedServices = data.services.filter(service => selectedServiceIds.includes(service.id) && service.active);
  const selectedService = selectedServices[0] || data.services.find(service => service.id === selected && service.active);
  const statusCounts = useMemo(() => data.orders.reduce<Record<string, number>>((acc, order) => { acc[order.status] = (acc[order.status] || 0) + 1; return acc; }, {}), [data.orders]);
  const localStorageBytes = useMemo<number | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      let total = 0;
      for (let index = 0; index < window.localStorage.length; index += 1) {
        const key = window.localStorage.key(index);
        if (!key || !key.startsWith("iteration13:")) continue;
        total += new Blob([key, window.localStorage.getItem(key) || ""]).size;
      }
      return total;
    } catch { return null; }
  }, [data, ownerNotes, businessName, brandColors, businessCurrency]);
  const localEvents = data.events || [];
  const recordedVisits = Math.max(data.views || 0, localEvents.filter(event => event.kind === "visit").length);
  const serviceSelections = localEvents.filter(event => event.kind === "service").length;
  const accountOpens = localEvents.filter(event => event.kind === "account").length;
  const recentLocalEvents = localEvents.slice(0, 6);

  function beginOrder(service: Service) {
    recordActivity("service", "Service selected · " + service.name);
    setSelected(service.id); setSelectedServiceIds([service.id]); setOrderFormOpen(true); setView("shop"); setNotice(`${service.name} added to your enquiry. Complete the request here, then follow it in your Account.`); setDueDate(""); setBrief("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function openRequestForm() {
    setOrderFormOpen(true); setView("shop");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function requestAdminLogin() {
    if (adminUnlocked) { setView("admin"); return; }
    setAdminPassphrase("");
    setView("login");
    setNotice("Enter the demo access word to open the owner workspace.");
  }
  function submitAdminLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (adminPassphrase.trim().toLowerCase() !== "admin") {
      setNotice("That word is not correct. Enter admin for this demo.");
      return;
    }
    setAdminUnlocked(true);
    setAdminPassphrase("");
    setView("admin");
    setNotice("Demo admin unlocked. This is not production authentication.");
  }
  function openAdminGuide(target?: "services" | "announcement" | "requests") {
    if (!adminUnlocked) { requestAdminLogin(); return; }
    setView("admin");
    setAdminTab(target === "requests" ? "work" : target === "services" || target === "announcement" ? "store" : "today");
    const targetId = target === "services" ? "admin-service-tools" : target === "announcement" ? "admin-announcement-tools" : target === "requests" ? "admin-requests-tools" : "admin-tools";
    window.setTimeout(() => document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" }), 120);
  }
  function submitOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedServices.length) { setNotice("Choose at least one service for this enquiry."); return; }
    if (!customerName.trim() || !email.trim() || !whatsapp.trim() || !brief.trim() || !dueDate) { setNotice("Add your name, email, WhatsApp number, project brief and requested timeline."); return; }
    const claim = (data.discountClaims || []).find(item => item.code.toLowerCase() === promoCode.trim().toLowerCase() && item.email.toLowerCase() === email.trim().toLowerCase() && item.status === "Available");
    if (promoCode.trim() && !claim) { setNotice("That discount code is not available for this customer account."); return; }
    const servicesTotal = selectedServices.reduce((sum, service) => sum + service.price, 0);
    const discountAmount = claim ? Math.min(claim.amount, servicesTotal) : 0;
    if (dueDate < localDate()) { setNotice("Choose today or a future date for your requested timeline."); return; }
    const createdAt = new Date().toISOString();
    const id = "DEMO-" + Date.now().toString(36).toUpperCase();
    const order: DemoOrder = { id, receiptNo: "RCP-" + createdAt.slice(0, 10).replaceAll("-", "") + "-" + id.slice(-5), serviceId: selectedServices[0].id, serviceName: selectedServices.map(service => service.name).join(" + "), serviceItems: selectedServices.map(({id,name,price}) => ({id,name,price})), price: Math.max(0, servicesTotal - discountAmount), ...(discountAmount ? { originalPrice: servicesTotal, discountAmount, discountCode: claim!.code } : {}), dueDate, customerName: customerName.trim(), email: email.trim(), whatsapp: whatsapp.trim(), notificationOptIn, brief: brief.trim(), status: "New request", createdAt, paymentStatus: "Unpaid", paidAmount: 0 };
    if (!commitData(current => ({ ...current, orders: [order, ...current.orders], discountClaims: claim ? (current.discountClaims || []).map(item => item.id === claim.id ? { ...item, status: "Redeemed" as const } : item) : current.discountClaims, events: [{ id: "EV-"+Date.now().toString(36), kind: "request", label: "Customer request received · "+order.serviceName, at: new Date().toISOString() }, ...(current.events || [])] }), "Order request saved on this device. No payment was taken.")) return;
    setView("account"); setSelected(null); setSelectedServiceIds([]); setPromoCode("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function buildAdminHubHandoffUrl() {
    const demo = { businessName: businessName.trim() || "Your Business", currency: businessCurrency, brandColors: brandColors.slice(0, 3), services: activeServices.slice(0, 8).map(service => ({ name: service.name, industry: service.industry || "", price: service.price, description: service.description || "" })), journey: [...demoJourney, ...(data.orders.length && !demoJourney.includes("Customer request submitted") ? ["Customer request submitted"] : []), ...(data.discountClaims?.length && !demoJourney.includes("Racing discount earned") ? ["Racing discount earned"] : [])] };
    const params = new URLSearchParams({ source: "iteration13", demo: JSON.stringify(demo) });
    return "https://www.adminhub-global.com/?" + params.toString();
  }
  function startEdit(service: Service) {
    setEditingId(service.id); setServiceName(service.name); setServiceIndustry(service.industry || ""); setServicePrice(String(service.price)); setServiceDescription(service.description); setServiceMedia(service.media); setServiceMediaType(service.mediaType); setServiceActive(service.active);
    document.getElementById("admin-service-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function saveService(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const price = Number(servicePrice);
    if (!serviceName.trim() || !Number.isFinite(price) || price < 0) { setNotice("Enter a service name and a valid price."); return; }
    if (serviceMediaUploading) { setNotice("Wait for the media upload to finish before saving the service."); return; }
    if (serviceMedia.trim()) { try { const parsedMedia = new URL(serviceMedia.trim()); if (parsedMedia.protocol !== "https:" && parsedMedia.protocol !== "http:") throw new Error("Unsupported protocol"); } catch { setNotice("Enter a valid http:// or https:// media URL, or upload the file first."); return; } }
    const service: Service = { id: editingId || "service-" + Date.now().toString(36), name: serviceName.trim(), industry: serviceIndustry.trim(), price, description: serviceDescription.trim(), media: serviceMedia.trim(), mediaType: serviceMediaType, active: serviceActive };
    if (!commitData(current => ({ ...current, services: editingId ? current.services.map(item => item.id === editingId ? service : item) : [...current.services, service] }), editingId ? "Service updated and saved on this device." : "Service added and saved on this device.")) return;
    resetServiceForm();
  }
  function resetServiceForm() { setEditingId(null); setServiceName(""); setServiceIndustry(""); setServicePrice("100"); setServiceDescription(""); setServiceMedia(""); setServiceMediaType("image"); setServiceActive(true); }
  function updateOrder(id: string, status: string) {
    const order = data.orders.find(item => item.id === id); const now = new Date().toISOString();
    commitData(current => ({ ...current, orders: current.orders.map(item => item.id === id ? { ...item, status, ...(status === "Completed" ? { completedAt: now } : {}) } : item), events: [{ id: "EV-"+Date.now().toString(36), kind: status === "Completed" ? "completed" : "request", label: (order?.serviceName || "Job")+" moved to "+status, at: now, test: order?.isTest }, ...(current.events || [])] }), order ? `${order.serviceName} status changed to ${status}. Saved on this device.` : "Request status saved on this device.");
  }
  function recordDemoPayment(id: string, amount: number) {
    const order = data.orders.find(item => item.id === id);
    if (!order) return;
    const alreadyPaid = Math.max(0, order.paidAmount || 0);
    const outstanding = Math.max(0, order.price - alreadyPaid);
    const payment = Math.round(amount * 100) / 100;
    if (!Number.isFinite(payment) || payment <= 0) { setNotice("Enter a payment amount greater than zero."); return; }
    if (outstanding <= 0) { setNotice("This request is already fully paid in the local demo."); return; }
    if (payment > outstanding) { setNotice("The payment cannot exceed the remaining balance of " + money(outstanding) + "."); return; }
    const now = new Date().toISOString();
    const paidAmount = Math.min(order.price, alreadyPaid + payment);
    const paymentStatus = paidAmount >= order.price ? "Paid (demo)" as const : "Partially paid (demo)" as const;
    const receiptNo = order.receiptNo || "RCP-" + now.slice(0, 10).replaceAll("-", "") + "-" + id.slice(-5);
    if (commitData(current => ({
      ...current,
      orders: current.orders.map(item => item.id === id ? { ...item, paymentStatus, paidAmount, paidAt: now, receiptNo } : item),
      events: [{ id: "EV-" + Date.now().toString(36), kind: "payment", label: "Demo payment recorded · " + money(payment) + " · " + order.serviceName, at: now, test: order.isTest }, ...(current.events || [])]
    }), money(payment) + " recorded on this device. Remaining balance: " + money(Math.max(0, order.price - paidAmount)) + ". No money moved.")) {
      setPaymentDrafts(current => ({ ...current, [id]: "" }));
    }
  }

  function assignPromoReward() {
    const normalized = promoAssignEmail.trim().toLowerCase();
    if (!normalized || !normalized.includes("@")) { setNotice("Enter a valid customer email for this promotion."); return; }
    const existing = (data.discountClaims || []).find(item => item.email.toLowerCase() === normalized && item.status === "Available");
    if (existing) { setNotice("This customer already has an unused discount code: " + existing.code); return; }
    const code = "PROMO-" + Math.random().toString(36).slice(2,7).toUpperCase();
    const claim: DiscountClaim = { id: "DISC-" + Date.now().toString(36), email: normalized, code, amount: data.discountAmount ?? 5, lapTime: 0, createdAt: new Date().toISOString(), status: "Available" };
    if (commitData(current => ({ ...current, discountClaims: [claim, ...(current.discountClaims || [])], events: [{ id: "EV-" + Date.now().toString(36), kind: "reward", label: "Promotional discount assigned · " + money(claim.amount), at: new Date().toISOString() }, ...(current.events || [])] }), "Promotional discount assigned to " + normalized + ": " + code)) setPromoAssignEmail("");
  }
  function replyToOrder(id: string) {
    const text = (adminReplyDrafts[id] || "").trim();
    if (!text) { setNotice("Write a reply before sending it."); return; }
    const message: AccountMessage = { id: "MSG-" + Date.now().toString(36), from: "studio", text, createdAt: new Date().toISOString() };
    if (commitData(current => ({ ...current, orders: current.orders.map(order => order.id === id ? { ...order, messages: [...(order.messages || []), message] } : order) }), "Studio reply saved to this browser's demo thread.")) setAdminReplyDrafts(current => ({ ...current, [id]: "" }));
  }

  return <main className="serviceDemo" style={{ "--studio-accent": themeColor, "--studio-accent-secondary": secondaryColor, "--studio-accent-highlight": highlightColor, "--studio-accent-ink": accentInk(themeColor), "--studio-accent-text": accentText(themeColor) } as React.CSSProperties}>
    {!identityReady || !ready || !businessNameReady ? <section className="sd-identity-loading" aria-live="polite">Preparing your business identity…</section> : !identityComplete && identityMode === "choice" ? <section className="sd-identity-choice">
      <div className="sd-identity-choice-shell">
        <div className="sd-identity-choice-heading"><span className="sd-kicker">ITERATION13 / BUSINESS OS</span><span className="sd-identity-choice-eyebrow">YOUR NEXT STEP</span><h1>Your business, <em>your choice.</em></h1><p>Start with a fresh business setup or deliberately reopen one you saved before. Your previous setup will not load automatically.</p></div>
        <div className="sd-identity-choice-grid">
          <article className="sd-identity-choice-card is-primary"><span>01 / START FRESH</span><h2>Create a new business</h2><p>Enter a new business name, choose your brand colours, set your currency and add the first service and its industry.</p><button type="button" onClick={startNewBusinessSetup}>Create new business <b aria-hidden="true">↗</b></button></article>
          <article className="sd-identity-choice-card"><span>02 / RETURN TO A SETUP</span><h2>Load previous setup</h2>{hasPreviousSetup ? <><div className="sd-identity-saved-preview"><strong>{businessName.trim() || "Your saved business"}</strong><small>{data.services.length} saved service{data.services.length === 1 ? "" : "s"} · {businessCurrency} · this browser</small><div>{brandColors.map(color => <i key={color} style={{ background: color }} />)}</div></div><p>Restore the business identity and local demo storefront saved on this device.</p><button type="button" onClick={loadPreviousBusinessSetup}>Load {businessName.trim() || "previous setup"} <b aria-hidden="true">↗</b></button></> : <><p>No previous business setup has been saved in this browser yet. Create one first and it will be available here next time.</p><button type="button" disabled>Nothing to load yet</button></>}</article>
        </div>
        <p className="sd-identity-choice-footnote">One business is saved on this device. Load it whenever you return, or create a new one and confirm before replacing it.</p>
      </div>
    </section> : !identityComplete ? <section className="sd-identity-onboarding">
      <div className="sd-identity-onboarding-top"><span>ITERATION13 / BUSINESS OS</span><span>{identityEditing ? "EDIT YOUR BUSINESS SETUP" : "YOUR BRIEFCASE STARTS HERE"}</span></div>
      <div className="sd-identity-onboarding-layout">
        <div className="sd-identity-onboarding-copy">
          <span className="sd-kicker">LIVE BUSINESS IDENTITY / MAKE IT YOURS</span>
          <h1>{businessName.trim() || "Your Business"} <em>at work.</em></h1>
          <p>{identityEditing ? "Update your business name, colours, currency and first Store listing. Your existing requests and other services stay in place." : "Set up your business once. Your Store welcomes customers, your Account keeps their work together, and your Briefcase gives you the keys to run it all."}</p>
          <label className="sd-identity-name-label">01 / Business name
            <input value={businessName} onChange={event => setBusinessName(event.target.value.slice(0, 48))} maxLength={48} autoComplete="organization" placeholder="Example: Metsi Wellness" />
          </label>
          <small className="sd-identity-helper">Example: Metsi Wellness. Use a real or fictional name. Your Store, Account and Briefcase rebrand together instantly.</small>
          <div className="sd-identity-currency"><label htmlFor="sd-business-currency">01 / Choose your business currency</label><select id="sd-business-currency" value={businessCurrency} onChange={event => setBusinessCurrency(event.target.value)}><option value="BWP">Botswana pula (BWP)</option><option value="ZAR">South African rand (ZAR)</option><option value="USD">US dollar (USD)</option><option value="GBP">British pound (GBP)</option><option value="EUR">Euro (EUR)</option><option value="INR">Indian rupee (INR)</option></select><small>Choose the currency your business sets its prices in. This changes display only; no exchange-rate conversion is applied.</small></div>
           <div className="sd-identity-palette">
            <div><strong>02 / Make it look like your brand</strong><span>{brandColors.length} of 3 selected · choose one, two or three</span></div>
            <div className="sd-identity-swatches">{brandColorOptions.map(option => <button key={option.color} type="button" className={brandColors.includes(option.color) ? "is-selected" : ""} style={{ "--swatch": option.color } as React.CSSProperties} aria-label={option.label} aria-pressed={brandColors.includes(option.color)} onClick={() => toggleBrandColor(option.color)}><span>{brandColors.includes(option.color) ? "✓" : "+"}</span><small>{option.label}</small></button>)}</div>
            <label className="sd-custom-colour">Custom colour <input aria-label="Choose a custom brand colour" type="color" value={customBrandColor} onChange={event => setCustomBrandColor(event.target.value)} /><button type="button" onClick={addCustomBrandColor}>{brandColors.includes(customBrandColor) ? "Already selected" : brandColors.length === 3 ? "Replace highlight" : "Add colour"}</button></label>
          </div>
          <section className="sd-identity-first-service" aria-labelledby="sd-first-service-title">
            <div className="sd-identity-step-heading"><span>03 / YOUR FIRST CUSTOMER OFFER</span><strong id="sd-first-service-title">Create your first service</strong><p>Add at least one service before opening your business space. You can add, edit, hide or remove more later.</p></div>
            <div className="sd-identity-service-fields">
              <label>Service name<input value={serviceName} onChange={event => setServiceName(event.target.value)} maxLength={80} required placeholder="e.g. Website design, Consultation, Haircut" /></label>
              <label>Industry / line of business<input value={serviceIndustry} onChange={event => setServiceIndustry(event.target.value)} maxLength={80} required placeholder="e.g. Beauty & wellness, automotive, retail" /></label>
              <label>Price ({businessCurrency})<input type="number" min="0" step="0.01" value={servicePrice} onChange={event => setServicePrice(event.target.value)} required /></label>
              <label>Description <span className="sd-identity-optional">Optional</span><textarea rows={3} value={serviceDescription} onChange={event => setServiceDescription(event.target.value)} placeholder="Explain what the customer receives." /></label>
              <ServiceMediaPicker value={serviceMedia} type="image" allowVideo={false} online={online} onChange={(url, type) => { setServiceMedia(url); setServiceMediaType(type); }} onUploadingChange={setServiceMediaUploading} />
              <p className="sd-identity-placeholder-note">No image is required. Leave media empty to use a clean branded service placeholder in your Store.</p>
            </div>
          </section>
          <button type="button" className="sd-identity-continue" onClick={() => completeBusinessIdentity()} disabled={!ready || serviceMediaUploading}>{serviceMediaUploading ? "Uploading service image…" : identityEditing ? "Save business setup" : "Create my Business OS"} <span>↗</span></button>
          <p className="sd-identity-local-note">Save your setup on this device, then explore the working Store, customer Account and owner Briefcase. Nothing syncs across devices.</p>{identityEditing && <button type="button" className="sd-small-button" onClick={() => { setIdentityEditing(false); setIdentityServiceId(null); setIdentityComplete(true); }}>Cancel editing</button>}
        </div>
        <div className="sd-identity-live-preview" aria-label="Live preview of your Store, Account and Briefcase">
          <div className="sd-identity-preview-brand" style={{ background: themeColor }}><span>{(businessName.trim() || "Your Business").slice(0,2).toUpperCase()}</span><div><strong>{businessName.trim() || "Your Business"}</strong><small>Your business in your pocket.</small></div></div>
          <div className="sd-identity-preview-grid">
            <article><span>01 / CUSTOMER</span><strong>Store</strong><p>Explore your services and send a request.</p></article>
            <article><span>02 / CUSTOMER</span><strong>Account</strong><p>Follow requests, messages and receipts.</p></article>
            <article><span>03 / OWNER</span><strong>Briefcase</strong><p>Manage customers, jobs, money and insights.</p></article>
          </div>
          <div className="sd-identity-service-preview" aria-live="polite">
            <span>FIRST STORE LISTING</span>
            <div className="sd-identity-service-preview-card">
              {serviceMedia ? <img src={serviceMedia} alt="First service image preview" /> : <div className="sd-identity-service-placeholder" style={{background:themeColor,color:accentInk(themeColor)}}><strong>{serviceName.trim() ? serviceName.trim().slice(0,1).toUpperCase() : "＋"}</strong><small>BRANDED PLACEHOLDER</small></div>}
              <div><strong>{serviceName.trim() || "Your first service"}</strong><b>{money(Number(servicePrice)||0)}</b><p>{serviceDescription.trim() || "Your service description will appear here."}</p></div>
            </div>
          </div>
          <div className="sd-identity-preview-footer"><span>YOUR BRAND PALETTE</span><div>{brandColors.map(color => <i key={color} style={{ background: color }} />)}</div><small>One identity · three connected areas</small></div>
        </div>
      </div>
    {pendingConfirm?.kind === "overwrite-business" && <div className="sd-confirm-backdrop" onClick={() => setPendingConfirm(null)}><section className="sd-confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="sd-onboarding-overwrite-title" aria-describedby="sd-onboarding-overwrite-description" onClick={event => event.stopPropagation()}><span className="sd-kicker">CONFIRM ACTION</span><h2 id="sd-onboarding-overwrite-title">Replace the saved business?</h2><p id="sd-onboarding-overwrite-description">This replaces the current business name, colours, currency and services. Its saved customer requests, messages and owner notes on this device will also be cleared. This cannot be undone.</p><div className="sd-confirm-actions"><button type="button" className="sd-button sd-outline" autoFocus onClick={() => setPendingConfirm(null)}>Keep existing setup</button><button type="button" className="sd-button sd-primary" onClick={() => { setPendingConfirm(null); completeBusinessIdentity(true); }}>Replace and create</button></div></section></div>}</section> : <>
    <div className="sd-topline"><div className="sd-wrap"><span>ITERATION13 <i className="sd-topline-divider">/</i> BUSINESS PREVIEW</span><span className={online ? "sd-connect" : "sd-connect is-offline"}><i />{online ? "Demo ready" : "Offline · local demo"}</span></div></div>
    <header className="sd-header"><div className="sd-wrap sd-nav"><button className="sd-brand" onClick={() => { setView("shop"); setNotice(""); window.scrollTo({top:0,behavior:"smooth"}); }} aria-label="Back to services"><span className="sd-logo">{(businessName.trim() || "YB").slice(0,2).toUpperCase()}</span><span><strong>{businessName || "Your Business"}</strong><small>STORE</small></span></button><nav aria-label="Main navigation"><button onClick={() => { setView("shop"); setNotice(""); }}>Store</button><button onClick={() => { recordDemoJourney("Customer account opened"); recordActivity("account", "Customer account opened"); setView("account"); setNotice(""); }}>Account <span className="sd-count">{data.orders.length}</span></button><button onClick={requestAdminLogin}>Login</button></nav></div></header>
    {!online && <aside className="sd-offline-notice" role="status"><strong>Offline mode · saved on this device</strong><span>Store, account and Briefcase demo changes remain local to this browser. Previously loaded Store media can be available; new uploads and remote services need internet.</span></aside>}


    {view === "shop" && <>
      <section className="sd-store-home">
        <div className="sd-wrap">
          <div className="sd-store-intro">
            <div className="sd-store-copy">
              <span className="sd-kicker"><span aria-hidden="true">💼</span> {businessName.toUpperCase()} / CUSTOMER STORE</span>
              <h1>Your business <em>in your pocket.</em></h1>
              <p>Explore {businessName.trim() || "the business"} services, choose what you need and send a request. Your updates stay together in one place.</p>
              <div className="sd-hero-actions">
                <button type="button" className="sd-hero-primary" onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth", block: "start" })}>Explore services <span aria-hidden="true">↘</span></button>
              </div>
            </div>
          </div>

        </div>
      </section>
      {(data.announcement.trim() || data.announcementImage) && <section className="sd-announcement"><div className="sd-wrap"><span><span aria-hidden="true">📣</span> STUDIO NOTE / SPECIAL</span>{data.announcementImage && <img className="sd-announcement-thumb" src={data.announcementImage} alt={data.announcement.slice(0, 120) || "Announcement image"} loading="lazy" />}<p>{data.announcement}</p></div></section>}
      <section className="sd-services sd-wrap" id="services"><div className="sd-section-head sd-compact-section-head"><div><span className="sd-kicker"><span aria-hidden="true">🛍️</span> STORE / SERVICES</span><h2>Choose what you need</h2></div><p>Starting prices. Choose a service to open a short request form.</p></div><div className="sd-service-grid">{activeServices.map((service,index)=><article className="sd-service-card" key={service.id}><div className={"sd-service-media sd-media-"+(index%4)} data-label={service.name}>{service.media&&service.mediaType==="video"?<video src={service.media} controls muted playsInline preload="metadata"/>:service.media?<img src={service.media} alt={service.name+" preview"} loading="lazy"/>:<div className="sd-media-placeholder"><span>13STUDIO</span><strong>{service.name}</strong></div>}<span className="sd-service-emoji" aria-hidden="true">{serviceEmoji(service.name)}</span><span className="sd-service-index">0{index+1}</span></div><div className="sd-service-info"><div className="sd-service-title"><h3>{service.name}</h3><strong>{money(service.price)}</strong></div><p>{service.description}</p><button className="sd-order-button" onClick={()=>beginOrder(service)}>Choose service <span>↗</span></button></div></article>)}</div></section>

    
      {orderFormOpen && <section className="sd-order-section sd-compact-order" id="service-order"><div className="sd-wrap sd-order-grid"><div className="sd-order-copy"><span className="sd-kicker">NEXT STEP</span><h2>Send a request</h2><p>Choose a service, tell us your target date and send the brief. Your date is a preference until reviewed.</p><div className="sd-order-note"><span>i</span><p><strong>Demo only.</strong><br/>No payment is taken and no delivery date is confirmed.</p></div></div><form className="sd-order-form" onSubmit={submitOrder}><div className="sd-form-heading"><button type="button" className="sd-form-close" onClick={() => setOrderFormOpen(false)} aria-label="Close request form">×</button><span>REQUEST DETAILS</span><strong>{selectedServices.length?selectedServices.map(service=>service.name).join(" + "):"Choose a service"}</strong>{selectedServices.length>0&&<b>{money(selectedServices.reduce((sum,service)=>sum+service.price,0))} <small>estimated total</small></b>}</div><fieldset className="sd-enquiry-services"><legend>Services in this enquiry</legend><p>Choose one or more services. You can add to or remove them before sending.</p>{activeServices.map(service=><label key={service.id}><input type="checkbox" checked={selectedServiceIds.includes(service.id)} onChange={event=>{const next=event.target.checked?[...selectedServiceIds,service.id]:selectedServiceIds.filter(id=>id!==service.id);setSelectedServiceIds(next);setSelected(next[0]||null);}}/><span>{service.name}</span><strong>{money(service.price)}</strong></label>)}</fieldset><div className="sd-form-two"><label>Your name<input value={customerName} onChange={event=>setCustomerName(event.target.value)} autoComplete="name" required placeholder="Name or business"/></label><label>Email<input value={email} onChange={event=>setEmail(event.target.value)} type="email" autoComplete="email" required placeholder="you@example.com"/></label></div><label>WhatsApp number<input type="tel" value={whatsapp} onChange={event=>setWhatsapp(event.target.value)} autoComplete="tel" required placeholder="+267 …"/></label><label>Target date<input type="date" value={dueDate} min={localDate()} onChange={event=>setDueDate(event.target.value)} required/><small>Your requested date is reviewed before confirmation.</small></label><label>Discount code <span className="sd-optional">OPTIONAL</span><input value={promoCode} onChange={event=>setPromoCode(event.target.value.toUpperCase())} placeholder="Enter a game reward code" /></label><label>Project brief<textarea value={brief} onChange={event=>setBrief(event.target.value)} rows={3} placeholder="What would you like to achieve?" required/></label><label className="sd-enquiry-notifications"><input type="checkbox" checked={notificationOptIn} onChange={event=>setNotificationOptIn(event.target.checked)}/> Keep me informed about updates to this enquiry <span>In-app updates appear in your Account. Push and email delivery are not connected in this demo.</span></label><button className="sd-button sd-primary sd-submit" type="submit">Send request →</button><p className="sd-privacy-note">Saved in this browser only · no payment taken</p></form></div></section></>}

    {view === "account" && <AccountWorkspace businessName={businessName.trim() || "Your Business"} orders={data.orders} discountClaims={data.discountClaims || []} receiptProfile={data.receiptProfile} accentColor={themeColor} email={email} setEmail={setEmail} online={online} announcement={data.announcement} onBrowse={() => { setView("shop"); setNotice(""); }} onUpdateOrder={(orderId, update, message) => { commitData(current => ({ ...current, orders: current.orders.map(order => order.id === orderId ? update(order) : order) }), message); }}><section className="sd-racing-promo sd-wrap" id="racing-rewards">
        <div className="sd-racing-promo-copy"><span className="sd-kicker">PLAY / EARN A LITTLE EXTRA</span><h2>Race for a little extra.</h2><p>{data.rewardActive === false ? "The sprint is currently paused. Check back when a reward is published." : data.rewardDescription || "Drive for eight seconds and keep it clean to unlock a discount for your next request."}</p></div>
        <details className="sd-racing-details" onToggle={event => { if (event.currentTarget.open) recordDemoJourney("Racing discount explored"); }}><summary><span aria-hidden="true">🏁</span><strong>8-second sprint · {money(data.discountAmount ?? 5)} OFF</strong><span className="sd-racing-open">Play now ↗</span></summary>
          <RacingWarmup embedded discountAmount={data.discountAmount ?? 5} sprintDuration={8} promoTitle={data.rewardTitle || "Race for a discount."} promoDescription={data.rewardDescription || "Drive for eight seconds. Keep it clean to unlock the published discount on your next request."} promoImage={data.rewardImage || ""} rewardEnabled={data.rewardActive !== false} onDiscountEarned={(customerEmail, lapTime) => { const normalized = customerEmail.trim().toLowerCase(); if (!normalized || !normalized.includes("@")) { setNotice("Enter your email in the racing panel to receive a discount."); return; } const existing = (data.discountClaims || []).find(item => item.email.toLowerCase() === normalized && item.status === "Available"); if (existing) { setNotice("You already have an unused discount code in this browser account: "+existing.code); return; } const code = "RACE-"+Math.random().toString(36).slice(2,7).toUpperCase(); const claim: DiscountClaim = { id:"DISC-"+Date.now().toString(36), email:normalized, code, amount:data.discountAmount ?? 5, lapTime, createdAt:new Date().toISOString(), status:"Available" }; commitData(current=>({...current,discountClaims:[claim,...(current.discountClaims||[])],events:[{id:"EV-"+Date.now().toString(36),kind:"reward",label:"Racing discount earned · "+money(claim.amount),at:new Date().toISOString()},...(current.events||[])]}),"You earned "+money(claim.amount)+" off. Code "+code+" is saved for "+normalized+"."); }} />
        </details>
      </section></AccountWorkspace>}

    {view === "login" && <section className="sd-admin sd-wrap"><div className="sd-admin-panel sd-admin-login-card" style={{maxWidth:480,margin:"clamp(28px,8vh,84px) auto",padding:24}}><span className="sd-kicker">ITERATION13 / YOUR PRIVATE BRIEFCASE</span><h1 style={{fontSize:"clamp(1.8rem,5vw,2.5rem)",margin:"8px 0"}}>Open your <em>Briefcase.</em></h1><p className="sd-admin-help">This is the owner side of your business: customers, jobs, money, Store design and the records that keep everything together.</p><form className="sd-admin-form" onSubmit={submitAdminLogin}><label>Demo access word<input type="password" autoComplete="off" value={adminPassphrase} onChange={event=>setAdminPassphrase(event.target.value)} placeholder="Enter access word" required /></label><button className="sd-button sd-primary" type="submit">Unlock my Briefcase →</button></form><p className="sd-admin-help" style={{marginTop:12}}>Demo word: <strong>admin</strong>. This client-side gate is for demonstration only; it does not protect real data.</p><button className="sd-button sd-outline" type="button" onClick={() => { setView("shop"); setNotice(""); }}>← Back to Store</button></div></section>}

    {view === "admin" && adminUnlocked && <section className="sd-admin sd-wrap" data-admin-current={adminTab}><div className="sd-os-heading"><div><span className="sd-kicker">ADMIN HUB / PRIVATE BRIEFCASE</span><small className="sd-owner-greeting">{ownerGreeting}</small><h1>Your business in your pocket.</h1><p><strong>{businessName.trim() || "Your Business"}</strong> · Your keys to customers, jobs, money and records</p></div><span className="sd-os-status">LOCAL DEMO</span></div><section className="sd-business-identity" data-admin-tab="store" aria-label="Business identity">
  <div className="sd-business-identity-fields">
    <label>Business name<input value={businessName} onChange={event => setBusinessName(event.target.value.slice(0, 48))} maxLength={48} autoComplete="organization" /></label>
    <small>Example: Metsi Wellness. Use a real or fictional name. Your Store, Account and Briefcase rebrand together instantly.</small>
  </div>
  <div className="sd-business-identity-preview" style={{borderColor:themeColor}}><span className="sd-kicker">LIVE BUSINESS IDENTITY</span><strong>{businessName.trim() || "Your Business"}</strong><small>Store · Account · Briefcase</small><button type="button" className="sd-small-button" onClick={openBusinessSetup}>Edit business setup ↗</button></div>
</section>
<div className="sd-theme-control sd-palette-control" aria-label="Business brand colours"><div><strong>Brand palette · {brandColors.length} of 3 colours</strong><small>One to three brand colours shared by Store, Account, Briefcase and receipts.</small></div><div className="sd-admin-palette-swatches">{brandColorOptions.map(option => <button key={option.color} type="button" className={brandColors.includes(option.color) ? "is-selected" : ""} style={{ "--swatch": option.color } as React.CSSProperties} aria-label={option.label} aria-pressed={brandColors.includes(option.color)} onClick={() => toggleBrandColor(option.color)}>{brandColors.includes(option.color) ? "✓" : "+"}</button>)}<label title="Choose a custom brand colour"><input type="color" value={customBrandColor} onChange={event=>setCustomBrandColor(event.target.value)} aria-label="Custom brand colour"/><button type="button" onClick={addCustomBrandColor}>Add</button></label></div></div><div className="sd-briefcase-guide"><span className="sd-kicker">THE KEYS TO YOUR BUSINESS</span><p>Each section handles a different part of running your business. Start with Today, then move into customer work, money and the Store your customers see.</p></div><nav className="sd-os-nav" aria-label="Business OS sections"><button type="button" aria-pressed={adminTab==="today"} onClick={()=>setAdminTab("today")}>Today</button><button type="button" aria-pressed={adminTab==="work"} onClick={()=>setAdminTab("work")}>Customers &amp; jobs</button><button type="button" aria-pressed={adminTab==="money"} onClick={()=>setAdminTab("money")}>Money</button><button type="button" aria-pressed={adminTab==="store"} onClick={()=>setAdminTab("store")}>Store design</button><button type="button" aria-pressed={adminTab==="notes"} onClick={()=>setAdminTab("notes")}>My Notes</button><button type="button" aria-pressed={adminTab==="insights"} onClick={()=>setAdminTab("insights")}>Insights</button></nav><div className="sd-admin-head"><div><span className="sd-kicker">YOUR BRIEFCASE / TODAY</span><h2>Run your business from here</h2><p>Start with what needs attention, then manage customers, jobs, money, Store design and records from one place. Demo changes stay on this device.</p></div><div className="sd-admin-head-actions"><button className="sd-button sd-outline" onClick={() => setView("shop")}>View storefront ↗</button><button className="sd-button sd-outline" onClick={() => setView("account")}>Customer account ↗</button></div></div><div className="sd-stats" id="admin-today" data-admin-tab="today"><article><span>Submitted requests</span><strong>{data.orders.length}</strong><small>{data.views > 0 ? Math.round(data.orders.length / data.views * 100) : 0}% visit-to-request rate</small></article><article><span>New requests</span><strong>{statusCounts["New request"] || 0}</strong><small>{data.orders.length ? Math.round((statusCounts["New request"] || 0) / data.orders.length * 100) : 0}% of requests</small></article><article><span>Menu services</span><strong>{data.services.length}</strong><small>{data.services.length ? Math.round(activeServices.length / data.services.length * 100) : 0}% visible</small></article><article><span>Customer emails</span><strong>{new Set(data.orders.map(order => order.email.toLowerCase())).size}</strong><small>{data.orders.length ? Math.round(new Set(data.orders.map(order => order.email.toLowerCase())).size / data.orders.length * 100) : 0}% unique emails per request count</small></article><article><span>Store visits this demo</span><strong>{data.views}</strong><small>Local browser count · not unique visitors</small></article></div><section className="sd-owner-action-desk" data-admin-tab="today" aria-labelledby="sd-owner-action-title"><div className="sd-owner-action-copy"><span className="sd-kicker">YOUR NEXT MOVES</span><h2 id="sd-owner-action-title">Keep the business moving.</h2><p>Start with the work that needs your attention. These counts come from the requests saved in this browser.</p></div><div className="sd-owner-action-grid"><article><span className="sd-owner-action-icon" aria-hidden="true">↗</span><div><strong>{statusCounts["New request"] || 0}</strong><b>New requests</b><small>Waiting for your first review</small></div><button type="button" onClick={() => setAdminTab("work")}>Review requests</button></article><article><span className="sd-owner-action-icon" aria-hidden="true">◷</span><div><strong>{data.orders.filter(order => !["Completed", "Declined"].includes(order.status)).length}</strong><b>Active jobs</b><small>Not yet completed or declined</small></div><button type="button" onClick={() => setAdminTab("work")}>Open job list</button></article><article><span className="sd-owner-action-icon" aria-hidden="true">▦</span><div><strong>{activeServices.length}</strong><b>Live services</b><small>Visible in your customer Store</small></div><button type="button" onClick={() => setAdminTab("store")}>Manage Store</button></article></div></section><section className="sd-admin-panel sd-finance-panel" id="admin-finance" data-admin-tab="money"><div className="sd-discount-admin"><div className="sd-panel-head"><div><span className="sd-kicker">CUSTOMER REWARDS</span><h3>Sprint discount promotion</h3><p className="sd-admin-help">Edit the offer customers see beside the racing game. Changes stay in this browser demo.</p></div><span className="sd-local-pill">OWNER CONTROLLED</span></div><div className="sd-reward-editor"><label>Promotion headline<input maxLength={80} value={rewardTitleDraft} onChange={event=>setRewardTitleDraft(event.target.value)} placeholder="Race for a discount." /></label><label>Customer announcement<textarea rows={3} maxLength={280} value={rewardDescriptionDraft} onChange={event=>setRewardDescriptionDraft(event.target.value)} placeholder="Tell customers what the reward is and how to earn it." /></label><label>Discount for a clean eight-second sprint ({businessCurrency})<input type="number" min="0.01" max="5000" step="0.01" value={rewardDiscountDraft} onChange={event=>setRewardDiscountDraft(event.target.value)} /></label><AnnouncementImagePicker value={rewardImageDraft} online={online} onChange={setRewardImageDraft} onUploadingChange={setRewardImageUploading} /><div className="sd-reward-admin-actions"><button className="sd-small-button" type="button" disabled={rewardImageUploading} onClick={()=>{const amount=Number(rewardDiscountDraft);if(!rewardTitleDraft.trim()||!rewardDescriptionDraft.trim()){setNotice("Add a promotion headline and customer announcement first.");return;}if(!Number.isFinite(amount)||amount<=0||amount>5000){setNotice("Enter a valid discount amount in " + businessCurrency + ".");return;}commitData(current=>({...current,rewardTitle:rewardTitleDraft.trim(),rewardDescription:rewardDescriptionDraft.trim(),rewardImage:rewardImageDraft.trim(),discountAmount:amount,rewardActive:true}),"Sprint discount published on this device.");}}>Save &amp; publish reward</button><button className="sd-small-button" type="button" onClick={()=>commitData(current=>({...current,rewardActive:false}),"Sprint discount hidden from the customer Store.")}>Hide reward</button><button className="sd-small-button" type="button" onClick={()=>{setRewardTitleDraft("");setRewardDescriptionDraft("");setRewardImageDraft("");setRewardDiscountDraft("5");commitData(current=>({...current,rewardTitle:"",rewardDescription:"",rewardImage:"",discountAmount:5,rewardActive:false}),"Sprint discount removed from this device.");}}>Remove promotion</button></div><div className="sd-reward-preview"><span>STORE PREVIEW</span><div>{rewardImageDraft?<img src={rewardImageDraft} alt="Lap reward thumbnail preview"/>:<span className="sd-reward-preview-fallback">🏁</span>}<section><strong>{rewardTitleDraft||"Your promotion headline"}</strong><p>{rewardDescriptionDraft||"Your customer announcement will appear here."}</p><b>{money(Number(rewardDiscountDraft)>0?Number(rewardDiscountDraft):0)} OFF</b></section></div><small>{data.rewardActive===false?"Currently hidden":"Currently published"} · save to apply edits</small></div></div><label>Customer email for a direct promotion<input type="email" value={promoAssignEmail} onChange={event=>setPromoAssignEmail(event.target.value)} placeholder="customer@example.com" /></label><button className="sd-small-button" type="button" onClick={assignPromoReward}>Assign discount to customer →</button><div className="sd-discount-claims">{(data.discountClaims || []).length ? (data.discountClaims || []).slice(0,8).map(claim=><article key={claim.id}><strong>{claim.code}</strong><span>{claim.email}</span><b>{money(claim.amount)} · {claim.status}</b></article>) : <p className="sd-admin-empty">No racing rewards earned yet.</p>}</div></div>
<div className="sd-panel-head"><div><span className="sd-kicker">FINANCE / LOCAL DEMO LEDGER</span><h2>Money &amp; receipts</h2></div><span className="sd-local-pill">SIMULATED RECORDS</span></div>
<div className="sd-finance-metrics"><article><small>Payments received</small><strong>{money(paidTotal)}</strong></article><article><small>Completed value</small><strong>{money(completedValue)}</strong></article><article><small>Projected · accepted / active</small><strong>{money(projectedValue)}</strong></article><article><small>Requested value · excluding declined</small><strong>{money(requestedValue)}</strong></article><article><small>Completed · unpaid</small><strong>{money(completedUnpaid)}</strong></article></div>
<p className="sd-admin-help">Paid totals include only payments recorded in this demo. Completed-unpaid and active pipeline are estimates, not cash received.</p>
<div className="sd-receipt-profile"><h3>Business details on receipts</h3><p className="sd-admin-help">Use the business&apos;s own details and tax references in this prototype document.</p>
<div className="sd-form-two">
<label>Registered / legal name (if different)<input value={data.receiptProfile?.legalName || ""} onChange={event=>commitData(current=>({...current,receiptProfile:{...emptyData.receiptProfile!,...(current.receiptProfile||{}),legalName:event.target.value}}),"Receipt business name saved on this device.")}/></label>
<label>Tax / BURS reference<input value={data.receiptProfile?.registration || ""} onChange={event=>commitData(current=>({...current,receiptProfile:{...emptyData.receiptProfile!,...(current.receiptProfile||{}),registration:event.target.value}}),"Tax reference saved on this device.")}/></label>
<label>Business address<input value={data.receiptProfile?.address || ""} onChange={event=>commitData(current=>({...current,receiptProfile:{...emptyData.receiptProfile!,...(current.receiptProfile||{}),address:event.target.value}}),"Receipt address saved on this device.")}/></label>
<label>Contact number<input value={data.receiptProfile?.phone || ""} onChange={event=>commitData(current=>({...current,receiptProfile:{...emptyData.receiptProfile!,...(current.receiptProfile||{}),phone:event.target.value}}),"Receipt contact saved on this device.")}/></label></div>
<label className="sd-admin-label">Receipt footer / tax note<textarea rows={2} value={data.receiptProfile?.footer || ""} onChange={event=>commitData(current=>({...current,receiptProfile:{...emptyData.receiptProfile!,...(current.receiptProfile||{}),footer:event.target.value}}),"Receipt footer saved on this device.")}/></label></div></section>
<section className="sd-admin-panel sd-customers-panel" id="admin-customers" data-admin-tab="work"><div className="sd-panel-head"><div><span className="sd-kicker">CUSTOMER DIRECTORY</span><h2>Customers</h2></div><span className="sd-local-pill">{customerRecords.length} DEMO CONTACTS</span></div>
{customerRecords.length ? <div className="sd-customer-list">{customerRecords.map(customer=><article key={customer.email}><div><strong>{customer.name}</strong><span>{customer.email}</span></div><b>{customer.jobs.length} {customer.jobs.length===1?"job":"jobs"}</b><small>{money(customer.jobs.reduce((sum,job)=>sum+job.price,0))} total request value</small></article>)}</div> : <p className="sd-admin-empty">Customer profiles appear here when someone submits a Store request.</p>}</section><section className="sd-admin-panel sd-activity-panel" id="admin-activity" data-admin-tab="insights"><div className="sd-panel-head"><div><span className="sd-kicker">ACTIVITY / DEMO EVENT LOG</span><h2>What happened</h2></div><span className="sd-local-pill">THIS BROWSER</span></div><div className="sd-activity-summary"><span><strong>{data.views}</strong> Store visits recorded</span><span><strong>{data.orders.length}</strong> requests / jobs</span><span><strong>{data.events?.length || 0}</strong> recent events</span></div><div className="sd-event-list">{(data.events || []).slice(0,8).map(event=><article key={event.id}><i className={"sd-event-dot "+(event.test?"is-test":"")}/><div><strong>{event.label}</strong><small>{new Date(event.at).toLocaleString()} {event.test?"· TEST":""}</small></div></article>)}</div><p className="sd-admin-help">Vercel Analytics and Speed Insights are included at application level. This prototype shows the local event trail tied to the demo customer and job records; it does not fetch private Vercel dashboard analytics or connect Firebase Analytics.</p></section><section className="sd-admin-panel sd-admin-performance" data-admin-tab="insights"><div className="sd-panel-head"><div><span className="sd-kicker">04 / DEMO PERFORMANCE</span><h2>Conversion &amp; operations</h2></div><span className="sd-local-pill">LOCAL DEMO DATA</span></div><p className="sd-admin-help">Percentages are calculated from this browser’s saved demo counts only. They are directional indicators, not shared production analytics.</p><div className="sd-performance-grid"><article><div><span>Visit to request</span><strong>{data.views > 0 ? Math.round(data.orders.length / data.views * 100) : 0}%</strong></div><div className="sd-performance-track"><span style={{width: `${Math.min(100, data.views > 0 ? data.orders.length / data.views * 100 : 0)}%`}} /></div><small>{data.orders.length} requests from {data.views} recorded visits</small></article><article><div><span>Visible service menu</span><strong>{data.services.length ? Math.round(activeServices.length / data.services.length * 100) : 0}%</strong></div><div className="sd-performance-track"><span style={{width: `${data.services.length ? activeServices.length / data.services.length * 100 : 0}%`}} /></div><small>{activeServices.length} of {data.services.length} services visible</small></article><article><div><span>Requests needing attention</span><strong>{data.orders.length ? Math.round((data.orders.length - (statusCounts["Completed"] || 0) - (statusCounts["Declined"] || 0)) / data.orders.length * 100) : 0}%</strong></div><div className="sd-performance-track"><span style={{width: `${data.orders.length ? (data.orders.length - (statusCounts["Completed"] || 0) - (statusCounts["Declined"] || 0)) / data.orders.length * 100 : 0}%`}} /></div><small>{data.orders.length - (statusCounts["Completed"] || 0) - (statusCounts["Declined"] || 0)} active of {data.orders.length} requests</small></article><article><div><span>New request share</span><strong>{data.orders.length ? Math.round((statusCounts["New request"] || 0) / data.orders.length * 100) : 0}%</strong></div><div className="sd-performance-track"><span style={{width: `${data.orders.length ? (statusCounts["New request"] || 0) / data.orders.length * 100 : 0}%`}} /></div><small>{statusCounts["New request"] || 0} new of {data.orders.length} requests</small></article></div></section>
      <section className="sd-admin-panel sd-showcase-preview" data-admin-tab="store" aria-live="polite">
  <div className="sd-panel-head"><div><span className="sd-kicker"><span aria-hidden="true">🏪</span> LIVE STOREFRONT / SHOWCASE</span><h2>{businessName.trim() || "Your Business"}</h2></div><span className="sd-local-pill">DISPLAYING IN DEMO STORE</span></div>
  <div className="sd-showcase-preview-head"><div><span>YOUR BUSINESS / CUSTOMER VIEW</span><strong>What customers see</strong><p>Your selected colour, business name and currently visible products or services.</p></div><button className="sd-small-button" type="button" onClick={() => { setView("shop"); window.scrollTo({top:0,behavior:"smooth"}); }}>Open full Store ↗</button></div>
  {(data.announcement.trim() || data.announcementImage) && <section className="sd-announcement sd-showcase-announcement"><div className="sd-wrap"><span><span aria-hidden="true">📣</span> STUDIO NOTE / SPECIAL</span>{data.announcementImage && <img className="sd-announcement-thumb" src={data.announcementImage} alt={data.announcement.slice(0, 120) || "Announcement image"} />}<p>{data.announcement}</p></div></section>}
  <div className="sd-showcase-preview-grid">{activeServices.length ? activeServices.map((service,index)=><article key={service.id}><div className="sd-showcase-preview-media sd-service-media">{service.media&&service.mediaType==="video"?<video src={service.media} muted playsInline controls preload="metadata"/>:service.media?<img src={service.media} alt={service.name+" preview"} loading="lazy"/>:<div className="sd-showcase-media-fallback"><span>{serviceEmoji(service.name)}</span></div>}<span className="sd-service-emoji" aria-hidden="true">{serviceEmoji(service.name)}</span></div><div className="sd-showcase-preview-copy"><span className="sd-showcase-preview-index">0{index+1}</span><strong>{service.name}</strong><b>{money(service.price)}</b><p>{service.description || "A service from this business."}</p></div></article>) : <p className="sd-admin-empty">No visible products or services yet. Add one below to populate the Store preview.</p>}</div>
  <div className="sd-showcase-footer"><button className="sd-brand sd-owner-entry" type="button" disabled aria-label="Preview of the owner Briefcase footer link"><span className="sd-briefcase-mark" aria-hidden="true">💼</span><span className="sd-owner-entry-copy"><strong>Iteration13</strong><small>OPEN YOUR BRIEFCASE</small><em>{businessName || "Your Business"}</em></span><span className="sd-owner-entry-arrow" aria-hidden="true">↗</span></button><p>Built to be explored online and offline.</p><div><span>My account</span><span>Store links</span></div></div><p className="sd-admin-help">Preview updates from the same local demo data as your Store. The footer Briefcase card matches the customer-facing Store. Saving, hiding or deleting a service changes this showcase; it does not publish a live customer website.</p>
</section>
<div className="sd-admin-grid"><section className="sd-admin-panel" id="admin-service-tools"><div className="sd-panel-head"><div><span className="sd-kicker">01 / SERVICE CRUD</span><h2>Service menu</h2></div><button className="sd-small-button" onClick={() => { resetServiceForm(); setNotice("New service form ready."); }}>+ New service</button></div><div className="sd-admin-services">{data.services.map(service => <article key={service.id}><div><strong>{service.name}</strong><span>{money(service.price)} · {service.active ? "Visible" : "Hidden"}</span></div><div className="sd-row-actions"><button onClick={() => { startEdit(service); setNotice(`Editing ${service.name}. Save your changes when ready.`); }}>Edit</button><button onClick={() => toggleService(service)}>{service.active ? "Hide" : "Show"}</button><button className="sd-danger" onClick={() => setPendingConfirm({ kind: "delete-service", serviceId: service.id, serviceName: service.name })}>Delete</button></div></article>)}</div>
      <form className="sd-admin-form" id="admin-service-form" onSubmit={saveService}><h3>{editingId ? "Edit service" : "Add a service"}</h3><label>Service name<input value={serviceName} onChange={event => setServiceName(event.target.value)} required /></label><label>Industry / line of business<input value={serviceIndustry} onChange={event => setServiceIndustry(event.target.value)} placeholder="e.g. Beauty & wellness, automotive, retail, consulting" maxLength={80} required /></label><p className="sd-admin-help">Classify each service by the industry it belongs to. Different services can belong to different industries.</p><label>Price ({businessCurrency})<input type="number" min="0" step="1" value={servicePrice} onChange={event => setServicePrice(event.target.value)} required /></label><label>Description<textarea rows={3} value={serviceDescription} onChange={event => setServiceDescription(event.target.value)} /></label><ServiceMediaPicker value={serviceMedia} type={serviceMediaType} online={online} onChange={(url, type) => { setServiceMedia(url); setServiceMediaType(type); }} onUploadingChange={setServiceMediaUploading} /><label className="sd-check"><input type="checkbox" checked={serviceActive} onChange={event => setServiceActive(event.target.checked)} /> Show on customer storefront</label><div className="sd-form-two"><button className="sd-button sd-primary" type="submit" disabled={serviceMediaUploading}>{serviceMediaUploading ? "Uploading media…" : editingId ? "Save changes" : "Add service"}</button><button className="sd-button sd-outline" type="button" onClick={resetServiceForm}>Cancel</button></div></form></section>
      <section className="sd-admin-panel" id="admin-announcement-tools"><div className="sd-panel-head"><div><span className="sd-kicker">02 / CUSTOMER NOTICE</span><h2>Special announcement</h2></div></div><p className="sd-admin-help">Publish a short promotion or service update. Leave both fields empty to remove it from the storefront.</p><label className="sd-admin-label">Announcement<textarea rows={4} value={announcementDraft} onChange={event => setAnnouncementDraft(event.target.value)} placeholder="Example: Book your next project this month…" /></label><AnnouncementImagePicker value={announcementImageDraft} online={online} onChange={setAnnouncementImageDraft} onUploadingChange={setAnnouncementImageUploading} /><button className="sd-button sd-primary" disabled={announcementImageUploading} onClick={() => { const announcement = announcementDraft.trim(); const announcementImage = announcementImageDraft.trim(); if (announcementImage) { try { const parsed = new URL(announcementImage); if (parsed.protocol !== "https:" && parsed.protocol !== "http:") throw new Error("Unsupported protocol"); } catch { setNotice("Enter a valid image URL or upload the thumbnail before publishing."); return; } } commitData(current => ({ ...current, announcement, announcementImage }), announcement || announcementImage ? "Announcement published on this device." : "Announcement cleared from the storefront."); }}>{announcementImageUploading ? "Uploading thumbnail…" : "Publish announcement"}</button><div className="sd-live-preview"><span>STOREFRONT PREVIEW</span>{(announcementDraft.trim() || announcementImageDraft.trim()) ? <div className="sd-announcement sd-announcement-preview"><div className="sd-wrap"><span><span aria-hidden="true">📣</span> STUDIO NOTE / SPECIAL</span>{announcementImageDraft.trim() && <img className="sd-announcement-thumb" src={announcementImageDraft} alt={announcementDraft.slice(0, 120) || "Announcement image"} />}<p>{announcementDraft.trim()}</p></div></div> : <p>Your announcement banner will appear here when published.</p>}</div><div className="sd-panel-head sd-request-head" id="admin-requests-tools"><div><span className="sd-kicker">03 / INCOMING WORK</span><h2>Customer requests</h2></div></div>{data.orders.length === 0 ? <div className="sd-admin-empty">No requests yet. Submit a customer request from the Store to see it appear here.</div> : <div className="sd-admin-orders">{data.orders.map(order => <article key={order.id}><div className="sd-admin-order-top"><strong>{order.serviceName} · {money(order.price)} {order.isTest && <span className="sd-test-label">TEST</span>}</strong><span>{order.id}</span></div><p>{order.customerName} · {order.email}{order.whatsapp ? " · WhatsApp " + order.whatsapp : ""}</p><p>Requested date: <b>{order.dueDate}</b></p><p>Payment: <b>{order.paymentStatus || "Unpaid"}</b> · {money(order.paidAmount || 0)} received · {money(Math.max(0,order.price-(order.paidAmount||0)))} due</p>{order.discountAmount ? <p>Discount: <b>{money(order.discountAmount)} off · {order.discountCode}</b> (regular {money(order.originalPrice || order.price + order.discountAmount)})</p> : null}{order.brief && <p>{order.brief}</p>}<div className="sd-order-admin-actions">{Math.max(0, order.price - (order.paidAmount || 0)) > 0 && <label className="sd-payment-entry">Record payment (demo)<span><input type="number" min="0.01" max={Math.max(0, order.price - (order.paidAmount || 0))} step="0.01" value={paymentDrafts[order.id] ?? String(Math.max(0, order.price - (order.paidAmount || 0)))} onChange={event=>setPaymentDrafts(current=>({...current,[order.id]:event.target.value}))} aria-label={"Payment amount for "+order.serviceName}/><button className="sd-small-button" type="button" onClick={()=>recordDemoPayment(order.id,Number(paymentDrafts[order.id] ?? Math.max(0, order.price - (order.paidAmount || 0))))}>Record amount</button></span></label>}<label>Request status<select value={order.status} onChange={event => updateOrder(order.id, event.target.value)}><option>New request</option><option>Reviewing</option><option>Accepted</option><option>In progress</option><option>Completed</option><option>Declined</option></select></label></div><ReceiptDocument businessName={businessName.trim() || "Your Business"} accentColor={themeColor} receiptProfile={data.receiptProfile} order={order}/><div className="sd-admin-thread"><strong>Customer conversation · {(order.messages || []).length} messages</strong>{(order.messages || []).map(message => <div className={"sd-admin-thread-message is-" + message.from} key={message.id}><b>{message.from === "customer" ? "Customer" : "Studio / Admin"}</b><small>{new Date(message.createdAt).toLocaleString()}</small>{message.text && <p>{message.text}</p>}{message.attachment && <a href={message.attachment.url} target="_blank" rel="noreferrer">↗ {message.attachment.name}</a>}</div>)}<form onSubmit={event => { event.preventDefault(); replyToOrder(order.id); }}><label>Reply to customer<textarea rows={2} value={adminReplyDrafts[order.id] || ""} onChange={event => setAdminReplyDrafts(current => ({ ...current, [order.id]: event.target.value }))} placeholder="Write a project update or question…" maxLength={1200}/></label><button className="sd-small-button" type="submit" disabled={!(adminReplyDrafts[order.id] || "").trim()}>Save reply to local thread →</button></form></div></article>)}</div>}</section></div><section className="sd-admin-panel sd-capacity-reference" data-admin-tab="insights">
  <div className="sd-panel-head"><div><span className="sd-kicker">APP ACTIVITY / LOCAL ANALYTICS</span><h2>Work happening behind the scenes</h2></div><span className="sd-local-pill">THIS BROWSER</span></div>
  <p className="sd-admin-help">See the work this demo has actually recorded: Store visits in this browser, service selections, account opens and enquiries saved locally. This is useful activity—not a claim that a sale has happened.</p>
  <div className="sd-capacity-grid sd-local-activity-grid">
    <article><strong>{recordedVisits.toLocaleString()}</strong><span>Store visits recorded in this browser</span></article>
    <article><strong>{serviceSelections.toLocaleString()}</strong><span>Service selections started</span></article>
    <article><strong>{accountOpens.toLocaleString()}</strong><span>Customer account opens</span></article>
    <article><strong>{data.orders.length.toLocaleString()}</strong><span>Enquiries saved on this device</span></article>
  </div>
  <div className="sd-local-analytics-columns">
    <article><span className="sd-kicker">LOCAL DATA FOOTPRINT</span><strong>{formatLocalBytes(localStorageBytes)}</strong><p>Approximate size of this app&apos;s saved browser data, including business setup, notes and demo records. It is not Firebase storage usage.</p></article>
    <article><span className="sd-kicker">FIREBASE / BOARDSIGNAL</span><strong>25 GB</strong><p>BoardSignal&apos;s Firebase capacity reference ceiling. Firebase is not connected to this prototype, so live reads, writes, bandwidth and storage consumption are not measured here.</p><span className="sd-local-pill">Not connected · usage not measured</span></article>
  </div>
  <div className="sd-local-activity-feed">
    <div className="sd-local-activity-heading"><div><span className="sd-kicker">RECENT RECORDED WORK</span><h3>Activity trail</h3></div><span>{recentLocalEvents.length} latest events</span></div>
    {recentLocalEvents.length ? <ol>{recentLocalEvents.map(event => <li key={event.id}><span className={"sd-activity-dot is-" + event.kind} aria-hidden="true" /><div><strong>{event.label}</strong><time dateTime={event.at}>{new Date(event.at).toLocaleString()}</time></div></li>)}</ol> : <p className="sd-admin-empty">No activity has been recorded yet. Open the Store, choose a service or visit the Account to start the local activity trail.</p>}
  </div>
  <p className="sd-admin-help sd-local-analytics-boundary">Important boundary: visitors using another phone, browser or device do not appear in this local count. The app does not listen to public traffic across devices in this iteration. There is no shared visitor analytics, Firebase telemetry or cross-device sync yet.</p>
</section><section className="sd-admin-panel sd-owner-notes" id="admin-notes" data-admin-tab="notes"><div className="sd-panel-head"><div><span className="sd-kicker">PRIVATE BRIEFCASE / NOTES</span><h2>My Notes</h2></div><span className="sd-local-pill">THIS DEVICE</span></div><p className="sd-admin-help">Capture priorities, decisions, reminders and ideas for the business. Notes are private to this browser profile in this demo; they are not synced or encrypted as an owner account.</p><label className="sd-admin-label" htmlFor="owner-notes">Working notes</label><textarea id="owner-notes" rows={8} maxLength={12000} value={ownerNotes} onChange={event => setOwnerNotes(event.target.value)} placeholder="Today’s priorities…&#10;Decisions to revisit…&#10;Ideas to develop…" /><div className="sd-notes-meta"><span>{ownerNotes.length.toLocaleString()} / 12,000 characters</span><span>{notesReady ? "Auto-saves on this device" : "Loading notes…"}</span></div></section><div className="sd-admin-footer"><button className="sd-button sd-outline" onClick={() => setPendingConfirm({ kind: "reset-demo" })}>Reset demo data</button><p>Prototype only · no Firebase · no shared admin/customer records</p></div></section>}


<footer className="sd-footer"><div className="sd-wrap sd-footer-inner"><button className="sd-brand sd-owner-entry" onClick={() => { requestAdminLogin(); window.scrollTo({ top: 0, behavior: "smooth" }); }} aria-label={`Open ${businessName || "Your Business"} owner Briefcase`}><span className="sd-briefcase-mark" aria-hidden="true">💼</span><span className="sd-owner-entry-copy"><strong>{businessName || "Your Business"}</strong><small>PRIVATE BRIEFCASE · OWNER ACCESS</small><em>Open your workspace</em></span><span className="sd-owner-entry-arrow" aria-hidden="true">↗</span></button><p>Built to be explored online and offline.</p><div><button onClick={() => { setView("account"); setNotice(""); }}>My account</button><Link href="/patterns">PWA pattern lab</Link></div></div></footer>
    {pendingConfirm && <div className="sd-confirm-backdrop" onClick={() => setPendingConfirm(null)}><section className="sd-confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="sd-confirm-title" aria-describedby="sd-confirm-description" onClick={event => event.stopPropagation()}><span className="sd-kicker">CONFIRM ACTION</span><h2 id="sd-confirm-title">{pendingConfirm.kind === "reset-demo" ? "Reset demo data?" : pendingConfirm.kind === "overwrite-business" ? "Replace the saved business?" : `Delete ${pendingConfirm.serviceName || "this service"}?`}</h2><p id="sd-confirm-description">{pendingConfirm.kind === "reset-demo" ? "This clears local requests, service edits and the announcement, restoring the starter examples on this device." : pendingConfirm.kind === "overwrite-business" ? "This replaces the current business name, colours, currency and services. Its saved customer requests, messages and owner notes on this device will also be cleared. This cannot be undone." : "This removes the service from this browser demo. Existing requests keep their saved service name and price."}</p><div className="sd-confirm-actions"><button type="button" className="sd-button sd-outline" autoFocus onClick={() => setPendingConfirm(null)}>Keep it</button><button type="button" className="sd-button sd-primary" onClick={() => { const action = pendingConfirm; setPendingConfirm(null); if (action.kind === "reset-demo") { if (commitData(() => ({ ...emptyData, views: data.views }), "Demo data reset on this device.")) { setAnnouncementDraft(""); setAnnouncementImageDraft(""); resetServiceForm(); } } else if (action.kind === "overwrite-business") { completeBusinessIdentity(true); } else if (action.serviceId) { if (commitData(current => ({ ...current, services: current.services.filter(item => item.id !== action.serviceId) }), `${action.serviceName || "Service"} deleted from this demo.`) && editingId === action.serviceId) resetServiceForm(); } }}>Confirm</button></div></section></div>}
    {notice && <div className="sd-toast-region"><div className={"sd-toast" + (/^(Choose|Add |Enter |The browser|Local demo storage|Could not save)/i.test(notice) ? " is-error" : " is-success")} role={/^(Choose|Add |Enter |The browser|Local demo storage|Could not save)/i.test(notice) ? "alert" : "status"}><span className="sd-toast-mark" aria-hidden="true">{/^(Choose|Add |Enter |The browser|Local demo storage|Could not save)/i.test(notice) ? "!" : "✓"}</span><p>{notice}</p><button type="button" aria-label="Dismiss message" onClick={() => setNotice("")}>×</button></div></div>}
    </>}
  </main>;
}
