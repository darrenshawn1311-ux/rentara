"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGrid,
  Users,
  ClipboardList,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  LogOut,
  Eye,
  Download,
  X,
} from "lucide-react";
import { formatIDR, cn } from "@/lib/utils";
import { SAMPLE_LISTINGS } from "@/lib/seed-data";
import { AGENTS } from "@/lib/agents";
import type { Agent } from "@/lib/agents";
import { VerificationChecklistUI, CHECKLIST_KEYS } from "@/components/shared/VerificationChecklist";
import type { VerificationStatus, VerificationChecklist, VerificationRecord } from "@/types";

const SAMPLE_WAITLIST = [
  { id: "w1", full_name: "Anisa R.", email: "anisa@gmail.com", whatsapp: "62811xxx", preferred_area: "Kemang", rental_budget: "10-20jt", created_at: "2024-10-14" },
  { id: "w2", full_name: "David C.", email: "david@corp.com", whatsapp: "62812xxx", preferred_area: "SCBD", rental_budget: "20-40jt", created_at: "2024-10-13" },
  { id: "w3", full_name: "Maya S.", email: "maya@mail.id", whatsapp: "62813xxx", preferred_area: "BSD", rental_budget: "5-10jt", created_at: "2024-10-12" },
];

const STATUS_PILL: Record<VerificationStatus, string> = {
  pending:   "bg-gray-100 text-gray-600 border-gray-200",
  in_review: "bg-amber-50 text-amber-700 border-amber-200",
  verified:  "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected:  "bg-red-50 text-red-700 border-red-200",
  suspended: "bg-orange-50 text-orange-700 border-orange-200",
};

