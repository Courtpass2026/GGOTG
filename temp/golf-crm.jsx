import { useState } from "react";

const C = {
  green: "#1E4D0F", greenMid: "#2D6B1A", greenLight: "#4A8C2A",
  greenPale: "#D4EAB8", greenGhost: "#F0F7E8", cream: "#FAF7F2",
  tan: "#C8A96E", tanLight: "#EDE0C4", brown: "#7A4F2D",
  brownDark: "#4A2C10", sand: "#F5EDD8", white: "#FFFFFF",
  textDark: "#1A2A0A", textMid: "#4A5E2A", textLight: "#8A9E6A",
  red: "#C0392B", redLight: "#FADBD8", gold: "#C8930A", goldLight: "#FEF3CD",
  blue: "#1A4D8F", blueLight: "#D6E4F7",
  purple: "#5B2D8F", purpleLight: "#EAD6F7",
};

const EXPENSE_CATEGORIES = [
  "Fuel / Travel", "Equipment Maintenance", "Equipment Purchase",
  "Insurance", "Marketing / Advertising", "Software / Subscriptions",
  "Supplies", "Meals / Entertainment", "Phone / Internet",
  "Professional Services", "Other",
];

const TEXT_TEMPLATES = {
  booking_confirmation: {
    label: "Booking Confirmation", icon: "✅",
    personal: (c, b) => `Hi ${c.name.split(" ")[0]}! Your golf simulator event "${b?.event || "your event"}" is confirmed for ${b?.date ? fmt(b.date) : "your scheduled date"} at ${b?.location || "your location"}. We can't wait to bring the course to you! – Great Golf on the Go`,
    generic: () => `Your golf simulator booking is confirmed! We're looking forward to bringing the experience to you. See you on the course! – Great Golf on the Go`,
  },
  payment_reminder: {
    label: "Payment Reminder", icon: "💳",
    personal: (c) => `Hi ${c.name.split(" ")[0]}, just a friendly reminder that you have an outstanding balance with Great Golf on the Go. Please reach out if you have any questions. We appreciate your business! – Great Golf on the Go`,
    generic: () => `Friendly reminder: you have an outstanding balance with Great Golf on the Go. Please reach out at your convenience. Thank you! – Great Golf on the Go`,
  },
  birthday_greeting: {
    label: "Birthday Greeting", icon: "🎂",
    personal: (c) => `Happy Birthday, ${c.name.split(" ")[0]}! 🎉⛳ Wishing you an amazing day! Reply for a special birthday discount on your next golf simulator event. – Great Golf on the Go`,
    generic: () => `Happy Birthday! 🎉⛳ Wishing you a fantastic day! Reply for a special birthday discount on your next event. – Great Golf on the Go`,
  },
  event_reminder: {
    label: "Event Reminder (Day Before)", icon: "📅",
    personal: (c, b) => `Hi ${c.name.split(" ")[0]}! Just a reminder that your golf simulator event is TOMORROW${b?.location ? ` at ${b.location}` : ""}. We'll arrive ready to set up an amazing experience. See you soon! – Great Golf on the Go`,
    generic: () => `Reminder: Your golf simulator event is TOMORROW! We're excited to bring the course to you. See you soon! – Great Golf on the Go`,
  },
  followup: {
    label: "Follow-Up After Event", icon: "🔁",
    personal: (c) => `Hi ${c.name.split(" ")[0]}! Hope you had an amazing time with Great Golf on the Go! We'd love your feedback and help planning your next event. Reply anytime! – Great Golf on the Go`,
    generic: () => `Thank you for booking with Great Golf on the Go! We hope you had an incredible time. We'd love to host your next event — reach out anytime! – Great Golf on the Go`,
  },
  promo: {
    label: "Promotional / Special Offer", icon: "🎁",
    personal: (c) => `Hi ${c.name.split(" ")[0]}! Exclusive offer for our valued clients: book this month and save 15%! Limited spots available. Reply to book now. – Great Golf on the Go`,
    generic: () => `🏌️ Special offer from Great Golf on the Go! Book your golf simulator event this month and save 15%. Limited availability — reply to reserve your spot!`,
  },
};

const GROUP_EMAIL_TEMPLATES = {
  promo: { label: "Promotional Offer", icon: "🎁", subject: (p,n) => p ? `${n}, Exclusive Offer from Great Golf on the Go!` : "Exclusive Offer from Great Golf on the Go!", aiPrompt: (p,n) => p ? `Write a warm, exciting promotional email to ${n} from "Great Golf on the Go," a mobile golf simulator company. Offer 15% off their next event this month. Keep it under 4 sentences.` : `Write a warm promotional email blast from "Great Golf on the Go." Offer 15% off events booked this month. Under 4 sentences. Do not address to any specific person.` },
  newsletter: { label: "Newsletter / Update", icon: "📰", subject: (p,n) => p ? `${n}, What's New at Great Golf on the Go` : "What's New at Great Golf on the Go", aiPrompt: (p,n) => p ? `Write a friendly newsletter email to ${n} from "Great Golf on the Go." Share excitement, mention new event types, invite them to book. 3-4 sentences.` : `Write a friendly newsletter from "Great Golf on the Go." Share excitement, new event types, invite booking. 3-4 sentences. Do not address to any specific person.` },
  seasonal: { label: "Seasonal Campaign", icon: "🌟", subject: (p,n) => p ? `${n}, Make This Season Unforgettable!` : "Make This Season Unforgettable with Great Golf on the Go", aiPrompt: (p,n) => p ? `Write a seasonal email to ${n} from "Great Golf on the Go." Encourage a seasonal event booking. Fun tone, 3-4 sentences.` : `Write a seasonal email blast from "Great Golf on the Go." Encourage seasonal event bookings. Fun tone, 3-4 sentences. No specific name.` },
  reengagement: { label: "Re-Engagement", icon: "👋", subject: (p,n) => p ? `We Miss You, ${n}!` : "We Miss You! Come Back to Great Golf on the Go", aiPrompt: (p,n) => p ? `Write a warm re-engagement email to ${n} from "Great Golf on the Go." It's been a while — invite them back, offer incentive. 3-4 sentences.` : `Write a re-engagement email from "Great Golf on the Go." Invite clients back, offer incentive. 3-4 sentences. No specific name.` },
  payment: { label: "Payment Reminder", icon: "💳", subject: (p,n) => p ? `${n}, Friendly Payment Reminder` : "Friendly Payment Reminder from Great Golf on the Go", aiPrompt: (p,n) => p ? `Write a polite payment reminder email to ${n} from "Great Golf on the Go." Outstanding balance. Professional and warm, 2-3 sentences.` : `Write a polite payment reminder from "Great Golf on the Go." Outstanding balances. Professional and warm, 2-3 sentences. No specific name.` },
  thankyou: { label: "Thank You", icon: "🙏", subject: (p,n) => p ? `Thank You, ${n}!` : "Thank You from Great Golf on the Go", aiPrompt: (p,n) => p ? `Write a heartfelt thank-you email to ${n} from "Great Golf on the Go." Thank them for being a valued client, invite rebook. 3 sentences.` : `Write a heartfelt thank-you from "Great Golf on the Go." Thank clients, invite rebook. 3 sentences. No specific name.` },
};

const initialClients = [
  { id: 1, name: "Michael Thompson", email: "michael.t@email.com", phone: "(555) 234-5678", address: "142 Oak Lane, Springfield, IL 62701", birthdate: "1978-03-15", referral: "Google Search", notes: "Loves scramble format. Prefers evening events.",
    bookings: [{ id: 1, date: "2026-04-12", event: "Birthday Party", location: "Client's Home", guests: 12, amount: 550, status: "outstanding" }, { id: 2, date: "2026-03-01", event: "Corporate Team Building", location: "Marriott Downtown", guests: 20, amount: 850, status: "paid" }],
    invoices: [{ id: 101, date: "2026-04-12", description: "Birthday Party - 2hrs", amount: 550, status: "outstanding" }, { id: 102, date: "2026-03-01", description: "Corporate Event - 3hrs", amount: 850, status: "paid" }] },
  { id: 2, name: "Sarah Johnson", email: "sarah.j@email.com", phone: "(555) 876-5432", address: "88 Willow Creek Dr, Naperville, IL 60540", birthdate: "1985-07-22", referral: "Michael Thompson", notes: "Loves the experience. Wants to book quarterly.",
    bookings: [{ id: 3, date: "2026-02-14", event: "Valentine's Day Party", location: "Sarah's Backyard", guests: 8, amount: 400, status: "paid" }],
    invoices: [{ id: 103, date: "2026-02-14", description: "Valentine's Event - 2hrs", amount: 400, status: "paid" }] },
  { id: 3, name: "David Martinez", email: "d.martinez@company.com", phone: "(555) 321-0987", address: "505 Elmwood Ave, Evanston, IL 60201", birthdate: "1990-12-03", referral: "LinkedIn", notes: "Wants monthly corporate bookings.",
    bookings: [{ id: 4, date: "2026-05-20", event: "Sales Kickoff", location: "Hyatt Regency", guests: 35, amount: 1200, status: "outstanding" }],
    invoices: [{ id: 104, date: "2026-03-20", description: "Sales Kickoff - 4hrs", amount: 1200, status: "outstanding" }] },
];

