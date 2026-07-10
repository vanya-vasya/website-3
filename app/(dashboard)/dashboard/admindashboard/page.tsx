"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, SlidersHorizontal, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { inputStyles, buttonStyles, contentStyles } from "@/components/ui/feature-styles";
import { FeatureContainer } from "@/components/feature-container";
import { currencies, type Currency } from "@/constants/index";

// ─── Constants ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 20;

// ─── Model definitions ───────────────────────────────────────────────────────

type ModelKey = "masterChef" | "masterNutritionist" | "calTracker";

interface ModelDef {
  name: string;
  tokens: number;
}

const MODELS: Record<ModelKey, ModelDef> = {
  masterChef:         { name: "Your Own Chef",         tokens: 10 },
  masterNutritionist: { name: "Your Own Nutritionist", tokens: 15 },
  calTracker:         { name: "Your Own Tracker",      tokens: 5  },
};

const ALL_MODELS: ModelKey[] = ["masterChef", "masterNutritionist", "calTracker"];

// ─── Payment types ────────────────────────────────────────────────────────────

type PaymentStatus = "successful" | "failed" | "pending";

interface PaymentRow {
  id: string;
  date: string;
  amount: string;
  currency: Currency;
  tokens: string;
  status: PaymentStatus;
}

// ─── Activity type ────────────────────────────────────────────────────────────

interface ActivityRow {
  ts: number; // epoch ms — drives sorting
  date: string;
  tool: string;
  tokensUsed: number;
  tokensTotal: number;
}

type SortDir = "asc" | "desc";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const rand = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const parseDate = (dateStr: string): Date | null => {
  const parts = dateStr.split(".");
  if (parts.length !== 3) return null;
  const [day, month, year] = parts.map(Number);
  if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
  if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900) return null;
  return new Date(year, month - 1, day);
};