const STATUS_LABEL: Record<VerificationStatus, string> = {
  pending:   "Pending",
  in_review: "In Review",
  verified:  "✓ Verified",
  rejected:  "✗ Rejected",
  suspended: "⚠ Suspended",
};

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<"listings" | "agents" | "waitlist">("listings");
  const [listingStatuses, setListingStatuses] = useState<Record<string, string>>({});

  // Verification state keyed by agent id
  const [verifications, setVerifications] = useState<Record<string, VerificationRecord>>(
    Object.fromEntries(AGENTS.map((a) => [a.id, { ...a.verification }]))
  );

  // Review modal state
  const [reviewingAgent, setReviewingAgent] = useState<Agent | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  function approveListig(id: string) {
    setListingStatuses((s) => ({ ...s, [id]: "approved" }));
  }

  function rejectListing(id: string) {
    setListingStatuses((s) => ({ ...s, [id]: "rejected" }));
  }

  function toggleChecklistItem(agentId: string, key: keyof VerificationChecklist) {
    setVerifications((prev) => ({
      ...prev,
      [agentId]: {
        ...prev[agentId],
        checklist: {
          ...prev[agentId].checklist,
          [key]: !prev[agentId].checklist[key],
        },
      },
    }));
  }

  function approveAgent(agentId: string) {
    setVerifications((prev) => ({
      ...prev,
      [agentId]: {
        ...prev[agentId],
        status: "verified",
        verifiedAt: new Date().toISOString().slice(0, 10),
        reviewedBy: "Admin",
        checklist: {
          identityVerified: true,
          whatsappActive: true,
          agencyConfirmed: true,
          licenseUploaded: true,
          ownershipConfirmed: true,
          photosReviewed: true,
          priceConfirmed: true,
          availabilityConfirmed: true,
          depositFeesConfirmed: true,
          locationConfirmed: true,
          responseTimeCollected: true,
        },
      },
    }));
    setReviewingAgent(null);
  }

  function rejectAgent(agentId: string) {
    setVerifications((prev) => ({
      ...prev,
      [agentId]: {
        ...prev[agentId],
        status: "rejected",
        rejectionReason,
        reviewedBy: "Admin",
      },
    }));
    setRejectionReason("");
    setReviewingAgent(null);
  }

  const pendingCount = SAMPLE_LISTINGS.filter((l) => !listingStatuses[l.id]).length;

  return (
    <div className="min-h-screen bg-[#f5f7fa] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#070f2e] flex-col hidden md:flex">
        <div className="p-6 border-b border-white/10">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-black text-white" style={{ fontFamily: "Poppins, sans-serif" }}>Rent</span>
            <span className="text-xl font-black text-[#19d3c5]" style={{ fontFamily: "Poppins, sans-serif" }}>ara</span>
          </Link>
          <span className="text-xs text-white/30 mt-1 block">Admin Panel</span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {[
            { id: "listings", label: "Listings Queue", icon: <ClipboardList size={16} />, badge: pendingCount },
            { id: "agents", label: "Agents", icon: <Users size={16} /> },
            { id: "waitlist", label: "Waitlist", icon: <LayoutGrid size={16} /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as typeof activeTab)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors text-left",
                activeTab === item.id ? "bg-white/15 text-white" : "text-white/50 hover:text-white/80 hover:bg-white/5"
              )}
            >
              {item.icon}
              <span className="flex-1">{item.label}</span>
              {item.badge ? (
                <span className="bg-[#19d3c5] text-[#0b1f5c] text-xs font-bold px-2 py-0.5 rounded-full">{item.badge}</span>
              ) : null}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/50 hover:text-red-400 transition-colors">
            <LogOut size={16} />Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <div className="bg-white border-b border-[#e2e8f0] px-6 py-4">
          <h1 className="text-xl font-black text-[#0b1f5c]" style={{ fontFamily: "Poppins, sans-serif" }}>
            {activeTab === "listings" && "Listings Queue"}
            {activeTab === "agents" && "Agent Management"}
            {activeTab === "waitlist" && "Waitlist"}
          </h1>
          <p className="text-[#6b7a99] text-xs">Admin Dashboard</p>
        </div>

        <div className="p-6">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Listings", value: SAMPLE_LISTINGS.length.toString() },
              { label: "Pending Review", value: pendingCount.toString() },
              { label: "Total Agents", value: AGENTS.length.toString() },
              { label: "Waitlist", value: SAMPLE_WAITLIST.length.toString() },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl border border-[#e2e8f0] p-5">
                <p className="text-2xl font-black text-[#0b1f5c]" style={{ fontFamily: "Poppins, sans-serif" }}>{stat.value}</p>
                <p className="text-xs text-[#6b7a99] mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Mobile tab bar */}
          <div className="flex gap-2 mb-6 md:hidden">
            {["listings", "agents", "waitlist"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as typeof activeTab)}
                className={cn(
                  "flex-1 py-2 rounded-xl text-xs font-medium capitalize",
                  activeTab === tab ? "bg-[#0b1f5c] text-white" : "bg-white border border-[#e2e8f0] text-[#6b7a99]"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* ── Listings Queue ─────────────────────────────── */}
          {activeTab === "listings" && (
            <div className="space-y-3">
              {SAMPLE_LISTINGS.map((listing) => {
                const status = listingStatuses[listing.id];
                return (
                  <motion.div
                    key={listing.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "bg-white rounded-2xl border p-5 flex flex-col sm:flex-row sm:items-center gap-4 transition-opacity",
                      status ? "opacity-50" : "border-[#e2e8f0]"
                    )}
                  >
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#0b1f5c] to-[#122470] shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-[#0b1f5c] truncate">{listing.title}</p>
                        {listing.is_verified && <ShieldCheck size={14} className="text-[#19d3c5] shrink-0" />}
                      </div>
                      <p className="text-[#6b7a99] text-xs">{listing.area} · {formatIDR(listing.price_monthly)}/bln</p>
                    </div>

                    {status ? (
                      <span className={cn(
                        "text-xs font-semibold px-3 py-1.5 rounded-full border",
                        status === "approved" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"
                      )}>
                        {status === "approved" ? "✓ Approved" : "✗ Rejected"}
                      </span>
                    ) : (
                      <div className="flex items-center gap-2 shrink-0">
                        <Link href={`/listings/${listing.id}`} className="p-2 rounded-lg border border-[#e2e8f0] text-[#6b7a99] hover:text-[#0b1f5c] transition-colors">
                          <Eye size={15} />
                        </Link>
                        <button onClick={() => approveListig(listing.id)} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-500 text-white text-xs font-semibold hover:bg-emerald-600 transition-colors">
                          <CheckCircle2 size={13} /> Approve
                        </button>
                        <button onClick={() => rejectListing(listing.id)} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition-colors">
                          <XCircle size={13} /> Reject
                        </button>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* ── Agents ─────────────────────────────────────── */}
          {activeTab === "agents" && (
            <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#e2e8f0] bg-[#f5f7fa]">
                    {["Agent", "Agency", "Areas", "Verification", "Action"].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-[#6b7a99] uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {AGENTS.map((agent) => {
                    const vr = verifications[agent.id] ?? agent.verification;
                    return (
                      <tr key={agent.id} className="border-b border-[#e2e8f0] hover:bg-[#f5f7fa] transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <img src={agent.avatar} alt={agent.name} className="w-9 h-9 rounded-full object-cover" />
                            <span className="font-medium text-[#0b1f5c]">{agent.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-[#6b7a99] text-xs">{agent.agency}</td>
                        <td className="px-5 py-4">
                          <div className="flex flex-wrap gap-1">
                            {agent.areas.slice(0, 2).map((a) => (
                              <span key={a} className="text-[10px] px-1.5 py-0.5 rounded bg-[#f5f7fa] text-[#6b7a99] border border-[#e2e8f0]">{a}</span>
                            ))}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border", STATUS_PILL[vr.status])}>
                            {STATUS_LABEL[vr.status]}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <button
                            onClick={() => setReviewingAgent(agent)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0b1f5c] text-white text-xs font-medium hover:bg-[#122470] transition-colors"
                          >
                            <Eye size={12} /> Review
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* ── Waitlist ───────────────────────────────────── */}
          {activeTab === "waitlist" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-[#6b7a99]">{SAMPLE_WAITLIST.length} signups</p>
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#e2e8f0] text-sm font-medium text-[#0b1f5c] bg-white hover:bg-[#f5f7fa] transition-colors">
                  <Download size={14} /> Export CSV
                </button>
              </div>
              <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#e2e8f0] bg-[#f5f7fa]">
                      {["Name", "Email", "WhatsApp", "Area", "Budget", "Date"].map((h) => (
                        <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-[#6b7a99] uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {SAMPLE_WAITLIST.map((entry) => (
                      <tr key={entry.id} className="border-b border-[#e2e8f0] hover:bg-[#f5f7fa] transition-colors">
                        <td className="px-5 py-4 font-medium text-[#0b1f5c]">{entry.full_name}</td>
                        <td className="px-5 py-4 text-[#6b7a99]">{entry.email}</td>
                        <td className="px-5 py-4 text-[#6b7a99]">{entry.whatsapp}</td>
                        <td className="px-5 py-4 text-[#6b7a99]">{entry.preferred_area}</td>
                        <td className="px-5 py-4 text-[#6b7a99]">{entry.rental_budget}</td>
                        <td className="px-5 py-4 text-[#6b7a99]">{entry.created_at}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ── Verification Review Modal ────────────────────────── */}
      <AnimatePresence>
        {reviewingAgent && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setReviewingAgent(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 280 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
            >
              {/* Modal header */}
              <div className="bg-[#0b1f5c] text-white px-6 py-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={reviewingAgent.avatar} alt={reviewingAgent.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-[#19d3c5]" />
                  <div>
                    <p className="font-semibold text-sm">{reviewingAgent.name}</p>
                    <p className="text-white/50 text-xs">{reviewingAgent.agency}</p>
                  </div>
                </div>
                <button onClick={() => setReviewingAgent(null)} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                  <X size={18} />
                </button>
              </div>

              {/* Modal body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <VerificationChecklistUI
                  checklist={verifications[reviewingAgent.id]?.checklist ?? reviewingAgent.verification.checklist}
                  status={verifications[reviewingAgent.id]?.status ?? reviewingAgent.verification.status}
                  showProgress={true}
                  onToggle={(key) => toggleChecklistItem(reviewingAgent.id, key)}
                />

                {/* Notes */}
                {(verifications[reviewingAgent.id]?.notes || reviewingAgent.verification.notes) && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700">
                    <strong>Note:</strong> {verifications[reviewingAgent.id]?.notes ?? reviewingAgent.verification.notes}
                  </div>
                )}

                {/* Rejection reason input */}
                {verifications[reviewingAgent.id]?.status !== "verified" && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                      Rejection reason (if rejecting)
                    </label>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Describe why this application is being rejected..."
                      rows={3}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-300"
                    />
                  </div>
                )}
              </div>

              {/* Modal actions */}
              <div className="border-t border-gray-100 p-5 flex gap-3">
                {verifications[reviewingAgent.id]?.status === "verified" ? (
                  <div className="flex-1 flex items-center justify-center py-2.5 rounded-xl bg-emerald-50 text-emerald-700 text-sm font-semibold border border-emerald-200">
                    <CheckCircle2 size={14} className="mr-2" />
                    Already Verified
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => rejectAgent(reviewingAgent.id)}
                      disabled={!rejectionReason.trim()}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <XCircle size={14} /> Reject
                    </button>
                    <button
                      onClick={() => approveAgent(reviewingAgent.id)}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors"
                    >
                      <CheckCircle2 size={14} /> Approve Agent
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