const initialExpenses = [
  { id: 1, date: "2026-03-10", description: "Fuel - Springfield run", category: "Fuel / Travel", amount: 48, receipt: false, notes: "" },
  { id: 2, date: "2026-03-05", description: "Monthly software sub", category: "Software / Subscriptions", amount: 29, receipt: true, notes: "Booking platform" },
  { id: 3, date: "2026-02-20", description: "Simulator cable repair", category: "Equipment Maintenance", amount: 185, receipt: true, notes: "Fixed HDMI harness" },
];

const emptyClient = { name: "", email: "", phone: "", address: "", birthdate: "", referral: "", notes: "" };
const emptyBooking = { date: "", event: "", location: "", guests: "", amount: "", status: "outstanding" };
const emptyInvoice = { date: "", description: "", amount: "", status: "outstanding" };
const emptyExpense = { date: "", description: "", category: EXPENSE_CATEGORIES[0], amount: "", receipt: false, notes: "" };

function fmt(d) {
  if (!d) return "No date";
  return new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
function daysUntilBirthday(bd) {
  if (!bd) return null;
  const today = new Date();
  const b = new Date(bd);
  const next = new Date(today.getFullYear(), b.getMonth(), b.getDate());
  if (next < today) next.setFullYear(today.getFullYear() + 1);
  return Math.ceil((next - today) / 86400000);
}
function initials(name) { return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase(); }

// ── UI COMPONENTS ──────────────────────────────────────────────────────────────
function Avatar({ name, size = 44 }) {
  const colors = ["#1E4D0F","#2D5E6B","#4D1E3A","#3A4D1E","#6B2D2D","#1E3A4D","#4D3A1E"];
  const idx = (name.charCodeAt(0) + (name.charCodeAt(1) || 0)) % colors.length;
  return <div style={{ width: size, height: size, borderRadius: size/2, background: colors[idx], display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: size*0.36, fontFamily: "'Playfair Display', serif", flexShrink: 0 }}>{initials(name)}</div>;
}
function Pill({ status }) {
  const map = { paid: { bg: C.greenPale, color: C.greenMid, label: "Paid" }, outstanding: { bg: C.goldLight, color: C.gold, label: "Due" }, cancelled: { bg: C.redLight, color: C.red, label: "Cancelled" } };
  const s = map[status] || map.outstanding;
  return <span style={{ background: s.bg, color: s.color, borderRadius: 20, padding: "4px 10px", fontSize: 11, fontWeight: 800, letterSpacing: 0.3 }}>{s.label}</span>;
}
function Card({ children, onClick, style }) {
  return <div onClick={onClick} style={{ background: C.white, borderRadius: 18, boxShadow: "0 1px 8px rgba(30,77,15,0.09)", overflow: "hidden", cursor: onClick ? "pointer" : "default", ...style }}>{children}</div>;
}
function Btn({ children, variant = "primary", small, full, onClick, disabled, style }) {
  const vs = { primary: { background: C.green, color: "#fff" }, secondary: { background: C.greenGhost, color: C.green }, sand: { background: C.sand, color: C.brown }, ghost: { background: "rgba(255,255,255,0.2)", color: "#fff", border: "1px solid rgba(255,255,255,0.35)" }, blue: { background: C.blue, color: "#fff" }, blueLight: { background: C.blueLight, color: C.blue }, purple: { background: C.purple, color: "#fff" }, purpleLight: { background: C.purpleLight, color: C.purple }, danger: { background: C.redLight, color: C.red } };
  return <button onClick={onClick} disabled={disabled} style={{ ...vs[variant], border: vs[variant].border || "none", borderRadius: small ? 10 : 14, padding: small ? "8px 14px" : "14px 18px", fontWeight: 800, fontSize: small ? 13 : 15, cursor: "pointer", fontFamily: "'Lato', sans-serif", width: full ? "100%" : "auto", opacity: disabled ? 0.6 : 1, WebkitTapHighlightColor: "transparent", letterSpacing: 0.2, ...style }}>{children}</button>;
}
function Sheet({ show, onClose, title, children }) {
  if (!show) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "flex-end" }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: C.cream, borderRadius: "24px 24px 0 0", width: "100%", maxHeight: "92vh", overflowY: "auto", boxShadow: "0 -4px 40px rgba(0,0,0,0.2)" }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}><div style={{ width: 36, height: 4, borderRadius: 2, background: "#CCC" }} /></div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 20px 14px" }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 800, color: C.textDark }}>{title}</div>
          <button onClick={onClose} style={{ background: "#E5E5EA", border: "none", borderRadius: "50%", width: 30, height: 30, fontSize: 15, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#555" }}>✕</button>
        </div>
        <div style={{ padding: "0 20px 44px" }}>{children}</div>
      </div>
    </div>
  );
}
function FInput({ label, textarea, ...props }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <div style={{ fontSize: 12, fontWeight: 700, color: C.textMid, marginBottom: 5, letterSpacing: 0.4, textTransform: "uppercase" }}>{label}</div>}
      {textarea ? <textarea {...props} style={{ width: "100%", padding: "13px 14px", borderRadius: 12, border: `1.5px solid ${C.greenPale}`, fontSize: 16, boxSizing: "border-box", resize: "none", outline: "none", fontFamily: "'Lato', sans-serif", color: C.textDark, background: C.white, ...props.style }} />
        : <input {...props} style={{ width: "100%", padding: "13px 14px", borderRadius: 12, border: `1.5px solid ${C.greenPale}`, fontSize: 16, background: C.white, color: C.textDark, boxSizing: "border-box", outline: "none", WebkitAppearance: "none", ...props.style }} />}
    </div>
  );
}
function FSelect({ label, children, ...props }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <div style={{ fontSize: 12, fontWeight: 700, color: C.textMid, marginBottom: 5, letterSpacing: 0.4, textTransform: "uppercase" }}>{label}</div>}
      <select {...props} style={{ width: "100%", padding: "13px 14px", borderRadius: 12, border: `1.5px solid ${C.greenPale}`, fontSize: 16, background: C.white, color: C.textDark, outline: "none", WebkitAppearance: "none", appearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%234A5E2A' stroke-width='2' fill='none'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center", paddingRight: 36 }}>{children}</select>
    </div>
  );
}
function EmptyState({ icon, msg }) {
  return <div style={{ textAlign: "center", padding: "48px 20px", color: C.textLight }}><div style={{ fontSize: 40, marginBottom: 10 }}>{icon}</div><div style={{ fontWeight: 700, fontSize: 14 }}>{msg}</div></div>;
}
function Toast({ msg, type }) {
  return <div style={{ position: "fixed", top: 54, left: 12, right: 12, zIndex: 999, background: type === "error" ? C.red : C.green, color: "#fff", padding: "14px 18px", borderRadius: 14, fontWeight: 700, fontSize: 14, textAlign: "center", boxShadow: "0 4px 24px rgba(0,0,0,0.25)" }}>{msg}</div>;
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function GolfCRM() {
  const [clients, setClients] = useState(initialClients);
  const [expenses, setExpenses] = useState(initialExpenses);
  const [tab, setTab] = useState("home");
  const [clientView, setClientView] = useState(null);
  const [clientTab, setClientTab] = useState("info");
  const [financeTab, setFinanceTab] = useState("overview"); // overview | invoices | expenses
  const [invoiceFilter, setInvoiceFilter] = useState("all"); // all | paid | outstanding
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);

  // Sheets
  const [addClientOpen, setAddClientOpen] = useState(false);
  const [addBookingOpen, setAddBookingOpen] = useState(false);
  const [addInvoiceOpen, setAddInvoiceOpen] = useState(false);
  const [addExpenseOpen, setAddExpenseOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [emailType, setEmailType] = useState("custom");
  const [textSheetOpen, setTextSheetOpen] = useState(false);
  const [textTemplateKey, setTextTemplateKey] = useState(null);
  const [textPersonalized, setTextPersonalized] = useState(true);
  const [textBody, setTextBody] = useState("");
  const [textTarget, setTextTarget] = useState(null);
  const [textStep, setTextStep] = useState(1);
  const [groupEmailOpen, setGroupEmailOpen] = useState(false);
  const [groupEmailStep, setGroupEmailStep] = useState(1);
  const [groupEmailTemplateKey, setGroupEmailTemplateKey] = useState(null);
  const [groupEmailPersonalized, setGroupEmailPersonalized] = useState(false);
  const [groupEmailSubject, setGroupEmailSubject] = useState("");
  const [groupEmailBody, setGroupEmailBody] = useState("");
  const [groupSelected, setGroupSelected] = useState([]);
  const [groupSelectAll, setGroupSelectAll] = useState(false);
  const [groupAiLoading, setGroupAiLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  // Forms
  const [nc, setNc] = useState(emptyClient);
  const [nb, setNb] = useState(emptyBooking);
  const [ni, setNi] = useState(emptyInvoice);
  const [ne, setNe] = useState(emptyExpense);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 2800); };

  // ── DERIVED ────────────────────────────────────────────────────────────────
  const allInvoices = clients.flatMap(c => c.invoices.map(i => ({ ...i, clientName: c.name, clientId: c.id, clientPhone: c.phone })));
  const paidInvoices = allInvoices.filter(i => i.status === "paid");
  const outstandingInvoices = allInvoices.filter(i => i.status === "outstanding");
  const totalRevenue = paidInvoices.reduce((s, i) => s + +i.amount, 0);
  const totalOwed = outstandingInvoices.reduce((s, i) => s + +i.amount, 0);
  const totalExpenses = expenses.reduce((s, e) => s + +e.amount, 0);
  const netProfit = totalRevenue - totalExpenses;
  const allBookings = clients.flatMap(c => c.bookings.map(b => ({ ...b, clientName: c.name, clientId: c.id })));
  const upcoming = allBookings.filter(b => new Date(b.date) >= new Date()).sort((a, b) => new Date(a.date) - new Date(b.date));
  const birthdays = clients.filter(c => { const d = daysUntilBirthday(c.birthdate); return d !== null && d <= 30; }).sort((a, b) => daysUntilBirthday(a.birthdate) - daysUntilBirthday(b.birthdate));
  const filtered = clients.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search));

  const expensesByCategory = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + +e.amount;
    return acc;
  }, {});
  const topCategory = Object.entries(expensesByCategory).sort((a, b) => b[1] - a[1])[0];

  const filteredInvoices = invoiceFilter === "paid" ? paidInvoices : invoiceFilter === "outstanding" ? outstandingInvoices : allInvoices;

  // ── ACTIONS ────────────────────────────────────────────────────────────────
  const openClient = (c) => { setClientView(c); setClientTab("info"); setTab("client"); };
  const backToClients = () => { setClientView(null); setTab("clients"); };

  const saveClient = () => {
    if (!nc.name || !nc.email) { showToast("Name & email required", "error"); return; }
    setClients(p => [...p, { ...nc, id: Date.now(), bookings: [], invoices: [] }]);
    setNc(emptyClient); setAddClientOpen(false); showToast("Client added! ⛳");
  };
  const saveBooking = () => {
    if (!nb.date || !nb.event) { showToast("Date & event required", "error"); return; }
    const b = { ...nb, id: Date.now(), guests: +nb.guests, amount: +nb.amount };
    setClients(p => p.map(c => c.id === clientView.id ? { ...c, bookings: [...c.bookings, b] } : c));
    setClientView(p => ({ ...p, bookings: [...p.bookings, b] }));
    setNb(emptyBooking); setAddBookingOpen(false); showToast("Event added! 📅");
  };
  const saveInvoice = () => {
    if (!ni.description || !ni.amount) { showToast("Description & amount required", "error"); return; }
    const inv = { ...ni, id: Date.now(), amount: +ni.amount };
    setClients(p => p.map(c => c.id === clientView.id ? { ...c, invoices: [...c.invoices, inv] } : c));
    setClientView(p => ({ ...p, invoices: [...p.invoices, inv] }));
    setNi(emptyInvoice); setAddInvoiceOpen(false); showToast("Invoice created! 📄");
  };
  const toggleInvoice = (clientId, invoiceId) => {
    const update = invs => invs.map(i => i.id === invoiceId ? { ...i, status: i.status === "paid" ? "outstanding" : "paid" } : i);
    setClients(p => p.map(c => c.id === clientId ? { ...c, invoices: update(c.invoices) } : c));
    if (clientView?.id === clientId) setClientView(p => ({ ...p, invoices: update(p.invoices) }));
    showToast("Invoice updated!");
  };
  const saveExpense = () => {
    if (!ne.description || !ne.amount) { showToast("Description & amount required", "error"); return; }
    setExpenses(p => [...p, { ...ne, id: Date.now(), amount: +ne.amount }]);
    setNe(emptyExpense); setAddExpenseOpen(false); showToast("Expense logged! 🧾");
  };
  const deleteExpense = (id) => {
    setExpenses(p => p.filter(e => e.id !== id));
    showToast("Expense deleted");
  };

  // ── TEXT / EMAIL (same as before) ──────────────────────────────────────────
  const openTextSingle = (client) => { setTextTarget(client); setTextTemplateKey(null); setTextBody(""); setTextStep(1); setTextPersonalized(true); setTextSheetOpen(true); };
  const selectTextTemplate = (key) => { setTextTemplateKey(key); const tmpl = TEXT_TEMPLATES[key]; const b = textTarget?.bookings?.[0] || null; setTextBody(tmpl.personal(textTarget, b)); setTextPersonalized(true); setTextStep(2); };
  const toggleTextPersonalized = (val) => { setTextPersonalized(val); if (textTemplateKey) { const tmpl = TEXT_TEMPLATES[textTemplateKey]; const b = textTarget?.bookings?.[0] || null; setTextBody(val ? tmpl.personal(textTarget, b) : tmpl.generic()); } };
  const sendSingleText = () => { if (!textTarget?.phone) { showToast("No phone number on file", "error"); return; } window.location.href = `sms:${textTarget.phone}?body=${encodeURIComponent(textBody)}`; };
  const openEmail = (type) => { setEmailType(type); setEmailSubject(""); setEmailBody(""); setEmailOpen(true); };
  const generateEmail = async (type) => {
    setAiLoading(true); setEmailType(type);
    const prompts = { custom: `Write a friendly outreach email (3-4 sentences) to ${clientView.name} from "Great Golf on the Go," a mobile golf simulator service.`, birthday: `Write a warm birthday email (3-4 sentences) to ${clientView.name} from "Great Golf on the Go."`, followup: `Write a short follow-up email (3-4 sentences) to ${clientView.name} from "Great Golf on the Go." Thank them for their recent event.`, invoice: `Write a polite invoice reminder email (3-4 sentences) to ${clientView.name} from "Great Golf on the Go."` };
    const subjects = { custom: "Great Golf on the Go - Bring the Course to You!", birthday: `Happy Birthday, ${clientView.name.split(" ")[0]}!`, followup: "Thanks for Booking with Great Golf on the Go", invoice: "Invoice Reminder - Great Golf on the Go" };
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, messages: [{ role: "user", content: prompts[type] }] }) });
      const data = await res.json();
      setEmailBody(data.content?.[0]?.text || ""); setEmailSubject(subjects[type]);
    } catch { showToast("AI draft failed", "error"); }
    setAiLoading(false);
  };
  const sendViaMailApp = () => { window.location.href = `mailto:${clientView.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`; };
  const openGroupEmail = () => { setGroupEmailStep(1); setGroupEmailTemplateKey(null); setGroupEmailSubject(""); setGroupEmailBody(""); setGroupSelected([]); setGroupSelectAll(false); setGroupEmailPersonalized(false); setGroupEmailOpen(true); };
  const selectGroupTemplate = (key) => { setGroupEmailTemplateKey(key); setGroupEmailSubject(GROUP_EMAIL_TEMPLATES[key].subject(false, "")); setGroupEmailBody(""); setGroupEmailStep(2); };
  const generateGroupEmail = async () => {
    if (!groupEmailTemplateKey) return; setGroupAiLoading(true);
    const tmpl = GROUP_EMAIL_TEMPLATES[groupEmailTemplateKey];
    const firstName = groupEmailPersonalized && groupSelected.length > 0 ? clients.find(c => c.id === groupSelected[0])?.name.split(" ")[0] || "there" : "";
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, messages: [{ role: "user", content: tmpl.aiPrompt(groupEmailPersonalized, firstName) }] }) });
      const data = await res.json();
      setGroupEmailBody(data.content?.[0]?.text || ""); setGroupEmailSubject(tmpl.subject(groupEmailPersonalized, firstName));
    } catch { showToast("AI draft failed", "error"); }
    setGroupAiLoading(false);
  };
  const toggleGroupClient = (id) => { setGroupSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]); setGroupSelectAll(false); };
  const toggleGroupSelectAll = () => { if (groupSelectAll) { setGroupSelected([]); setGroupSelectAll(false); } else { setGroupSelected(clients.map(c => c.id)); setGroupSelectAll(true); } };
  const sendGroupEmail = () => {
    const targets = clients.filter(c => groupSelected.includes(c.id) && c.email);
    if (targets.length === 0) { showToast("No clients with emails selected", "error"); return; }
    if (groupEmailPersonalized) {
      const first = targets[0]; const personalSubject = GROUP_EMAIL_TEMPLATES[groupEmailTemplateKey]?.subject(true, first.name.split(" ")[0]) || groupEmailSubject;
      window.location.href = `mailto:${first.email}?subject=${encodeURIComponent(personalSubject)}&body=${encodeURIComponent(groupEmailBody)}`;
      if (targets.length > 1) showToast(`Opened for ${first.name.split(" ")[0]}. Send, return for next. (${targets.length} total)`);
    } else {
      window.location.href = `mailto:?bcc=${encodeURIComponent(targets.map(c => c.email).join(","))}&subject=${encodeURIComponent(groupEmailSubject)}&body=${encodeURIComponent(groupEmailBody)}`;
    }
    setGroupEmailOpen(false);
  };

  const navTabs = [
    { id: "home", icon: "⛳", label: "Home" },
    { id: "clients", icon: "👥", label: "Clients" },
    { id: "messages", icon: "💬", label: "Messages" },
    { id: "finances", icon: "💰", label: "Finances" },
    { id: "bookings", icon: "📅", label: "Events" },
  ];
  const activeNav = tab === "client" ? "clients" : tab;

  return (
    <div style={{ fontFamily: "'Lato', sans-serif", background: C.cream, minHeight: "100vh", maxWidth: 430, margin: "0 auto", position: "relative", paddingBottom: 90, color: C.textDark }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Lato:wght@400;600;700;800&display=swap" rel="stylesheet" />
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      {/* ── HOME ── */}
      {tab === "home" && (
        <div style={{ padding: "0 16px" }}>
          <div style={{ padding: "20px 0 18px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div><div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 800, lineHeight: 1.1 }}>Great Golf</div><div style={{ fontSize: 11, color: C.textLight, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", marginTop: 2 }}>on the go · dashboard</div></div>
            <div style={{ fontSize: 36, marginTop: 2 }}>🏌️</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 22 }}>
            {[
              { icon: "👥", label: "Clients", val: clients.length, color: C.green },
              { icon: "📅", label: "Upcoming", val: upcoming.length, color: C.greenMid },
              { icon: "💰", label: "Collected", val: `$${totalRevenue.toLocaleString()}`, color: C.greenMid },
              { icon: "📈", label: "Net Profit", val: `$${netProfit.toLocaleString()}`, color: netProfit >= 0 ? C.greenMid : C.red },
            ].map(s => (
              <Card key={s.label} style={{ padding: "16px 14px" }}>
                <div style={{ fontSize: 22, marginBottom: 5 }}>{s.icon}</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.val}</div>
                <div style={{ fontSize: 11, color: C.textLight, fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase", marginTop: 3 }}>{s.label}</div>
              </Card>
            ))}
          </div>
          {/* Outstanding invoices alert */}
          {outstandingInvoices.length > 0 && (
            <div onClick={() => { setTab("finances"); setFinanceTab("invoices"); setInvoiceFilter("outstanding"); }}
              style={{ background: C.goldLight, border: `1.5px solid ${C.gold}`, borderRadius: 14, padding: "13px 16px", marginBottom: 18, display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
              <span style={{ fontSize: 22 }}>⚠️</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: 14, color: C.brownDark }}>{outstandingInvoices.length} Outstanding Invoice{outstandingInvoices.length > 1 ? "s" : ""}</div>
                <div style={{ fontSize: 12, color: C.brown }}>${totalOwed.toLocaleString()} total due — tap to view</div>
              </div>
              <span style={{ color: C.gold, fontSize: 18 }}>›</span>
            </div>
          )}
          {upcoming.length > 0 && (
            <div style={{ marginBottom: 22 }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 800, marginBottom: 10 }}>Upcoming Events</div>
              <Card>{upcoming.slice(0, 5).map((b, i) => (
                <div key={b.id} style={{ padding: "14px 16px", borderBottom: i < Math.min(upcoming.length,5)-1 ? `1px solid ${C.greenGhost}` : "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ flex: 1, marginRight: 10 }}><div style={{ fontWeight: 800, fontSize: 14 }}>{b.event}</div><div style={{ fontSize: 12, color: C.textMid, marginTop: 2 }}>{b.clientName}</div><div style={{ fontSize: 12, color: C.textLight }}>📍 {b.location}</div></div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}><div style={{ fontSize: 12, fontWeight: 700, color: C.green }}>{fmt(b.date)}</div><div style={{ marginTop: 4 }}><Pill status={b.status} /></div></div>
                  </div>
                </div>
              ))}</Card>
            </div>
          )}
          {birthdays.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 800, marginBottom: 10 }}>🎂 Birthdays This Month</div>
              <Card>{birthdays.map((c, i) => {
                const d = daysUntilBirthday(c.birthdate);
                return (
                  <div key={c.id} style={{ padding: "13px 16px", display: "flex", alignItems: "center", gap: 12, borderBottom: i < birthdays.length-1 ? `1px solid ${C.greenGhost}` : "none" }}>
                    <Avatar name={c.name} size={40} />
                    <div style={{ flex: 1 }}><div style={{ fontWeight: 800, fontSize: 14 }}>{c.name}</div><div style={{ fontSize: 12, color: C.textLight }}>{fmt(c.birthdate)}</div></div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ background: d <= 7 ? C.goldLight : C.greenPale, color: d <= 7 ? C.gold : C.green, borderRadius: 20, padding: "4px 10px", fontSize: 11, fontWeight: 800 }}>{d === 0 ? "Today!" : `${d}d`}</span>
                      <Btn small variant="secondary" onClick={() => { openClient(c); setTimeout(() => openEmail("birthday"), 100); }}>✉️</Btn>
                      <Btn small variant="blueLight" onClick={() => openTextSingle(c)}>💬</Btn>
                    </div>
                  </div>
                );
              })}</Card>
            </div>
          )}
        </div>
      )}

      {/* ── CLIENTS ── */}
      {tab === "clients" && (
        <div style={{ padding: "0 16px" }}>
          <div style={{ padding: "20px 0 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 800 }}>Clients</div>
            <Btn onClick={() => setAddClientOpen(true)}>+ Add</Btn>
          </div>
          <div style={{ position: "relative", marginBottom: 14 }}>
            <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", fontSize: 16 }}>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search clients..." style={{ width: "100%", padding: "13px 14px 13px 40px", borderRadius: 13, border: `1.5px solid ${C.greenPale}`, fontSize: 16, background: C.white, boxSizing: "border-box", outline: "none" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.map(client => {
              const days = daysUntilBirthday(client.birthdate);
              const owed = client.invoices.filter(i => i.status === "outstanding").reduce((s, i) => s + +i.amount, 0);
              return (
                <Card key={client.id} onClick={() => openClient(client)}>
                  <div style={{ padding: "15px 16px", display: "flex", alignItems: "center", gap: 13 }}>
                    <Avatar name={client.name} />
                    <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 800, fontSize: 15, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{client.name}</div><div style={{ fontSize: 12, color: C.textMid, marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{client.email}</div><div style={{ fontSize: 12, color: C.textLight }}>{client.phone}</div></div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end", flexShrink: 0 }}>
                      {days !== null && days <= 30 && <span style={{ background: C.goldLight, color: C.gold, borderRadius: 20, padding: "2px 9px", fontSize: 10, fontWeight: 800 }}>🎂 {days}d</span>}
                      {owed > 0 && <span style={{ background: C.goldLight, color: C.gold, borderRadius: 20, padding: "2px 9px", fontSize: 10, fontWeight: 800 }}>⚠️ ${owed}</span>}
                      <span style={{ color: C.textLight, fontSize: 20 }}>›</span>
                    </div>
                  </div>
                </Card>
              );
            })}
            {filtered.length === 0 && <EmptyState icon="👥" msg="No clients found" />}
          </div>
        </div>
      )}

      {/* ── CLIENT DETAIL ── */}
      {tab === "client" && clientView && (
        <div>
          <div style={{ background: `linear-gradient(145deg, ${C.green} 0%, ${C.greenMid} 100%)`, padding: "16px 16px 22px" }}>
            <button onClick={backToClients} style={{ background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 20, padding: "7px 16px", color: "#fff", fontSize: 13, fontWeight: 800, cursor: "pointer", marginBottom: 16, WebkitTapHighlightColor: "transparent" }}>← Clients</button>
            <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 18 }}>
              <Avatar name={clientView.name} size={56} />
              <div><div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 800, color: "#fff", lineHeight: 1.2 }}>{clientView.name}</div><div style={{ fontSize: 13, color: "rgba(255,255,255,0.72)", marginTop: 3 }}>{clientView.email}</div></div>
            </div>
            <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 2 }}>
              {[["✉️ Email", () => openEmail("custom")], ["🎂 B-Day Email", () => openEmail("birthday")], ["🔁 Follow-up", () => openEmail("followup")], ["💬 Text", () => openTextSingle(clientView)]].map(([label, fn]) => (
                <Btn key={label} small variant="ghost" onClick={fn} style={{ whiteSpace: "nowrap", flexShrink: 0 }}>{label}</Btn>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", background: C.white, borderBottom: `1px solid ${C.greenPale}` }}>
            {[["info","Info"],["bookings","Events"],["invoices","Invoices"]].map(([id, label]) => (
              <button key={id} onClick={() => setClientTab(id)} style={{ flex: 1, padding: "14px 0", border: "none", background: "transparent", fontWeight: 800, fontSize: 13, cursor: "pointer", color: clientTab === id ? C.green : C.textLight, borderBottom: clientTab === id ? `2.5px solid ${C.green}` : "2.5px solid transparent", WebkitTapHighlightColor: "transparent" }}>{label}</button>
            ))}
          </div>
          <div style={{ padding: "16px" }}>
            {clientTab === "info" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[{ icon: "📞", label: "Phone", val: clientView.phone, href: `tel:${clientView.phone}` }, { icon: "📧", label: "Email", val: clientView.email, href: `mailto:${clientView.email}` }, { icon: "📍", label: "Address", val: clientView.address || "—" }, { icon: "🎂", label: "Birthdate", val: clientView.birthdate ? `${fmt(clientView.birthdate)} · ${daysUntilBirthday(clientView.birthdate)} days away` : "—" }, { icon: "💬", label: "Referral", val: clientView.referral || "—" }, { icon: "📝", label: "Notes", val: clientView.notes || "—" }].map(row => (
                  <Card key={row.label} style={{ padding: "13px 16px" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: C.textLight, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 4 }}>{row.icon} {row.label}</div>
                    {row.href ? <a href={row.href} style={{ fontSize: 15, color: C.green, fontWeight: 700, textDecoration: "none" }}>{row.val}</a> : <div style={{ fontSize: 15, color: C.textDark, fontWeight: 600, lineHeight: 1.4 }}>{row.val}</div>}
                  </Card>
                ))}
                <div style={{ marginTop: 4 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.textMid, letterSpacing: 0.4, textTransform: "uppercase", marginBottom: 10 }}>💬 Quick Text</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {Object.entries(TEXT_TEMPLATES).map(([key, tmpl]) => (
                      <button key={key} onClick={() => { setTextTarget(clientView); setTextTemplateKey(key); const b = clientView.bookings?.[0]; setTextPersonalized(true); setTextBody(tmpl.personal(clientView, b)); setTextStep(2); setTextSheetOpen(true); }} style={{ background: C.blueLight, color: C.blue, border: "none", borderRadius: 10, padding: "8px 13px", fontSize: 12, fontWeight: 800, cursor: "pointer", WebkitTapHighlightColor: "transparent" }}>{tmpl.icon} {tmpl.label}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {clientTab === "bookings" && (
              <div>
                <Btn full onClick={() => setAddBookingOpen(true)} style={{ marginBottom: 14 }}>+ Add Event</Btn>
                {clientView.bookings.length === 0 && <EmptyState icon="📅" msg="No events yet" />}
                {[...clientView.bookings].sort((a,b) => new Date(b.date)-new Date(a.date)).map(b => (
                  <Card key={b.id} style={{ padding: "15px 16px", marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ flex: 1 }}><div style={{ fontWeight: 800, fontSize: 15 }}>{b.event}</div><div style={{ fontSize: 12, color: C.textMid, marginTop: 3 }}>{fmt(b.date)}</div>{b.location && <div style={{ fontSize: 12, color: C.textLight }}>📍 {b.location}</div>}<div style={{ fontSize: 12, color: C.textLight }}>👥 {b.guests || 0} guests</div><div style={{ fontSize: 18, fontWeight: 800, color: C.green, marginTop: 6 }}>${(+b.amount).toLocaleString()}</div></div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}><Pill status={b.status} /><Btn small variant="blueLight" onClick={() => { setTextTarget(clientView); setTextTemplateKey("event_reminder"); setTextPersonalized(true); setTextBody(TEXT_TEMPLATES.event_reminder.personal(clientView, b)); setTextStep(2); setTextSheetOpen(true); }}>💬 Remind</Btn></div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
            {clientTab === "invoices" && (
              <div>
                <Btn full onClick={() => setAddInvoiceOpen(true)} style={{ marginBottom: 14 }}>+ Create Invoice</Btn>
                {clientView.invoices.length === 0 && <EmptyState icon="📄" msg="No invoices yet" />}
                {[...clientView.invoices].sort((a,b) => new Date(b.date)-new Date(a.date)).map(inv => (
                  <Card key={inv.id} style={{ padding: "15px 16px", marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                      <div style={{ flex: 1 }}><div style={{ fontWeight: 800, fontSize: 15 }}>{inv.description}</div><div style={{ fontSize: 12, color: C.textLight, marginTop: 3 }}>{fmt(inv.date)}</div><div style={{ fontSize: 20, fontWeight: 800, color: C.green, marginTop: 6 }}>${(+inv.amount).toLocaleString()}</div></div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
                        <Pill status={inv.status} />
                        <div style={{ display: "flex", gap: 6 }}>
                          <Btn small variant="secondary" onClick={() => toggleInvoice(clientView.id, inv.id)}>{inv.status === "paid" ? "Mark Due" : "Mark Paid"}</Btn>
                          {inv.status === "outstanding" && <Btn small variant="blueLight" onClick={() => { setTextTarget(clientView); setTextTemplateKey("payment_reminder"); setTextPersonalized(true); setTextBody(TEXT_TEMPLATES.payment_reminder.personal(clientView)); setTextStep(2); setTextSheetOpen(true); }}>💬</Btn>}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── MESSAGES ── */}
      {tab === "messages" && (
        <div style={{ padding: "0 16px" }}>
          <div style={{ padding: "20px 0 18px" }}><div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 800 }}>Messages</div><div style={{ fontSize: 13, color: C.textLight, marginTop: 4 }}>Text or email clients individually, or send a group email campaign</div></div>
          <Card style={{ marginBottom: 22 }}>
            <div style={{ background: `linear-gradient(135deg, ${C.purple} 0%, #3A1A6B 100%)`, borderRadius: 18, padding: "22px 20px" }}>
              <div style={{ fontSize: 30, marginBottom: 8 }}>📧</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 6 }}>Group Email</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.78)", marginBottom: 18, lineHeight: 1.5 }}>Send a campaign to multiple clients at once. AI-written, personalized or blast.</div>
              <div style={{ display: "flex", gap: 10 }}>
                <Btn variant="ghost" onClick={openGroupEmail} style={{ fontSize: 14 }}>✉️ Start Group Email</Btn>
                <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 12, padding: "8px 14px" }}><span style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", fontWeight: 700 }}>{clients.length} clients</span></div>
              </div>
            </div>
          </Card>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 800, marginBottom: 12 }}>Individual Messages</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
            {clients.map(client => (
              <Card key={client.id}>
                <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 13 }}>
                  <Avatar name={client.name} size={42} />
                  <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 800, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{client.name}</div><div style={{ fontSize: 12, color: C.textLight }}>{client.phone || "No phone"} · {client.email}</div></div>
                  <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                    <Btn small variant="secondary" onClick={() => { setClientView(client); openEmail("custom"); }}>✉️</Btn>
                    <Btn small variant="blueLight" onClick={() => openTextSingle(client)}>💬</Btn>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ── FINANCES ── */}
      {tab === "finances" && (
        <div style={{ padding: "0 16px" }}>
          <div style={{ padding: "20px 0 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 800 }}>Finances</div>
            {financeTab === "expenses" && <Btn onClick={() => setAddExpenseOpen(true)}>+ Add</Btn>}
          </div>

          {/* Sub-tabs */}
          <div style={{ display: "flex", gap: 0, background: C.white, borderRadius: 14, padding: 4, marginBottom: 20, boxShadow: "0 1px 6px rgba(30,77,15,0.08)" }}>
            {[["overview","📊 Overview"],["invoices","📄 Invoices"],["expenses","🧾 Expenses"]].map(([id, label]) => (
              <button key={id} onClick={() => setFinanceTab(id)} style={{ flex: 1, padding: "10px 6px", border: "none", borderRadius: 10, background: financeTab === id ? C.green : "transparent", color: financeTab === id ? "#fff" : C.textLight, fontWeight: 800, fontSize: 12, cursor: "pointer", WebkitTapHighlightColor: "transparent" }}>{label}</button>
            ))}
          </div>

          {/* OVERVIEW */}
          {financeTab === "overview" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
                {[
                  { icon: "💰", label: "Revenue Collected", val: `$${totalRevenue.toLocaleString()}`, color: C.green },
                  { icon: "⚠️", label: "Invoices Due", val: `$${totalOwed.toLocaleString()}`, color: C.gold },
                  { icon: "🧾", label: "Total Expenses", val: `$${totalExpenses.toLocaleString()}`, color: C.red },
                  { icon: "📈", label: "Net Profit", val: `$${netProfit.toLocaleString()}`, color: netProfit >= 0 ? C.green : C.red },
                ].map(s => (
                  <Card key={s.label} style={{ padding: "15px 14px" }}>
                    <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 800, color: s.color }}>{s.val}</div>
                    <div style={{ fontSize: 11, color: C.textLight, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.3, marginTop: 3 }}>{s.label}</div>
                  </Card>
                ))}
              </div>

              {/* Expense breakdown */}
              {expenses.length > 0 && (
                <div style={{ marginBottom: 18 }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 800, marginBottom: 12 }}>Expenses by Category</div>
                  <Card>
                    {Object.entries(expensesByCategory).sort((a,b) => b[1]-a[1]).map(([cat, amt], i, arr) => {
                      const pct = Math.round((amt / totalExpenses) * 100);
                      return (
                        <div key={cat} style={{ padding: "13px 16px", borderBottom: i < arr.length-1 ? `1px solid ${C.greenGhost}` : "none" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                            <div style={{ fontWeight: 700, fontSize: 13 }}>{cat}</div>
                            <div style={{ fontWeight: 800, fontSize: 14, color: C.red }}>${amt.toLocaleString()}</div>
                          </div>
                          <div style={{ background: C.greenGhost, borderRadius: 4, height: 6 }}>
                            <div style={{ background: C.red, borderRadius: 4, height: 6, width: `${pct}%`, opacity: 0.7 }} />
                          </div>
                        </div>
                      );
                    })}
                  </Card>
                </div>
              )}

              {/* Recent invoices summary */}
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 800, marginBottom: 12 }}>Recent Invoices</div>
              <Card style={{ marginBottom: 16 }}>
                {allInvoices.slice(0,4).map((inv, i) => (
                  <div key={inv.id} style={{ padding: "12px 16px", borderBottom: i < 3 ? `1px solid ${C.greenGhost}` : "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div><div style={{ fontWeight: 700, fontSize: 13 }}>{inv.clientName}</div><div style={{ fontSize: 11, color: C.textLight }}>{inv.description}</div></div>
                    <div style={{ textAlign: "right" }}><div style={{ fontWeight: 800, fontSize: 14, color: C.green }}>${(+inv.amount).toLocaleString()}</div><Pill status={inv.status} /></div>
                  </div>
                ))}
              </Card>
            </div>
          )}

          {/* INVOICES */}
          {financeTab === "invoices" && (
            <div>
              {/* Filter pills */}
              <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                {[["all","All"],["outstanding","Due"],["paid","Paid"]].map(([val, label]) => (
                  <button key={val} onClick={() => setInvoiceFilter(val)}
                    style={{ padding: "8px 16px", borderRadius: 20, border: "none", background: invoiceFilter === val ? C.green : C.white, color: invoiceFilter === val ? "#fff" : C.textLight, fontWeight: 800, fontSize: 13, cursor: "pointer", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", WebkitTapHighlightColor: "transparent" }}>
                    {label} {val === "outstanding" ? `(${outstandingInvoices.length})` : val === "paid" ? `(${paidInvoices.length})` : `(${allInvoices.length})`}
                  </button>
                ))}
              </div>
              {/* Totals */}
              <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                <Card style={{ flex: 1, padding: "13px 14px" }}><div style={{ fontSize: 11, fontWeight: 700, color: C.textLight, textTransform: "uppercase", letterSpacing: 0.4 }}>💰 Collected</div><div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 800, color: C.green, marginTop: 3 }}>${totalRevenue.toLocaleString()}</div></Card>
                <Card style={{ flex: 1, padding: "13px 14px" }}><div style={{ fontSize: 11, fontWeight: 700, color: C.textLight, textTransform: "uppercase", letterSpacing: 0.4 }}>⚠️ Outstanding</div><div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 800, color: C.gold, marginTop: 3 }}>${totalOwed.toLocaleString()}</div></Card>
              </div>
              {filteredInvoices.length === 0 && <EmptyState icon="📄" msg="No invoices found" />}
              {filteredInvoices.sort((a,b) => new Date(b.date)-new Date(a.date)).map(inv => (
                <Card key={inv.id} style={{ padding: "15px 16px", marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start" }}>
                    <div style={{ flex: 1 }}><div style={{ fontWeight: 800, fontSize: 15 }}>{inv.description}</div><div style={{ fontSize: 12, color: C.textMid, marginTop: 2 }}>{inv.clientName}</div><div style={{ fontSize: 12, color: C.textLight }}>{fmt(inv.date)}</div><div style={{ fontSize: 18, fontWeight: 800, color: C.green, marginTop: 5 }}>${(+inv.amount).toLocaleString()}</div></div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
                      <Pill status={inv.status} />
                      <div style={{ display: "flex", gap: 6 }}>
                        <Btn small variant="secondary" onClick={() => toggleInvoice(inv.clientId, inv.id)}>{inv.status === "paid" ? "Mark Due" : "Mark Paid"}</Btn>
                        {inv.status === "outstanding" && <Btn small variant="blueLight" onClick={() => { const c = clients.find(x => x.id === inv.clientId); if (c) { setTextTarget(c); setTextTemplateKey("payment_reminder"); setTextPersonalized(true); setTextBody(TEXT_TEMPLATES.payment_reminder.personal(c)); setTextStep(2); setTextSheetOpen(true); } }}>💬</Btn>}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* EXPENSES */}
          {financeTab === "expenses" && (
            <div>
              <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                <Card style={{ flex: 1, padding: "13px 14px" }}><div style={{ fontSize: 11, fontWeight: 700, color: C.textLight, textTransform: "uppercase", letterSpacing: 0.4 }}>🧾 Total</div><div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 800, color: C.red, marginTop: 3 }}>${totalExpenses.toLocaleString()}</div></Card>
                <Card style={{ flex: 1, padding: "13px 14px" }}><div style={{ fontSize: 11, fontWeight: 700, color: C.textLight, textTransform: "uppercase", letterSpacing: 0.4 }}>📌 Top Category</div><div style={{ fontSize: 14, fontWeight: 800, color: C.textDark, marginTop: 3, lineHeight: 1.3 }}>{topCategory ? topCategory[0] : "—"}</div></Card>
              </div>
              {expenses.length === 0 && <EmptyState icon="🧾" msg="No expenses logged yet" />}
              {[...expenses].sort((a,b) => new Date(b.date)-new Date(a.date)).map(exp => (
                <Card key={exp.id} style={{ padding: "15px 16px", marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, fontSize: 15 }}>{exp.description}</div>
                      <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 4, flexWrap: "wrap" }}>
                        <span style={{ background: C.greenGhost, color: C.green, borderRadius: 20, padding: "2px 9px", fontSize: 11, fontWeight: 700 }}>{exp.category}</span>
                        {exp.receipt && <span style={{ background: C.blueLight, color: C.blue, borderRadius: 20, padding: "2px 9px", fontSize: 11, fontWeight: 700 }}>🧾 Receipt</span>}
                      </div>
                      <div style={{ fontSize: 12, color: C.textLight, marginTop: 4 }}>{fmt(exp.date)}</div>
                      {exp.notes && <div style={{ fontSize: 12, color: C.textMid, marginTop: 2 }}>{exp.notes}</div>}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
                      <div style={{ fontSize: 20, fontWeight: 800, color: C.red }}>${(+exp.amount).toLocaleString()}</div>
                      <Btn small variant="danger" onClick={() => deleteExpense(exp.id)}>Delete</Btn>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── BOOKINGS ── */}
      {tab === "bookings" && (
        <div style={{ padding: "0 16px" }}>
          <div style={{ padding: "20px 0 14px" }}><div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 800 }}>Events</div></div>
          {allBookings.sort((a,b) => new Date(b.date)-new Date(a.date)).map(b => (
            <Card key={b.id} style={{ padding: "15px 16px", marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}><div style={{ fontWeight: 800, fontSize: 15 }}>{b.event}</div><div style={{ fontSize: 12, color: C.textMid, marginTop: 2 }}>{b.clientName}</div><div style={{ fontSize: 12, color: C.textLight }}>{fmt(b.date)}</div>{b.location && <div style={{ fontSize: 12, color: C.textLight }}>📍 {b.location}</div>}<div style={{ fontSize: 12, color: C.textLight }}>👥 {b.guests||0} guests · 💰 ${(+b.amount).toLocaleString()}</div></div>
                <Pill status={b.status} />
              </div>
            </Card>
          ))}
          {allBookings.length === 0 && <EmptyState icon="📅" msg="No events yet" />}
        </div>
      )}

      {/* ── BOTTOM TAB BAR ── */}
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, background: C.white, borderTop: `1px solid ${C.greenPale}`, display: "flex", paddingBottom: 8, boxShadow: "0 -2px 20px rgba(30,77,15,0.10)", zIndex: 100 }}>
        {navTabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, padding: "10px 0 6px", border: "none", background: "transparent", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, cursor: "pointer", WebkitTapHighlightColor: "transparent" }}>
            <span style={{ fontSize: 22 }}>{t.icon}</span>
            <span style={{ fontSize: 10, fontWeight: 800, color: activeNav === t.id ? C.green : C.textLight, letterSpacing: 0.3, textTransform: "uppercase" }}>{t.label}</span>
            {activeNav === t.id && <div style={{ width: 18, height: 3, borderRadius: 2, background: C.green, marginTop: 1 }} />}
          </button>
        ))}
      </div>

      {/* ── FORM SHEETS ── */}
      <Sheet show={addClientOpen} onClose={() => setAddClientOpen(false)} title="New Client">
        <FInput label="Full Name *" value={nc.name} onChange={e => setNc(p=>({...p,name:e.target.value}))} placeholder="Jane Smith" />
        <FInput label="Email *" type="email" value={nc.email} onChange={e => setNc(p=>({...p,email:e.target.value}))} placeholder="jane@email.com" />
        <FInput label="Phone" type="tel" value={nc.phone} onChange={e => setNc(p=>({...p,phone:e.target.value}))} placeholder="(555) 000-0000" />
        <FInput label="Address" value={nc.address} onChange={e => setNc(p=>({...p,address:e.target.value}))} placeholder="123 Main St, City, IL" />
        <FInput label="Birthdate" type="date" value={nc.birthdate} onChange={e => setNc(p=>({...p,birthdate:e.target.value}))} />
        <FInput label="Referral Source" value={nc.referral} onChange={e => setNc(p=>({...p,referral:e.target.value}))} placeholder="Google, Friend, Event..." />
        <FInput label="Notes" textarea rows={3} value={nc.notes} onChange={e => setNc(p=>({...p,notes:e.target.value}))} placeholder="Preferences, notes..." />
        <Btn full onClick={saveClient}>Save Client ⛳</Btn>
      </Sheet>

      <Sheet show={addBookingOpen} onClose={() => setAddBookingOpen(false)} title="New Event">
        <FInput label="Event Name *" value={nb.event} onChange={e => setNb(p=>({...p,event:e.target.value}))} placeholder="Birthday, Corporate, Wedding..." />
        <FInput label="Date *" type="date" value={nb.date} onChange={e => setNb(p=>({...p,date:e.target.value}))} />
        <FInput label="Location" value={nb.location} onChange={e => setNb(p=>({...p,location:e.target.value}))} placeholder="Venue or address" />
        <FInput label="# of Guests" type="number" inputMode="numeric" value={nb.guests} onChange={e => setNb(p=>({...p,guests:e.target.value}))} placeholder="0" />
        <FInput label="Amount ($)" type="number" inputMode="decimal" value={nb.amount} onChange={e => setNb(p=>({...p,amount:e.target.value}))} placeholder="0" />
        <FSelect label="Status" value={nb.status} onChange={e => setNb(p=>({...p,status:e.target.value}))}><option value="outstanding">Outstanding</option><option value="paid">Paid</option></FSelect>
        <Btn full onClick={saveBooking}>Save Event 📅</Btn>
      </Sheet>

      <Sheet show={addInvoiceOpen} onClose={() => setAddInvoiceOpen(false)} title="New Invoice">
        <FInput label="Description *" value={ni.description} onChange={e => setNi(p=>({...p,description:e.target.value}))} placeholder="Event name - 2hrs" />
        <FInput label="Date" type="date" value={ni.date} onChange={e => setNi(p=>({...p,date:e.target.value}))} />
        <FInput label="Amount ($) *" type="number" inputMode="decimal" value={ni.amount} onChange={e => setNi(p=>({...p,amount:e.target.value}))} placeholder="0" />
        <FSelect label="Status" value={ni.status} onChange={e => setNi(p=>({...p,status:e.target.value}))}><option value="outstanding">Outstanding</option><option value="paid">Paid</option></FSelect>
        <Btn full onClick={saveInvoice}>Create Invoice 📄</Btn>
      </Sheet>

      {/* ── ADD EXPENSE SHEET ── */}
      <Sheet show={addExpenseOpen} onClose={() => setAddExpenseOpen(false)} title="Log Expense">
        <FInput label="Description *" value={ne.description} onChange={e => setNe(p=>({...p,description:e.target.value}))} placeholder="Fuel, repair, software..." />
        <FInput label="Date" type="date" value={ne.date} onChange={e => setNe(p=>({...p,date:e.target.value}))} />
        <FInput label="Amount ($) *" type="number" inputMode="decimal" value={ne.amount} onChange={e => setNe(p=>({...p,amount:e.target.value}))} placeholder="0.00" />
        <FSelect label="Category" value={ne.category} onChange={e => setNe(p=>({...p,category:e.target.value}))}>
          {EXPENSE_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </FSelect>
        <FInput label="Notes (optional)" value={ne.notes} onChange={e => setNe(p=>({...p,notes:e.target.value}))} placeholder="Any extra details..." />
        {/* Receipt toggle */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.textMid, marginBottom: 8, letterSpacing: 0.4, textTransform: "uppercase" }}>Receipt on Hand?</div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setNe(p=>({...p,receipt:true}))} style={{ flex: 1, padding: "12px", borderRadius: 12, border: `2px solid ${ne.receipt ? C.blue : C.greenPale}`, background: ne.receipt ? C.blueLight : C.white, fontWeight: 800, fontSize: 13, color: ne.receipt ? C.blue : C.textLight, cursor: "pointer" }}>✅ Yes</button>
            <button onClick={() => setNe(p=>({...p,receipt:false}))} style={{ flex: 1, padding: "12px", borderRadius: 12, border: `2px solid ${!ne.receipt ? C.green : C.greenPale}`, background: !ne.receipt ? C.greenGhost : C.white, fontWeight: 800, fontSize: 13, color: !ne.receipt ? C.green : C.textLight, cursor: "pointer" }}>❌ No</button>
          </div>
        </div>
        <Btn full onClick={saveExpense}>Log Expense 🧾</Btn>
      </Sheet>

      {/* ── INDIVIDUAL EMAIL SHEET ── */}
      <Sheet show={emailOpen && !!clientView} onClose={() => setEmailOpen(false)} title={clientView ? `Email ${clientView.name.split(" ")[0]}` : "Email"}>
        {clientView && (<>
          <div style={{ fontSize: 13, color: C.textLight, marginTop: -10, marginBottom: 16 }}>To: {clientView.email}</div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.textMid, letterSpacing: 0.4, textTransform: "uppercase", marginBottom: 9 }}>AI Draft</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {[["✨ General","custom"],["🎂 Birthday","birthday"],["🔁 Follow-up","followup"],["⚠️ Invoice","invoice"]].map(([label, type]) => (
                <Btn key={type} small variant={emailType===type && emailBody ? "primary" : "secondary"} onClick={() => generateEmail(type)} disabled={aiLoading}>{aiLoading && emailType===type ? "Writing..." : label}</Btn>
              ))}
            </div>
          </div>
          <FInput label="Subject" value={emailSubject} onChange={e => setEmailSubject(e.target.value)} placeholder="Subject line" />
          <FInput label="Message" textarea rows={7} value={emailBody} onChange={e => setEmailBody(e.target.value)} placeholder="Type a message or tap an AI draft above..." />
          <div style={{ display: "flex", gap: 10 }}>
            <Btn full onClick={sendViaMailApp}>📬 Open Mail</Btn>
            <Btn full variant="sand" onClick={() => { navigator.clipboard.writeText(`Subject: ${emailSubject}\n\n${emailBody}`); showToast("Copied! 📋"); }}>📋 Copy</Btn>
          </div>
        </>)}
      </Sheet>

      {/* ── TEXT SHEET ── */}
      <Sheet show={textSheetOpen} onClose={() => setTextSheetOpen(false)} title={textTarget ? `Text ${textTarget.name.split(" ")[0]}` : "Send Text"}>
        {textStep === 1 && (
          <div>
            <div style={{ fontSize: 13, color: C.textLight, marginTop: -10, marginBottom: 18 }}>To: {textTarget?.phone || "No phone on file"}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.textMid, letterSpacing: 0.4, textTransform: "uppercase", marginBottom: 12 }}>Choose a Template</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {Object.entries(TEXT_TEMPLATES).map(([key, tmpl]) => (
                <button key={key} onClick={() => selectTextTemplate(key)} style={{ background: C.white, border: `1.5px solid ${C.greenPale}`, borderRadius: 14, padding: "14px 16px", textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", gap: 14, WebkitTapHighlightColor: "transparent" }}>
                  <span style={{ fontSize: 24 }}>{tmpl.icon}</span>
                  <div style={{ flex: 1 }}><div style={{ fontWeight: 800, fontSize: 14, color: C.textDark }}>{tmpl.label}</div><div style={{ fontSize: 12, color: C.textLight, marginTop: 2 }}>Tap to preview & edit</div></div>
                  <span style={{ color: C.textLight, fontSize: 18 }}>›</span>
                </button>
              ))}
            </div>
          </div>
        )}
        {textStep === 2 && (
          <div>
            <button onClick={() => setTextStep(1)} style={{ background: "none", border: "none", color: C.green, fontWeight: 800, fontSize: 14, cursor: "pointer", padding: "0 0 16px" }}>← Back</button>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.textMid, letterSpacing: 0.4, textTransform: "uppercase", marginBottom: 10 }}>Style</div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => toggleTextPersonalized(true)} style={{ flex: 1, padding: "11px", borderRadius: 12, border: `2px solid ${textPersonalized ? C.green : C.greenPale}`, background: textPersonalized ? C.greenGhost : C.white, fontWeight: 800, fontSize: 13, color: textPersonalized ? C.green : C.textLight, cursor: "pointer" }}>👤 Personalized</button>
                <button onClick={() => toggleTextPersonalized(false)} style={{ flex: 1, padding: "11px", borderRadius: 12, border: `2px solid ${!textPersonalized ? C.blue : C.greenPale}`, background: !textPersonalized ? C.blueLight : C.white, fontWeight: 800, fontSize: 13, color: !textPersonalized ? C.blue : C.textLight, cursor: "pointer" }}>📢 Generic</button>
              </div>
            </div>
            <FInput label="Message" textarea rows={6} value={textBody} onChange={e => setTextBody(e.target.value)} />
            <div style={{ fontSize: 12, color: C.textLight, marginTop: -8, marginBottom: 16, textAlign: "right" }}>{textBody.length} chars</div>
            <div style={{ display: "flex", gap: 10 }}>
              <Btn full variant="blue" onClick={sendSingleText}>📲 Open in Messages</Btn>
              <Btn full variant="sand" onClick={() => { navigator.clipboard.writeText(textBody); showToast("Copied! 📋"); }}>📋 Copy</Btn>
            </div>
          </div>
        )}
      </Sheet>

      {/* ── GROUP EMAIL SHEET ── */}
      <Sheet show={groupEmailOpen} onClose={() => setGroupEmailOpen(false)} title="Group Email">
        {groupEmailStep === 1 && (
          <div>
            <div style={{ fontSize: 13, color: C.textLight, marginTop: -10, marginBottom: 18 }}>Choose a campaign type to get started</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {Object.entries(GROUP_EMAIL_TEMPLATES).map(([key, tmpl]) => (
                <button key={key} onClick={() => selectGroupTemplate(key)} style={{ background: C.white, border: `1.5px solid ${C.greenPale}`, borderRadius: 14, padding: "15px 16px", textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", gap: 14, WebkitTapHighlightColor: "transparent" }}>
                  <span style={{ fontSize: 26 }}>{tmpl.icon}</span>
                  <div style={{ flex: 1 }}><div style={{ fontWeight: 800, fontSize: 15, color: C.textDark }}>{tmpl.label}</div><div style={{ fontSize: 12, color: C.textLight, marginTop: 2 }}>AI-written · personalized or generic</div></div>
                  <span style={{ color: C.textLight, fontSize: 18 }}>›</span>
                </button>
              ))}
            </div>
          </div>
        )}
        {groupEmailStep === 2 && (
          <div>
            <button onClick={() => setGroupEmailStep(1)} style={{ background: "none", border: "none", color: C.purple, fontWeight: 800, fontSize: 14, cursor: "pointer", padding: "0 0 16px" }}>← Back to Templates</button>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.textMid, letterSpacing: 0.4, textTransform: "uppercase", marginBottom: 10 }}>Email Style</div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setGroupEmailPersonalized(true)} style={{ flex: 1, padding: "12px 10px", borderRadius: 12, border: `2px solid ${groupEmailPersonalized ? C.purple : C.greenPale}`, background: groupEmailPersonalized ? C.purpleLight : C.white, fontWeight: 800, fontSize: 12, color: groupEmailPersonalized ? C.purple : C.textLight, cursor: "pointer", lineHeight: 1.4 }}>👤 Personalized<br /><span style={{ fontSize: 10, fontWeight: 600 }}>Each client gets their name used</span></button>
                <button onClick={() => setGroupEmailPersonalized(false)} style={{ flex: 1, padding: "12px 10px", borderRadius: 12, border: `2px solid ${!groupEmailPersonalized ? C.green : C.greenPale}`, background: !groupEmailPersonalized ? C.greenGhost : C.white, fontWeight: 800, fontSize: 12, color: !groupEmailPersonalized ? C.green : C.textLight, cursor: "pointer", lineHeight: 1.4 }}>📢 Generic Blast<br /><span style={{ fontSize: 10, fontWeight: 600 }}>One email, BCC all</span></button>
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Btn full variant={groupEmailPersonalized ? "purple" : "primary"} onClick={generateGroupEmail} disabled={groupAiLoading}>{groupAiLoading ? "✍️ Writing..." : "✨ Generate with AI"}</Btn>
              {!groupEmailBody && !groupAiLoading && <div style={{ fontSize: 12, color: C.textLight, textAlign: "center", marginTop: 8 }}>Tap above to auto-write, or type below</div>}
            </div>
            <FInput label="Subject Line" value={groupEmailSubject} onChange={e => setGroupEmailSubject(e.target.value)} placeholder="Email subject..." />
            <FInput label="Message Body" textarea rows={8} value={groupEmailBody} onChange={e => setGroupEmailBody(e.target.value)} placeholder="Your message will appear here..." />
            {groupEmailPersonalized && groupEmailBody && <div style={{ background: C.purpleLight, borderRadius: 12, padding: "12px 14px", marginBottom: 14, fontSize: 12, color: C.purple, fontWeight: 600 }}>💡 Personalized: opens one email per client. Send each, return for next.</div>}
            {!groupEmailPersonalized && groupEmailBody && <div style={{ background: C.greenGhost, borderRadius: 12, padding: "12px 14px", marginBottom: 14, fontSize: 12, color: C.green, fontWeight: 600 }}>💡 Generic blast: all clients added as BCC — they won't see each other.</div>}
            <div style={{ display: "flex", gap: 10 }}>
              <Btn full variant={groupEmailPersonalized ? "purple" : "primary"} onClick={() => setGroupEmailStep(3)} disabled={!groupEmailBody}>Next: Choose Recipients →</Btn>
              <Btn small variant="sand" onClick={() => { navigator.clipboard.writeText(`Subject: ${groupEmailSubject}\n\n${groupEmailBody}`); showToast("Copied! 📋"); }} disabled={!groupEmailBody}>📋</Btn>
            </div>
          </div>
        )}
        {groupEmailStep === 3 && (
          <div>
            <button onClick={() => setGroupEmailStep(2)} style={{ background: "none", border: "none", color: C.purple, fontWeight: 800, fontSize: 14, cursor: "pointer", padding: "0 0 16px" }}>← Back to Message</button>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.textMid, letterSpacing: 0.4, textTransform: "uppercase", marginBottom: 12 }}>Select Recipients</div>
            <button onClick={toggleGroupSelectAll} style={{ width: "100%", background: groupSelectAll ? C.green : C.white, border: `2px solid ${groupSelectAll ? C.green : C.greenPale}`, borderRadius: 14, padding: "13px 16px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", marginBottom: 12, WebkitTapHighlightColor: "transparent" }}>
              <div style={{ width: 22, height: 22, borderRadius: 6, background: groupSelectAll ? "#fff" : C.greenGhost, border: `2px solid ${groupSelectAll ? C.green : C.greenPale}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>{groupSelectAll ? "✓" : ""}</div>
              <span style={{ fontWeight: 800, fontSize: 14, color: groupSelectAll ? "#fff" : C.textDark }}>Select All ({clients.length} clients)</span>
            </button>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
              {clients.map(c => {
                const selected = groupSelected.includes(c.id);
                return (
                  <button key={c.id} onClick={() => toggleGroupClient(c.id)} style={{ background: selected ? C.greenGhost : C.white, border: `2px solid ${selected ? C.green : C.greenPale}`, borderRadius: 14, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", WebkitTapHighlightColor: "transparent" }}>
                    <div style={{ width: 22, height: 22, borderRadius: 6, background: selected ? C.green : C.white, border: `2px solid ${selected ? C.green : C.greenPale}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "#fff", flexShrink: 0 }}>{selected ? "✓" : ""}</div>
                    <Avatar name={c.name} size={34} />
                    <div style={{ flex: 1, textAlign: "left", minWidth: 0 }}><div style={{ fontWeight: 800, fontSize: 14 }}>{c.name}</div><div style={{ fontSize: 12, color: C.textLight, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.email || "No email"}</div></div>
                  </button>
                );
              })}
            </div>
            {groupSelected.length > 0 && <div style={{ background: groupEmailPersonalized ? C.purpleLight : C.greenGhost, borderRadius: 12, padding: "12px 14px", marginBottom: 16, fontSize: 12, color: groupEmailPersonalized ? C.purple : C.green, fontWeight: 700 }}>{groupEmailPersonalized ? `✉️ Will open ${groupSelected.length} personalized email${groupSelected.length > 1 ? "s" : ""} one at a time` : `✉️ One email to ${groupSelected.length} client${groupSelected.length > 1 ? "s" : ""} via BCC`}</div>}
            <Btn full variant={groupEmailPersonalized ? "purple" : "primary"} onClick={sendGroupEmail} disabled={groupSelected.length === 0}>✉️ Send to {groupSelected.length} Client{groupSelected.length !== 1 ? "s" : ""}</Btn>
          </div>
        )}
      </Sheet>
    </div>
  );
}