const formatDate = (d: Date): string => {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}.${mm}.${d.getFullYear()}`;
};

const CHARS = "abcdefghijklmnopqrstuvwxyz0123456789";
const generateId = (): string =>
  "cmp" + Array.from({ length: 22 }, () => CHARS[rand(0, CHARS.length - 1)]).join("");

// ─── Activity generator ───────────────────────────────────────────────────────

const generateActivity = (tokensTarget: number, startDate: Date, endDate: Date): ActivityRow[] => {
  const startMs = startDate.getTime();
  const endMs   = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59, 59).getTime();
  const rangeMs = Math.max(endMs - startMs, 60_000); // at least 1 min

  // ── Phase 1: generate sessions until ALL tokens are exhausted ──────────────
  // Time is NOT checked here — tokens drive the loop completely.
  type RawEntry = { tool: string; tokens: number };
  const sessions: RawEntry[][] = [];
  let remaining = tokensTarget;

  while (remaining > 0) {
    const session: RawEntry[] = [];
    const modelCount = Math.min(rand(1, 3), ALL_MODELS.length);
    const picked     = [...ALL_MODELS].sort(() => Math.random() - 0.5).slice(0, modelCount);

    for (const modelKey of picked) {
      if (remaining <= 0) break;
      const uses = rand(1, 4);
      for (let u = 0; u < uses; u++) {
        if (remaining <= 0) break;
        const model = MODELS[modelKey];
        const cost  = Math.min(model.tokens, remaining);
        session.push({ tool: model.name, tokens: cost });
        remaining -= cost;
      }
    }

    if (session.length > 0) sessions.push(session);
  }

  // ── Phase 2: distribute sessions evenly across the date range ─────────────
  const numSessions = sessions.length;
  const slotMs      = rangeMs / numSessions;
  type TimedEntry = { ts: number; tool: string; tokens: number };
  const timed: TimedEntry[] = [];

  for (let s = 0; s < numSessions; s++) {
    // Cursor starts at a random point in the first quarter of each slot
    const slotStart = startMs + s * slotMs;
    let cursorMs    = slotStart + rand(0, Math.max(1, Math.floor(slotMs * 0.25 / 60_000))) * 60_000
                    + rand(0, 59) * 1000;

    for (const entry of sessions[s]) {
      // Clamp so a long session never overflows past the requested last date
      const displayMs = Math.min(cursorMs + rand(0, 59) * 1000, endMs);
      timed.push({ ts: displayMs, tool: entry.tool, tokens: entry.tokens });
      cursorMs += rand(2, 25) * 60_000; // intra-session gap
    }
  }

  // Sessions can overlap in time, so enforce chronological order globally
  // before computing the running total — it must follow real time.
  timed.sort((a, b) => a.ts - b.ts);

  let totalSpent = 0;
  return timed.map((entry) => {
    totalSpent += entry.tokens;
    return {
      ts:          entry.ts,
      date:        formatDate(new Date(entry.ts)),
      tool:        entry.tool,
      tokensUsed:  entry.tokens,
      tokensTotal: totalSpent,
    };
  });
};

// ─── Pagination component ─────────────────────────────────────────────────────

interface PaginationProps {
  page: number;
  total: number;
  onChange: (p: number) => void;
}

const Pagination = ({ page, total, onChange }: PaginationProps) => {
  if (total <= 1) return null;

  const getPages = (): (number | "…")[] => {
    if (total <= 6) return Array.from({ length: total }, (_, i) => i + 1);
    if (page <= 3)      return [1, 2, 3, "…", total];
    if (page >= total - 2) return [1, "…", total - 2, total - 1, total];
    return [1, "…", page - 1, page, page + 1, "…", total];
  };

  const btnBase = "w-8 h-8 flex items-center justify-center rounded text-sm font-medium transition-colors";

  return (
    <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
      <span className="text-xs text-gray-400">Page {page} of {total}</span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
          className={cn(btnBase, page === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:bg-gray-100")}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {getPages().map((p, i) =>
          p === "…" ? (
            <span key={`ellipsis-${i}`} className="w-8 h-8 flex items-center justify-center text-gray-400 text-sm">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onChange(p as number)}
              aria-label={`Page ${p}`}
              aria-current={page === p ? "page" : undefined}
              className={cn(
                btnBase,
                page === p
                  ? "bg-indigo-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onChange(page + 1)}
          disabled={page === total}
          aria-label="Next page"
          className={cn(btnBase, page === total ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:bg-gray-100")}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// ─── Shared styles ────────────────────────────────────────────────────────────

const cardStyle: React.CSSProperties = {
  boxShadow: "0 0 0 1px rgba(129,140,248,0.15), 0 4px 6px -1px rgba(0,0,0,0.05)",
};

const cellInputCls =
  "w-full bg-gray-100 border border-gray-200 rounded-md px-2 py-1.5 text-sm text-black outline-none focus:border-indigo-400 transition-colors";

const cellSelectCls =
  "w-full bg-gray-100 border border-gray-200 rounded-md px-2 py-1.5 text-sm text-black outline-none focus:border-indigo-400 transition-colors appearance-none cursor-pointer pr-7";

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  // Config visibility
  const [configVisible, setConfigVisible] = useState(true);

  // Activity state
  const [email,      setEmail]      = useState("");
  const [tokensSpend, setTokensSpend] = useState("1500");
  const [firstDate,  setFirstDate]  = useState("");
  const [lastDate,   setLastDate]   = useState("");
  const [activityRows, setActivityRows]   = useState<ActivityRow[]>([]);
  const [activityError, setActivityError] = useState("");
  const [activityGenerated, setActivityGenerated] = useState(false);
  const [activityPage, setActivityPage] = useState(1);
  const [activitySortDir, setActivitySortDir] = useState<SortDir>("desc");

  // Payment state
  const [rowsCount,     setRowsCount]    = useState("");
  const [paymentRows,   setPaymentRows]  = useState<PaymentRow[]>([]);
  const [paymentLocked, setPaymentLocked] = useState(false);
  const [paymentPage,   setPaymentPage]  = useState(1);

  // ── Validation ──────────────────────────────────────────────────────────────

  const isEmailValid = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const canGenerateActivity = (() => {
    if (!isEmailValid(email)) return false;
    if (!tokensSpend || Number(tokensSpend) <= 0) return false;
    const start = parseDate(firstDate);
    const end   = parseDate(lastDate);
    if (!start || !end) return false;
    return end >= start;
  })();

  const canGenerateRows = Number(rowsCount) > 0;

  // ── Sorting + pagination slices ──────────────────────────────────────────────

  const sortedActivity = [...activityRows].sort((a, b) =>
    activitySortDir === "desc" ? b.ts - a.ts : a.ts - b.ts
  );
  const activityTotalPages = Math.max(1, Math.ceil(sortedActivity.length / PAGE_SIZE));
  const pagedActivity = sortedActivity.slice((activityPage - 1) * PAGE_SIZE, activityPage * PAGE_SIZE);

  const paymentTotalPages = Math.max(1, Math.ceil(paymentRows.length / PAGE_SIZE));
  const pagedPayment = paymentRows.slice((paymentPage - 1) * PAGE_SIZE, paymentPage * PAGE_SIZE);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleGenerateActivity = () => {
    setActivityError("");
    setActivityGenerated(false);
    const start  = parseDate(firstDate);
    const end    = parseDate(lastDate);
    const tokens = parseInt(tokensSpend, 10);
    if (!start || !end) { setActivityError("Invalid date format. Use DD.MM.YYYY"); return; }
    if (end < start)    { setActivityError("Last date must be equal to or later than first date."); return; }
    if (tokens <= 0)    { setActivityError("Tokens spend must be greater than 0."); return; }
    // Rows come back chronologically sorted; publish newest-first by default
    setActivityRows(generateActivity(tokens, start, end));
    setActivitySortDir("desc");
    setActivityPage(1);
    setActivityGenerated(true);
  };

  const handleToggleActivitySort = () => {
    setActivitySortDir((prev) => (prev === "desc" ? "asc" : "desc"));
    setActivityPage(1);
  };

  const handleResetActivity = () => {
    setEmail("");
    setTokensSpend("1500");
    setFirstDate("");
    setLastDate("");
    setActivityRows([]);
    setActivityError("");
    setActivityGenerated(false);
    setActivityPage(1);
  };

  const handleGenerateRows = () => {
    const count = Math.max(1, Math.min(500, parseInt(rowsCount, 10)));
    const today = formatDate(new Date());
    setPaymentRows(
      Array.from({ length: count }, () => ({
        id: generateId(), date: today, amount: "20.00",
        currency: "GBP" as Currency, tokens: "100", status: "successful" as PaymentStatus,
      }))
    );
    setPaymentPage(1);
    setPaymentLocked(false);
  };

  const handleUpdateRow = <K extends keyof PaymentRow>(idx: number, field: K, value: PaymentRow[K]) => {
    // idx here is the global index, not the page-local index
    setPaymentRows((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  };

  const handleCreateTable = () => setPaymentLocked(true);

  const statusBadge = (s: PaymentStatus) => {
    const map: Record<PaymentStatus, string> = {
      successful: "bg-emerald-50 text-emerald-700 border border-emerald-100",
      failed:     "bg-red-50 text-red-600 border border-red-100",
      pending:    "bg-amber-50 text-amber-700 border border-amber-100",
    };
    return cn("px-2 py-0.5 rounded-full text-xs font-medium capitalize", map[s]);
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="bg-white">
      <FeatureContainer
        title="Account Overview"
        description="View account activity, usage history, and transaction records for the selected user."
        iconName="SlidersHorizontal"
        gradient="from-cyan-400 via-blue-500 to-indigo-600"
      >
        <div className="space-y-8">

          {/* ── Back to Dashboard ── */}
          <div className="flex justify-center">
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-black transition-colors"
              aria-label="Back to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
              Dashboard
            </Link>
          </div>

          {/* ── Activity configuration (hidden when configVisible=false) ── */}
          {configVisible && (
            <div className={contentStyles.base}>
              <div className="rounded-xl border border-gray-200 bg-white shadow-sm" style={cardStyle}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                  <h2 className="text-base font-heading font-semibold text-black">
                    Activity configuration
                  </h2>
                  <button
                    onClick={() => setConfigVisible(false)}
                    aria-label="Hide configuration"
                    className="text-sm font-medium text-indigo-500 hover:text-indigo-700 transition-colors"
                  >
                    Hide
                  </button>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">Email</label>
                      <div className={cn(inputStyles.container, "p-0")}>
                        <input type="email" placeholder="user@example.com" value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className={cn(inputStyles.base, "w-full px-3 py-2.5 text-sm")}
                          aria-label="User email" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">Tokens spend</label>
                      <div className={cn(inputStyles.container, "p-0")}>
                        <input type="number" min={1} placeholder="1500" value={tokensSpend}
                          onChange={(e) => setTokensSpend(e.target.value)}
                          className={cn(inputStyles.base, "w-full px-3 py-2.5 text-sm")}
                          aria-label="Tokens to spend" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">First date</label>
                      <div className={cn(inputStyles.container, "p-0")}>
                        <input type="text" placeholder="DD.MM.YYYY" value={firstDate}
                          onChange={(e) => setFirstDate(e.target.value)} maxLength={10}
                          className={cn(inputStyles.base, "w-full px-3 py-2.5 text-sm")}
                          aria-label="Start date DD.MM.YYYY" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">Last date</label>
                      <div className={cn(inputStyles.container, "p-0")}>
                        <input type="text" placeholder="DD.MM.YYYY" value={lastDate}
                          onChange={(e) => setLastDate(e.target.value)} maxLength={10}
                          className={cn(inputStyles.base, "w-full px-3 py-2.5 text-sm")}
                          aria-label="End date DD.MM.YYYY" />
                      </div>
                    </div>
                  </div>

                  {activityError && <p className="text-xs text-red-500 mb-3">{activityError}</p>}

                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleGenerateActivity}
                      disabled={!canGenerateActivity}
                      aria-disabled={!canGenerateActivity}
                      aria-label="Generate activity"
                      className={cn(
                        "px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-all duration-200",
                        canGenerateActivity ? buttonStyles.base : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      )}
                    >
                      Generate activity
                    </button>
                    <button
                      onClick={handleResetActivity}
                      aria-label="Reset activity form"
                      className="px-4 py-2.5 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Payment configuration ── */}
          {configVisible && (
            <div className={contentStyles.base}>
              <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6" style={cardStyle}>
                <h2 className="text-base font-heading font-semibold text-black mb-5">
                  Payment configuration
                </h2>

                <div className="flex items-end gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Rows count</label>
                    <div className={cn(inputStyles.container, "p-0 w-32")}>
                      <input type="number" min={1} max={500} placeholder="10" value={rowsCount}
                        onChange={(e) => setRowsCount(e.target.value)}
                        className={cn(inputStyles.base, "w-full px-3 py-2.5 text-sm")}
                        aria-label="Payment rows count" />
                    </div>
                  </div>

                  <button
                    onClick={handleGenerateRows}
                    disabled={!canGenerateRows}
                    aria-disabled={!canGenerateRows}
                    aria-label="Generate payment rows"
                    className={cn(
                      "px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-all duration-200",
                      canGenerateRows ? buttonStyles.base : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    )}
                  >
                    Generate rows
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── Editable payment rows ── */}
          {configVisible && paymentRows.length > 0 && !paymentLocked && (
            <div className={contentStyles.base}>
              <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden" style={cardStyle}>
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="text-base font-heading font-semibold text-black">
                    Payment rows — <span className="text-indigo-600">{paymentRows.length} rows</span>
                  </h2>
                  <button
                    onClick={handleCreateTable}
                    aria-label="Create table"
                    className={cn("px-5 py-2 rounded-lg text-sm font-semibold text-white transition-all duration-200", buttonStyles.base)}
                  >
                    Create table
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        {["Date", "Amount", "Currency", "Tokens", "Status"].map((h) => (
                          <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {pagedPayment.map((row) => {
                        const globalIdx = paymentRows.findIndex((r) => r.id === row.id);
                        return (
                          <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-2.5 w-36">
                              <input type="text" maxLength={10} value={row.date}
                                onChange={(e) => handleUpdateRow(globalIdx, "date", e.target.value)}
                                className={cellInputCls} aria-label="Row date" />
                            </td>
                            <td className="px-4 py-2.5 w-32">
                              <input type="number" min={0} step={0.01} value={row.amount}
                                onChange={(e) => handleUpdateRow(globalIdx, "amount", e.target.value)}
                                className={cellInputCls} aria-label="Row amount" />
                            </td>
                            <td className="px-4 py-2.5 w-36">
                              <div className="relative">
                                <select value={row.currency}
                                  onChange={(e) => handleUpdateRow(globalIdx, "currency", e.target.value as Currency)}
                                  className={cellSelectCls} aria-label="Row currency">
                                  {currencies.map((c) => <option key={c} value={c}>{c}</option>)}
                                </select>
                                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                              </div>
                            </td>
                            <td className="px-4 py-2.5 w-32">
                              <input type="number" min={0} value={row.tokens}
                                onChange={(e) => handleUpdateRow(globalIdx, "tokens", e.target.value)}
                                className={cellInputCls} aria-label="Row tokens" />
                            </td>
                            <td className="px-4 py-2.5 w-40">
                              <div className="relative">
                                <select value={row.status}
                                  onChange={(e) => handleUpdateRow(globalIdx, "status", e.target.value as PaymentStatus)}
                                  className={cellSelectCls} aria-label="Row status">
                                  <option value="successful">successful</option>
                                  <option value="failed">failed</option>
                                  <option value="pending">pending</option>
                                </select>
                                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <Pagination page={paymentPage} total={paymentTotalPages} onChange={setPaymentPage} />
              </div>
            </div>
          )}

          {/* ── Locked payment history ── */}
          {paymentLocked && paymentRows.length > 0 && (
            <div className={contentStyles.base}>
              <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden" style={cardStyle}>
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="text-base font-heading font-semibold text-black">
                    Payment History — <span className="text-indigo-600">{paymentRows.length} records</span>
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Payment transactions linked to this account</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        {["ID", "Date", "Amount", "Currency", "Tokens", "Status"].map((h) => (
                          <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {paymentRows
                        .slice((paymentPage - 1) * PAGE_SIZE, paymentPage * PAGE_SIZE)
                        .map((row) => (
                          <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 font-mono text-xs text-gray-500">{row.id}</td>
                            <td className="px-4 py-3 font-medium text-black">{row.date}</td>
                            <td className="px-4 py-3 text-black">{Number(row.amount).toFixed(2)}</td>
                            <td className="px-4 py-3 text-black">{row.currency}</td>
                            <td className="px-4 py-3 text-black">{row.tokens}</td>
                            <td className="px-4 py-3"><span className={statusBadge(row.status)}>{row.status}</span></td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

                <div className="border-t border-gray-100">
                  <Pagination page={paymentPage} total={paymentTotalPages} onChange={setPaymentPage} />
                </div>
              </div>
            </div>
          )}

          {/* ── Generated activity table ── */}
          {activityGenerated && activityRows.length > 0 && (
            <div className={contentStyles.base}>
              <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden" style={cardStyle}>
                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                  <h2 className="text-base font-heading font-semibold text-black">
                    User activity
                  </h2>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
                    {activityRows.length} rows · {email}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        {["#", "Date", "Tool", "Tokens", "Total spent"].map((h) =>
                          h === "Date" ? (
                            <th
                              key={h}
                              aria-sort={activitySortDir === "desc" ? "descending" : "ascending"}
                              className="text-left px-4 py-3 border-b border-gray-100"
                            >
                              <button
                                onClick={handleToggleActivitySort}
                                aria-label={`Sort by date, currently ${activitySortDir === "desc" ? "newest first" : "oldest first"}`}
                                className="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-indigo-600 transition-colors"
                              >
                                {h}
                                {activitySortDir === "desc"
                                  ? <ChevronDown className="w-3.5 h-3.5" />
                                  : <ChevronUp className="w-3.5 h-3.5" />}
                              </button>
                            </th>
                          ) : (
                            <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                              {h}
                            </th>
                          )
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {pagedActivity.map((row, i) => {
                        const globalN = (activityPage - 1) * PAGE_SIZE + i + 1;
                        return (
                          <tr key={i} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 text-gray-400 text-xs">{globalN}</td>
                            <td className="px-4 py-3 font-medium text-black">{row.date}</td>
                            <td className="px-4 py-3">
                              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-600 border border-indigo-100">
                                {row.tool}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-black">{row.tokensUsed}</td>
                            <td className="px-4 py-3 font-semibold text-indigo-600">{row.tokensTotal}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <Pagination page={activityPage} total={activityTotalPages} onChange={setActivityPage} />
              </div>
            </div>
          )}

          {activityGenerated && activityRows.length === 0 && (
            <p className="text-center text-sm text-muted-foreground">
              No activity could be generated. Try a wider date range or more tokens.
            </p>
          )}
        </div>
      </FeatureContainer>
    </div>
  );
}
